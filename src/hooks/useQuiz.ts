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
    label: "How do you prefer to communicate now",
    type: 'single',
    options: [
      "👉 Point with hands/fingers",
      "👀 Look with eyes",
      "🗣️ Make sounds/gestures",
      "🖼️ Use pictures or symbols"
    ]
  },
  {
    id: 2,
    label: "What are your favorite things to talk about?",
    type: 'single',
    options: [
      "👫 Friends & family",
      "🎮 Games & toys",
      "🏫 School & learning",
      "🍔🐶 Food, animals & hobbies"
    ]
  },
  {
    id: 3,
    label: "Which language(s) do you use most at home or school?",
    type: 'single',
    options: [
      "🇮🇱 Hebrew",
      "🇷🇺 Russian",
      "🇬🇧 English",
      "🌍 More than one / Mixed"
    ]
  },
  {
    id: 4,
    label: "How do you like to build your messages?",
    type: 'single',
    options: [
      "🔘 One button at a time",
      "✌️ Two or three words together",
      "📑 Ready-made phrases",
      "📝 Mix words & make my own"
    ]
  },
  {
    id: 5,
    label: "Which pictures are easiest for you to use?",
    type: 'single',
    options: [
      "📸 Real photos",
      "✏️ Cartoon drawings",
      "🎨 Colorful icons",
      "🌟 My own custom images"
    ]
  },
  {
    id: 6,
    label: "How do you want the app to sound when it speaks?",
    type: 'single',
    options: [
      "👦 Child's voice",
      "👨 Man's voice",
      "👩 Woman's voice",
      "🤖 Robot/fun voice"
    ]
  },
  {
    id: 7,
    label: "What emotions should Echoes help you show first?",
    type: 'single',
    options: [
      "😀 Happy / Excited",
      "😢 Sad",
      "😡 Angry",
      "😨 Scared / Worried"
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
    id: 9,
    label: "When you need help quickly, what should the app do?",
    type: 'single',
    options: [
      "🆘 Big \"Help me\" button",
      "👍👎 Quick Yes / No choices",
      "👨‍👩‍👦 Show people I choose",
      "🌈 Calming pictures or sounds"
    ]
  },
  {
    id: 10,
    label: "Do you want Echoes to look different in different places?",
    type: 'single',
    options: [
      "🏫 Yes, at school",
      "🏠 Yes, at home",
      "🌳 Yes, outside (park, shop)",
      "🔒 No, always the same"
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