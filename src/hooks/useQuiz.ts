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
    label: "What best describes your communication needs?",
    type: 'single',
    options: [
      "I need help expressing basic needs",
      "I want to have conversations", 
      "I need emergency communication",
      "I want to learn communication skills",
      "All of the above"
    ]
  },
  {
    id: 2,
    label: "What is your primary way of accessing a device?",
    type: 'single',
    options: [
      "Touch with fingers",
      "Touch with stylus or pointer",
      "Eye gaze",
      "Switch scanning",
      "Head mouse"
    ]
  },
  {
    id: 3,
    label: "How familiar are you with AAC devices?",
    type: 'single',
    options: [
      "Completely new to AAC",
      "Some experience with simple devices",
      "Experienced with AAC apps",
      "Very experienced user",
      "Professional/therapist"
    ]
  },
  {
    id: 4,
    label: "What type of device will you primarily use?",
    type: 'single',
    options: [
      "Tablet (iPad/Android)",
      "Smartphone only",
      "Dedicated AAC device",
      "Computer/laptop",
      "Multiple devices"
    ]
  },
  {
    id: 5,
    label: "How would you describe your motor abilities?",
    type: 'single',
    options: [
      "Full fine motor control",
      "Some difficulty with small targets",
      "Need larger buttons/targets",
      "Limited range of motion",
      "Prefer alternative access methods"
    ]
  },
  {
    id: 6,
    label: "Do you have vision considerations?",
    type: 'single',
    options: [
      "No vision concerns",
      "Need larger text/buttons",
      "High contrast needed",
      "Low vision accommodations",
      "Use screen reader"
    ]
  },
  {
    id: 7,
    label: "What type of voice would you prefer?",
    type: 'single',
    options: [
      "Adult male voice",
      "Adult female voice", 
      "Child voice (if appropriate)",
      "My own recorded voice",
      "No preference"
    ]
  },
  {
    id: 8,
    label: "How fast should the voice speak?",
    type: 'single',
    options: [
      "Very slow",
      "Slow",
      "Normal speed",
      "Fast",
      "Let me adjust as needed"
    ]
  },
  {
    id: 9,
    label: "What environments will you use this in?",
    type: 'single',
    options: [
      "Mostly at home",
      "School/work settings",
      "Public/community spaces",
      "Medical appointments",
      "All environments"
    ]
  },
  {
    id: 10,
    label: "Who will you communicate with most?",
    type: 'single',
    options: [
      "Family members",
      "Teachers/therapists",
      "Friends/peers",
      "Medical professionals",
      "Various people"
    ]
  },
  {
    id: 11,
    label: "What are your main interests or topics?",
    type: 'single',
    options: [
      "Sports and activities",
      "Entertainment (TV, movies, music)",
      "School/work topics",
      "Medical/health needs",
      "Social conversation"
    ]
  },
  {
    id: 12,
    label: "How do you prefer to learn new things?",
    type: 'single',
    options: [
      "Visual demonstrations",
      "Step-by-step instructions",
      "Trial and error",
      "Guided practice",
      "Independent exploration"
    ]
  },
  {
    id: 13,
    label: "What level of vocabulary do you need?",
    type: 'single',
    options: [
      "Basic words and phrases",
      "Everyday conversation",
      "Academic/professional",
      "Complex thoughts and ideas",
      "Mix of all levels"
    ]
  },
  {
    id: 14,
    label: "Do you need multilingual support?",
    type: 'single',
    options: [
      "English only",
      "Spanish and English",
      "Other bilingual needs",
      "Multiple languages",
      "Not sure yet"
    ]
  },
  {
    id: 15,
    label: "How important is speed of communication?",
    type: 'single',
    options: [
      "Accuracy is more important",
      "Balance of speed and accuracy",
      "Speed is very important",
      "Depends on the situation",
      "Not sure"
    ]
  },
  {
    id: 16,
    label: "Do you need word prediction?",
    type: 'single',
    options: [
      "Yes, very helpful",
      "Sometimes useful",
      "Not sure what this is",
      "No, prefer full selection",
      "Let me try both"
    ]
  },
  {
    id: 17,
    label: "How do you handle emotions in communication?",
    type: 'single',
    options: [
      "Need help expressing feelings",
      "Can express basic emotions",
      "Want nuanced emotional vocabulary",
      "Prefer practical communication",
      "Varies by situation"
    ]
  },
  {
    id: 18,
    label: "What backup communication methods do you use?",
    type: 'single',
    options: [
      "Gestures and body language",
      "Writing or drawing",
      "Picture cards",
      "Simple signs",
      "Multiple methods"
    ]
  },
  {
    id: 19,
    label: "How much customization do you want?",
    type: 'single',
    options: [
      "Keep it simple",
      "Some personalization",
      "Moderate customization",
      "Highly customized",
      "Let others set it up"
    ]
  },
  {
    id: 20,
    label: "What time of day will you use this most?",
    type: 'single',
    options: [
      "Morning routine",
      "During school/work",
      "Evening/dinner time",
      "Throughout the day",
      "Emergency situations"
    ]
  },
  {
    id: 21,
    label: "Do you need help with social interactions?",
    type: 'single',
    options: [
      "Greetings and social basics",
      "Asking questions",
      "Sharing information",
      "Making friends",
      "All social communication"
    ]
  },
  {
    id: 22,
    label: "How do you prefer to navigate the app?",
    type: 'single',
    options: [
      "Simple menu structure",
      "Category-based navigation",
      "Search function",
      "Recent/favorites",
      "Multiple navigation options"
    ]
  },
  {
    id: 23,
    label: "What size buttons work best for you?",
    type: 'single',
    options: [
      "Small buttons (more on screen)",
      "Medium buttons",
      "Large buttons",
      "Extra large buttons",
      "Let me adjust size"
    ]
  },
  {
    id: 24,
    label: "Do you need help with grammar?",
    type: 'single',
    options: [
      "Grammar not important",
      "Basic sentence structure",
      "Proper grammar help",
      "Advanced grammar features",
      "Depends on situation"
    ]
  },
  {
    id: 25,
    label: "How do you want to save favorite phrases?",
    type: 'single',
    options: [
      "Quick access buttons",
      "Favorites menu",
      "Custom categories",
      "Recent phrases list",
      "Multiple saving options"
    ]
  },
  {
    id: 26,
    label: "What level of support do you need?",
    type: 'single',
    options: [
      "Minimal - I can figure it out",
      "Some guidance appreciated",
      "Regular support needed",
      "Extensive help required",
      "Support from family/team"
    ]
  },
  {
    id: 27,
    label: "How important is privacy to you?",
    type: 'single',
    options: [
      "Very important",
      "Somewhat important",
      "Not very concerned",
      "Depends on the content",
      "Let others decide"
    ]
  },
  {
    id: 28,
    label: "Do you want progress tracking?",
    type: 'single',
    options: [
      "Yes, detailed progress",
      "Basic usage statistics",
      "Simple goal tracking",
      "No tracking needed",
      "Let family/team track"
    ]
  },
  {
    id: 29,
    label: "What motivates you to communicate?",
    type: 'single',
    options: [
      "Meeting basic needs",
      "Social connections",
      "Learning and growth",
      "Independence",
      "All of these"
    ]
  },
  {
    id: 30,
    label: "How often do you expect to use this?",
    type: 'single',
    options: [
      "Multiple times daily",
      "Daily",
      "Several times per week",
      "Weekly",
      "As needed"
    ]
  },
  {
    id: 31,
    label: "How would you like your communication board organized?",
    type: 'single',
    options: [
      "Most used words first",
      "Organized by clear categories", 
      "Mix of both approaches"
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