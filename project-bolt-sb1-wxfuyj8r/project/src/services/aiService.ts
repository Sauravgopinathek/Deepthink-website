// Enhanced AI Service with Real ChatGPT-like Responses
import { OpenAI } from 'openai';

// AI Service Configuration
const AI_PROVIDERS = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1'
  },
  groq: {
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
  }
};

// Response cache for performance
const responseCache = new Map();

class EnhancedAIService {
  private providers: any[] = [];
  private conversationHistory = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Prioritize Groq for speed (70B model is very fast)
    if (AI_PROVIDERS.groq.apiKey) {
      this.providers.push({
        name: 'groq',
        client: new OpenAI({
          apiKey: AI_PROVIDERS.groq.apiKey,
          baseURL: AI_PROVIDERS.groq.baseURL,
          dangerouslyAllowBrowser: true
        }),
        models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant']
      });
    }

    if (AI_PROVIDERS.openai.apiKey) {
      this.providers.push({
        name: 'openai',
        client: new OpenAI({
          apiKey: AI_PROVIDERS.openai.apiKey,
          dangerouslyAllowBrowser: true
        }),
        models: ['gpt-4o-mini', 'gpt-3.5-turbo']
      });
    }
  }

  private async callAI(messages: any[], systemPrompt: string, conversationId?: string): Promise<string> {
    // Get conversation history if available
    const history = conversationId ? this.conversationHistory.get(conversationId) || [] : [];
    
    // Build full conversation context
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...history,
      ...messages
    ];

    // Try each provider
    for (const provider of this.providers) {
      try {
        const response = await Promise.race([
          provider.client.chat.completions.create({
            model: provider.models[0],
            messages: fullMessages,
            max_tokens: 1000,
            temperature: 0.7,
            stream: false
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000) // 10 second timeout
          )
        ]);

        const result = (response as any).choices[0]?.message?.content || 'I apologize, but I\'m having trouble generating a response right now.';
        
        // Update conversation history
        if (conversationId) {
          const updatedHistory = [...history, ...messages, { role: 'assistant', content: result }];
          this.conversationHistory.set(conversationId, updatedHistory.slice(-20)); // Keep last 20 messages
        }
        
        return result;
      } catch (error) {
        console.warn(`${provider.name} failed, trying next provider...`);
        continue;
      }
    }

    // Fallback response if all providers fail
    return this.generateIntelligentFallback(messages[messages.length - 1]?.content || '');
  }

  private generateIntelligentFallback(userMessage: string): string {
    const messageLower = userMessage.toLowerCase();
    
    // Decision-related fallbacks
    if (messageLower.includes('decision') || messageLower.includes('choose') || messageLower.includes('option')) {
      return `I understand you're working on a decision. Here's my advice:

1. **Clarify your criteria** - What factors matter most to you?
2. **Gather information** - Do you have all the data you need?
3. **Consider consequences** - What are the potential outcomes?
4. **Trust your analysis** - Your systematic approach is valuable.

What specific aspect of this decision would you like to explore further?`;
    }

    // Career/mentor related fallbacks
    if (messageLower.includes('career') || messageLower.includes('job') || messageLower.includes('mentor')) {
      return `Great question about your career! Here's what I'd suggest:

**For Career Growth:**
- Focus on building skills that are in high demand
- Network authentically with people in your target field
- Seek feedback regularly and act on it
- Document your achievements and impact

**For Mentorship:**
- Be specific about what you want to learn
- Come prepared with thoughtful questions
- Follow up and show appreciation
- Apply what you learn and share your progress

What specific career challenge are you facing right now?`;
    }

    // General helpful fallback
    return `I'm here to help you think through this systematically. While I'm having some technical difficulties right now, I can still offer some guidance:

**Key Questions to Consider:**
- What's the core issue you're trying to resolve?
- What information do you need to make a good decision?
- What are your main constraints or limitations?
- What would success look like?

Feel free to share more details, and I'll do my best to provide helpful insights!`;
  }

  // Decision Framework AI Assistant
  generateDecisionInsights = async (decisionData: any, conversationId: string = 'decision'): Promise<string> => {
    const messages = [{
      role: 'user',
      content: `I'm working on a decision: "${decisionData.title}". 
      
      Description: ${decisionData.description}
      Options: ${decisionData.options?.map((o: any) => o.name).join(', ') || 'None yet'}
      Criteria: ${decisionData.criteria?.map((c: any) => c.name).join(', ') || 'None yet'}
      
      Can you help me analyze this decision and provide insights?`
    }];

    const systemPrompt = `You are an expert decision-making coach. Help users make better decisions by:
    1. Asking clarifying questions
    2. Suggesting additional criteria or options they might have missed
    3. Providing frameworks for analysis
    4. Offering objective insights
    5. Helping them think through potential consequences
    
    Be conversational, helpful, and ask follow-up questions to better understand their situation.`;

    return this.callAI(messages, systemPrompt, conversationId);
  }

  // Mentor Chat AI
  generateMentorResponse = async (userMessage: string, mentorContext: any, conversationId: string): Promise<string> => {
    const messages = [{
      role: 'user',
      content: userMessage
    }];

    const systemPrompt = `You are ${mentorContext.name}, a ${mentorContext.title} at ${mentorContext.company}. 

    Your background:
    - ${mentorContext.experience} years of experience
    - Expertise in: ${mentorContext.expertise?.join(', ')}
    - Specializations: ${mentorContext.specializations?.join(', ')}
    - Bio: ${mentorContext.bio}

    Respond as this mentor would - be helpful, professional, and draw from your expertise. Share specific advice, ask clarifying questions, and provide actionable guidance. Keep responses conversational and engaging, like a real mentorship conversation.

    If asked about scheduling or booking, mention that this is a simulation and they should use the "Connect" button to reach out on the actual platform.`;

    return this.callAI(messages, systemPrompt, conversationId);
  }

  // General Chat AI
  generateChatResponse = async (message: string, context?: any, conversationId: string = 'general'): Promise<string> => {
    const messages = [{
      role: 'user',
      content: message
    }];

    const systemPrompt = `You are a helpful AI assistant for DeepThink, a platform focused on decision-making, career planning, and personal development. 

    Your role is to:
    - Help users with decision-making frameworks and processes
    - Provide career and life guidance
    - Assist with goal setting and planning
    - Offer insights on values alignment and personal growth
    - Be encouraging and supportive while being practical

    Keep responses helpful, conversational, and actionable. Ask follow-up questions when appropriate to better understand the user's needs.`;

    return this.callAI(messages, systemPrompt, conversationId);
  }

  // File Analysis AI
  analyzeUploadedFile = async (fileContent: string, fileType: string, context?: any): Promise<string> => {
    const messages = [{
      role: 'user',
      content: `Please analyze this ${fileType} file content and provide insights for decision-making:

      ${fileContent}

      Context: ${context?.decisionTitle || 'General decision analysis'}`
    }];

    const systemPrompt = `You are an expert at analyzing documents, images, and audio content to extract decision-relevant insights. 

    For each file, provide:
    1. Key information extracted
    2. How it relates to the decision at hand
    3. Potential implications or considerations
    4. Recommendations for next steps

    Be specific and actionable in your analysis.`;

    return this.callAI(messages, systemPrompt);
  }

  // Clear conversation history
  clearConversation = (conversationId: string) => {
    this.conversationHistory.delete(conversationId);
  }

  // Get conversation history
  getConversationHistory = (conversationId: string) => {
    return this.conversationHistory.get(conversationId) || [];
  }
}

export const aiService = new EnhancedAIService();
export default aiService;