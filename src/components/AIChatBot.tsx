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
      content: "Hi! I'm your AAC board assistant. I can help you customize your board. Try things like:\n\n• 'Make the tiles bigger'\n• 'Change the voice speed to slower'\n• 'Use high contrast mode'\n• 'Show 4 columns' or 'use 2 columns on mobile'\n• 'Hide labels' / 'Show emojis'\n• 'Hide the gaze dot'",
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
  };

  const interpretMessage = async (message: string): Promise<{ message: string; settings?: Partial<BoardSettings> }> => {
    // Use real AI to interpret the message
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          currentSettings,
          systemPrompt: `You are an AI assistant for an AAC (Augmentative and Alternative Communication) board. 
          
Your job is to interpret user requests and return:
1. A helpful response message
2. Any settings changes to apply to the AAC board

Available settings to modify:
- tileSize: 'sm' | 'md' | 'lg'
- gridColsDesktop/gridColsMobile: 2-6 columns
- highContrast: boolean
- showLabels/showEmoji: boolean  
- showGazeDot: boolean
- voiceRate: 0.5-2.0
- voicePitch: 0.5-2.0
- voiceVolume: 0-1
- voiceGender: 'male' | 'female' | 'child'
- enabledCategories: array of category names
- eyeTrackingEnabled: boolean
- fixationTime: milliseconds
- dwellHighlight: boolean
- predictiveSuggestions: boolean

You can also:
- Explain AAC concepts and best practices
- Suggest board improvements based on user needs
- Help with accessibility settings
- Provide communication strategies
- Answer questions about eye tracking, voice settings, etc.

Respond with JSON: { "message": "your response", "settings": { settingName: value } }
If no settings should change, omit the "settings" field.`
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.error('AI API error:', error);
    }

    // Fallback to rule-based interpretation
    return interpretMessageFallback(message);
  };

  const interpretMessageFallback = (message: string): { message: string; settings?: Partial<BoardSettings> } => {
    const text = message.trim();
    const lowercaseMsg = text.toLowerCase();
    let responseMessage = '';
    let settingsUpdate: Partial<BoardSettings> = {};

    // Enhanced pattern matching with more capabilities
    
    // Tile size commands
    if (/(bigger|larger|large)/.test(lowercaseMsg) && /tile/.test(lowercaseMsg)) {
      settingsUpdate.tileSize = 'lg';
      responseMessage = "I've made the tiles larger for easier selection.";
    } else if (/(smaller|small)/.test(lowercaseMsg) && /tile/.test(lowercaseMsg)) {
      settingsUpdate.tileSize = 'sm';
      responseMessage = 'Tiles set to small - you can fit more on screen now.';
    } else if (/(medium|normal)/.test(lowercaseMsg) && /tile/.test(lowercaseMsg)) {
      settingsUpdate.tileSize = 'md';
      responseMessage = 'Tiles set to medium size.';
    }

    // Categories management
    if (/enable|add|turn on/.test(lowercaseMsg) && /(food|animals|emotions|people|places|colors|numbers)/.test(lowercaseMsg)) {
      const category = lowercaseMsg.match(/(food|animals|emotions|people|places|colors|numbers)/)?.[1];
      if (category) {
        const current = currentSettings.enabledCategories || [];
        if (!current.includes(category)) {
          settingsUpdate.enabledCategories = [...current, category];
          responseMessage = `Added ${category} category to your board.`;
        } else {
          responseMessage = `${category} category is already enabled.`;
        }
      }
    }

    if (/disable|remove|turn off/.test(lowercaseMsg) && /(food|animals|emotions|people|places|colors|numbers)/.test(lowercaseMsg)) {
      const category = lowercaseMsg.match(/(food|animals|emotions|people|places|colors|numbers)/)?.[1];
      if (category) {
        const current = currentSettings.enabledCategories || [];
        settingsUpdate.enabledCategories = current.filter(c => c !== category);
        responseMessage = `Removed ${category} category from your board.`;
      }
    }

    // Eye tracking commands
    if (/eye.track|gaze.track/.test(lowercaseMsg)) {
      if (/(on|enable|start|activate)/.test(lowercaseMsg)) {
        settingsUpdate.eyeTrackingEnabled = true;
        responseMessage = "Eye tracking enabled. Look at tiles to select them.";
      } else if (/(off|disable|stop|deactivate)/.test(lowercaseMsg)) {
        settingsUpdate.eyeTrackingEnabled = false;
        responseMessage = "Eye tracking disabled.";
      }
    }

    // Dwell time adjustment
    if (/dwell|fixation/.test(lowercaseMsg) && /time/.test(lowercaseMsg)) {
      if (/(faster|quick|shorter)/.test(lowercaseMsg)) {
        settingsUpdate.fixationTime = Math.max((currentSettings.fixationTime || 1000) - 200, 300);
        responseMessage = "Reduced dwell time for faster selection.";
      } else if (/(slower|longer)/.test(lowercaseMsg)) {
        settingsUpdate.fixationTime = Math.min((currentSettings.fixationTime || 1000) + 200, 3000);
        responseMessage = "Increased dwell time for more accurate selection.";
      }
    }

    // Voice commands (existing)
    if (/(voice|speech)/.test(lowercaseMsg)) {
      if (/(faster|speed up|quick)/.test(lowercaseMsg)) {
        settingsUpdate.voiceRate = Math.min((currentSettings.voiceRate || 1) + 0.3, 2);
        responseMessage = "Voice speed increased.";
      } else if (/(slower|slow down)/.test(lowercaseMsg)) {
        settingsUpdate.voiceRate = Math.max((currentSettings.voiceRate || 1) - 0.3, 0.5);
        responseMessage = 'Voice speed reduced.';
      }
      
      if (/(male|man)/.test(lowercaseMsg)) {
        settingsUpdate.voiceGender = 'male';
        responseMessage = "Voice changed to male.";
      } else if (/(female|woman)/.test(lowercaseMsg)) {
        settingsUpdate.voiceGender = 'female';
        responseMessage = "Voice changed to female.";
      } else if (/child/.test(lowercaseMsg)) {
        settingsUpdate.voiceGender = 'child';
        responseMessage = "Voice changed to child-like.";
      }
    }

    // AI features
    if (/predict|suggestion/.test(lowercaseMsg)) {
      if (/(on|enable)/.test(lowercaseMsg)) {
        settingsUpdate.predictiveSuggestions = true;
        responseMessage = "Predictive suggestions enabled - I'll suggest likely next words.";
      } else if (/(off|disable)/.test(lowercaseMsg)) {
        settingsUpdate.predictiveSuggestions = false;
        responseMessage = "Predictive suggestions disabled.";
      }
    }

    // Accessibility
    if (/contrast/.test(lowercaseMsg)) {
      settingsUpdate.highContrast = !/(off|disable)/.test(lowercaseMsg);
      responseMessage = settingsUpdate.highContrast ? 'High contrast enabled for better visibility.' : 'High contrast disabled.';
    }

    // Help - Enhanced
    if (/help|what can you do/.test(lowercaseMsg)) {
      responseMessage = `I'm your AAC board assistant! I can help with:

🎯 Board Layout:
• "Make tiles bigger/smaller"
• "Show 4 columns" / "Use 2 columns on mobile"
• "Enable high contrast mode"

🗂️ Categories:
• "Add animals category"
• "Remove food category" 
• "Show only emotions and people"

👁️ Eye Tracking:
• "Turn on eye tracking"
• "Make dwell time faster/slower"
• "Show/hide gaze dot"

🎤 Voice Settings:
• "Make voice faster/slower"
• "Use female/male/child voice"
• "Higher/lower pitch"

🤖 Smart Features:
• "Enable predictions"
• "Turn on word suggestions"

Just tell me what you need!`;
    }

    // Default enhanced response
    if (!responseMessage) {
      responseMessage = `I can help customize your AAC board in many ways! Try asking me to:
• Change tile sizes or layout
• Add/remove categories  
• Adjust voice settings
• Configure eye tracking
• Enable smart features
• Improve accessibility

What would you like to change?`;
    }

    return {
      message: responseMessage,
      settings: Object.keys(settingsUpdate).length > 0 ? settingsUpdate : undefined,
    };
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
        title="AI Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 h-[500px] shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="h-5 w-5" />
          AI Board Assistant
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
            placeholder="Tell me how to customize your board..."
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