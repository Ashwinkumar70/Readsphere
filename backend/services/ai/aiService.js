import { GeminiAdapter } from './adapters/geminiAdapter.js';
import { supabase } from '../../config/supabase.js';

class AIService {
  constructor() {
    this.adapter = new GeminiAdapter();
  }

  async generate(userId, prompt, type, model, conversationId = null) {
    if (!prompt || prompt.length > 5000) {
      throw new Error('Prompt exceeds maximum length or is empty.');
    }

    let activeConversationId = conversationId;
    let historyText = "";

    // Load or Create Conversation
    if (activeConversationId) {
      const { data: messages } = await supabase
        .from('ai_messages')
        .select('role, content')
        .eq('conversation_id', activeConversationId)
        .order('created_at', { ascending: true });
      
      if (messages && messages.length > 0) {
        historyText = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
      }
    } else {
      const { data: conv } = await supabase
        .from('ai_conversations')
        .insert([{ user_id: userId, title: prompt.substring(0, 40) + '...' }])
        .select('id').single();
      
      if (conv) activeConversationId = conv.id;
    }

    // Save User Prompt
    if (activeConversationId) {
      await supabase.from('ai_messages').insert([{
        conversation_id: activeConversationId,
        role: 'user',
        content: prompt,
        tokens: Math.floor(prompt.length / 4) // rough estimate before response
      }]);
    }

    // Context-Aware Bounded Prompt
    const boundedPrompt = `You are the ReadSphere AI Assistant. You only answer within the context of books, publishing, and reading. Provide structured, clean responses without markdown formatting unless specifically asked for.

Previous Conversation:
${historyText}

User Request: ${prompt}`;

    // Execute via Provider
    const response = await this.adapter.generateContent(boundedPrompt, model);

    if (response.success && activeConversationId) {
      // Save AI Response
      await supabase.from('ai_messages').insert([{
        conversation_id: activeConversationId,
        role: 'assistant',
        content: response.content,
        tokens: response.responseTokens || Math.floor(response.content.length / 4)
      }]);

      // Log Usage
      await supabase.from('ai_usage_logs').insert([{
        user_id: userId,
        conversation_id: activeConversationId,
        feature: type,
        provider: response.provider,
        model: response.model,
        prompt_tokens: response.promptTokens,
        response_tokens: response.responseTokens,
        tokens_used: response.tokens,
        latency_ms: response.latency,
        status: 'success'
      }]);
      
      response.conversationId = activeConversationId;
    }

    return response;
  }
}

export const aiService = new AIService();
