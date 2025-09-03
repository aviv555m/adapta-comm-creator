import React, { useState } from 'react';
import { MessageCircle, Send, X, Palette, Layout, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { BoardSettings } from './BoardSettingsDialog';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatBotProps {
  onUpdateSettings: (settings: Partial<BoardSettings>) => void;
  currentSettings: BoardSettings;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({ onUpdateSettings, currentSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "שלום! אני העוזר החכם של לוח התקשורת שלך. אני יכול לעזור לך להתאים את הלוח. נסה דברים כמו:\n\n• 'תעשה את הכפתורים יותר גדולים'\n• 'תשנה את מהירות הקול לאטי יותר'\n• 'תשתמש במצב ניגודיות גבוהה'\n• 'תראה 4 עמודות' או 'תשתמש ב-2 עמודות בנייד'\n• 'תסתיר תוויות' / 'תראה אמוג\'ים'\n• 'תסתיר את נקודת המבט'",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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
      toast({
        title: 'Settings Updated',
        description: 'Your board has been customized!',
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
    // Try Ollama first, fallback to local processing
    try {
      if (currentSettings.ollamaUrl && currentSettings.ollamaModel) {
        const ollamaResponse = await fetch(`${currentSettings.ollamaUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: currentSettings.ollamaModel,
            messages: [
              {
                role: 'system',
                content: `You are an AAC (Augmentative and Alternative Communication) assistant. Help users customize their communication board. You can modify these settings: tileSize (1-10), voiceRate (0.5-2), voicePitch (0.5-2), voiceGender ('male'/'female'/'neutral'), highContrast (true/false), showLabels (true/false), showEmoji (true/false), showGazeDot (true/false), enabledCategories (array). Respond concisely (e.g., "Done. Voice slower, male.") and, when making changes, mention them clearly. Current settings: ${JSON.stringify(currentSettings)}`
              },
              {
                role: 'user', 
                content: message
              }
            ],
            stream: false
          })
        });

        if (ollamaResponse.ok) {
          const data = await ollamaResponse.json();
          const aiResponse = data.message?.content || data.response || 'I processed your request!';
          
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

    // Fallback to local processing
    const text = message.trim();
    const lowercaseMsg = text.toLowerCase();
    let responseMessage = '';
    let settingsUpdate: Partial<BoardSettings> = {};

    // Conversational AI responses - not just settings changes
    
    // Greetings and casual conversation
    if (/^(hi|hello|hey|good morning|good afternoon)/.test(lowercaseMsg)) {
      responseMessage = `Hello! I'm your AAC assistant. I'm here to help make your communication board work perfectly for you. 

Some things I can help with:
• Customize how your board looks and feels
• Explain how different features work
• Suggest better ways to organize your tiles
• Help with eye tracking setup
• Answer questions about AAC communication

What would you like to explore today?`;
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

    // Settings changes with enhanced responses
    else if (/(bigger|larger|large)/.test(lowercaseMsg) && /tile/.test(lowercaseMsg)) {
      settingsUpdate.tileSize = 8;
      responseMessage = "Perfect! I've made the tiles larger. Large tiles are great for:\n• Easier eye tracking accuracy\n• Better for motor difficulties\n• Clearer visual targets\n\nYou'll have fewer tiles per screen but they'll be much easier to select.";
    }
    
    else if (/(smaller|small)/.test(lowercaseMsg) && /tile/.test(lowercaseMsg)) {
      settingsUpdate.tileSize = 3;
      responseMessage = 'Tiles are now smaller. This gives you:\n• More vocabulary visible at once\n• Faster navigation between topics\n• Better for advanced users\n\nIf they become hard to select, just ask me to make them bigger again!';
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

    // Voice adjustments with concise confirmations
    else if (/(voice|speech)/.test(lowercaseMsg)) {
      if (/(faster|speed up|quick)/.test(lowercaseMsg)) {
        settingsUpdate.voiceRate = Math.min((currentSettings.voiceRate || 1) + 0.3, 2);
        responseMessage = 'Done. Voice faster.';
      }
      if (/(slower|slow down)/.test(lowercaseMsg)) {
        settingsUpdate.voiceRate = Math.max((currentSettings.voiceRate || 1) - 0.3, 0.5);
        responseMessage = responseMessage ? `${responseMessage} Voice slower.` : 'Done. Voice slower.';
      }
      if (/(male|man)/.test(lowercaseMsg)) {
        // Prefer male voice
        settingsUpdate.voiceGender = 'male';
        responseMessage = responseMessage ? `${responseMessage} Male voice.` : 'Done. Male voice.';
      }
      if (/(female|woman)/.test(lowercaseMsg)) {
        // Prefer female voice
        settingsUpdate.voiceGender = 'female';
        responseMessage = responseMessage ? `${responseMessage} Female voice.` : 'Done. Female voice.';
      }
      if (!responseMessage) responseMessage = 'Updated voice settings.';
    }

    // Default helpful response
    else {
      responseMessage = `I'm here to help! I understand you mentioned "${message}". 

I can assist with:
• **Settings** - "make tiles bigger", "slower voice", "high contrast"
• **Categories** - "add animals", "show only basic needs"  
• **Eye tracking** - "calibrate tracking", "make selection faster"
• **Questions** - "how does eye tracking work?", "what is AAC?"
• **Problems** - "voice not working", "tracking is off"

What would you like help with?`;
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
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
        title="עוזר חכם"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[520px] h-[640px] shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="h-5 w-5" />
          עוזר לוח חכם
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
            placeholder="ספר לי איך להתאים את הלוח שלך..."
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