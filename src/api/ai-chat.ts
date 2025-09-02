// Mock AI API endpoint - replace with real AI service
export async function POST(request: Request) {
  try {
    const { message, currentSettings, systemPrompt } = await request.json();
    
    // For now, return a structured response based on simple pattern matching
    // Replace this with actual AI API call (OpenAI, Anthropic, etc.)
    
    const lowercaseMsg = message.toLowerCase();
    let responseMessage = '';
    let settings: any = {};

    // Enhanced AI-like responses
    if (/help|what can you do/.test(lowercaseMsg)) {
      responseMessage = `I'm your AI assistant for AAC communication! I can help you:

🎯 **Customize Your Board:**
• Adjust tile sizes and layouts
• Enable/disable categories based on your needs
• Configure voice settings (speed, pitch, gender)

👁️ **Eye Tracking Setup:**
• Calibrate and optimize eye tracking
• Adjust fixation times and highlighting
• Enable advanced selection methods

🤖 **Smart Features:**
• Enable predictive text suggestions
• Set up contextual boards for different situations
• Configure adaptive layouts that learn from usage

🛡️ **Accessibility & Safety:**
• High contrast modes for better visibility
• Parental controls and safety features
• Offline mode configuration

Just tell me what you'd like to adjust - I understand natural language! For example:
• "Make voice slower for my child"
• "Add animals category and remove advanced topics"
• "Set up eye tracking with longer dwell time"
• "Enable predictions but keep it simple"`;
      
    } else if (/voice.*child|child.*voice|kid.*voice/.test(lowercaseMsg)) {
      settings.voiceGender = 'child';
      settings.voiceRate = 0.8; // Slightly slower for children
      responseMessage = "I've set the voice to child-like with a slightly slower pace - perfect for young communicators!";
      
    } else if (/eye.*track.*slow|slow.*eye|dwell.*long/.test(lowercaseMsg)) {
      settings.fixationTime = 1500;
      settings.dwellHighlight = true;
      responseMessage = "I've increased the dwell time to 1.5 seconds and enabled highlighting - this will give more time for accurate selection.";
      
    } else if (/simple|basic|beginner/.test(lowercaseMsg)) {
      settings.enabledCategories = ['basic-needs', 'core-words', 'emotions'];
      settings.tileSize = 'lg';
      settings.predictiveSuggestions = false;
      responseMessage = "I've simplified your board with basic categories, large tiles, and disabled advanced features - perfect for getting started!";
      
    } else if (/predict|suggest|smart/.test(lowercaseMsg)) {
      if (/(on|enable|yes)/.test(lowercaseMsg)) {
        settings.predictiveSuggestions = true;
        settings.showHistory = true;
        responseMessage = "Predictive suggestions enabled! I'll now suggest likely next words based on your communication patterns.";
      } else {
        settings.predictiveSuggestions = false;
        responseMessage = "Predictive suggestions disabled - keeping things simple.";
      }
      
    } else if (/animal|pet/.test(lowercaseMsg)) {
      const currentCategories = currentSettings.enabledCategories || [];
      if (!currentCategories.includes('animals')) {
        settings.enabledCategories = [...currentCategories, 'animals'];
        responseMessage = "Added animals category! You'll now see tiles for pets, farm animals, and wildlife.";
      } else {
        responseMessage = "Animals category is already enabled in your board.";
      }
      
    } else if (/contrast|vision|see/.test(lowercaseMsg)) {
      settings.highContrast = true;
      settings.tileBorderThickness = 'thick';
      responseMessage = "Enabled high contrast mode with thick borders for better visibility.";
      
    } else {
      // Fallback response that's still helpful
      responseMessage = `I understand you want to customize "${message}". While I'm still learning, I can help with:

• **Voice settings** - "make voice slower/faster", "use male/female voice"
• **Board layout** - "bigger tiles", "more columns", "high contrast"  
• **Categories** - "add animals", "remove advanced topics"
• **Eye tracking** - "slower selection", "show gaze dot"
• **Smart features** - "enable predictions", "simple mode"

What specific change would you like me to make?`;
    }

    return Response.json({
      message: responseMessage,
      settings: Object.keys(settings).length > 0 ? settings : undefined
    });
    
  } catch (error) {
    console.error('AI Chat API error:', error);
    return Response.json(
      { 
        message: "I'm having trouble understanding right now. Try asking me to 'make tiles bigger', 'change voice speed', or 'enable eye tracking'.",
        settings: undefined 
      },
      { status: 500 }
    );
  }
}