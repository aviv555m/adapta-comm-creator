import { BoardTile } from '../types/board';

export const generateExpandedBoardData = (): BoardTile[] => {
  return [
    // Core (Priority 1)
    { id: 'core1', text: 'I need help', emoji: '🆘', category: 'Core', priority: 1 },
    { id: 'core2', text: 'Please help me', emoji: '🙏', category: 'Core', priority: 1 },
    { id: 'core3', text: 'Thank you', emoji: '🙇', category: 'Core', priority: 1 },
    { id: 'core4', text: 'Yes', emoji: '👍', category: 'Core', priority: 1 },
    { id: 'core5', text: 'No', emoji: '👎', category: 'Core', priority: 1 },
    { id: 'core6', text: 'Please stop', emoji: '✋', category: 'Core', priority: 1 },
    { id: 'core7', text: 'More', emoji: '➕', category: 'Core', priority: 1 },
    { id: 'core8', text: 'Finished', emoji: '✅', category: 'Core', priority: 1 },

    // Basic Needs
    { id: 'basic1', text: 'I am hungry', emoji: '🍽️', category: 'Basic Needs', priority: 2 },
    { id: 'basic2', text: 'I am thirsty', emoji: '🥤', category: 'Basic Needs', priority: 2 },
    { id: 'basic3', text: 'I need the bathroom', emoji: '🚻', category: 'Basic Needs', priority: 2 },
    { id: 'basic4', text: 'I am tired', emoji: '😴', category: 'Basic Needs', priority: 2 },
    { id: 'basic5', text: 'I am hot', emoji: '🔥', category: 'Basic Needs', priority: 2 },
    { id: 'basic6', text: 'I am cold', emoji: '🥶', category: 'Basic Needs', priority: 2 },
    { id: 'basic7', text: 'I need medicine', emoji: '💊', category: 'Basic Needs', priority: 2 },
    { id: 'basic8', text: 'I want to sleep', emoji: '🛏️', category: 'Basic Needs', priority: 2 },

    // Food & Drinks
    { id: 'food1', text: 'Water', emoji: '💧', category: 'Food & Drinks', priority: 3 },
    { id: 'food2', text: 'Bread', emoji: '🍞', category: 'Food & Drinks', priority: 3 },
    { id: 'food3', text: 'Apple', emoji: '🍎', category: 'Food & Drinks', priority: 3 },
    { id: 'food4', text: 'Milk', emoji: '🥛', category: 'Food & Drinks', priority: 3 },
    { id: 'food5', text: 'Coffee', emoji: '☕', category: 'Food & Drinks', priority: 3 },
    { id: 'food6', text: 'Sandwich', emoji: '🥪', category: 'Food & Drinks', priority: 3 },
    { id: 'food7', text: 'Pizza', emoji: '🍕', category: 'Food & Drinks', priority: 3 },
    { id: 'food8', text: 'Ice cream', emoji: '🍦', category: 'Food & Drinks', priority: 3 },

    // Emotions
    { id: 'emotion1', text: 'I am happy', emoji: '😊', category: 'Emotions', priority: 3 },
    { id: 'emotion2', text: 'I am sad', emoji: '😢', category: 'Emotions', priority: 3 },
    { id: 'emotion3', text: 'I am angry', emoji: '😠', category: 'Emotions', priority: 3 },
    { id: 'emotion4', text: 'I am scared', emoji: '😨', category: 'Emotions', priority: 3 },
    { id: 'emotion5', text: 'I am excited', emoji: '🤩', category: 'Emotions', priority: 3 },
    { id: 'emotion6', text: 'I am confused', emoji: '😕', category: 'Emotions', priority: 3 },
    { id: 'emotion7', text: 'I am proud', emoji: '🥰', category: 'Emotions', priority: 3 },
    { id: 'emotion8', text: 'I am worried', emoji: '😟', category: 'Emotions', priority: 3 },

    // Actions
    { id: 'action1', text: 'I want to go', emoji: '🏃', category: 'Actions', priority: 3 },
    { id: 'action2', text: 'I want to stay', emoji: '🧍', category: 'Actions', priority: 3 },
    { id: 'action3', text: 'I want to play', emoji: '🎮', category: 'Actions', priority: 3 },
    { id: 'action4', text: 'I want to rest', emoji: '🛌', category: 'Actions', priority: 3 },
    { id: 'action5', text: 'I want to read', emoji: '📚', category: 'Actions', priority: 3 },
    { id: 'action6', text: 'I want to watch', emoji: '📺', category: 'Actions', priority: 3 },
    { id: 'action7', text: 'I want to listen', emoji: '🎵', category: 'Actions', priority: 3 },
    { id: 'action8', text: 'I want to draw', emoji: '🎨', category: 'Actions', priority: 3 },

    // People
    { id: 'people1', text: 'Mom', emoji: '👩', category: 'People', priority: 4 },
    { id: 'people2', text: 'Dad', emoji: '👨', category: 'People', priority: 4 },
    { id: 'people3', text: 'Teacher', emoji: '👩‍🏫', category: 'People', priority: 4 },
    { id: 'people4', text: 'Friend', emoji: '👫', category: 'People', priority: 4 },
    { id: 'people5', text: 'Doctor', emoji: '👩‍⚕️', category: 'People', priority: 4 },
    { id: 'people6', text: 'Family', emoji: '👨‍👩‍👧‍👦', category: 'People', priority: 4 },

    // Places
    { id: 'places1', text: 'Home', emoji: '🏠', category: 'Places', priority: 4 },
    { id: 'places2', text: 'School', emoji: '🏫', category: 'Places', priority: 4 },
    { id: 'places3', text: 'Park', emoji: '🏞️', category: 'Places', priority: 4 },
    { id: 'places4', text: 'Store', emoji: '🏪', category: 'Places', priority: 4 },
    { id: 'places5', text: 'Hospital', emoji: '🏥', category: 'Places', priority: 4 },
    { id: 'places6', text: 'Library', emoji: '📚', category: 'Places', priority: 4 },

    // Animals
    { id: 'animals1', text: 'Dog', emoji: '🐕', category: 'Animals', priority: 5 },
    { id: 'animals2', text: 'Cat', emoji: '🐱', category: 'Animals', priority: 5 },
    { id: 'animals3', text: 'Bird', emoji: '🐦', category: 'Animals', priority: 5 },
    { id: 'animals4', text: 'Fish', emoji: '🐠', category: 'Animals', priority: 5 },
    { id: 'animals5', text: 'Horse', emoji: '🐎', category: 'Animals', priority: 5 },
    { id: 'animals6', text: 'Rabbit', emoji: '🐰', category: 'Animals', priority: 5 },

    // Colors
    { id: 'colors1', text: 'Red', emoji: '🔴', category: 'Colors', priority: 5 },
    { id: 'colors2', text: 'Blue', emoji: '🔵', category: 'Colors', priority: 5 },
    { id: 'colors3', text: 'Green', emoji: '🟢', category: 'Colors', priority: 5 },
    { id: 'colors4', text: 'Yellow', emoji: '🟡', category: 'Colors', priority: 5 },
    { id: 'colors5', text: 'Purple', emoji: '🟣', category: 'Colors', priority: 5 },
    { id: 'colors6', text: 'Orange', emoji: '🟠', category: 'Colors', priority: 5 },

    // Numbers
    { id: 'numbers1', text: 'One', emoji: '1️⃣', category: 'Numbers', priority: 5 },
    { id: 'numbers2', text: 'Two', emoji: '2️⃣', category: 'Numbers', priority: 5 },
    { id: 'numbers3', text: 'Three', emoji: '3️⃣', category: 'Numbers', priority: 5 },
    { id: 'numbers4', text: 'Four', emoji: '4️⃣', category: 'Numbers', priority: 5 },
    { id: 'numbers5', text: 'Five', emoji: '5️⃣', category: 'Numbers', priority: 5 },
    { id: 'numbers6', text: 'Ten', emoji: '🔟', category: 'Numbers', priority: 5 },

    // Time
    { id: 'time1', text: 'Now', emoji: '⏰', category: 'Time', priority: 4 },
    { id: 'time2', text: 'Later', emoji: '⏳', category: 'Time', priority: 4 },
    { id: 'time3', text: 'Today', emoji: '📅', category: 'Time', priority: 4 },
    { id: 'time4', text: 'Tomorrow', emoji: '🗓️', category: 'Time', priority: 4 },
    { id: 'time5', text: 'Morning', emoji: '🌅', category: 'Time', priority: 4 },
    { id: 'time6', text: 'Night', emoji: '🌙', category: 'Time', priority: 4 },

    // Weather
    { id: 'weather1', text: 'Sunny', emoji: '☀️', category: 'Weather', priority: 5 },
    { id: 'weather2', text: 'Rainy', emoji: '🌧️', category: 'Weather', priority: 5 },
    { id: 'weather3', text: 'Cloudy', emoji: '☁️', category: 'Weather', priority: 5 },
    { id: 'weather4', text: 'Snowy', emoji: '❄️', category: 'Weather', priority: 5 },
    { id: 'weather5', text: 'Windy', emoji: '💨', category: 'Weather', priority: 5 },
    { id: 'weather6', text: 'Hot', emoji: '🌡️', category: 'Weather', priority: 5 },

    // Transportation
    { id: 'transport1', text: 'Car', emoji: '🚗', category: 'Transportation', priority: 5 },
    { id: 'transport2', text: 'Bus', emoji: '🚌', category: 'Transportation', priority: 5 },
    { id: 'transport3', text: 'Train', emoji: '🚂', category: 'Transportation', priority: 5 },
    { id: 'transport4', text: 'Bike', emoji: '🚲', category: 'Transportation', priority: 5 },
    { id: 'transport5', text: 'Walk', emoji: '🚶', category: 'Transportation', priority: 5 },
    { id: 'transport6', text: 'Airplane', emoji: '✈️', category: 'Transportation', priority: 5 },

    // Activities
    { id: 'activities1', text: 'Swimming', emoji: '🏊', category: 'Activities', priority: 5 },
    { id: 'activities2', text: 'Dancing', emoji: '💃', category: 'Activities', priority: 5 },
    { id: 'activities3', text: 'Singing', emoji: '🎤', category: 'Activities', priority: 5 },
    { id: 'activities4', text: 'Cooking', emoji: '👩‍🍳', category: 'Activities', priority: 5 },
    { id: 'activities5', text: 'Cleaning', emoji: '🧽', category: 'Activities', priority: 5 },
    { id: 'activities6', text: 'Shopping', emoji: '🛒', category: 'Activities', priority: 5 },

    // Sports
    { id: 'sports1', text: 'Football', emoji: '⚽', category: 'Sports', priority: 5 },
    { id: 'sports2', text: 'Basketball', emoji: '🏀', category: 'Sports', priority: 5 },
    { id: 'sports3', text: 'Tennis', emoji: '🎾', category: 'Sports', priority: 5 },
    { id: 'sports4', text: 'Baseball', emoji: '⚾', category: 'Sports', priority: 5 },
    { id: 'sports5', text: 'Running', emoji: '🏃‍♂️', category: 'Sports', priority: 5 },
    { id: 'sports6', text: 'Golf', emoji: '⛳', category: 'Sports', priority: 5 },

    // Technology
    { id: 'tech1', text: 'Computer', emoji: '💻', category: 'Technology', priority: 5 },
    { id: 'tech2', text: 'Phone', emoji: '📱', category: 'Technology', priority: 5 },
    { id: 'tech3', text: 'TV', emoji: '📺', category: 'Technology', priority: 5 },
    { id: 'tech4', text: 'Camera', emoji: '📷', category: 'Technology', priority: 5 },
    { id: 'tech5', text: 'Music', emoji: '🎵', category: 'Technology', priority: 5 },
    { id: 'tech6', text: 'Game', emoji: '🎮', category: 'Technology', priority: 5 },

    // Health
    { id: 'health1', text: 'Pain', emoji: '🤕', category: 'Health', priority: 3 },
    { id: 'health2', text: 'Sick', emoji: '🤒', category: 'Health', priority: 3 },
    { id: 'health3', text: 'Better', emoji: '😌', category: 'Health', priority: 3 },
    { id: 'health4', text: 'Exercise', emoji: '🏋️', category: 'Health', priority: 5 },
    { id: 'health5', text: 'Medicine', emoji: '💊', category: 'Health', priority: 3 },
    { id: 'health6', text: 'Doctor', emoji: '👩‍⚕️', category: 'Health', priority: 4 },

    // School
    { id: 'school1', text: 'Book', emoji: '📖', category: 'School', priority: 4 },
    { id: 'school2', text: 'Pencil', emoji: '✏️', category: 'School', priority: 4 },
    { id: 'school3', text: 'Paper', emoji: '📄', category: 'School', priority: 4 },
    { id: 'school4', text: 'Math', emoji: '🔢', category: 'School', priority: 4 },
    { id: 'school5', text: 'Science', emoji: '🔬', category: 'School', priority: 4 },
    { id: 'school6', text: 'Art', emoji: '🎨', category: 'School', priority: 4 },

    // Clothing
    { id: 'clothing1', text: 'Shirt', emoji: '👕', category: 'Clothing', priority: 5 },
    { id: 'clothing2', text: 'Pants', emoji: '👖', category: 'Clothing', priority: 5 },
    { id: 'clothing3', text: 'Shoes', emoji: '👟', category: 'Clothing', priority: 5 },
    { id: 'clothing4', text: 'Hat', emoji: '👒', category: 'Clothing', priority: 5 },
    { id: 'clothing5', text: 'Jacket', emoji: '🧥', category: 'Clothing', priority: 5 },
    { id: 'clothing6', text: 'Socks', emoji: '🧦', category: 'Clothing', priority: 5 },

    // Music
    { id: 'music1', text: 'Piano', emoji: '🎹', category: 'Music', priority: 5 },
    { id: 'music2', text: 'Guitar', emoji: '🎸', category: 'Music', priority: 5 },
    { id: 'music3', text: 'Drums', emoji: '🥁', category: 'Music', priority: 5 },
    { id: 'music4', text: 'Song', emoji: '🎵', category: 'Music', priority: 5 },
    { id: 'music5', text: 'Dance', emoji: '💃', category: 'Music', priority: 5 },
    { id: 'music6', text: 'Concert', emoji: '🎤', category: 'Music', priority: 5 },

    // Nature
    { id: 'nature1', text: 'Tree', emoji: '🌳', category: 'Nature', priority: 5 },
    { id: 'nature2', text: 'Flower', emoji: '🌸', category: 'Nature', priority: 5 },
    { id: 'nature3', text: 'Grass', emoji: '🌱', category: 'Nature', priority: 5 },
    { id: 'nature4', text: 'Mountain', emoji: '⛰️', category: 'Nature', priority: 5 },
    { id: 'nature5', text: 'Ocean', emoji: '🌊', category: 'Nature', priority: 5 },
    { id: 'nature6', text: 'River', emoji: '🏞️', category: 'Nature', priority: 5 },

    // Toys
    { id: 'toys1', text: 'Ball', emoji: '⚽', category: 'Toys', priority: 5 },
    { id: 'toys2', text: 'Doll', emoji: '🪆', category: 'Toys', priority: 5 },
    { id: 'toys3', text: 'Blocks', emoji: '🧱', category: 'Toys', priority: 5 },
    { id: 'toys4', text: 'Puzzle', emoji: '🧩', category: 'Toys', priority: 5 },
    { id: 'toys5', text: 'Car toy', emoji: '🚗', category: 'Toys', priority: 5 },
    { id: 'toys6', text: 'Robot', emoji: '🤖', category: 'Toys', priority: 5 },

    // Furniture
    { id: 'furniture1', text: 'Chair', emoji: '🪑', category: 'Furniture', priority: 5 },
    { id: 'furniture2', text: 'Table', emoji: '🪑', category: 'Furniture', priority: 5 },
    { id: 'furniture3', text: 'Bed', emoji: '🛏️', category: 'Furniture', priority: 5 },
    { id: 'furniture4', text: 'Sofa', emoji: '🛋️', category: 'Furniture', priority: 5 },
    { id: 'furniture5', text: 'Door', emoji: '🚪', category: 'Furniture', priority: 5 },
    { id: 'furniture6', text: 'Window', emoji: '🪟', category: 'Furniture', priority: 5 },

    // Communication
    { id: 'comm1', text: 'Talk', emoji: '💬', category: 'Communication', priority: 3 },
    { id: 'comm2', text: 'Listen', emoji: '👂', category: 'Communication', priority: 3 },
    { id: 'comm3', text: 'Write', emoji: '✍️', category: 'Communication', priority: 3 },
    { id: 'comm4', text: 'Read', emoji: '📖', category: 'Communication', priority: 3 },
    { id: 'comm5', text: 'Ask', emoji: '❓', category: 'Communication', priority: 3 },
    { id: 'comm6', text: 'Tell', emoji: '🗣️', category: 'Communication', priority: 3 },

    // Safety
    { id: 'safety1', text: 'Help', emoji: '🆘', category: 'Safety', priority: 1 },
    { id: 'safety2', text: 'Emergency', emoji: '🚨', category: 'Safety', priority: 1 },
    { id: 'safety3', text: 'Safe', emoji: '🛡️', category: 'Safety', priority: 2 },
    { id: 'safety4', text: 'Careful', emoji: '⚠️', category: 'Safety', priority: 2 },
    { id: 'safety5', text: 'Danger', emoji: '⚡', category: 'Safety', priority: 1 },
    { id: 'safety6', text: 'Police', emoji: '👮', category: 'Safety', priority: 2 },

    // Holidays
    { id: 'holidays1', text: 'Birthday', emoji: '🎂', category: 'Holidays', priority: 5 },
    { id: 'holidays2', text: 'Christmas', emoji: '🎄', category: 'Holidays', priority: 5 },
    { id: 'holidays3', text: 'Halloween', emoji: '🎃', category: 'Holidays', priority: 5 },
    { id: 'holidays4', text: 'Easter', emoji: '🐰', category: 'Holidays', priority: 5 },
    { id: 'holidays5', text: 'Party', emoji: '🎉', category: 'Holidays', priority: 5 },
    { id: 'holidays6', text: 'Gift', emoji: '🎁', category: 'Holidays', priority: 5 },

    // Work
    { id: 'work1', text: 'Job', emoji: '💼', category: 'Work', priority: 5 },
    { id: 'work2', text: 'Office', emoji: '🏢', category: 'Work', priority: 5 },
    { id: 'work3', text: 'Meeting', emoji: '👥', category: 'Work', priority: 5 },
    { id: 'work4', text: 'Computer', emoji: '💻', category: 'Work', priority: 5 },
    { id: 'work5', text: 'Email', emoji: '📧', category: 'Work', priority: 5 },
    { id: 'work6', text: 'Boss', emoji: '👔', category: 'Work', priority: 5 },

    // Games
    { id: 'games1', text: 'Cards', emoji: '🃏', category: 'Games', priority: 5 },
    { id: 'games2', text: 'Chess', emoji: '♟️', category: 'Games', priority: 5 },
    { id: 'games3', text: 'Video game', emoji: '🎮', category: 'Games', priority: 5 },
    { id: 'games4', text: 'Board game', emoji: '🎲', category: 'Games', priority: 5 },
    { id: 'games5', text: 'Hide and seek', emoji: '🙈', category: 'Games', priority: 5 },
    { id: 'games6', text: 'Tag', emoji: '🏃‍♂️', category: 'Games', priority: 5 },
  ];
};

export const getAllCategories = (): string[] => {
  return [
    'Most Used',
    'Core',
    'Basic Needs',
    'Food & Drinks',
    'Emotions',
    'Actions',
    'People',
    'Places',
    'Animals',
    'Colors',
    'Numbers',
    'Time',
    'Weather',
    'Transportation',
    'Activities',
    'Sports',
    'Technology',
    'Health',
    'School',
    'Clothing',
    'Music',
    'Nature',
    'Toys',
    'Furniture',
    'Communication',
    'Safety',
    'Holidays',
    'Work',
    'Games'
  ];
};

export const getCategoryEmoji = (category: string): string => {
  const emojiMap: Record<string, string> = {
    'Most Used': '⭐',
    'Core': '💫',
    'Basic Needs': '🍽️',
    'Food & Drinks': '🍎',
    'Emotions': '😊',
    'Actions': '🏃',
    'People': '👥',
    'Places': '🏠',
    'Animals': '🐕',
    'Colors': '🌈',
    'Numbers': '🔢',
    'Time': '⏰',
    'Weather': '☀️',
    'Transportation': '🚗',
    'Activities': '🎯',
    'Sports': '⚽',
    'Technology': '💻',
    'Health': '🏥',
    'School': '📚',
    'Clothing': '👕',
    'Music': '🎵',
    'Nature': '🌳',
    'Toys': '🧸',
    'Furniture': '🪑',
    'Communication': '💬',
    'Safety': '🛡️',
    'Holidays': '🎉',
    'Work': '💼',
    'Games': '🎮'
  };
  return emojiMap[category] || '📁';
};