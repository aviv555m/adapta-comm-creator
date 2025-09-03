export interface Translations {
  // UI Elements
  settings: string;
  aiAdapt: string;
  ready: string;
  eyeTrack: string;
  eyeOff: string;
  calibrating: string;
  newSetup: string;
  profile: string;
  all: string;
  name: string;
  communicationStyle: string;
  interests: string;
  currentlySelected: string;
  category: string;
  generatedFromQuiz: string;
  tilesAvailable: string;
  backToCategories: string;
  welcomeMessage: string;
  speakingNow: string;
  eyeTrackingStopped: string;
  eyeTrackingReady: string;
  calibrationCompleted: string;
  noTileSelected: string;
  tapTileFirst: string;
  returningToCategories: string;
  echoesBoard: string;
  echoesBoard2: string;
  layout: string;
  
  // Board Data
  boardData: {
    // Core
    'I need help': string;
    'Please help me': string;
    'Thank you': string;
    'Yes': string;
    'No': string;
    'Please stop': string;
    'More': string;
    'Finished': string;
    
    // Basic Needs
    'I am hungry': string;
    'I am thirsty': string;
    'I need the bathroom': string;
    'I am tired': string;
    'I am hot': string;
    'I am cold': string;
    'I need medicine': string;
    'I want to sleep': string;
    
    // Food & Drinks
    'Water': string;
    'Bread': string;
    'Apple': string;
    'Milk': string;
    'Coffee': string;
    'Sandwich': string;
    'Pizza': string;
    'Ice cream': string;
    
    // Emotions
    'I am happy': string;
    'I am sad': string;
    'I am angry': string;
    'I am scared': string;
    'I am excited': string;
    'I am confused': string;
    'I am proud': string;
    'I am worried': string;
    
    // Actions
    'I want to go': string;
    'I want to stay': string;
    'I want to play': string;
    'I want to rest': string;
    'I want to read': string;
    'I want to watch': string;
    'I want to listen': string;
    'I want to draw': string;
    
    // People
    'Mom': string;
    'Dad': string;
    'Teacher': string;
    'Friend': string;
    'Doctor': string;
    'Family': string;
    
    // Places
    'Home': string;
    'School': string;
    'Park': string;
    'Store': string;
    'Hospital': string;
    'Library': string;
    
    // Animals
    'Dog': string;
    'Cat': string;
    'Bird': string;
    'Fish': string;
    'Horse': string;
    'Rabbit': string;
    
    // Colors
    'Red': string;
    'Blue': string;
    'Green': string;
    'Yellow': string;
    'Purple': string;
    'Orange': string;
    
    // Numbers
    'One': string;
    'Two': string;
    'Three': string;
    'Four': string;
    'Five': string;
    'Ten': string;
    
    // Time
    'Now': string;
    'Later': string;
    'Today': string;
    'Tomorrow': string;
    'Morning': string;
    'Night': string;
    
    // Weather
    'Sunny': string;
    'Rainy': string;
    'Cloudy': string;
    'Snowy': string;
    'Windy': string;
    'Hot': string;
    
    // Transportation
    'Car': string;
    'Bus': string;
    'Train': string;
    'Bike': string;
    'Walk': string;
    'Airplane': string;
  };
  
  // Categories
  categoryNames: {
    'Most Used': string;
    'Core': string;
    'Basic Needs': string;
    'Food & Drinks': string;
    'Emotions': string;
    'Actions': string;
    'People': string;
    'Places': string;
    'Animals': string;
    'Colors': string;
    'Numbers': string;
    'Time': string;
    'Weather': string;
    'Transportation': string;
    'Activities': string;
    'Sports': string;
    'Technology': string;
    'Health': string;
    'School': string;
    'Clothing': string;
    'Music': string;
    'Nature': string;
    'Toys': string;
    'Furniture': string;
    'Communication': string;
    'Safety': string;
    'Holidays': string;
    'Work': string;
    'Games': string;
  };
}

export const translations = {
  en: {
    settings: 'Settings',
    aiAdapt: 'AI Adapt',
    ready: 'Ready',
    eyeTrack: 'Eye Track',
    eyeOff: 'Eye Off',
    calibrating: 'Calibrating...',
    newSetup: 'New Setup',
    profile: 'Profile',
    all: 'All',
    name: 'Name',
    communicationStyle: 'Communication Style',
    interests: 'Interests',
    currentlySelected: 'Currently Selected:',
    category: 'Category:',
    generatedFromQuiz: 'Generated from your quiz responses',
    tilesAvailable: 'tiles available',
    backToCategories: 'Back to Categories',
    welcomeMessage: 'Welcome! Please answer the questions to set up your communication board',
    speakingNow: 'Speaking now',
    eyeTrackingStopped: 'Eye tracking stopped',
    eyeTrackingReady: 'Eye tracking ready!',
    calibrationCompleted: 'Calibration completed successfully. The red dot shows where you\'re looking.',
    noTileSelected: 'No tile selected',
    tapTileFirst: 'Tap a tile first, then press Ready.',
    returningToCategories: 'Returning to main categories',
    echoesBoard: 'Echoes Board',
    layout: 'Layout',
    
    boardData: {
      'I need help': 'I need help',
      'Please help me': 'Please help me',
      'Thank you': 'Thank you',
      'Yes': 'Yes',
      'No': 'No',
      'Please stop': 'Please stop',
      'More': 'More',
      'Finished': 'Finished',
      'I am hungry': 'I am hungry',
      'I am thirsty': 'I am thirsty',
      'I need the bathroom': 'I need the bathroom',
      'I am tired': 'I am tired',
      'I am hot': 'I am hot',
      'I am cold': 'I am cold',
      'I need medicine': 'I need medicine',
      'I want to sleep': 'I want to sleep',
      'Water': 'Water',
      'Bread': 'Bread',
      'Apple': 'Apple',
      'Milk': 'Milk',
      'Coffee': 'Coffee',
      'Sandwich': 'Sandwich',
      'Pizza': 'Pizza',
      'Ice cream': 'Ice cream',
      'I am happy': 'I am happy',
      'I am sad': 'I am sad',
      'I am angry': 'I am angry',
      'I am scared': 'I am scared',
      'I am excited': 'I am excited',
      'I am confused': 'I am confused',
      'I am proud': 'I am proud',
      'I am worried': 'I am worried',
      'I want to go': 'I want to go',
      'I want to stay': 'I want to stay',
      'I want to play': 'I want to play',
      'I want to rest': 'I want to rest',
      'I want to read': 'I want to read',
      'I want to watch': 'I want to watch',
      'I want to listen': 'I want to listen',
      'I want to draw': 'I want to draw',
      'Mom': 'Mom',
      'Dad': 'Dad',
      'Teacher': 'Teacher',
      'Friend': 'Friend',
      'Doctor': 'Doctor',
      'Family': 'Family',
      'Home': 'Home',
      'School': 'School',
      'Park': 'Park',
      'Store': 'Store',
      'Hospital': 'Hospital',
      'Library': 'Library',
      'Dog': 'Dog',
      'Cat': 'Cat',
      'Bird': 'Bird',
      'Fish': 'Fish',
      'Horse': 'Horse',
      'Rabbit': 'Rabbit',
      'Red': 'Red',
      'Blue': 'Blue',
      'Green': 'Green',
      'Yellow': 'Yellow',
      'Purple': 'Purple',
      'Orange': 'Orange',
      'One': 'One',
      'Two': 'Two',
      'Three': 'Three',
      'Four': 'Four',
      'Five': 'Five',
      'Ten': 'Ten',
      'Now': 'Now',
      'Later': 'Later',
      'Today': 'Today',
      'Tomorrow': 'Tomorrow',
      'Morning': 'Morning',
      'Night': 'Night',
      'Sunny': 'Sunny',
      'Rainy': 'Rainy',
      'Cloudy': 'Cloudy',
      'Snowy': 'Snowy',
      'Windy': 'Windy',
      'Hot': 'Hot',
      'Car': 'Car',
      'Bus': 'Bus',
      'Train': 'Train',
      'Bike': 'Bike',
      'Walk': 'Walk',
      'Airplane': 'Airplane',
    },
    
    categoryNames: {
      'Most Used': 'Most Used',
      'Core': 'Core',
      'Basic Needs': 'Basic Needs',
      'Food & Drinks': 'Food & Drinks',
      'Emotions': 'Emotions',
      'Actions': 'Actions',
      'People': 'People',
      'Places': 'Places',
      'Animals': 'Animals',
      'Colors': 'Colors',
      'Numbers': 'Numbers',
      'Time': 'Time',
      'Weather': 'Weather',
      'Transportation': 'Transportation',
      'Activities': 'Activities',
      'Sports': 'Sports',
      'Technology': 'Technology',
      'Health': 'Health',
      'School': 'School',
      'Clothing': 'Clothing',
      'Music': 'Music',
      'Nature': 'Nature',
      'Toys': 'Toys',
      'Furniture': 'Furniture',
      'Communication': 'Communication',
      'Safety': 'Safety',
      'Holidays': 'Holidays',
      'Work': 'Work',
      'Games': 'Games',
    }
  } as Translations,
  
  he: {
    settings: 'הגדרות',
    aiAdapt: 'התאמת AI',
    ready: 'מוכן',
    eyeTrack: 'מעקב עיניים',
    eyeOff: 'כיבוי עיניים',
    calibrating: 'מכויל...',
    newSetup: 'הגדרה חדשה',
    profile: 'פרופיל',
    all: 'הכל',
    name: 'שם',
    communicationStyle: 'סגנון תקשורת',
    interests: 'תחומי עניין',
    currentlySelected: 'נבחר כרגע:',
    category: 'קטגוריה:',
    generatedFromQuiz: 'נוצר מתשובות השאלון שלך',
    tilesAvailable: 'אריחים זמינים',
    backToCategories: 'חזור לקטגוריות',
    welcomeMessage: 'ברוכים הבאים! אנא ענו על השאלות כדי להגדיר את לוח התקשורת שלכם',
    speakingNow: 'מדבר עכשיו',
    eyeTrackingStopped: 'מעקב עיניים הופסק',
    eyeTrackingReady: 'מעקב עיניים מוכן!',
    calibrationCompleted: 'הכיול הושלם בהצלחה. הנקודה האדומה מראה לאן אתם מסתכלים.',
    noTileSelected: 'לא נבחרה משבצת',
    tapTileFirst: 'הקש על משבצת קודם, ואז לחץ מוכן.',
    returningToCategories: 'חוזר לקטגוריות הראשיות',
    echoesBoard: 'לוח הדים',
    layout: 'פריסה',
    
    boardData: {
      'I need help': 'אני צריך עזרה',
      'Please help me': 'בבקשה עזרו לי',
      'Thank you': 'תודה',
      'Yes': 'כן',
      'No': 'לא',
      'Please stop': 'בבקשה תפסיקו',
      'More': 'עוד',
      'Finished': 'סיימתי',
      'I am hungry': 'אני רעב',
      'I am thirsty': 'אני צמא',
      'I need the bathroom': 'אני צריך שירותים',
      'I am tired': 'אני עייף',
      'I am hot': 'חם לי',
      'I am cold': 'קר לי',
      'I need medicine': 'אני צריך תרופה',
      'I want to sleep': 'אני רוצה לישון',
      'Water': 'מים',
      'Bread': 'לחם',
      'Apple': 'תפוח',
      'Milk': 'חלב',
      'Coffee': 'קפה',
      'Sandwich': 'כריך',
      'Pizza': 'פיצה',
      'Ice cream': 'גלידה',
      'I am happy': 'אני שמח',
      'I am sad': 'אני עצוב',
      'I am angry': 'אני כועס',
      'I am scared': 'אני מפחד',
      'I am excited': 'אני נרגש',
      'I am confused': 'אני מבולבל',
      'I am proud': 'אני גאה',
      'I am worried': 'אני דואג',
      'I want to go': 'אני רוצה ללכת',
      'I want to stay': 'אני רוצה להישאר',
      'I want to play': 'אני רוצה לשחק',
      'I want to rest': 'אני רוצה לנוח',
      'I want to read': 'אני רוצה לקרוא',
      'I want to watch': 'אני רוצה לראות',
      'I want to listen': 'אני רוצה להקשיב',
      'I want to draw': 'אני רוצה לצייר',
      'Mom': 'אמא',
      'Dad': 'אבא',
      'Teacher': 'מורה',
      'Friend': 'חבר',
      'Doctor': 'רופא',
      'Family': 'משפחה',
      'Home': 'בית',
      'School': 'בית ספר',
      'Park': 'פארק',
      'Store': 'חנות',
      'Hospital': 'בית חולים',
      'Library': 'ספרייה',
      'Dog': 'כלב',
      'Cat': 'חתול',
      'Bird': 'ציפור',
      'Fish': 'דג',
      'Horse': 'סוס',
      'Rabbit': 'ארנב',
      'Red': 'אדום',
      'Blue': 'כחול',
      'Green': 'ירוק',
      'Yellow': 'צהוב',
      'Purple': 'סגול',
      'Orange': 'כתום',
      'One': 'אחד',
      'Two': 'שניים',
      'Three': 'שלושה',
      'Four': 'ארבעה',
      'Five': 'חמישה',
      'Ten': 'עשרה',
      'Now': 'עכשיו',
      'Later': 'מאוחר יותר',
      'Today': 'היום',
      'Tomorrow': 'מחר',
      'Morning': 'בוקר',
      'Night': 'לילה',
      'Sunny': 'שמשי',
      'Rainy': 'גשום',
      'Cloudy': 'מעונן',
      'Snowy': 'שלג',
      'Windy': 'רוח',
      'Hot': 'חם',
      'Car': 'מכונית',
      'Bus': 'אוטובוס',
      'Train': 'רכבת',
      'Bike': 'אופניים',
      'Walk': 'הליכה',
      'Airplane': 'מטוס',
    },
    
    categoryNames: {
      'Most Used': 'הכי נפוצים',
      'Core': 'יסוד',
      'Basic Needs': 'צרכים בסיסיים',
      'Food & Drinks': 'אוכל ושתייה',
      'Emotions': 'רגשות',
      'Actions': 'פעולות',
      'People': 'אנשים',
      'Places': 'מקומות',
      'Animals': 'חיות',
      'Colors': 'צבעים',
      'Numbers': 'מספרים',
      'Time': 'זמן',
      'Weather': 'מזג אוויר',
      'Transportation': 'תחבורה',
      'Activities': 'פעילויות',
      'Sports': 'ספורט',
      'Technology': 'טכנולוגיה',
      'Health': 'בריאות',
      'School': 'בית ספר',
      'Clothing': 'בגדים',
      'Music': 'מוזיקה',
      'Nature': 'טבע',
      'Toys': 'צעצועים',
      'Furniture': 'רהיטים',
      'Communication': 'תקשורת',
      'Safety': 'בטיחות',
      'Holidays': 'חגים',
      'Work': 'עבודה',
      'Games': 'משחקים',
    }
  } as Translations,
};

export type Language = 'en' | 'he';

export const getTranslation = (lang: Language, key: string, subKey?: string): string => {
  const t = translations[lang];
  if (subKey) {
    return (t as any)[key]?.[subKey] || translations.en[key]?.[subKey] || subKey;
  }
  return (t as any)[key] || translations.en[key] || key;
};