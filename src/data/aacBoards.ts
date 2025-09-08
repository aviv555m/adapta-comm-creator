import { BoardConfig } from '@/types/board';
import { QuizQuestion } from '@/hooks/useQuiz';

export interface AACItem {
  id: string;
  text: string;
  emoji: string;
  category?: string;
  subcategory?: string;
  priority?: number;
  children?: AACItem[];
}

export interface AACBoard {
  id: string;
  name: string;
  description: string;
  config: BoardConfig;
  structure: AACItem[];
}

// AAC Board with 3-level navigation and unique emojis
export const AAC_BOARDS: AACBoard[] = [
  {
    id: 'basic_simple',
    name: '🌟 Basic & Simple',
    description: 'Perfect for beginners - essential words with big buttons',
    config: {
      tiles: [],
      categories: ['Basic Needs', 'Feelings', 'Actions', 'People', 'Food', 'Activities', 'Places', 'Things', 'Communication'],
      layout: 'grid-3x3'
    },
    structure: [
      {
        id: 'basic_needs',
        text: 'Basic Needs',
        emoji: '🆘',
        children: [
          {
            id: 'requests',
            text: 'Requests',
            emoji: '🙋',
            children: [
              { id: 'want', text: 'Want', emoji: '👆' },
              { id: 'need', text: 'Need', emoji: '🎯' },
              { id: 'help', text: 'Help', emoji: '🤝' },
              { id: 'more', text: 'More', emoji: '➕' },
              { id: 'stop', text: 'Stop', emoji: '🛑' },
              { id: 'finished', text: 'Finished', emoji: '✅' },
              { id: 'please', text: 'Please', emoji: '🙏' },
              { id: 'thank_you', text: 'Thank You', emoji: '💝' },
              { id: 'sorry', text: 'Sorry', emoji: '🙇' }
            ]
          },
          {
            id: 'yes_no',
            text: 'Yes/No',
            emoji: '❓',
            children: [
              { id: 'yes', text: 'Yes', emoji: '✔️' },
              { id: 'no', text: 'No', emoji: '❌' },
              { id: 'maybe', text: 'Maybe', emoji: '🤷' },
              { id: 'okay', text: 'Okay', emoji: '👌' },
              { id: 'good', text: 'Good', emoji: '👍' },
              { id: 'bad', text: 'Bad', emoji: '👎' },
              { id: 'like', text: 'Like', emoji: '💚' },
              { id: 'dont_like', text: "Don't Like", emoji: '💔' },
              { id: 'understand', text: 'Understand', emoji: '💡' }
            ]
          },
          {
            id: 'urgent',
            text: 'Urgent',
            emoji: '🚨',
            children: [
              { id: 'bathroom', text: 'Bathroom', emoji: '🚽' },
              { id: 'hungry', text: 'Hungry', emoji: '🍽️' },
              { id: 'thirsty', text: 'Thirsty', emoji: '🥤' },
              { id: 'tired', text: 'Tired', emoji: '😴' },
              { id: 'hurt', text: 'Hurt', emoji: '🤕' },
              { id: 'sick', text: 'Sick', emoji: '🤒' },
              { id: 'hot', text: 'Hot', emoji: '🥵' },
              { id: 'cold', text: 'Cold', emoji: '🥶' },
              { id: 'scared', text: 'Scared', emoji: '😨' }
            ]
          },
          {
            id: 'time',
            text: 'Time',
            emoji: '⏰',
            children: [
              { id: 'now', text: 'Now', emoji: '⚡' },
              { id: 'later', text: 'Later', emoji: '⏳' },
              { id: 'today', text: 'Today', emoji: '📅' },
              { id: 'tomorrow', text: 'Tomorrow', emoji: '📆' },
              { id: 'yesterday', text: 'Yesterday', emoji: '📋' },
              { id: 'morning', text: 'Morning', emoji: '🌅' },
              { id: 'afternoon', text: 'Afternoon', emoji: '☀️' },
              { id: 'evening', text: 'Evening', emoji: '🌆' },
              { id: 'night', text: 'Night', emoji: '🌙' }
            ]
          },
          {
            id: 'quantities',
            text: 'Quantities',
            emoji: '🔢',
            children: [
              { id: 'one', text: 'One', emoji: '1️⃣' },
              { id: 'two', text: 'Two', emoji: '2️⃣' },
              { id: 'three', text: 'Three', emoji: '3️⃣' },
              { id: 'many', text: 'Many', emoji: '📊' },
              { id: 'few', text: 'Few', emoji: '🤏' },
              { id: 'all', text: 'All', emoji: '💯' },
              { id: 'none', text: 'None', emoji: '⭕' },
              { id: 'half', text: 'Half', emoji: '➗' },
              { id: 'full', text: 'Full', emoji: '🔥' }
            ]
          },
          {
            id: 'locations',
            text: 'Locations',
            emoji: '📍',
            children: [
              { id: 'here', text: 'Here', emoji: '📌' },
              { id: 'there', text: 'There', emoji: '👉' },
              { id: 'up', text: 'Up', emoji: '⬆️' },
              { id: 'down', text: 'Down', emoji: '⬇️' },
              { id: 'left', text: 'Left', emoji: '⬅️' },
              { id: 'right', text: 'Right', emoji: '➡️' },
              { id: 'inside', text: 'Inside', emoji: '🔘' },
              { id: 'outside', text: 'Outside', emoji: '🔲' },
              { id: 'near', text: 'Near', emoji: '🔗' }
            ]
          },
          {
            id: 'sizes',
            text: 'Sizes',
            emoji: '📏',
            children: [
              { id: 'big', text: 'Big', emoji: '🐘' },
              { id: 'small', text: 'Small', emoji: '🐁' },
              { id: 'huge', text: 'Huge', emoji: '🦕' },
              { id: 'tiny', text: 'Tiny', emoji: '🐜' },
              { id: 'tall', text: 'Tall', emoji: '🗼' },
              { id: 'short', text: 'Short', emoji: '🦔' },
              { id: 'wide', text: 'Wide', emoji: '🌊' },
              { id: 'narrow', text: 'Narrow', emoji: '🧵' },
              { id: 'thick', text: 'Thick', emoji: '📚' }
            ]
          },
          {
            id: 'colors',
            text: 'Colors',
            emoji: '🎨',
            children: [
              { id: 'red', text: 'Red', emoji: '🔴' },
              { id: 'blue', text: 'Blue', emoji: '🔵' },
              { id: 'green', text: 'Green', emoji: '🟢' },
              { id: 'yellow', text: 'Yellow', emoji: '🟡' },
              { id: 'orange', text: 'Orange', emoji: '🟠' },
              { id: 'purple', text: 'Purple', emoji: '🟣' },
              { id: 'pink', text: 'Pink', emoji: '🩷' },
              { id: 'black', text: 'Black', emoji: '⚫' },
              { id: 'white', text: 'White', emoji: '⚪' }
            ]
          },
          {
            id: 'weather',
            text: 'Weather',
            emoji: '🌤️',
            children: [
              { id: 'sunny', text: 'Sunny', emoji: '☀️' },
              { id: 'rainy', text: 'Rainy', emoji: '🌧️' },
              { id: 'cloudy', text: 'Cloudy', emoji: '☁️' },
              { id: 'snowy', text: 'Snowy', emoji: '❄️' },
              { id: 'windy', text: 'Windy', emoji: '💨' },
              { id: 'stormy', text: 'Stormy', emoji: '⛈️' },
              { id: 'foggy', text: 'Foggy', emoji: '🌫️' },
              { id: 'warm', text: 'Warm', emoji: '🌡️' },
              { id: 'cool', text: 'Cool', emoji: '🧊' }
            ]
          }
        ]
      },
      {
        id: 'feelings',
        text: 'Feelings',
        emoji: '😊',
        children: [
          {
            id: 'happy_feelings',
            text: 'Happy Feelings',
            emoji: '😄',
            children: [
              { id: 'excited', text: 'Excited', emoji: '🤩' },
              { id: 'proud', text: 'Proud', emoji: '😌' },
              { id: 'calm', text: 'Calm', emoji: '😇' },
              { id: 'grateful', text: 'Grateful', emoji: '🙏' },
              { id: 'loved', text: 'Loved', emoji: '🥰' },
              { id: 'confident', text: 'Confident', emoji: '💪' },
              { id: 'hopeful', text: 'Hopeful', emoji: '🌟' },
              { id: 'relaxed', text: 'Relaxed', emoji: '😎' },
              { id: 'amazed', text: 'Amazed', emoji: '🤯' }
            ]
          },
          {
            id: 'sad_feelings',
            text: 'Sad Feelings',
            emoji: '😢',
            children: [
              { id: 'disappointed', text: 'Disappointed', emoji: '😞' },
              { id: 'lonely', text: 'Lonely', emoji: '😔' },
              { id: 'worried', text: 'Worried', emoji: '😰' },
              { id: 'frustrated', text: 'Frustrated', emoji: '😤' },
              { id: 'confused', text: 'Confused', emoji: '😕' },
              { id: 'embarrassed', text: 'Embarrassed', emoji: '😳' },
              { id: 'jealous', text: 'Jealous', emoji: '😒' },
              { id: 'overwhelmed', text: 'Overwhelmed', emoji: '🫨' },
              { id: 'bored', text: 'Bored', emoji: '😑' }
            ]
          },
          {
            id: 'strong_feelings',
            text: 'Strong Feelings',
            emoji: '😡',
            children: [
              { id: 'angry', text: 'Angry', emoji: '🔥' },
              { id: 'surprised', text: 'Surprised', emoji: '😲' },
              { id: 'shocked', text: 'Shocked', emoji: '😱' },
              { id: 'nervous', text: 'Nervous', emoji: '😬' },
              { id: 'curious', text: 'Curious', emoji: '🧐' },
              { id: 'determined', text: 'Determined', emoji: '💯' },
              { id: 'disgusted', text: 'Disgusted', emoji: '🤢' },
              { id: 'silly', text: 'Silly', emoji: '🤪' },
              { id: 'sleepy', text: 'Sleepy', emoji: '🥱' }
            ]
          }
        ]
      },
      {
        id: 'actions',
        text: 'Actions',
        emoji: '🏃',
        children: [
          {
            id: 'daily_actions',
            text: 'Daily Actions',
            emoji: '🌅',
            children: [
              { id: 'eat', text: 'Eat', emoji: '🍴' },
              { id: 'drink', text: 'Drink', emoji: '🧊' },
              { id: 'sleep', text: 'Sleep', emoji: '💤' },
              { id: 'wake_up', text: 'Wake Up', emoji: '⏰' },
              { id: 'wash', text: 'Wash', emoji: '🧼' },
              { id: 'brush_teeth', text: 'Brush Teeth', emoji: '🦷' },
              { id: 'shower', text: 'Shower', emoji: '🚿' },
              { id: 'get_dressed', text: 'Get Dressed', emoji: '👕' },
              { id: 'comb_hair', text: 'Comb Hair', emoji: '🪮' }
            ]
          },
          {
            id: 'movement',
            text: 'Movement',
            emoji: '🚶',
            children: [
              { id: 'walk', text: 'Walk', emoji: '👣' },
              { id: 'run', text: 'Run', emoji: '🏃‍♂️' },
              { id: 'jump', text: 'Jump', emoji: '🦘' },
              { id: 'sit', text: 'Sit', emoji: '🪑' },
              { id: 'stand', text: 'Stand', emoji: '🧍' },
              { id: 'dance', text: 'Dance', emoji: '💃' },
              { id: 'climb', text: 'Climb', emoji: '🧗' },
              { id: 'swim', text: 'Swim', emoji: '🏊' },
              { id: 'ride', text: 'Ride', emoji: '🚴' }
            ]
          },
          {
            id: 'communication_actions',
            text: 'Communication',
            emoji: '💬',
            children: [
              { id: 'talk', text: 'Talk', emoji: '🗣️' },
              { id: 'listen', text: 'Listen', emoji: '👂' },
              { id: 'look', text: 'Look', emoji: '👀' },
              { id: 'point', text: 'Point', emoji: '👉' },
              { id: 'show', text: 'Show', emoji: '🫴' },
              { id: 'call', text: 'Call', emoji: '📞' },
              { id: 'wave', text: 'Wave', emoji: '👋' },
              { id: 'nod', text: 'Nod', emoji: '✌️' },
              { id: 'smile', text: 'Smile', emoji: '🙂' }
            ]
          }
        ]
      },
      {
        id: 'people',
        text: 'People',
        emoji: '👨‍👩‍👧‍👦',
        children: [
          {
            id: 'family',
            text: 'Family',
            emoji: '🏠',
            children: [
              { id: 'mom', text: 'Mom', emoji: '👩' },
              { id: 'dad', text: 'Dad', emoji: '👨' },
              { id: 'sister', text: 'Sister', emoji: '👧' },
              { id: 'brother', text: 'Brother', emoji: '👦' },
              { id: 'grandma', text: 'Grandma', emoji: '👵' },
              { id: 'grandpa', text: 'Grandpa', emoji: '👴' },
              { id: 'baby', text: 'Baby', emoji: '👶' },
              { id: 'aunt', text: 'Aunt', emoji: '👩‍🦳' },
              { id: 'uncle', text: 'Uncle', emoji: '👨‍🦲' }
            ]
          },
          {
            id: 'school_people',
            text: 'School People',
            emoji: '🏫',
            children: [
              { id: 'teacher', text: 'Teacher', emoji: '👩‍🏫' },
              { id: 'principal', text: 'Principal', emoji: '👨‍💼' },
              { id: 'classmate', text: 'Classmate', emoji: '👥' },
              { id: 'friend', text: 'Friend', emoji: '👫' },
              { id: 'nurse', text: 'Nurse', emoji: '👩‍⚕️' },
              { id: 'librarian', text: 'Librarian', emoji: '📚' },
              { id: 'coach', text: 'Coach', emoji: '👨‍⚽' },
              { id: 'counselor', text: 'Counselor', emoji: '🧠' },
              { id: 'substitute', text: 'Substitute', emoji: '🔄' }
            ]
          },
          {
            id: 'community',
            text: 'Community',
            emoji: '🏘️',
            children: [
              { id: 'doctor', text: 'Doctor', emoji: '👨‍⚕️' },
              { id: 'dentist', text: 'Dentist', emoji: '🦷' },
              { id: 'police', text: 'Police', emoji: '👮' },
              { id: 'firefighter', text: 'Firefighter', emoji: '👨‍🚒' },
              { id: 'cashier', text: 'Cashier', emoji: '💰' },
              { id: 'driver', text: 'Driver', emoji: '🚗' },
              { id: 'neighbor', text: 'Neighbor', emoji: '🏡' },
              { id: 'mailman', text: 'Mailman', emoji: '📮' },
              { id: 'stranger', text: 'Stranger', emoji: '🚷' }
            ]
          }
        ]
      },
      {
        id: 'food',
        text: 'Food',
        emoji: '🍎',
        children: [
          {
            id: 'fruits',
            text: 'Fruits',
            emoji: '🍇',
            children: [
              { id: 'banana', text: 'Banana', emoji: '🍌' },
              { id: 'orange', text: 'Orange', emoji: '🍊' },
              { id: 'strawberry', text: 'Strawberry', emoji: '🍓' },
              { id: 'grapes', text: 'Grapes', emoji: '🫐' },
              { id: 'watermelon', text: 'Watermelon', emoji: '🍉' },
              { id: 'pineapple', text: 'Pineapple', emoji: '🍍' },
              { id: 'peach', text: 'Peach', emoji: '🍑' },
              { id: 'cherry', text: 'Cherry', emoji: '🍒' },
              { id: 'kiwi', text: 'Kiwi', emoji: '🥝' }
            ]
          },
          {
            id: 'meals',
            text: 'Meals',
            emoji: '🍽️',
            children: [
              { id: 'breakfast', text: 'Breakfast', emoji: '🥞' },
              { id: 'lunch', text: 'Lunch', emoji: '🥪' },
              { id: 'dinner', text: 'Dinner', emoji: '🍖' },
              { id: 'snack', text: 'Snack', emoji: '🥨' },
              { id: 'pizza', text: 'Pizza', emoji: '🍕' },
              { id: 'sandwich', text: 'Sandwich', emoji: '🥙' },
              { id: 'soup', text: 'Soup', emoji: '🍲' },
              { id: 'salad', text: 'Salad', emoji: '🥗' },
              { id: 'pasta', text: 'Pasta', emoji: '🍝' }
            ]
          },
          {
            id: 'drinks',
            text: 'Drinks',
            emoji: '🥛',
            children: [
              { id: 'water', text: 'Water', emoji: '💧' },
              { id: 'milk', text: 'Milk', emoji: '🍼' },
              { id: 'juice', text: 'Juice', emoji: '🧃' },
              { id: 'soda', text: 'Soda', emoji: '🥤' },
              { id: 'coffee', text: 'Coffee', emoji: '☕' },
              { id: 'tea', text: 'Tea', emoji: '🍵' },
              { id: 'smoothie', text: 'Smoothie', emoji: '🥤' },
              { id: 'chocolate_milk', text: 'Chocolate Milk', emoji: '🍫' },
              { id: 'hot_chocolate', text: 'Hot Chocolate', emoji: '☕' }
            ]
          }
        ]
      },
      {
        id: 'activities',
        text: 'Activities',
        emoji: '🎮',
        children: [
          {
            id: 'play_activities',
            text: 'Play',
            emoji: '🛝',
            children: [
              { id: 'video_games', text: 'Video Games', emoji: '🕹️' },
              { id: 'board_games', text: 'Board Games', emoji: '🎲' },
              { id: 'puzzles', text: 'Puzzles', emoji: '🧩' },
              { id: 'blocks', text: 'Blocks', emoji: '🧱' },
              { id: 'dolls', text: 'Dolls', emoji: '🪆' },
              { id: 'cars', text: 'Cars', emoji: '🚗' },
              { id: 'coloring', text: 'Coloring', emoji: '🖍️' },
              { id: 'drawing', text: 'Drawing', emoji: '✏️' },
              { id: 'crafts', text: 'Crafts', emoji: '✂️' }
            ]
          },
          {
            id: 'outdoor',
            text: 'Outdoor',
            emoji: '🌳',
            children: [
              { id: 'playground', text: 'Playground', emoji: '🏞️' },
              { id: 'park', text: 'Park', emoji: '🌿' },
              { id: 'bike_riding', text: 'Bike Riding', emoji: '🚲' },
              { id: 'sports', text: 'Sports', emoji: '⚽' },
              { id: 'hiking', text: 'Hiking', emoji: '🥾' },
              { id: 'picnic', text: 'Picnic', emoji: '🧺' },
              { id: 'gardening', text: 'Gardening', emoji: '🌱' },
              { id: 'sandbox', text: 'Sandbox', emoji: '🏖️' },
              { id: 'swings', text: 'Swings', emoji: '🌀' }
            ]
          },
          {
            id: 'indoor',
            text: 'Indoor',
            emoji: '🏠',
            children: [
              { id: 'reading', text: 'Reading', emoji: '📖' },
              { id: 'watching_tv', text: 'Watching TV', emoji: '📺' },
              { id: 'music', text: 'Music', emoji: '🎵' },
              { id: 'singing', text: 'Singing', emoji: '🎤' },
              { id: 'cooking', text: 'Cooking', emoji: '👩‍🍳' },
              { id: 'cleaning', text: 'Cleaning', emoji: '🧽' },
              { id: 'computer', text: 'Computer', emoji: '💻' },
              { id: 'tablet', text: 'Tablet', emoji: '📱' },
              { id: 'phone', text: 'Phone', emoji: '📲' }
            ]
          }
        ]
      },
      {
        id: 'places',
        text: 'Places',
        emoji: '📍',
        children: [
          {
            id: 'home_places',
            text: 'Home',
            emoji: '🏡',
            children: [
              { id: 'bedroom', text: 'Bedroom', emoji: '🛏️' },
              { id: 'kitchen', text: 'Kitchen', emoji: '🍳' },
              { id: 'living_room', text: 'Living Room', emoji: '🛋️' },
              { id: 'bathroom', text: 'Bathroom', emoji: '🛁' },
              { id: 'garage', text: 'Garage', emoji: '🚪' },
              { id: 'yard', text: 'Yard', emoji: '🌾' },
              { id: 'basement', text: 'Basement', emoji: '⬇️' },
              { id: 'attic', text: 'Attic', emoji: '⬆️' },
              { id: 'porch', text: 'Porch', emoji: '🏠' }
            ]
          },
          {
            id: 'school_places',
            text: 'School',
            emoji: '🎒',
            children: [
              { id: 'classroom', text: 'Classroom', emoji: '📚' },
              { id: 'library', text: 'Library', emoji: '📖' },
              { id: 'cafeteria', text: 'Cafeteria', emoji: '🍽️' },
              { id: 'gym', text: 'Gym', emoji: '🏃‍♂️' },
              { id: 'office', text: 'Office', emoji: '💼' },
              { id: 'nurse_office', text: 'Nurse Office', emoji: '🩺' },
              { id: 'computer_lab', text: 'Computer Lab', emoji: '💻' },
              { id: 'art_room', text: 'Art Room', emoji: '🎨' },
              { id: 'music_room', text: 'Music Room', emoji: '🎼' }
            ]
          },
          {
            id: 'community_places',
            text: 'Community',
            emoji: '🏪',
            children: [
              { id: 'store', text: 'Store', emoji: '🛒' },
              { id: 'hospital', text: 'Hospital', emoji: '🏥' },
              { id: 'restaurant', text: 'Restaurant', emoji: '🍴' },
              { id: 'bank', text: 'Bank', emoji: '🏦' },
              { id: 'gas_station', text: 'Gas Station', emoji: '⛽' },
              { id: 'zoo', text: 'Zoo', emoji: '🦁' },
              { id: 'beach', text: 'Beach', emoji: '🏖️' },
              { id: 'mall', text: 'Mall', emoji: '🏬' },
              { id: 'airport', text: 'Airport', emoji: '✈️' }
            ]
          }
        ]
      },
      {
        id: 'things',
        text: 'Things',
        emoji: '📦',
        children: [
          {
            id: 'toys',
            text: 'Toys',
            emoji: '🧸',
            children: [
              { id: 'ball', text: 'Ball', emoji: '🏀' },
              { id: 'teddy_bear', text: 'Teddy Bear', emoji: '🐻' },
              { id: 'toy_car', text: 'Toy Car', emoji: '🚙' },
              { id: 'doll', text: 'Doll', emoji: '👗' },
              { id: 'lego', text: 'Lego', emoji: '🔨' },
              { id: 'robot', text: 'Robot', emoji: '🤖' },
              { id: 'train', text: 'Train', emoji: '🚂' },
              { id: 'airplane', text: 'Airplane', emoji: '🛩️' },
              { id: 'boat', text: 'Boat', emoji: '⛵' }
            ]
          },
          {
            id: 'school_supplies',
            text: 'School Supplies',
            emoji: '✏️',
            children: [
              { id: 'pencil', text: 'Pencil', emoji: '✂️' },
              { id: 'pen', text: 'Pen', emoji: '🖊️' },
              { id: 'paper', text: 'Paper', emoji: '📄' },
              { id: 'book', text: 'Book', emoji: '📗' },
              { id: 'backpack', text: 'Backpack', emoji: '🎒' },
              { id: 'ruler', text: 'Ruler', emoji: '📏' },
              { id: 'calculator', text: 'Calculator', emoji: '🧮' },
              { id: 'scissors', text: 'Scissors', emoji: '✄' },
              { id: 'glue', text: 'Glue', emoji: '🧴' }
            ]
          },
          {
            id: 'clothing',
            text: 'Clothing',
            emoji: '👕',
            children: [
              { id: 'shirt', text: 'Shirt', emoji: '👔' },
              { id: 'pants', text: 'Pants', emoji: '👖' },
              { id: 'dress', text: 'Dress', emoji: '👗' },
              { id: 'shoes', text: 'Shoes', emoji: '👟' },
              { id: 'socks', text: 'Socks', emoji: '🧦' },
              { id: 'hat', text: 'Hat', emoji: '👒' },
              { id: 'coat', text: 'Coat', emoji: '🧥' },
              { id: 'sweater', text: 'Sweater', emoji: '🧶' },
              { id: 'pajamas', text: 'Pajamas', emoji: '🩳' }
            ]
          }
        ]
      },
      {
        id: 'communication',
        text: 'Communication',
        emoji: '💭',
        children: [
          {
            id: 'greetings',
            text: 'Greetings',
            emoji: '👋',
            children: [
              { id: 'hello', text: 'Hello', emoji: '🙋‍♀️' },
              { id: 'goodbye', text: 'Goodbye', emoji: '👋🏻' },
              { id: 'good_morning', text: 'Good Morning', emoji: '🌅' },
              { id: 'good_night', text: 'Good Night', emoji: '🌙' },
              { id: 'see_you_later', text: 'See You Later', emoji: '💫' },
              { id: 'how_are_you', text: 'How Are You', emoji: '❓' },
              { id: 'nice_to_meet', text: 'Nice to Meet', emoji: '🤝' },
              { id: 'welcome', text: 'Welcome', emoji: '🎉' },
              { id: 'excuse_me', text: 'Excuse Me', emoji: '🙋‍♂️' }
            ]
          },
          {
            id: 'questions',
            text: 'Questions',
            emoji: '❔',
            children: [
              { id: 'what', text: 'What', emoji: '🤔' },
              { id: 'where', text: 'Where', emoji: '📍' },
              { id: 'when', text: 'When', emoji: '⏰' },
              { id: 'who', text: 'Who', emoji: '👤' },
              { id: 'why', text: 'Why', emoji: '🤷' },
              { id: 'how', text: 'How', emoji: '🔧' },
              { id: 'which', text: 'Which', emoji: '👆' },
              { id: 'can_you', text: 'Can You', emoji: '🙏' },
              { id: 'will_you', text: 'Will You', emoji: '⚡' }
            ]
          },
          {
            id: 'descriptions',
            text: 'Descriptions',
            emoji: '📝',
            children: [
              { id: 'big', text: 'Big', emoji: '🐘' },
              { id: 'small', text: 'Small', emoji: '🐁' },
              { id: 'fast', text: 'Fast', emoji: '💨' },
              { id: 'slow', text: 'Slow', emoji: '🐌' },
              { id: 'loud', text: 'Loud', emoji: '📢' },
              { id: 'quiet', text: 'Quiet', emoji: '🤫' },
              { id: 'heavy', text: 'Heavy', emoji: '🏋️' },
              { id: 'light', text: 'Light', emoji: '🪶' },
              { id: 'beautiful', text: 'Beautiful', emoji: '🌺' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'social_focused',
    name: '🤗 Social & Emotions',
    description: 'Express feelings and connect with others',
    config: {
      tiles: [],
      categories: ['Basic Needs', 'Feelings', 'Actions', 'People', 'Food', 'Activities', 'Places', 'Things', 'Communication'],
      layout: 'grid-3x3'
    },
    structure: []
  },
  {
    id: 'school_learning',
    name: '🎓 School & Learning',
    description: 'Perfect for classroom communication',
    config: {
      tiles: [],
      categories: ['Basic Needs', 'Feelings', 'Actions', 'People', 'Food', 'Activities', 'Places', 'Things', 'Communication'],
      layout: 'grid-3x3'
    },
    structure: []
  },
  {
    id: 'game_entertainment',
    name: '🎮 Games & Fun',
    description: 'For play time and entertainment',
    config: {
      tiles: [],
      categories: ['Basic Needs', 'Feelings', 'Actions', 'People', 'Food', 'Activities', 'Places', 'Things', 'Communication'],
      layout: 'grid-3x3'
    },
    structure: []
  },
  {
    id: 'advanced_communication',
    name: '🗣️ Advanced Communication',
    description: 'Complex phrases and conversations',
    config: {
      tiles: [],
      categories: ['Basic Needs', 'Feelings', 'Actions', 'People', 'Food', 'Activities', 'Places', 'Things', 'Communication'],
      layout: 'grid-3x3'
    },
    structure: []
  }
];

// Function to select board based on quiz answers
export function selectBoardBasedOnAnswers(answers: { [key: string]: string }): AACBoard {
  // Default to basic board
  return AAC_BOARDS[0];
}

// Function to get selected board by ID
export function getSelectedBoard(selectedBoardId?: string): AACBoard {
  const boardId = selectedBoardId || 'basic_simple';
  return AAC_BOARDS.find(board => board.id === boardId) || AAC_BOARDS[0];
}