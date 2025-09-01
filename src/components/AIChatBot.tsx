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
      content: "Hi! I'm your AAC board assistant. I can help you customize your board. Try saying things like:\n\n• 'Make the tiles bigger'\n• 'Change the voice speed to slower'\n• 'Make the voice higher pitched'\n• 'Set tile size to small'",
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
    const lowercaseMsg = message.toLowerCase();
    let responseMessage = '';
    let settingsUpdate: Partial<BoardSettings> = {};

    // Tile size commands
    if (lowercaseMsg.includes('bigger') || lowercaseMsg.includes('larger') || lowercaseMsg.includes('large')) {
      if (lowercaseMsg.includes('tile')) {
        settingsUpdate.tileSize = 'lg';
        responseMessage = 'Perfect! I\'ve made the tiles larger for you.';
      }
    } else if (lowercaseMsg.includes('smaller') || lowercaseMsg.includes('small')) {
      if (lowercaseMsg.includes('tile')) {
        settingsUpdate.tileSize = 'sm';
        responseMessage = 'Great! I\'ve made the tiles smaller for better visibility.';
      }
    } else if (lowercaseMsg.includes('medium') || lowercaseMsg.includes('normal')) {
      if (lowercaseMsg.includes('tile')) {
        settingsUpdate.tileSize = 'md';
        responseMessage = 'Done! Tiles are now set to medium size.';
      }
    }

    // Voice speed commands
    if (lowercaseMsg.includes('voice') || lowercaseMsg.includes('speech')) {
      if (lowercaseMsg.includes('faster') || lowercaseMsg.includes('speed up') || lowercaseMsg.includes('quick')) {
        settingsUpdate.voiceRate = Math.min((currentSettings.voiceRate || 1) + 0.3, 2);
        responseMessage = 'I\'ve increased the voice speed for you!';
      } else if (lowercaseMsg.includes('slower') || lowercaseMsg.includes('slow down')) {
        settingsUpdate.voiceRate = Math.max((currentSettings.voiceRate || 1) - 0.3, 0.5);
        responseMessage = 'I\'ve slowed down the voice speed for better clarity.';
      } else if (lowercaseMsg.includes('normal speed')) {
        settingsUpdate.voiceRate = 1;
        responseMessage = 'Voice speed reset to normal.';
      }

      // Voice pitch commands
      if (lowercaseMsg.includes('higher') || lowercaseMsg.includes('pitch up')) {
        settingsUpdate.voicePitch = Math.min((currentSettings.voicePitch || 1) + 0.2, 2);
        responseMessage = 'I\'ve made the voice higher pitched!';
      } else if (lowercaseMsg.includes('lower') || lowercaseMsg.includes('pitch down') || lowercaseMsg.includes('deeper')) {
        settingsUpdate.voicePitch = Math.max((currentSettings.voicePitch || 1) - 0.2, 0.5);
        responseMessage = 'I\'ve made the voice lower and deeper.';
      } else if (lowercaseMsg.includes('normal pitch')) {
        settingsUpdate.voicePitch = 1;
        responseMessage = 'Voice pitch reset to normal.';
      }
    }

    // Help and suggestions
    if (lowercaseMsg.includes('help') || lowercaseMsg.includes('what can you do')) {
      responseMessage = `I can help you customize your AAC board! Here's what I can do:

🔧 **Tile Settings:**
• "Make tiles bigger/smaller/medium"
• "Set tile size to large/small"

🎤 **Voice Settings:**
• "Make voice faster/slower"
• "Higher/lower pitch"
• "Speed up the voice"
• "Make voice deeper"

Just tell me what you'd like to change and I'll help you customize it!`;
    }

    // Default response if no command recognized
    if (!responseMessage) {
      responseMessage = `I understand you want to customize something, but I'm not sure exactly what. 

Try being more specific like:
• "Make the tiles bigger"
• "Slow down the voice"
• "Make the voice higher pitched"
• "Set tiles to small size"

What would you like to change about your board?`;
    }

    return {
      message: responseMessage,
      settings: Object.keys(settingsUpdate).length > 0 ? settingsUpdate : undefined
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