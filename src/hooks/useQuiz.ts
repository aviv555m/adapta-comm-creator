import { useState, useEffect } from 'react';

export interface QuizQuestion {
  id: number;
  label: string;
  type: 'single';
  options: string[];
  status: 'unanswered' | 'answered' | 'skipped';
  value: string | null;
}

export interface QuizEvent {
  type: 'next' | 'back' | 'skip' | 'skip_all' | 'answer';
  questionId: number;
  timestamp: number;
  data?: any;
}

const QUIZ_QUESTIONS: Omit<QuizQuestion, 'status' | 'value'>[] = [
  {
    id: 1,
    label: "How do you prefer to communicate now?",
    type: 'single',
    options: [
      "👉 Point with hands/fingers",
      "👀 Look with eyes",
      "🗣️ Make sounds/gestures",
      "🤲 Other ways"
    ]
  },
  {
    id: 3,
    label: "Which languages would you talk about, now?",
    type: 'single',
    options: [
      "🇮🇱 Hebrew",
      "🇷🇺 Russian",
      "🇬🇧 English",
      "🌍 Other"
    ]
  },
  {
    id: 5,
    label: "Which images would you like to use now?",
    type: 'single',
    options: [
      "📸 Real photos",
      "✏️ Cartoon drawings",
      "🎨 Colorful icons",
      "🌟 My own custom images"
    ]
  },
  {
    id: 7,
    label: "Do you want text under the pictures?",
    type: 'single',
    options: [
      "✅ Yes, always",
      "🔄 Only sometimes",
      "📷 No, pictures only"
    ]
  },
  {
    id: 6,
    label: "Which voice would you like to use now?",
    type: 'single',
    options: [
      "👦 Boy's voice",
      "👧 Girl's voice",
      "👨 Man's voice",
      "👩 Woman's voice"
    ]
  },
  {
    id: 10,
    label: "How fast should the voice speak?",
    type: 'single',
    options: [
      "🐌 Slow",
      "⚡ Medium",
      "🚀 Fast"
    ]
  },
  {
    id: 4,
    label: "How do you like to build your messages?",
    type: 'single',
    options: [
      "🔘 Word by word",
      "✌️ Two or three words together",
      "📑 Ready-made phrases",
      "📝 Mix words & make my own"
    ]
  },
  {
    id: 8,
    label: "Do you want the app to suggest new words automatically?",
    type: 'single',
    options: [
      "✅ Yes, always",
      "🔄 Sometimes",
      "🕒 Rarely",
      "❌ No, keep the same"
    ]
  },
  {
    id: 2,
    label: "What would you like to speak about, now?",
    type: 'single',
    options: [
      "👫 Friends & family & Feelings",
      "🎮 Games",
      "🏫 School & learning",
      "🍔 Food"
    ]
  },
  {
    id: 9,
    label: "What are your favorite things to talk about?",
    type: 'single',
    options: [
      "👫 Friends & family",
      "🎮 Games & toys",
      "🏫 School & learning",
      "🍔🐶 Food, animals & hobbies"
    ]
  }
];

export const useQuiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [events, setEvents] = useState<QuizEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize questions
  useEffect(() => {
    const saved = localStorage.getItem('echoes_quiz_v1');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setQuestions(data.questions || initializeQuestions());
        setCurrentIndex(data.currentIndex || 0);
        setEvents(data.events || []);
      } catch {
        setQuestions(initializeQuestions());
      }
    } else {
      setQuestions(initializeQuestions());
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!loading && questions.length > 0) {
      const data = {
        questions,
        currentIndex,
        events,
        timestamp: Date.now()
      };
      localStorage.setItem('echoes_quiz_v1', JSON.stringify(data));
    }
  }, [questions, currentIndex, events, loading]);

  const initializeQuestions = (): QuizQuestion[] => {
    return QUIZ_QUESTIONS.map(q => ({
      ...q,
      status: 'unanswered',
      value: null
    }));
  };

  const logEvent = (event: Omit<QuizEvent, 'timestamp'>) => {
    const newEvent = { ...event, timestamp: Date.now() };
    setEvents(prev => [...prev, newEvent]);
  };

  const answerQuestion = (questionId: number, value: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, status: 'answered', value }
        : q
    ));
    logEvent({ type: 'answer', questionId, data: { value } });
  };

  const skipQuestion = (questionId: number) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, status: 'skipped', value: null }
        : q
    ));
    logEvent({ type: 'skip', questionId });
  };

  const skipAllRemaining = () => {
    const currentQuestionId = questions[currentIndex]?.id;
    setQuestions(prev => prev.map((q, index) => 
      index >= currentIndex 
        ? { ...q, status: 'skipped', value: null }
        : q
    ));
    setCurrentIndex(questions.length - 1);
    logEvent({ type: 'skip_all', questionId: currentQuestionId });
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      logEvent({ type: 'next', questionId: questions[currentIndex]?.id });
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      logEvent({ type: 'back', questionId: questions[currentIndex]?.id });
    }
  };

  const resetQuiz = () => {
    setQuestions(initializeQuestions());
    setCurrentIndex(0);
    setEvents([]);
    localStorage.removeItem('echoes_quiz_v1');
  };

  const getStats = () => {
    const answered = questions.filter(q => q.status === 'answered').length;
    const skipped = questions.filter(q => q.status === 'skipped').length;
    const progress = ((answered + skipped) / questions.length) * 100;
    
    return { answered, skipped, total: questions.length, progress };
  };

  const getSelectedBoard = () => {
    // This will be used to get the appropriate AAC board based on answers
    return questions;
  };

  const getCurrentQuestion = () => questions[currentIndex];
  const isComplete = () => currentIndex >= questions.length - 1 && 
    (questions[currentIndex]?.status === 'answered' || questions[currentIndex]?.status === 'skipped');

  return {
    questions,
    currentIndex,
    events,
    loading,
    getCurrentQuestion,
    getStats,
    getSelectedBoard,
    answerQuestion,
    skipQuestion,
    skipAllRemaining,
    goNext,
    goBack,
    resetQuiz,
    isComplete,
    canGoNext: currentIndex < questions.length - 1,
    canGoBack: currentIndex > 0
  };
};