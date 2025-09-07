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
        // Core Words (9 words)
        { id: 'want', text: 'Want', emoji: '🙋‍♂️', category: 'Core Words', priority: 1 },
        { id: 'need', text: 'Need', emoji: '🆘', category: 'Core Words', priority: 1 },
        { id: 'help', text: 'Help', emoji: '🤝', category: 'Core Words', priority: 1 },
        { id: 'yes', text: 'Yes', emoji: '✅', category: 'Core Words', priority: 1 },
        { id: 'no', text: 'No', emoji: '❌', category: 'Core Words', priority: 1 },
        { id: 'stop', text: 'Stop', emoji: '🛑', category: 'Core Words', priority: 1 },
        { id: 'more', text: 'More', emoji: '➕', category: 'Core Words', priority: 1 },
        { id: 'finished', text: 'Done', emoji: '✔️', category: 'Core Words', priority: 1 },
        { id: 'please', text: 'Please', emoji: '🙏', category: 'Core Words', priority: 1 },
        
        // Feelings (9 words)
        { id: 'happy', text: 'Happy', emoji: '😊', category: 'Feelings', priority: 1 },
        { id: 'sad', text: 'Sad', emoji: '😢', category: 'Feelings', priority: 1 },
        { id: 'angry', text: 'Mad', emoji: '😡', category: 'Feelings', priority: 1 },
        { id: 'tired', text: 'Tired', emoji: '😴', category: 'Feelings', priority: 1 },
        { id: 'hurt', text: 'Hurt', emoji: '🤕', category: 'Feelings', priority: 1 },
        { id: 'excited', text: 'Excited', emoji: '🤩', category: 'Feelings', priority: 1 },
        { id: 'scared', text: 'Scared', emoji: '😨', category: 'Feelings', priority: 1 },
        { id: 'surprised', text: 'Surprised', emoji: '😲', category: 'Feelings', priority: 1 },
        { id: 'calm', text: 'Calm', emoji: '😌', category: 'Feelings', priority: 1 },
        
        // Actions (9 words)
        { id: 'eat', text: 'Eat', emoji: '🍽️', category: 'Actions', priority: 1 },
        { id: 'drink', text: 'Drink', emoji: '🥤', category: 'Actions', priority: 1 },
        { id: 'sleep', text: 'Sleep', emoji: '😴', category: 'Actions', priority: 1 },
        { id: 'play', text: 'Play', emoji: '🎮', category: 'Actions', priority: 1 },
        { id: 'walk', text: 'Walk', emoji: '🚶‍♂️', category: 'Actions', priority: 1 },
        { id: 'sit', text: 'Sit', emoji: '🪑', category: 'Actions', priority: 1 },
        { id: 'stand', text: 'Stand', emoji: '🧍‍♂️', category: 'Actions', priority: 1 },
        { id: 'go', text: 'Go', emoji: '➡️', category: 'Actions', priority: 1 },
        { id: 'come', text: 'Come', emoji: '👈', category: 'Actions', priority: 1 },
        
        // People (9 words)
        { id: 'mom', text: 'Mom', emoji: '👩‍👧‍👦', category: 'People', priority: 1 },
        { id: 'dad', text: 'Dad', emoji: '👨‍👧‍👦', category: 'People', priority: 1 },
        { id: 'teacher', text: 'Teacher', emoji: '👩‍🏫', category: 'People', priority: 1 },
        { id: 'friend', text: 'Friend', emoji: '👫', category: 'People', priority: 1 },
        { id: 'brother', text: 'Brother', emoji: '👦', category: 'People', priority: 1 },
        { id: 'sister', text: 'Sister', emoji: '👧', category: 'People', priority: 1 },
        { id: 'grandma', text: 'Grandma', emoji: '👵', category: 'People', priority: 1 },
        { id: 'grandpa', text: 'Grandpa', emoji: '👴', category: 'People', priority: 1 },
        { id: 'baby', text: 'Baby', emoji: '👶', category: 'People', priority: 1 },
        
        // Food (9 words)
        { id: 'apple', text: 'Apple', emoji: '🍎', category: 'Food', priority: 1 },
        { id: 'bread', text: 'Bread', emoji: '🍞', category: 'Food', priority: 1 },
        { id: 'milk', text: 'Milk', emoji: '🥛', category: 'Food', priority: 1 },
        { id: 'cookie', text: 'Cookie', emoji: '🍪', category: 'Food', priority: 1 },
        { id: 'water', text: 'Water', emoji: '💧', category: 'Food', priority: 1 },
        { id: 'juice', text: 'Juice', emoji: '🧃', category: 'Food', priority: 1 },
        { id: 'sandwich', text: 'Sandwich', emoji: '🥪', category: 'Food', priority: 1 },
        { id: 'banana', text: 'Banana', emoji: '🍌', category: 'Food', priority: 1 },
        { id: 'pizza', text: 'Pizza', emoji: '🍕', category: 'Food', priority: 1 },
        
        // Animals (9 words)
        { id: 'dog', text: 'Dog', emoji: '🐕', category: 'Animals', priority: 1 },
        { id: 'cat', text: 'Cat', emoji: '🐱', category: 'Animals', priority: 1 },
        { id: 'bird', text: 'Bird', emoji: '🐦', category: 'Animals', priority: 1 },
        { id: 'fish', text: 'Fish', emoji: '🐠', category: 'Animals', priority: 1 },
        { id: 'horse', text: 'Horse', emoji: '🐴', category: 'Animals', priority: 1 },
        { id: 'cow', text: 'Cow', emoji: '🐄', category: 'Animals', priority: 1 },
        { id: 'pig', text: 'Pig', emoji: '🐷', category: 'Animals', priority: 1 },
        { id: 'duck', text: 'Duck', emoji: '🦆', category: 'Animals', priority: 1 },
        { id: 'rabbit', text: 'Rabbit', emoji: '🐰', category: 'Animals', priority: 1 },
        
        // Colors (9 words)
        { id: 'red', text: 'Red', emoji: '🔴', category: 'Colors', priority: 1 },
        { id: 'blue', text: 'Blue', emoji: '🔵', category: 'Colors', priority: 1 },
        { id: 'green', text: 'Green', emoji: '🟢', category: 'Colors', priority: 1 },
        { id: 'yellow', text: 'Yellow', emoji: '🟡', category: 'Colors', priority: 1 },
        { id: 'orange', text: 'Orange', emoji: '🟠', category: 'Colors', priority: 1 },
        { id: 'purple', text: 'Purple', emoji: '🟣', category: 'Colors', priority: 1 },
        { id: 'pink', text: 'Pink', emoji: '🩷', category: 'Colors', priority: 1 },
        { id: 'black', text: 'Black', emoji: '⚫', category: 'Colors', priority: 1 },
        { id: 'white', text: 'White', emoji: '⚪', category: 'Colors', priority: 1 },
        
        // Places (9 words)
        { id: 'home', text: 'Home', emoji: '🏠', category: 'Places', priority: 1 },
        { id: 'school', text: 'School', emoji: '🏫', category: 'Places', priority: 1 },
        { id: 'park', text: 'Park', emoji: '🏞️', category: 'Places', priority: 1 },
        { id: 'store', text: 'Store', emoji: '🏪', category: 'Places', priority: 1 },
        { id: 'bathroom', text: 'Bathroom', emoji: '🚽', category: 'Places', priority: 1 },
        { id: 'kitchen', text: 'Kitchen', emoji: '👩‍🍳', category: 'Places', priority: 1 },
        { id: 'bedroom', text: 'Bedroom', emoji: '🛏️', category: 'Places', priority: 1 },
        { id: 'playground', text: 'Playground', emoji: '🛝', category: 'Places', priority: 1 },
        { id: 'library', text: 'Library', emoji: '📚', category: 'Places', priority: 1 },
        
        // Toys (9 words)
        { id: 'ball', text: 'Ball', emoji: '⚽', category: 'Toys', priority: 1 },
        { id: 'doll', text: 'Doll', emoji: '🪆', category: 'Toys', priority: 1 },
        { id: 'car', text: 'Car', emoji: '🚗', category: 'Toys', priority: 1 },
        { id: 'blocks', text: 'Blocks', emoji: '🧱', category: 'Toys', priority: 1 },
        { id: 'puzzle', text: 'Puzzle', emoji: '🧩', category: 'Toys', priority: 1 },
        { id: 'teddy', text: 'Teddy Bear', emoji: '🧸', category: 'Toys', priority: 1 },
        { id: 'book', text: 'Book', emoji: '📖', category: 'Toys', priority: 1 },
        { id: 'crayons', text: 'Crayons', emoji: '🖍️', category: 'Toys', priority: 1 },
        { id: 'bike', text: 'Bike', emoji: '🚲', category: 'Toys', priority: 1 }
      ],
      categories: ['Core Words', 'Feelings', 'Actions', 'People', 'Food', 'Animals', 'Colors', 'Places', 'Toys'],
      layout: 'grid-3x3'
    }
  },
  {
    id: 'social_focused',
    name: '🤗 Social & Emotions',
    description: 'Express feelings and connect with others',
    config: {
      tiles: [
        // Social Words (9 words)
        { id: 'hello', text: 'Hello', emoji: '👋', category: 'Social Words', priority: 1 },
        { id: 'goodbye', text: 'Goodbye', emoji: '👋', category: 'Social Words', priority: 1 },
        { id: 'please', text: 'Please', emoji: '🙏', category: 'Social Words', priority: 1 },
        { id: 'thank_you', text: 'Thank you', emoji: '💝', category: 'Social Words', priority: 1 },
        { id: 'sorry', text: 'Sorry', emoji: '😔', category: 'Social Words', priority: 1 },
        { id: 'excuse_me', text: 'Excuse me', emoji: '🙋‍♂️', category: 'Social Words', priority: 1 },
        { id: 'welcome', text: 'Welcome', emoji: '🤝', category: 'Social Words', priority: 1 },
        { id: 'nice', text: 'Nice', emoji: '👍', category: 'Social Words', priority: 1 },
        { id: 'good', text: 'Good', emoji: '✨', category: 'Social Words', priority: 1 },
        
        // Emotions (9 words)
        { id: 'happy', text: 'Happy', emoji: '😊', category: 'Emotions', priority: 1 },
        { id: 'excited', text: 'Excited', emoji: '🤩', category: 'Emotions', priority: 1 },
        { id: 'proud', text: 'Proud', emoji: '😌', category: 'Emotions', priority: 1 },
        { id: 'sad', text: 'Sad', emoji: '😢', category: 'Emotions', priority: 1 },
        { id: 'worried', text: 'Worried', emoji: '😰', category: 'Emotions', priority: 1 },
        { id: 'frustrated', text: 'Frustrated', emoji: '😤', category: 'Emotions', priority: 1 },
        { id: 'calm', text: 'Calm', emoji: '😌', category: 'Emotions', priority: 1 },
        { id: 'surprised', text: 'Surprised', emoji: '😲', category: 'Emotions', priority: 1 },
        { id: 'confused', text: 'Confused', emoji: '😕', category: 'Emotions', priority: 1 },
        
        // Family (9 words)
        { id: 'family', text: 'Family', emoji: '👨‍👩‍👧‍👦', category: 'Family', priority: 1 },
        { id: 'mom', text: 'Mom', emoji: '👩‍👧‍👦', category: 'Family', priority: 1 },
        { id: 'dad', text: 'Dad', emoji: '👨‍👧‍👦', category: 'Family', priority: 1 },
        { id: 'sister', text: 'Sister', emoji: '👧', category: 'Family', priority: 1 },
        { id: 'brother', text: 'Brother', emoji: '👦', category: 'Family', priority: 1 },
        { id: 'grandma', text: 'Grandma', emoji: '👵', category: 'Family', priority: 1 },
        { id: 'grandpa', text: 'Grandpa', emoji: '👴', category: 'Family', priority: 1 },
        { id: 'baby', text: 'Baby', emoji: '👶', category: 'Family', priority: 1 },
        { id: 'pet', text: 'Pet', emoji: '🐕', category: 'Family', priority: 1 },
        
        // Friends (9 words)
        { id: 'friend', text: 'Friend', emoji: '👫', category: 'Friends', priority: 1 },
        { id: 'best_friend', text: 'Best Friend', emoji: '💙', category: 'Friends', priority: 1 },
        { id: 'classmate', text: 'Classmate', emoji: '👥', category: 'Friends', priority: 1 },
        { id: 'neighbor', text: 'Neighbor', emoji: '🏘️', category: 'Friends', priority: 1 },
        { id: 'play_together', text: 'Play Together', emoji: '🤝', category: 'Friends', priority: 1 },
        { id: 'share', text: 'Share', emoji: '🤲', category: 'Friends', priority: 1 },
        { id: 'help_friend', text: 'Help Friend', emoji: '💪', category: 'Friends', priority: 1 },
        { id: 'invite', text: 'Invite', emoji: '📞', category: 'Friends', priority: 1 },
        { id: 'visit', text: 'Visit', emoji: '🚪', category: 'Friends', priority: 1 },
        
        // Love & Care (9 words)
        { id: 'love', text: 'Love', emoji: '❤️', category: 'Love & Care', priority: 1 },
        { id: 'like', text: 'Like', emoji: '👍', category: 'Love & Care', priority: 1 },
        { id: 'care', text: 'Care', emoji: '🤗', category: 'Love & Care', priority: 1 },
        { id: 'hug', text: 'Hug', emoji: '🤗', category: 'Love & Care', priority: 1 },
        { id: 'kiss', text: 'Kiss', emoji: '😘', category: 'Love & Care', priority: 1 },
        { id: 'miss', text: 'Miss', emoji: '💭', category: 'Love & Care', priority: 1 },
        { id: 'comfort', text: 'Comfort', emoji: '🤲', category: 'Love & Care', priority: 1 },
        { id: 'support', text: 'Support', emoji: '💪', category: 'Love & Care', priority: 1 },
        { id: 'kind', text: 'Kind', emoji: '💝', category: 'Love & Care', priority: 1 },
        
        // Activities (9 words)
        { id: 'play', text: 'Play', emoji: '🎮', category: 'Activities', priority: 1 },
        { id: 'talk', text: 'Talk', emoji: '💬', category: 'Activities', priority: 1 },
        { id: 'listen', text: 'Listen', emoji: '👂', category: 'Activities', priority: 1 },
        { id: 'dance', text: 'Dance', emoji: '💃', category: 'Activities', priority: 1 },
        { id: 'sing', text: 'Sing', emoji: '🎤', category: 'Activities', priority: 1 },
        { id: 'laugh', text: 'Laugh', emoji: '😂', category: 'Activities', priority: 1 },
        { id: 'smile', text: 'Smile', emoji: '😊', category: 'Activities', priority: 1 },
        { id: 'celebrate', text: 'Celebrate', emoji: '🎉', category: 'Activities', priority: 1 },
        { id: 'party', text: 'Party', emoji: '🥳', category: 'Activities', priority: 1 },
        
        // Manners (9 words)
        { id: 'polite', text: 'Polite', emoji: '🙏', category: 'Manners', priority: 1 },
        { id: 'respectful', text: 'Respectful', emoji: '🤝', category: 'Manners', priority: 1 },
        { id: 'patient', text: 'Patient', emoji: '⏰', category: 'Manners', priority: 1 },
        { id: 'gentle', text: 'Gentle', emoji: '🕊️', category: 'Manners', priority: 1 },
        { id: 'honest', text: 'Honest', emoji: '💯', category: 'Manners', priority: 1 },
        { id: 'fair', text: 'Fair', emoji: '⚖️', category: 'Manners', priority: 1 },
        { id: 'helpful', text: 'Helpful', emoji: '🤲', category: 'Manners', priority: 1 },
        { id: 'generous', text: 'Generous', emoji: '🎁', category: 'Manners', priority: 1 },
        { id: 'friendly', text: 'Friendly', emoji: '🌟', category: 'Manners', priority: 1 },
        
        // Requests (9 words)
        { id: 'can_i', text: 'Can I', emoji: '🙋‍♂️', category: 'Requests', priority: 1 },
        { id: 'may_i', text: 'May I', emoji: '🙏', category: 'Requests', priority: 1 },
        { id: 'would_you', text: 'Would you', emoji: '❓', category: 'Requests', priority: 1 },
        { id: 'could_you', text: 'Could you', emoji: '🤔', category: 'Requests', priority: 1 },
        { id: 'help_me', text: 'Help me', emoji: '🆘', category: 'Requests', priority: 1 },
        { id: 'show_me', text: 'Show me', emoji: '👀', category: 'Requests', priority: 1 },
        { id: 'teach_me', text: 'Teach me', emoji: '📚', category: 'Requests', priority: 1 },
        { id: 'tell_me', text: 'Tell me', emoji: '💬', category: 'Requests', priority: 1 },
        { id: 'give_me', text: 'Give me', emoji: '🤲', category: 'Requests', priority: 1 },
        
        // Greetings (9 words)
        { id: 'good_morning', text: 'Good Morning', emoji: '🌅', category: 'Greetings', priority: 1 },
        { id: 'good_afternoon', text: 'Good Afternoon', emoji: '☀️', category: 'Greetings', priority: 1 },
        { id: 'good_evening', text: 'Good Evening', emoji: '🌆', category: 'Greetings', priority: 1 },
        { id: 'good_night', text: 'Good Night', emoji: '🌙', category: 'Greetings', priority: 1 },
        { id: 'see_you_later', text: 'See You Later', emoji: '👋', category: 'Greetings', priority: 1 },
        { id: 'how_are_you', text: 'How Are You', emoji: '❓', category: 'Greetings', priority: 1 },
        { id: 'fine_thanks', text: 'Fine Thanks', emoji: '👍', category: 'Greetings', priority: 1 },
        { id: 'nice_to_meet', text: 'Nice to Meet', emoji: '🤝', category: 'Greetings', priority: 1 },
        { id: 'welcome_back', text: 'Welcome Back', emoji: '🏠', category: 'Greetings', priority: 1 }
      ],
      categories: ['Social Words', 'Emotions', 'Family', 'Friends', 'Love & Care', 'Activities', 'Manners', 'Requests', 'Greetings'],
      layout: 'grid-3x3'
    }
  },
  {
    id: 'school_learning',
    name: '🎓 School & Learning',
    description: 'Perfect for classroom communication',
    config: {
      tiles: [
        // School Basics (9 words)
        { id: 'help', text: 'Help', emoji: '🆘', category: 'School Basics', priority: 1 },
        { id: 'understand', text: 'Understand', emoji: '💡', category: 'School Basics', priority: 1 },
        { id: 'dont_understand', text: "Don't understand", emoji: '❓', category: 'School Basics', priority: 1 },
        { id: 'finished', text: 'Finished', emoji: '✅', category: 'School Basics', priority: 1 },
        { id: 'more_time', text: 'More time', emoji: '⏰', category: 'School Basics', priority: 1 },
        { id: 'ready', text: 'Ready', emoji: '🙋‍♂️', category: 'School Basics', priority: 1 },
        { id: 'question', text: 'Question', emoji: '🙋‍♀️', category: 'School Basics', priority: 1 },
        { id: 'answer', text: 'Answer', emoji: '💬', category: 'School Basics', priority: 1 },
        { id: 'repeat', text: 'Repeat', emoji: '🔄', category: 'School Basics', priority: 1 },
        
        // Subjects (9 words)
        { id: 'math', text: 'Math', emoji: '🔢', category: 'Subjects', priority: 1 },
        { id: 'reading', text: 'Reading', emoji: '📚', category: 'Subjects', priority: 1 },
        { id: 'writing', text: 'Writing', emoji: '✏️', category: 'Subjects', priority: 1 },
        { id: 'science', text: 'Science', emoji: '🔬', category: 'Subjects', priority: 1 },
        { id: 'art', text: 'Art', emoji: '🎨', category: 'Subjects', priority: 1 },
        { id: 'music', text: 'Music', emoji: '🎵', category: 'Subjects', priority: 1 },
        { id: 'pe', text: 'PE', emoji: '⚽', category: 'Subjects', priority: 1 },
        { id: 'history', text: 'History', emoji: '📜', category: 'Subjects', priority: 1 },
        { id: 'geography', text: 'Geography', emoji: '🌍', category: 'Subjects', priority: 1 },
        
        // Learning Actions (9 words)
        { id: 'listen', text: 'Listen', emoji: '👂', category: 'Learning Actions', priority: 1 },
        { id: 'look', text: 'Look', emoji: '👀', category: 'Learning Actions', priority: 1 },
        { id: 'think', text: 'Think', emoji: '🤔', category: 'Learning Actions', priority: 1 },
        { id: 'work', text: 'Work', emoji: '📝', category: 'Learning Actions', priority: 1 },
        { id: 'study', text: 'Study', emoji: '📖', category: 'Learning Actions', priority: 1 },
        { id: 'practice', text: 'Practice', emoji: '🎯', category: 'Learning Actions', priority: 1 },
        { id: 'learn', text: 'Learn', emoji: '🧠', category: 'Learning Actions', priority: 1 },
        { id: 'remember', text: 'Remember', emoji: '💭', category: 'Learning Actions', priority: 1 },
        { id: 'review', text: 'Review', emoji: '🔍', category: 'Learning Actions', priority: 1 },
        
        // School People (9 words)
        { id: 'teacher', text: 'Teacher', emoji: '👩‍🏫', category: 'School People', priority: 1 },
        { id: 'principal', text: 'Principal', emoji: '👔', category: 'School People', priority: 1 },
        { id: 'classmate', text: 'Classmate', emoji: '👫', category: 'School People', priority: 1 },
        { id: 'librarian', text: 'Librarian', emoji: '📚', category: 'School People', priority: 1 },
        { id: 'nurse', text: 'Nurse', emoji: '👩‍⚕️', category: 'School People', priority: 1 },
        { id: 'counselor', text: 'Counselor', emoji: '🤝', category: 'School People', priority: 1 },
        { id: 'coach', text: 'Coach', emoji: '🏃‍♂️', category: 'School People', priority: 1 },
        { id: 'friend', text: 'Friend', emoji: '👯‍♀️', category: 'School People', priority: 1 },
        { id: 'tutor', text: 'Tutor', emoji: '👨‍🏫', category: 'School People', priority: 1 },
        
        // School Supplies (9 words)
        { id: 'pencil', text: 'Pencil', emoji: '✏️', category: 'School Supplies', priority: 1 },
        { id: 'paper', text: 'Paper', emoji: '📄', category: 'School Supplies', priority: 1 },
        { id: 'book', text: 'Book', emoji: '📖', category: 'School Supplies', priority: 1 },
        { id: 'notebook', text: 'Notebook', emoji: '📓', category: 'School Supplies', priority: 1 },
        { id: 'eraser', text: 'Eraser', emoji: '🧽', category: 'School Supplies', priority: 1 },
        { id: 'ruler', text: 'Ruler', emoji: '📏', category: 'School Supplies', priority: 1 },
        { id: 'calculator', text: 'Calculator', emoji: '🧮', category: 'School Supplies', priority: 1 },
        { id: 'crayon', text: 'Crayon', emoji: '🖍️', category: 'School Supplies', priority: 1 },
        { id: 'backpack', text: 'Backpack', emoji: '🎒', category: 'School Supplies', priority: 1 },
        
        // School Places (9 words)
        { id: 'classroom', text: 'Classroom', emoji: '🏫', category: 'School Places', priority: 1 },
        { id: 'library', text: 'Library', emoji: '📚', category: 'School Places', priority: 1 },
        { id: 'cafeteria', text: 'Cafeteria', emoji: '🍽️', category: 'School Places', priority: 1 },
        { id: 'gym', text: 'Gym', emoji: '🏃‍♂️', category: 'School Places', priority: 1 },
        { id: 'playground', text: 'Playground', emoji: '🛝', category: 'School Places', priority: 1 },
        { id: 'office', text: 'Office', emoji: '🏢', category: 'School Places', priority: 1 },
        { id: 'bathroom', text: 'Bathroom', emoji: '🚽', category: 'School Places', priority: 1 },
        { id: 'hallway', text: 'Hallway', emoji: '🚪', category: 'School Places', priority: 1 },
        { id: 'computer_lab', text: 'Computer Lab', emoji: '💻', category: 'School Places', priority: 1 },
        
        // Tests & Grades (9 words)
        { id: 'test', text: 'Test', emoji: '📝', category: 'Tests & Grades', priority: 1 },
        { id: 'quiz', text: 'Quiz', emoji: '❓', category: 'Tests & Grades', priority: 1 },
        { id: 'homework', text: 'Homework', emoji: '📚', category: 'Tests & Grades', priority: 1 },
        { id: 'project', text: 'Project', emoji: '📊', category: 'Tests & Grades', priority: 1 },
        { id: 'grade', text: 'Grade', emoji: '💯', category: 'Tests & Grades', priority: 1 },
        { id: 'report_card', text: 'Report Card', emoji: '📋', category: 'Tests & Grades', priority: 1 },
        { id: 'assignment', text: 'Assignment', emoji: '📄', category: 'Tests & Grades', priority: 1 },
        { id: 'presentation', text: 'Presentation', emoji: '📢', category: 'Tests & Grades', priority: 1 },
        { id: 'exam', text: 'Exam', emoji: '📑', category: 'Tests & Grades', priority: 1 },
        
        // Time & Schedule (9 words)
        { id: 'morning', text: 'Morning', emoji: '🌅', category: 'Time & Schedule', priority: 1 },
        { id: 'afternoon', text: 'Afternoon', emoji: '☀️', category: 'Time & Schedule', priority: 1 },
        { id: 'recess', text: 'Recess', emoji: '⏰', category: 'Time & Schedule', priority: 1 },
        { id: 'lunch', text: 'Lunch', emoji: '🍱', category: 'Time & Schedule', priority: 1 },
        { id: 'class', text: 'Class', emoji: '🕐', category: 'Time & Schedule', priority: 1 },
        { id: 'period', text: 'Period', emoji: '📅', category: 'Time & Schedule', priority: 1 },
        { id: 'bell', text: 'Bell', emoji: '🔔', category: 'Time & Schedule', priority: 1 },
        { id: 'calendar', text: 'Calendar', emoji: '📆', category: 'Time & Schedule', priority: 1 },
        { id: 'schedule', text: 'Schedule', emoji: '📋', category: 'Time & Schedule', priority: 1 }
      ],
      categories: ['School Basics', 'Subjects', 'Learning Actions', 'School People', 'School Supplies', 'School Places', 'Tests & Grades', 'Time & Schedule', 'School Activities'],
      layout: 'grid-3x3'
    }
  },
  {
    id: 'games_fun',
    name: '🎮 Games & Fun',
    description: 'All about play, games and having fun!',
    config: {
      tiles: [
        // Gaming Words (9 words)
        { id: 'play', text: 'Play', emoji: '🎮', category: 'Gaming Words', priority: 1 },
        { id: 'game', text: 'Game', emoji: '🎲', category: 'Gaming Words', priority: 1 },
        { id: 'fun', text: 'Fun', emoji: '🎉', category: 'Gaming Words', priority: 1 },
        { id: 'my_turn', text: 'My turn', emoji: '🙋‍♂️', category: 'Gaming Words', priority: 1 },
        { id: 'your_turn', text: 'Your turn', emoji: '👉', category: 'Gaming Words', priority: 1 },
        { id: 'wait', text: 'Wait', emoji: '⏳', category: 'Gaming Words', priority: 1 },
        { id: 'start', text: 'Start', emoji: '▶️', category: 'Gaming Words', priority: 1 },
        { id: 'pause', text: 'Pause', emoji: '⏸️', category: 'Gaming Words', priority: 1 },
        { id: 'again', text: 'Again', emoji: '🔄', category: 'Gaming Words', priority: 1 },
        
        // Game Results (9 words)
        { id: 'win', text: 'Win', emoji: '🏆', category: 'Game Results', priority: 1 },
        { id: 'lose', text: 'Lose', emoji: '😔', category: 'Game Results', priority: 1 },
        { id: 'tie', text: 'Tie', emoji: '🤝', category: 'Game Results', priority: 1 },
        { id: 'good_job', text: 'Good job', emoji: '👏', category: 'Game Results', priority: 1 },
        { id: 'try_again', text: 'Try again', emoji: '🔄', category: 'Game Results', priority: 1 },
        { id: 'almost', text: 'Almost', emoji: '👌', category: 'Game Results', priority: 1 },
        { id: 'great', text: 'Great', emoji: '⭐', category: 'Game Results', priority: 1 },
        { id: 'awesome', text: 'Awesome', emoji: '🌟', category: 'Game Results', priority: 1 },
        { id: 'perfect', text: 'Perfect', emoji: '💯', category: 'Game Results', priority: 1 },
        
        // Toy Games (9 words)
        { id: 'video_game', text: 'Video game', emoji: '🎮', category: 'Toy Games', priority: 1 },
        { id: 'board_game', text: 'Board game', emoji: '🎲', category: 'Toy Games', priority: 1 },
        { id: 'card_game', text: 'Card game', emoji: '🃏', category: 'Toy Games', priority: 1 },
        { id: 'puzzle', text: 'Puzzle', emoji: '🧩', category: 'Toy Games', priority: 1 },
        { id: 'blocks', text: 'Blocks', emoji: '🧱', category: 'Toy Games', priority: 1 },
        { id: 'dolls', text: 'Dolls', emoji: '🪆', category: 'Toy Games', priority: 1 },
        { id: 'cars', text: 'Cars', emoji: '🚗', category: 'Toy Games', priority: 1 },
        { id: 'action_figures', text: 'Action Figures', emoji: '🦸‍♂️', category: 'Toy Games', priority: 1 },
        { id: 'stuffed_animals', text: 'Stuffed Animals', emoji: '🧸', category: 'Toy Games', priority: 1 },
        
        // Outdoor Games (9 words)
        { id: 'tag', text: 'Tag', emoji: '🏃‍♂️', category: 'Outdoor Games', priority: 1 },
        { id: 'hide_seek', text: 'Hide & Seek', emoji: '👀', category: 'Outdoor Games', priority: 1 },
        { id: 'soccer', text: 'Soccer', emoji: '⚽', category: 'Outdoor Games', priority: 1 },
        { id: 'basketball', text: 'Basketball', emoji: '🏀', category: 'Outdoor Games', priority: 1 },
        { id: 'swing', text: 'Swing', emoji: '🛝', category: 'Outdoor Games', priority: 1 },
        { id: 'slide', text: 'Slide', emoji: '🛝', category: 'Outdoor Games', priority: 1 },
        { id: 'bike', text: 'Bike', emoji: '🚲', category: 'Outdoor Games', priority: 1 },
        { id: 'jump_rope', text: 'Jump rope', emoji: '🪢', category: 'Outdoor Games', priority: 1 },
        { id: 'hopscotch', text: 'Hopscotch', emoji: '🦘', category: 'Outdoor Games', priority: 1 },
        
        // Creative Play (9 words)
        { id: 'drawing', text: 'Drawing', emoji: '🖍️', category: 'Creative Play', priority: 1 },
        { id: 'coloring', text: 'Coloring', emoji: '🎨', category: 'Creative Play', priority: 1 },
        { id: 'painting', text: 'Painting', emoji: '🖌️', category: 'Creative Play', priority: 1 },
        { id: 'crafts', text: 'Crafts', emoji: '✂️', category: 'Creative Play', priority: 1 },
        { id: 'building', text: 'Building', emoji: '🔨', category: 'Creative Play', priority: 1 },
        { id: 'pretend', text: 'Pretend', emoji: '🎭', category: 'Creative Play', priority: 1 },
        { id: 'dress_up', text: 'Dress up', emoji: '👗', category: 'Creative Play', priority: 1 },
        { id: 'makeup', text: 'Make up', emoji: '💄', category: 'Creative Play', priority: 1 },
        { id: 'story', text: 'Story', emoji: '📚', category: 'Creative Play', priority: 1 },
        
        // Entertainment (9 words)
        { id: 'watch', text: 'Watch', emoji: '📺', category: 'Entertainment', priority: 1 },
        { id: 'movie', text: 'Movie', emoji: '🎬', category: 'Entertainment', priority: 1 },
        { id: 'cartoon', text: 'Cartoon', emoji: '📺', category: 'Entertainment', priority: 1 },
        { id: 'music', text: 'Music', emoji: '🎵', category: 'Entertainment', priority: 1 },
        { id: 'dance', text: 'Dance', emoji: '💃', category: 'Entertainment', priority: 1 },
        { id: 'sing', text: 'Sing', emoji: '🎤', category: 'Entertainment', priority: 1 },
        { id: 'show', text: 'Show', emoji: '🎪', category: 'Entertainment', priority: 1 },
        { id: 'youtube', text: 'YouTube', emoji: '📱', category: 'Entertainment', priority: 1 },
        { id: 'tablet', text: 'Tablet', emoji: '📱', category: 'Entertainment', priority: 1 },
        
        // Party & Celebration (9 words)
        { id: 'party', text: 'Party', emoji: '🥳', category: 'Party & Celebration', priority: 1 },
        { id: 'birthday', text: 'Birthday', emoji: '🎂', category: 'Party & Celebration', priority: 1 },
        { id: 'cake', text: 'Cake', emoji: '🍰', category: 'Party & Celebration', priority: 1 },
        { id: 'balloons', text: 'Balloons', emoji: '🎈', category: 'Party & Celebration', priority: 1 },
        { id: 'presents', text: 'Presents', emoji: '🎁', category: 'Party & Celebration', priority: 1 },
        { id: 'decorations', text: 'Decorations', emoji: '🎊', category: 'Party & Celebration', priority: 1 },
        { id: 'candles', text: 'Candles', emoji: '🕯️', category: 'Party & Celebration', priority: 1 },
        { id: 'celebrate', text: 'Celebrate', emoji: '🎉', category: 'Party & Celebration', priority: 1 },
        { id: 'surprise', text: 'Surprise', emoji: '🎁', category: 'Party & Celebration', priority: 1 },
        
        // Sports (9 words)
        { id: 'football', text: 'Football', emoji: '🏈', category: 'Sports', priority: 1 },
        { id: 'baseball', text: 'Baseball', emoji: '⚾', category: 'Sports', priority: 1 },
        { id: 'tennis', text: 'Tennis', emoji: '🎾', category: 'Sports', priority: 1 },
        { id: 'swimming', text: 'Swimming', emoji: '🏊‍♂️', category: 'Sports', priority: 1 },
        { id: 'running', text: 'Running', emoji: '🏃‍♂️', category: 'Sports', priority: 1 },
        { id: 'jumping', text: 'Jumping', emoji: '🦘', category: 'Sports', priority: 1 },
        { id: 'gym', text: 'Gym', emoji: '🏋️‍♂️', category: 'Sports', priority: 1 },
        { id: 'team', text: 'Team', emoji: '👥', category: 'Sports', priority: 1 },
        { id: 'coach', text: 'Coach', emoji: '👨‍🏫', category: 'Sports', priority: 1 }
      ],
      categories: ['Gaming Words', 'Game Results', 'Toy Games', 'Outdoor Games', 'Creative Play', 'Entertainment', 'Party & Celebration', 'Sports', 'Fun Activities'],
      layout: 'grid-3x3'
    }
  },
  {
    id: 'comprehensive',
    name: '🌈 Complete Communicator',
    description: 'Advanced board with phrases and complex ideas',
    config: {
      tiles: [
        // Common Phrases (9 words)
        { id: 'i_want', text: 'I want', emoji: '🙋‍♂️', category: 'Common Phrases', priority: 1 },
        { id: 'i_need', text: 'I need', emoji: '🆘', category: 'Common Phrases', priority: 1 },
        { id: 'i_like', text: 'I like', emoji: '👍', category: 'Common Phrases', priority: 1 },
        { id: 'i_dont_like', text: "I don't like", emoji: '👎', category: 'Common Phrases', priority: 1 },
        { id: 'can_you', text: 'Can you', emoji: '❓', category: 'Common Phrases', priority: 1 },
        { id: 'i_feel', text: 'I feel', emoji: '💭', category: 'Common Phrases', priority: 1 },
        { id: 'lets_go', text: "Let's go", emoji: '🚶‍♂️', category: 'Common Phrases', priority: 1 },
        { id: 'come_here', text: 'Come here', emoji: '👈', category: 'Common Phrases', priority: 1 },
        { id: 'what_is', text: 'What is', emoji: '❓', category: 'Common Phrases', priority: 1 },
        
        // Advanced Actions (9 words)
        { id: 'understand', text: 'Understand', emoji: '💡', category: 'Advanced Actions', priority: 1 },
        { id: 'remember', text: 'Remember', emoji: '🧠', category: 'Advanced Actions', priority: 1 },
        { id: 'forget', text: 'Forget', emoji: '🤔', category: 'Advanced Actions', priority: 1 },
        { id: 'choose', text: 'Choose', emoji: '🤏', category: 'Advanced Actions', priority: 1 },
        { id: 'decide', text: 'Decide', emoji: '🤷‍♂️', category: 'Advanced Actions', priority: 1 },
        { id: 'explain', text: 'Explain', emoji: '💬', category: 'Advanced Actions', priority: 1 },
        { id: 'imagine', text: 'Imagine', emoji: '💭', category: 'Advanced Actions', priority: 1 },
        { id: 'create', text: 'Create', emoji: '✨', category: 'Advanced Actions', priority: 1 },
        { id: 'discover', text: 'Discover', emoji: '🔍', category: 'Advanced Actions', priority: 1 },
        
        // Question Words (9 words)
        { id: 'what', text: 'What', emoji: '❓', category: 'Question Words', priority: 1 },
        { id: 'where', text: 'Where', emoji: '📍', category: 'Question Words', priority: 1 },
        { id: 'when', text: 'When', emoji: '⏰', category: 'Question Words', priority: 1 },
        { id: 'who', text: 'Who', emoji: '👤', category: 'Question Words', priority: 1 },
        { id: 'why', text: 'Why', emoji: '🤔', category: 'Question Words', priority: 1 },
        { id: 'how', text: 'How', emoji: '🔧', category: 'Question Words', priority: 1 },
        { id: 'which', text: 'Which', emoji: '👆', category: 'Question Words', priority: 1 },
        { id: 'whose', text: 'Whose', emoji: '🤷‍♂️', category: 'Question Words', priority: 1 },
        { id: 'how_many', text: 'How many', emoji: '🔢', category: 'Question Words', priority: 1 },
        
        // Time Words (9 words)
        { id: 'now', text: 'Now', emoji: '⏰', category: 'Time Words', priority: 1 },
        { id: 'later', text: 'Later', emoji: '⏳', category: 'Time Words', priority: 1 },
        { id: 'yesterday', text: 'Yesterday', emoji: '📅', category: 'Time Words', priority: 1 },
        { id: 'today', text: 'Today', emoji: '📆', category: 'Time Words', priority: 1 },
        { id: 'tomorrow', text: 'Tomorrow', emoji: '📅', category: 'Time Words', priority: 1 },
        { id: 'before', text: 'Before', emoji: '⏪', category: 'Time Words', priority: 1 },
        { id: 'after', text: 'After', emoji: '⏩', category: 'Time Words', priority: 1 },
        { id: 'soon', text: 'Soon', emoji: '⏱️', category: 'Time Words', priority: 1 },
        { id: 'never', text: 'Never', emoji: '🚫', category: 'Time Words', priority: 1 },
        
        // Describing Words (9 words)
        { id: 'big', text: 'Big', emoji: '🔍', category: 'Describing Words', priority: 1 },
        { id: 'small', text: 'Small', emoji: '🔎', category: 'Describing Words', priority: 1 },
        { id: 'hot', text: 'Hot', emoji: '🔥', category: 'Describing Words', priority: 1 },
        { id: 'cold', text: 'Cold', emoji: '❄️', category: 'Describing Words', priority: 1 },
        { id: 'fast', text: 'Fast', emoji: '💨', category: 'Describing Words', priority: 1 },
        { id: 'slow', text: 'Slow', emoji: '🐌', category: 'Describing Words', priority: 1 },
        { id: 'loud', text: 'Loud', emoji: '🔊', category: 'Describing Words', priority: 1 },
        { id: 'quiet', text: 'Quiet', emoji: '🔇', category: 'Describing Words', priority: 1 },
        { id: 'beautiful', text: 'Beautiful', emoji: '✨', category: 'Describing Words', priority: 1 },
        
        // Complex Emotions (9 words)
        { id: 'confused', text: 'Confused', emoji: '😕', category: 'Complex Emotions', priority: 1 },
        { id: 'disappointed', text: 'Disappointed', emoji: '😞', category: 'Complex Emotions', priority: 1 },
        { id: 'grateful', text: 'Grateful', emoji: '🙏', category: 'Complex Emotions', priority: 1 },
        { id: 'nervous', text: 'Nervous', emoji: '😰', category: 'Complex Emotions', priority: 1 },
        { id: 'curious', text: 'Curious', emoji: '🤔', category: 'Complex Emotions', priority: 1 },
        { id: 'brave', text: 'Brave', emoji: '💪', category: 'Complex Emotions', priority: 1 },
        { id: 'jealous', text: 'Jealous', emoji: '😒', category: 'Complex Emotions', priority: 1 },
        { id: 'embarrassed', text: 'Embarrassed', emoji: '😳', category: 'Complex Emotions', priority: 1 },
        { id: 'confident', text: 'Confident', emoji: '😎', category: 'Complex Emotions', priority: 1 },
        
        // Categories (9 words)
        { id: 'food', text: 'Food', emoji: '🍔', category: 'Categories', priority: 1 },
        { id: 'people', text: 'People', emoji: '👥', category: 'Categories', priority: 1 },
        { id: 'places', text: 'Places', emoji: '🏠', category: 'Categories', priority: 1 },
        { id: 'things', text: 'Things', emoji: '📦', category: 'Categories', priority: 1 },
        { id: 'colors', text: 'Colors', emoji: '🌈', category: 'Categories', priority: 1 },
        { id: 'numbers', text: 'Numbers', emoji: '🔢', category: 'Categories', priority: 1 },
        { id: 'feelings', text: 'Feelings', emoji: '😊', category: 'Categories', priority: 1 },
        { id: 'animals', text: 'Animals', emoji: '🐾', category: 'Categories', priority: 1 },
        { id: 'activities', text: 'Activities', emoji: '🎯', category: 'Categories', priority: 1 },
        
        // Abstract Concepts (9 words)
        { id: 'idea', text: 'Idea', emoji: '💡', category: 'Abstract Concepts', priority: 1 },
        { id: 'dream', text: 'Dream', emoji: '💭', category: 'Abstract Concepts', priority: 1 },
        { id: 'hope', text: 'Hope', emoji: '🌟', category: 'Abstract Concepts', priority: 1 },
        { id: 'worry', text: 'Worry', emoji: '😟', category: 'Abstract Concepts', priority: 1 },
        { id: 'memory', text: 'Memory', emoji: '🧠', category: 'Abstract Concepts', priority: 1 },
        { id: 'thought', text: 'Thought', emoji: '💭', category: 'Abstract Concepts', priority: 1 },
        { id: 'plan', text: 'Plan', emoji: '📋', category: 'Abstract Concepts', priority: 1 },
        { id: 'goal', text: 'Goal', emoji: '🎯', category: 'Abstract Concepts', priority: 1 },
        { id: 'wish', text: 'Wish', emoji: '⭐', category: 'Abstract Concepts', priority: 1 }
      ],
      categories: ['Common Phrases', 'Advanced Actions', 'Question Words', 'Time Words', 'Describing Words', 'Complex Emotions', 'Categories', 'Abstract Concepts', 'Communication'],
      layout: 'grid-3x3'
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