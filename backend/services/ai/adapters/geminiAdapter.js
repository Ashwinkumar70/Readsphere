import { GoogleGenAI } from '@google/genai';

export class GeminiAdapter {
  constructor() {
    this.provider = 'gemini';
    // The key is safely injected via environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  async generateContent(prompt, model = process.env.AI_MODEL || 'gemini-2.5-flash', role = 'User') {
    const startTime = Date.now();
    try {
      if (!this.ai) {
        throw new Error('GEMINI_API_KEY is missing or invalid.');
      }

      // Execute live Gemini API call
      const response = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
          maxOutputTokens: parseInt(process.env.AI_MAX_TOKENS || '4096', 10),
        }
      });

      const latency = Date.now() - startTime;
      
      return {
        provider: this.provider,
        model,
        content: response.text,
        tokens: response.usageMetadata?.totalTokenCount || 0,
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        responseTokens: response.usageMetadata?.candidatesTokenCount || 0,
        latency,
        success: true
      };
    } catch (error) {
      return {
        provider: this.provider,
        model,
        content: null,
        tokens: 0,
        promptTokens: 0,
        responseTokens: 0,
        latency: Date.now() - startTime,
        success: false,
        error: error.message || 'Failed to connect to Google Gemini API'
      };
    }
  }
}
