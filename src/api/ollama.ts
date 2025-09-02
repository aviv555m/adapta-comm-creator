export interface OllamaMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface OllamaResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export class OllamaClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  async chat(messages: OllamaMessage[], model: string = 'llama3.2'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.message.content;
    } catch (error) {
      console.error('Ollama API error:', error);
      
      // Fallback responses for common queries
      const userMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
      
      if (userMessage.includes('hello') || userMessage.includes('hi')) {
        return "Hello! I'm here to help you with your communication board. You can ask me to adjust settings, find specific words, or get recommendations for better communication.";
      }
      
      if (userMessage.includes('help')) {
        return "I can help you with:\n• Adjusting board settings\n• Finding specific words or categories\n• Recommending communication strategies\n• Customizing your tiles\n• Setting up voice preferences";
      }
      
      if (userMessage.includes('setting')) {
        return "I can help you adjust various settings like tile size, voice speed, eye tracking sensitivity, category preferences, and visual themes. What would you like to change?";
      }
      
      return "I'm having trouble connecting to the Ollama service. Please make sure Ollama is running on your system, or try asking me about board settings, word suggestions, or communication tips.";
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.error('Failed to list Ollama models:', error);
      return ['llama3.2', 'llama3.1', 'phi3'];
    }
  }
}