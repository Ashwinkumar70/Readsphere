import { aiService } from '../services/ai/aiService.js';
import { supabase } from '../config/supabase.js';

export const handleAIGenerate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { prompt, type, model, conversationId } = req.body;

    // Rate Limiting Check
    const { data: usage, error: usageError } = await supabase
      .from('ai_usage_logs')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const isPremium = req.user.subscription === 'premium';
    const limit = isPremium ? Infinity : 30;

    if (!usageError && usage && usage.length >= limit) {
      return res.status(429).json({ error: 'Daily AI limit reached (30 requests/day). Upgrade to premium for unlimited.' });
    }

    // Role Security
    if (role === 'Reader' && ['seo', 'marketing', 'description'].includes(type)) {
      return res.status(403).json({ error: 'Unauthorized AI action for Reader role.' });
    }
    if (role === 'Author' && ['summarize', 'quiz', 'flashcards', 'explain'].includes(type)) {
      return res.status(403).json({ error: 'Unauthorized AI action for Author role.' });
    }

    const response = await aiService.generate(userId, prompt, type, model, conversationId);

    if (!response.success) {
      return res.status(500).json({ error: 'AI generation failed', details: response.error });
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getAIHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};
