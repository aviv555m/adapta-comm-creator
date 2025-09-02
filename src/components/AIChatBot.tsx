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
    const text = message.trim();
    const lowercaseMsg = text.toLowerCase();
    let responseMessage = '';
    let settingsUpdate: Partial<BoardSettings> = {};

    // Tile size commands
    if (/(bigger|larger|large)/.test(lowercaseMsg) && /tile/.test(lowercaseMsg)) {
      settingsUpdate.tileSize = 'lg';
      responseMessage = "I've made the tiles larger.";
    } else if (/(smaller|small)/.test(lowercaseMsg) && /tile/.test(lowercaseMsg)) {
      settingsUpdate.tileSize = 'sm';
      responseMessage = 'Tiles set to small.';
    } else if (/(medium|normal)/.test(lowercaseMsg) && /tile/.test(lowercaseMsg)) {
      settingsUpdate.tileSize = 'md';
      responseMessage = 'Tiles set to medium.';
    }

    // Columns and layout density
    const colsMatch = lowercaseMsg.match(/(\d+)\s*(col|column|columns)/);
    if (colsMatch) {
      const n = Math.max(2, Math.min(5, parseInt(colsMatch[1], 10)));
      if (/mobile/.test(lowercaseMsg)) {
        settingsUpdate.gridColsMobile = n as any;
        responseMessage = `${n} columns on mobile set.`;
      } else {
        settingsUpdate.gridColsDesktop = n as any;
        responseMessage = `${n} columns set.`;
      }
    }
    if (/more\s+tiles|denser|tighter|increase\s+columns/.test(lowercaseMsg)) {
      settingsUpdate.gridColsDesktop = Math.min((currentSettings.gridColsDesktop || 3) + 1, 5) as any;
      responseMessage = 'Increased columns for more tiles on screen.';
    }
    if (/less\s+tiles|looser|decrease\s+columns|fewer\s+tiles/.test(lowercaseMsg)) {
      settingsUpdate.gridColsDesktop = Math.max((currentSettings.gridColsDesktop || 3) - 1, 2) as any;
      responseMessage = 'Decreased columns for larger tiles.';
    }

    // High contrast
    if (/high\s*contrast|contrast\s*mode/.test(lowercaseMsg)) {
      const on = !/(off|disable|stop)/.test(lowercaseMsg);
      settingsUpdate.highContrast = on;
      responseMessage = on ? 'High contrast mode enabled.' : 'High contrast mode disabled.';
    }

    // Labels and emojis
    if (/hide\s*(labels|text)/.test(lowercaseMsg)) {
      settingsUpdate.showLabels = false;
      responseMessage = 'Labels hidden.';
    } else if (/(show|display)\s*(labels|text)/.test(lowercaseMsg)) {
      settingsUpdate.showLabels = true;
      responseMessage = 'Labels shown.';
    }
    if (/hide\s*(emoji|emojis|icons|pictures)/.test(lowercaseMsg)) {
      settingsUpdate.showEmoji = false;
      responseMessage = 'Emojis hidden.';
    } else if (/(show|display)\s*(emoji|emojis|icons|pictures)/.test(lowercaseMsg)) {
      settingsUpdate.showEmoji = true;
      responseMessage = 'Emojis shown.';
    }

    // Gaze dot visibility
    if (/(show|hide)\s*(gaze|eye|tracking)\s*(dot|cursor)?/.test(lowercaseMsg)) {
      const show = /show/.test(lowercaseMsg);
      settingsUpdate.showGazeDot = show;
      responseMessage = show ? 'Gaze dot shown.' : 'Gaze dot hidden.';
    }

    // Voice speed
    if (/(voice|speech)/.test(lowercaseMsg)) {
      if (/(faster|speed up|quick)/.test(lowercaseMsg)) {
        settingsUpdate.voiceRate = Math.min((currentSettings.voiceRate || 1) + 0.3, 2);
        responseMessage = "I've increased the voice speed.";
      } else if (/(slower|slow down)/.test(lowercaseMsg)) {
        settingsUpdate.voiceRate = Math.max((currentSettings.voiceRate || 1) - 0.3, 0.5);
        responseMessage = 'Voice speed reduced.';
      } else if (/normal\s*speed/.test(lowercaseMsg)) {
        settingsUpdate.voiceRate = 1;
        responseMessage = 'Voice speed reset to normal.';
      }

      if (/(higher|pitch up)/.test(lowercaseMsg)) {
        settingsUpdate.voicePitch = Math.min((currentSettings.voicePitch || 1) + 0.2, 2);
        responseMessage = 'Higher voice pitch set.';
      } else if (/(lower|pitch down|deeper)/.test(lowercaseMsg)) {
        settingsUpdate.voicePitch = Math.max((currentSettings.voicePitch || 1) - 0.2, 0.5);
        responseMessage = 'Lower/deeper voice set.';
      } else if (/normal\s*pitch/.test(lowercaseMsg)) {
        settingsUpdate.voicePitch = 1;
        responseMessage = 'Voice pitch reset to normal.';
      }
    }

    // Help
    if (/help|what can you do/.test(lowercaseMsg)) {
      responseMessage = `I can customize your AAC board. Try:

🔧 Tiles & Layout:
• Make tiles bigger/smaller/medium
• Show 4 columns / use 2 columns on mobile
• Enable high contrast
• Hide labels / Show emojis

🎤 Voice:
• Make voice faster/slower
• Higher/lower pitch

👁️ Eye Tracking:
• Show/Hide gaze dot`;
    }

    // Default
    if (!responseMessage) {
      responseMessage = `I can help change tiles, columns, contrast, labels/emojis, voice, and gaze dot. What would you like?`;
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