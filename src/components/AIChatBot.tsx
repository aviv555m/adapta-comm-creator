import React, { useState } from 'react';
import { MessageCircle, Send, X, Palette, Layout, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { BoardSettings } from './BoardSettingsDialog';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuiz } from '@/hooks/useQuiz';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface TileUsage {
  tileId: string;
  count: number;
  lastUsed: number;
}

interface UsageData {
  clickCounts: Record<string, TileUsage>;
  mostUsedTiles: any[];
  totalInteractions: number;
  categoriesUsed: string[];
}

interface AIChatBotProps {
  onUpdateSettings: (settings: Partial<BoardSettings>) => void;
  currentSettings: BoardSettings;
  onTrackInteraction?: (type: string, data: any) => void;
  usageData?: UsageData;
}

interface QuizPersonalization {
  communicationStyle: string;
  favoriteTopics: string;
  primaryLanguage: string;
  messageStyle: string;
  visualPreference: string;
  voicePreference: string;
  emotionalNeeds: string;
  adaptiveLevel: string;
  emergencyNeeds: string;
  contextAwareness: string;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({ onUpdateSettings, currentSettings, onTrackInteraction, usageData }) => {
  const { language, t } = useLanguage();
  const { questions } = useQuiz();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Get personalization from quiz answers
  const getPersonalization = (): QuizPersonalization => {
    const answers = questions.reduce((acc, q) => {
      if (q.status === 'answered' && q.value) {
        acc[q.id] = q.value;
      }
      return acc;
    }, {} as Record<number, string>);

    return {
      communicationStyle: answers[1] || 'mixed',
      favoriteTopics: answers[2] || 'general',
      primaryLanguage: answers[3] || (language === 'he' ? '🇮🇱 Hebrew' : '🇬🇧 English'),
      messageStyle: answers[4] || 'mixed',
      visualPreference: answers[5] || 'mixed',
      voicePreference: answers[6] || 'neutral',
      emotionalNeeds: answers[7] || 'general',
      adaptiveLevel: answers[8] || 'sometimes',
      emergencyNeeds: answers[9] || 'general',
      contextAwareness: answers[10] || 'consistent'
    };
  };

  const getWelcomeMessage = () => {
    const personalization = getPersonalization();
    
    if (language === 'he') {
      return `שלום! אני העוזר החכם של לוח התקשורת שלך. 

בהתבסס על התשובות שלך בשאלון, אני יכול לעזור לך להתאים את הלוח במיוחד עבורך:

${personalization.communicationStyle.includes('Point') ? '• אתה אוהב להצביע - אני יכול להגדיל כפתורים' : ''}
${personalization.favoriteTopics.includes('Games') ? '• אתה אוהב משחקים - אני יכול להוסיף קטגוריות משחקים' : ''}
${personalization.voicePreference.includes('Child') ? '• אתה רוצה קול של ילד - אני יכול לשנות את הקול' : ''}

נסה דברים כמו:
• 'תעשה את הכפתורים יותר גדולים'
• 'תשנה את מהירות הקול לאטי יותר'
• 'תראה רק משחקים ורגשות'`;
    } else {
      return `Hello! I'm your smart AAC assistant.

Based on your quiz answers, I can help customize your board specifically for you:

${personalization.communicationStyle.includes('Point') ? '• You like pointing - I can make buttons bigger' : ''}
${personalization.favoriteTopics.includes('Games') ? '• You love games - I can add game categories' : ''}
${personalization.voicePreference.includes('Child') ? '• You want a child\'s voice - I can change the voice' : ''}

Try things like:
• 'Make the buttons bigger'
• 'Change voice to slower'
• 'Show only games and emotions'`;
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: getWelcomeMessage(),
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const processMessage = async (message: string) => {
    setIsProcessing(true);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Process the message and determine what changes to make
      const response = await interpretMessage(message);
    
    // Add AI response
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response.message,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    // Apply changes if any
    if (response.settings) {
      onUpdateSettings(response.settings);
      // Track AI-initiated changes
      onTrackInteraction?.('ai_adaptation', { settings: response.settings, confidence: 0.9 });
      toast({
        title: 'הבינה המלאכותית עדכנה את הלוח',
        description: response.message,
      });
    }
    
    setIsProcessing(false);
    } catch (error) {
      console.error('AI processing error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error processing your message. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsProcessing(false);
    }
  };

  const interpretMessage = async (message: string): Promise<{ message: string; settings?: Partial<BoardSettings> }> => {
    const personalization = getPersonalization();
    
    // Try Ollama first, fallback to local processing
    try {
      if (currentSettings.ollamaUrl && currentSettings.ollamaModel) {
        const systemPrompt = language === 'he' ? 
          `אתה עוזר AAC מתקדם עם שליטה מלאה בלוח התקשורת. אתה יכול לשנות כל הגדרה.

פרטי התאמה אישית מהשאלון:
- סגנון תקשורת: ${personalization.communicationStyle}
- נושאים מועדפים: ${personalization.favoriteTopics}  
- קול מועדף: ${personalization.voicePreference}
- צרכים רגשיים: ${personalization.emotionalNeeds}

הגדרות שאתה יכול לשנות:
- tileSize (1-10): גודל כפתורים
- voiceRate (0.5-2): מהירות דיבור
- voiceGender: מין הקול
- highContrast: ניגודיות גבוהה
- showLabels: הצגת תוויות
- enabledCategories: קטגוריות פעילות

תן תגובות קצרות בעברית. החל שינויים מיידיים כשמתבקש.` :
          `You are an advanced AAC assistant with FULL CONTROL over the communication board.

Child's personalization from quiz:
- Communication style: ${personalization.communicationStyle}
- Favorite topics: ${personalization.favoriteTopics}
- Voice preference: ${personalization.voicePreference}
- Emotional needs: ${personalization.emotionalNeeds}

Settings you can change:
- tileSize (1-10): Button size
- voiceRate (0.5-2): Speech speed
- voiceGender: Voice gender
- highContrast: High contrast mode
- showLabels: Show/hide labels
- enabledCategories: Active categories

Respond concisely in English. Apply changes immediately when requested.`;

        const ollamaResponse = await fetch(`${currentSettings.ollamaUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: currentSettings.ollamaModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
            stream: false
          })
        });

        if (ollamaResponse.ok) {
          const data = await ollamaResponse.json();
          const aiResponse = data.message?.content || data.response || (language === 'he' ? 'עיבדתי את הבקשה!' : 'I processed your request!');
          
          // Parse any settings changes from AI response
          const settingsUpdate = parseSettingsFromResponse(aiResponse, message);
          
          return {
            message: aiResponse,
            settings: Object.keys(settingsUpdate).length > 0 ? settingsUpdate : undefined
          };
        }
      }
    } catch (error) {
      console.log('Ollama not available, using local processing');
    }

    // Fallback to local processing with personalization
    const text = message.trim();
    const lowercaseMsg = text.toLowerCase();
    let responseMessage = '';
    let settingsUpdate: Partial<BoardSettings> = {};

    // Apply personalized defaults based on quiz
    const applyPersonalizedSettings = (): Partial<BoardSettings> => {
      const settings: Partial<BoardSettings> = {};
      
      // Voice preferences from quiz
      if (personalization.voicePreference.includes('Child')) {
        settings.voiceGender = 'female';
        settings.voicePitch = 1.3;
      } else if (personalization.voicePreference.includes('Man')) {
        settings.voiceGender = 'male';
      } else if (personalization.voicePreference.includes('Woman')) {
        settings.voiceGender = 'female';
      }

      // Communication style adjustments
      if (personalization.communicationStyle.includes('Point')) {
        settings.tileSize = 7; // Larger tiles for pointing
      } else if (personalization.communicationStyle.includes('Look')) {
        settings.showGazeDot = true; // Enable eye tracking dot
      }

      // Topic preferences
      const categories = [];
      if (personalization.favoriteTopics.includes('Games')) {
        categories.push('Activities', 'Toys', 'Games');
      }
      if (personalization.favoriteTopics.includes('School')) {
        categories.push('School', 'Numbers', 'Colors');
      }
      if (personalization.favoriteTopics.includes('Family')) {
        categories.push('People', 'Home', 'Emotions');
      }
      if (categories.length > 0) {
        settings.enabledCategories = [...new Set([...categories, 'Core', 'Basic Needs'])];
      }

      return settings;
    };

    // Greetings and casual conversation
    if (/^(hi|hello|hey|good morning|good afternoon|שלום|היי)/.test(lowercaseMsg)) {
      const personalizedGreeting = language === 'he' ? 
        `שלום! אני העוזר החכם שלך. בהתבסס על השאלון שלך, אני יודע שאתה:

${personalization.communicationStyle.includes('Point') ? '• אוהב להצביע - אני יכול להגדיל כפתורים' : ''}
${personalization.favoriteTopics.includes('Games') ? '• אוהב משחקים - יש לי קטגוריות מיוחדות' : ''}
${personalization.voicePreference.includes('Child') ? '• רוצה קול של ילד - אני יכול לשנות' : ''}

מה תרצה לשפר היום?` :
        `Hello! I'm your smart assistant. Based on your quiz, I know you:

${personalization.communicationStyle.includes('Point') ? '• Like pointing - I can make buttons bigger' : ''}
${personalization.favoriteTopics.includes('Games') ? '• Love games - I have special categories' : ''}
${personalization.voicePreference.includes('Child') ? '• Want a child\'s voice - I can change it' : ''}

What would you like to improve today?`;
      
      responseMessage = personalizedGreeting;
    }
    
    // Ask for help or capabilities
    else if (/what can you do|help|capabilities/.test(lowercaseMsg)) {
      responseMessage = `I'm your smart AAC assistant! Here's what I can do:

🎯 **Board Customization:**
• Adjust tile sizes and layout
• Change voice settings (speed, pitch, gender)
• Enable/disable categories
• Set up accessibility features

👁️ **Eye Tracking Help:**
• Calibrate and optimize tracking
• Adjust timing and sensitivity
• Troubleshoot tracking issues

🧠 **Smart Features:**
• Enable predictive text
• Set up adaptive learning
• Configure context-aware boards

💬 **Communication Support:**
• Explain AAC best practices
• Suggest communication strategies
• Help organize your vocabulary

🛠️ **Technical Support:**
• Troubleshoot issues
• Optimize performance
• Explain how features work

Just ask me anything! I understand natural language, so you can say things like "make voice slower" or "why isn't eye tracking working?"`;
    }

    // AAC education and best practices
    else if (/(what is aac|how does|explain|why|learn about)/.test(lowercaseMsg)) {
      if (/aac/.test(lowercaseMsg)) {
        responseMessage = `AAC stands for Augmentative and Alternative Communication. It helps people who have difficulty speaking to communicate effectively.

**How AAC works:**
• **Augmentative** - supports existing speech
• **Alternative** - replaces speech when needed
• Uses symbols, text, and technology to communicate

**Who benefits from AAC:**
• People with autism, cerebral palsy, stroke survivors
• Anyone with speech or language challenges
• Temporary needs (after surgery, injury)

**Your board includes:**
• Core vocabulary (high-frequency words like "I", "want", "more")
• Fringe vocabulary (specific topics like food, activities)
• Quick phrases for common needs

Would you like me to explain any specific features or help optimize your board for better communication?`;
      } else if (/eye.track/.test(lowercaseMsg)) {
        responseMessage = `Eye tracking lets you select tiles just by looking at them! Here's how it works:

**The Process:**
1. Camera tracks where you're looking
2. Software translates gaze to screen coordinates  
3. When you look at a tile long enough, it gets selected

**Key Settings:**
• **Fixation time** - how long to look (300ms-3000ms)
• **Dwell highlighting** - tile highlights while you look
• **Gaze dot** - shows where you're looking

**Tips for better accuracy:**
• Good lighting (not too bright/dark)
• Sit 18-24 inches from screen
• Keep head relatively still
• Recalibrate if accuracy drops

Having trouble with eye tracking? I can help troubleshoot!`;
      }
    }

    // Troubleshooting and support
    else if (/(not working|broken|problem|issue|trouble|error)/.test(lowercaseMsg)) {
      if (/eye.track/.test(lowercaseMsg)) {
        responseMessage = `Let's troubleshoot your eye tracking! Common solutions:

🔧 **Quick Fixes:**
• Check camera permissions in browser
• Ensure good lighting (avoid backlighting)
• Clean your screen and camera lens
• Sit 18-24 inches from screen

⚙️ **Calibration Issues:**
• Try recalibrating (look for calibration button)
• Use all 9 calibration points slowly
• Keep head still during calibration
• Make sure you're looking directly at dots

🎯 **Accuracy Problems:**
• Increase fixation time in settings
• Enable dwell highlighting
• Try different tile sizes
• Check if you need glasses/contacts

Want me to guide you through recalibration or adjust your settings?`;
      } else if (/voice|speak/.test(lowercaseMsg)) {
        responseMessage = `Voice issues? Let's fix that:

🔊 **No Sound:**
• Check device volume and browser sound permissions
• Try clicking a tile - does it speak?
• Check if voice is set to very low volume

🎤 **Wrong Voice:**
• I can change to male/female/child voice
• Adjust speed (slower for clarity, faster for efficiency)
• Modify pitch for comfort

⚡ **Performance:**
• Some voices load faster than others
• Browser voices vs online voices
• Internet connection affects online voices

Tell me exactly what's happening and I'll help fix it!`;
      }
    }

    // Personalized quick setup
    else if (/(setup|optimize|personalize|התאם|אישי)/.test(lowercaseMsg)) {
      settingsUpdate = applyPersonalizedSettings();
      responseMessage = language === 'he' ?
        'התאמתי את הלוח בהתבסס על השאלון שלך! שינויים:\n• גודל כפתורים מותאם\n• קול מועדף\n• קטגוריות שאתה אוהב' :
        'I\'ve personalized your board based on your quiz! Changes:\n• Optimized tile size\n• Preferred voice\n• Your favorite categories';
    }

    // Settings changes with enhanced responses  
    else if (/(bigger|larger|large|גדול)/.test(lowercaseMsg) && /(tile|כפתור)/.test(lowercaseMsg)) {
      settingsUpdate.tileSize = personalization.communicationStyle.includes('Point') ? 9 : 8;
      responseMessage = language === 'he' ?
        'הגדלתי את הכפתורים! זה מושלם בשבילך כי אתה אוהב להצביע.' :
        "Perfect! I've made the tiles larger. Great for pointing and easier selection.";
    }
    
    else if (/(smaller|small|קטן)/.test(lowercaseMsg) && /(tile|כפתור)/.test(lowercaseMsg)) {
      settingsUpdate.tileSize = 3;
      responseMessage = language === 'he' ?
        'הקטנתי את הכפתורים. עכשיו יש יותר מילים על המסך.' :
        'Tiles are now smaller. More vocabulary visible at once.';
    }

    // Categories management with better feedback
    else if (/categories|topics/.test(lowercaseMsg)) {
      if (/(show|enable|add|turn on)/.test(lowercaseMsg)) {
        responseMessage = `I can help you customize which categories appear on your board! 

Available categories:
• **Basic Needs** - food, toilet, drink, sleep
• **Core Words** - I, want, go, stop, more, help  
• **Emotions** - happy, sad, angry, excited
• **People** - family, friends, teachers
• **Animals** - pets, farm animals, wildlife
• **Actions** - play, eat, work, learn
• **Places** - home, school, park, store

Tell me which ones you'd like to see! For example: "Show only basic needs and emotions" or "Add animals category"`;
      } else {
        responseMessage = `Your current categories are: ${(currentSettings.enabledCategories || []).join(', ')}.

I can help you:
• Add new categories ("add animals")
• Remove ones you don't need ("remove school topics")  
• Suggest categories based on your interests
• Organize categories by priority

What would you like to change?`;
      }
    }

    // Voice adjustments with personalization
    else if (/(voice|speech|קול|דיבור)/.test(lowercaseMsg)) {
      if (/(faster|speed up|quick|מהיר)/.test(lowercaseMsg)) {
        settingsUpdate.voiceRate = Math.min((currentSettings.voiceRate || 1) + 0.3, 2);
        responseMessage = language === 'he' ? 'הקול עכשיו יותר מהיר.' : 'Voice is now faster.';
      }
      else if (/(slower|slow down|אטי)/.test(lowercaseMsg)) {
        settingsUpdate.voiceRate = Math.max((currentSettings.voiceRate || 1) - 0.3, 0.5);
        responseMessage = language === 'he' ? 'הקול עכשיו יותר אטי.' : 'Voice is now slower.';
      }
      else if (/(child|kid|ילד)/.test(lowercaseMsg)) {
        settingsUpdate.voiceGender = 'female';
        settingsUpdate.voicePitch = 1.4;
        responseMessage = language === 'he' ? 'החלפתי לקול של ילד.' : 'Changed to child\'s voice.';
      }
      else if (/(male|man|גבר)/.test(lowercaseMsg)) {
        settingsUpdate.voiceGender = 'male';
        responseMessage = language === 'he' ? 'החלפתי לקול גברי.' : 'Changed to male voice.';
      }
      else if (/(female|woman|אישה)/.test(lowercaseMsg)) {
        settingsUpdate.voiceGender = 'female';
        responseMessage = language === 'he' ? 'החלפתי לקול נשי.' : 'Changed to female voice.';
      }
      else {
        // Apply personalized voice preference
        if (personalization.voicePreference.includes('Child')) {
          settingsUpdate.voiceGender = 'female';
          settingsUpdate.voicePitch = 1.3;
          responseMessage = language === 'he' ? 'שינתי לקול הילד המועדף עליך.' : 'Changed to your preferred child voice.';
        } else {
          responseMessage = language === 'he' ? 'עדכנתי הגדרות קול.' : 'Updated voice settings.';
        }
      }
    }

    // Default helpful response with personalization
    else {
      const personalizedHelp = language === 'he' ?
        `אני כאן לעזור! הבנתי שאמרת "${message}".

בהתבסס על השאלון שלך, אני יכול לעזור עם:
${personalization.communicationStyle.includes('Point') ? '• הגדלת כפתורים למגע מדויק יותר' : ''}
${personalization.favoriteTopics.includes('Games') ? '• הוספת קטגוריות משחקים' : ''}
${personalization.voicePreference.includes('Child') ? '• שינוי לקול ילד' : ''}
• **הגדרות** - "תגדיל כפתורים", "קול אטי יותר"
• **קטגוריות** - "תראה רק משחקים", "תוסיף חיות"

מה תרצה לשפר?` :
        `I'm here to help! I understand you mentioned "${message}".

Based on your quiz, I can help with:
${personalization.communicationStyle.includes('Point') ? '• Making buttons bigger for better pointing' : ''}
${personalization.favoriteTopics.includes('Games') ? '• Adding game categories' : ''}
${personalization.voicePreference.includes('Child') ? '• Changing to child voice' : ''}
• **Settings** - "make tiles bigger", "slower voice"
• **Categories** - "show only games", "add animals"

What would you like to improve?`;
      
      responseMessage = personalizedHelp;
    }

    return {
      message: responseMessage,
      settings: Object.keys(settingsUpdate).length > 0 ? settingsUpdate : undefined,
    };
  };

  const parseSettingsFromResponse = (response: string, originalMessage: string): Partial<BoardSettings> => {
    const settings: Partial<BoardSettings> = {};
    const lowerMsg = originalMessage.toLowerCase();
    
    // Parse common setting changes from user message
    if (/(bigger|larger|large)/.test(lowerMsg) && /tile/.test(lowerMsg)) {
      settings.tileSize = 8;
    } else if (/(smaller|small)/.test(lowerMsg) && /tile/.test(lowerMsg)) {
      settings.tileSize = 3;
    }
    
    if (/(faster|speed up)/.test(lowerMsg) && /(voice|speak)/.test(lowerMsg)) {
      settings.voiceRate = Math.min((currentSettings.voiceRate || 1) + 0.3, 2);
    } else if (/(slower|slow down)/.test(lowerMsg) && /(voice|speak)/.test(lowerMsg)) {
      settings.voiceRate = Math.max((currentSettings.voiceRate || 1) - 0.3, 0.5);
    }

    if (/(male|man)/.test(lowerMsg)) {
      settings.voiceGender = 'male';
    } else if (/(female|woman)/.test(lowerMsg)) {
      
      settings.voiceGender = 'female';
    }
    
    if (/high contrast/.test(lowerMsg)) {
      settings.highContrast = true;
    }
    
    return settings;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    processMessage(inputMessage);
    setInputMessage('');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
        title={language === 'he' ? 'עוזר חכם' : 'Smart Assistant'}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-[520px] h-[640px] shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="h-5 w-5" />
          {language === 'he' ? 'עוזר לוח חכם' : 'Smart Board Assistant'}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex flex-col h-[calc(100%-80px)]">
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-line ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={language === 'he' ? 'ספר לי איך להתאים את הלוח שלך...' : 'Tell me how to customize your board...'}
            className="flex-1"
            disabled={isProcessing}
          />
          <Button type="submit" size="sm" disabled={isProcessing || !inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};