import { BoardConfig } from '@/types/board';
import { QuizQuestion } from '@/hooks/useQuiz';

export interface AACBoard {
  id: string;
  name: string;
  description: string;
  config: BoardConfig;
}

// Five different AAC boards with improved content and emojis
export const AAC_BOARDS: AACBoard[] = [
  {
    id: 'basic_simple',
    name: '🌟 Basic & Simple',
    description: 'Perfect for beginners - essential words with big buttons',
    config: {
      tiles: [
        // Core essentials
        { id: 'want', text: 'Want', emoji: '🙋‍♂️', category: 'Core', priority: 1 },
        { id: 'need', text: 'Need', emoji: '🆘', category: 'Core', priority: 1 },
        { id: 'help', text: 'Help', emoji: '🤝', category: 'Core', priority: 1 },
        { id: 'yes', text: 'Yes', emoji: '✅', category: 'Core', priority: 1 },
        { id: 'no', text: 'No', emoji: '❌', category: 'Core', priority: 1 },
        { id: 'stop', text: 'Stop', emoji: '🛑', category: 'Core', priority: 1 },
        { id: 'more', text: 'More', emoji: '➕', category: 'Core', priority: 1 },
        { id: 'finished', text: 'Done', emoji: '✔️', category: 'Core', priority: 1 },
        { id: 'please', text: 'Please', emoji: '🙏', category: 'Core', priority: 1 },
        
        // Basic feelings  
        { id: 'happy', text: 'Happy', emoji: '😊', category: 'Feelings', priority: 2 },
        { id: 'sad', text: 'Sad', emoji: '😢', category: 'Feelings', priority: 2 },
        { id: 'angry', text: 'Mad', emoji: '😡', category: 'Feelings', priority: 2 },
        { id: 'tired', text: 'Tired', emoji: '😴', category: 'Feelings', priority: 2 },
        { id: 'hurt', text: 'Hurt', emoji: '🤕', category: 'Feelings', priority: 2 },
        
        // Basic needs
        { id: 'eat', text: 'Eat', emoji: '🍽️', category: 'Actions', priority: 2 },
        { id: 'drink', text: 'Drink', emoji: '🥤', category: 'Actions', priority: 2 },
        { id: 'bathroom', text: 'Bathroom', emoji: '🚽', category: 'Actions', priority: 1 },
        { id: 'sleep', text: 'Sleep', emoji: '😴', category: 'Actions', priority: 2 },
        
        // Important people
        { id: 'mom', text: 'Mom', emoji: '👩‍👧‍👦', category: 'People', priority: 2 },
        { id: 'dad', text: 'Dad', emoji: '👨‍👧‍👦', category: 'People', priority: 2 },
        { id: 'teacher', text: 'Teacher', emoji: '👩‍🏫', category: 'People', priority: 2 }
      ],
      categories: ['Core', 'Feelings', 'Actions', 'People'],
      layout: 'grid-4x4'
    }
  },
  {
    id: 'social_focused',
    name: '🤗 Social & Emotions',
    description: 'Express feelings and connect with others',
    config: {
      tiles: [
        // Social greetings
        { id: 'hello', text: 'Hello', emoji: '👋', category: 'Social', priority: 1 },
        { id: 'bye', text: 'Goodbye', emoji: '👋', category: 'Social', priority: 1 },
        { id: 'please', text: 'Please', emoji: '🙏', category: 'Social', priority: 1 },
        { id: 'thank_you', text: 'Thank you', emoji: '💝', category: 'Social', priority: 1 },
        { id: 'sorry', text: 'Sorry', emoji: '😔', category: 'Social', priority: 1 },
        { id: 'excuse_me', text: 'Excuse me', emoji: '🙋‍♂️', category: 'Social', priority: 1 },
        
        // Rich emotions
        { id: 'happy', text: 'Happy', emoji: '😊', category: 'Feelings', priority: 1 },
        { id: 'excited', text: 'Excited', emoji: '🤩', category: 'Feelings', priority: 1 },
        { id: 'proud', text: 'Proud', emoji: '😌', category: 'Feelings', priority: 1 },
        { id: 'sad', text: 'Sad', emoji: '😢', category: 'Feelings', priority: 1 },
        { id: 'worried', text: 'Worried', emoji: '😰', category: 'Feelings', priority: 1 },
        { id: 'frustrated', text: 'Frustrated', emoji: '😤', category: 'Feelings', priority: 1 },
        { id: 'calm', text: 'Calm', emoji: '😌', category: 'Feelings', priority: 2 },
        { id: 'surprised', text: 'Surprised', emoji: '😲', category: 'Feelings', priority: 2 },
        
        // Social actions
        { id: 'love', text: 'Love', emoji: '❤️', category: 'Social', priority: 1 },
        { id: 'like', text: 'Like', emoji: '👍', category: 'Social', priority: 1 },
        { id: 'dont_like', text: "Don't like", emoji: '👎', category: 'Social', priority: 1 },
        { id: 'share', text: 'Share', emoji: '🤝', category: 'Social', priority: 2 },
        { id: 'hug', text: 'Hug', emoji: '🤗', category: 'Social', priority: 2 },
        { id: 'friend', text: 'Friend', emoji: '👫', category: 'Social', priority: 2 },
        { id: 'family', text: 'Family', emoji: '👨‍👩‍👧‍👦', category: 'Social', priority: 2 }
      ],
      categories: ['Social', 'Feelings'],
      layout: 'grid-4x4'
    }
  },
  {
    id: 'school_learning',
    name: '🎓 School & Learning',
    description: 'Perfect for classroom communication',
    config: {
      tiles: [
        // School essentials
        { id: 'help', text: 'Help', emoji: '🆘', category: 'School', priority: 1 },
        { id: 'understand', text: 'Understand', emoji: '💡', category: 'School', priority: 1 },
        { id: 'dont_understand', text: "Don't understand", emoji: '❓', category: 'School', priority: 1 },
        { id: 'finished', text: 'Finished', emoji: '✅', category: 'School', priority: 1 },
        { id: 'more_time', text: 'More time', emoji: '⏰', category: 'School', priority: 1 },
        { id: 'ready', text: 'Ready', emoji: '🙋‍♂️', category: 'School', priority: 1 },
        { id: 'question', text: 'Question', emoji: '🙋‍♀️', category: 'School', priority: 1 },
        { id: 'answer', text: 'Answer', emoji: '💬', category: 'School', priority: 1 },
        
        // School subjects
        { id: 'math', text: 'Math', emoji: '🔢', category: 'Subjects', priority: 2 },
        { id: 'reading', text: 'Reading', emoji: '📚', category: 'Subjects', priority: 2 },
        { id: 'writing', text: 'Writing', emoji: '✏️', category: 'Subjects', priority: 2 },
        { id: 'science', text: 'Science', emoji: '🔬', category: 'Subjects', priority: 2 },
        { id: 'art', text: 'Art', emoji: '🎨', category: 'Subjects', priority: 2 },
        { id: 'music', text: 'Music', emoji: '🎵', category: 'Subjects', priority: 3 },
        { id: 'pe', text: 'PE', emoji: '⚽', category: 'Subjects', priority: 3 },
        
        // School actions
        { id: 'listen', text: 'Listen', emoji: '👂', category: 'Actions', priority: 2 },
        { id: 'look', text: 'Look', emoji: '👀', category: 'Actions', priority: 2 },
        { id: 'think', text: 'Think', emoji: '🤔', category: 'Actions', priority: 2 },
        { id: 'work', text: 'Work', emoji: '📝', category: 'Actions', priority: 2 },
        
        // School people
        { id: 'teacher', text: 'Teacher', emoji: '👩‍🏫', category: 'People', priority: 2 },
        { id: 'classmate', text: 'Classmate', emoji: '👫', category: 'People', priority: 2 }
      ],
      categories: ['School', 'Subjects', 'Actions', 'People'],
      layout: 'grid-4x4'
    }
  },
  {
    id: 'games_fun',
    name: '🎮 Games & Fun',
    description: 'All about play, games and having fun!',
    config: {
      tiles: [
        // Gaming core
        { id: 'play', text: 'Play', emoji: '🎮', category: 'Games', priority: 1 },
        { id: 'game', text: 'Game', emoji: '🎲', category: 'Games', priority: 1 },
        { id: 'fun', text: 'Fun', emoji: '🎉', category: 'Games', priority: 1 },
        { id: 'my_turn', text: 'My turn', emoji: '🙋‍♂️', category: 'Games', priority: 1 },
        { id: 'your_turn', text: 'Your turn', emoji: '👉', category: 'Games', priority: 1 },
        { id: 'wait', text: 'Wait', emoji: '⏳', category: 'Games', priority: 1 },
        
        // Game outcomes
        { id: 'win', text: 'Win', emoji: '🏆', category: 'Results', priority: 1 },
        { id: 'lose', text: 'Lose', emoji: '😔', category: 'Results', priority: 2 },
        { id: 'tie', text: 'Tie', emoji: '🤝', category: 'Results', priority: 2 },
        { id: 'good_job', text: 'Good job', emoji: '👏', category: 'Results', priority: 1 },
        { id: 'try_again', text: 'Try again', emoji: '🔄', category: 'Results', priority: 1 },
        
        // Activities
        { id: 'video_game', text: 'Video game', emoji: '🎮', category: 'Activities', priority: 2 },
        { id: 'board_game', text: 'Board game', emoji: '🎲', category: 'Activities', priority: 2 },
        { id: 'puzzle', text: 'Puzzle', emoji: '🧩', category: 'Activities', priority: 2 },
        { id: 'toys', text: 'Toys', emoji: '🧸', category: 'Activities', priority: 2 },
        { id: 'blocks', text: 'Blocks', emoji: '🧱', category: 'Activities', priority: 3 },
        { id: 'drawing', text: 'Drawing', emoji: '🖍️', category: 'Activities', priority: 2 },
        
        // Entertainment
        { id: 'watch', text: 'Watch', emoji: '📺', category: 'Entertainment', priority: 2 },
        { id: 'music', text: 'Music', emoji: '🎵', category: 'Entertainment', priority: 2 },
        { id: 'dance', text: 'Dance', emoji: '💃', category: 'Entertainment', priority: 2 },
        { id: 'sing', text: 'Sing', emoji: '🎤', category: 'Entertainment', priority: 3 }
      ],
      categories: ['Games', 'Results', 'Activities', 'Entertainment'],
      layout: 'grid-4x4'
    }
  },
  {
    id: 'comprehensive',
    name: '🌈 Complete Communicator',
    description: 'Advanced board with phrases and complex ideas',
    config: {
      tiles: [
        // Ready-made phrases
        { id: 'i_want', text: 'I want', emoji: '🙋‍♂️', category: 'Phrases', priority: 1 },
        { id: 'i_need', text: 'I need', emoji: '🆘', category: 'Phrases', priority: 1 },
        { id: 'i_like', text: 'I like', emoji: '👍', category: 'Phrases', priority: 1 },
        { id: 'i_dont_like', text: "I don't like", emoji: '👎', category: 'Phrases', priority: 1 },
        { id: 'can_you', text: 'Can you', emoji: '❓', category: 'Phrases', priority: 1 },
        { id: 'i_feel', text: 'I feel', emoji: '💭', category: 'Phrases', priority: 1 },
        { id: 'lets_go', text: "Let's go", emoji: '🚶‍♂️', category: 'Phrases', priority: 1 },
        { id: 'come_here', text: 'Come here', emoji: '👈', category: 'Phrases', priority: 1 },
        
        // Complex actions
        { id: 'understand', text: 'Understand', emoji: '💡', category: 'Actions', priority: 2 },
        { id: 'remember', text: 'Remember', emoji: '🧠', category: 'Actions', priority: 2 },
        { id: 'forget', text: 'Forget', emoji: '🤔', category: 'Actions', priority: 3 },
        { id: 'choose', text: 'Choose', emoji: '🤏', category: 'Actions', priority: 2 },
        { id: 'decide', text: 'Decide', emoji: '🤷‍♂️', category: 'Actions', priority: 2 },
        { id: 'explain', text: 'Explain', emoji: '💬', category: 'Actions', priority: 2 },
        
        // Categories & concepts
        { id: 'food', text: 'Food', emoji: '🍔', category: 'Categories', priority: 2 },
        { id: 'people', text: 'People', emoji: '👥', category: 'Categories', priority: 2 },
        { id: 'places', text: 'Places', emoji: '🏠', category: 'Categories', priority: 2 },
        { id: 'things', text: 'Things', emoji: '📦', category: 'Categories', priority: 2 },
        { id: 'colors', text: 'Colors', emoji: '🌈', category: 'Categories', priority: 3 },
        { id: 'numbers', text: 'Numbers', emoji: '🔢', category: 'Categories', priority: 3 },
        { id: 'feelings', text: 'Feelings', emoji: '😊', category: 'Categories', priority: 2 }
      ],
      categories: ['Phrases', 'Actions', 'Categories'],
      layout: 'grid-4x4'
    }
  }
];

// Board selection logic based on quiz answers
export function selectBoardBasedOnAnswers(questions: QuizQuestion[]): AACBoard {
  // Convert questions to a map for easier access
  const answerMap = new Map<number, string>();
  questions.forEach(q => {
    if (q.value) answerMap.set(q.id, q.value);
  });

  let scores = {
    basic_simple: 0,
    social_focused: 0,
    school_learning: 0,
    games_fun: 0,
    comprehensive: 0
  };

  // Question 1: Communication preference
  const q1 = answerMap.get(1);
  if (q1?.includes('Point') || q1?.includes('Other')) {
    scores.basic_simple += 2;
  } else if (q1?.includes('Look')) {
    scores.social_focused += 1;
    scores.basic_simple += 1;
  }

  // Question 3 (reordered 2): Language preference
  const q3 = answerMap.get(3);
  if (q3?.includes('Other') || q3?.includes('More than one')) {
    scores.comprehensive += 1;
  }

  // Question 5 (reordered 3): Image preference
  const q5 = answerMap.get(5);
  if (q5?.includes('Real photos')) {
    scores.basic_simple += 1;
  } else if (q5?.includes('Cartoon')) {
    scores.games_fun += 1;
  } else if (q5?.includes('custom')) {
    scores.comprehensive += 1;
  }

  // Question 7 (reordered 4): Text under pictures
  const q7 = answerMap.get(7);
  if (q7?.includes('always')) {
    scores.school_learning += 1;
    scores.comprehensive += 1;
  } else if (q7?.includes('pictures only')) {
    scores.basic_simple += 1;
  }

  // Question 4 (reordered 7): Message building
  const q4 = answerMap.get(4);
  if (q4?.includes('Word by word')) {
    scores.basic_simple += 2;
  } else if (q4?.includes('Ready-made phrases')) {
    scores.comprehensive += 2;
  } else if (q4?.includes('Mix words')) {
    scores.comprehensive += 1;
    scores.school_learning += 1;
  }

  // Question 2 (reordered 9): Topics of interest
  const q2 = answerMap.get(2);
  if (q2?.includes('Games')) {
    scores.games_fun += 2;
  } else if (q2?.includes('School')) {
    scores.school_learning += 2;
  } else if (q2?.includes('Feelings')) {
    scores.social_focused += 2;
  } else if (q2?.includes('Food')) {
    scores.basic_simple += 1;
  }

  // Question 9 (reordered 10): Favorite topics
  const q9 = answerMap.get(9);
  if (q9?.includes('Games')) {
    scores.games_fun += 1;
  } else if (q9?.includes('School')) {
    scores.school_learning += 1;
  } else if (q9?.includes('Friends')) {
    scores.social_focused += 1;
  }

  // Find the board with the highest score
  const maxScore = Math.max(...Object.values(scores));
  const selectedBoardId = Object.keys(scores).find(
    key => scores[key as keyof typeof scores] === maxScore
  ) as string;

  // Fallback to basic_simple if no clear winner
  const boardId = selectedBoardId || 'basic_simple';
  return AAC_BOARDS.find(board => board.id === boardId) || AAC_BOARDS[0];
}