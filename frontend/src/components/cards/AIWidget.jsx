import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, BookOpen, Headphones, Zap } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../ui/Button.jsx';
import { sendChatMessage, sendQuickAction, addUserMessage } from '../../store/slices/aiSlice.js';

const quickActions = [
  { id: 'explain', icon: Zap, label: 'Explain This Page', color: 'text-amber-500 bg-amber-50' },
  { id: 'summarize', icon: BookOpen, label: 'Summarize Chapter', color: 'text-blue-500 bg-blue-50' },
  { id: 'story', icon: Sparkles, label: 'Story So Far', color: 'text-purple-500 bg-purple-50' },
  { id: 'listen', icon: Headphones, label: 'Listen Explanation', color: 'text-green-500 bg-green-50' },
];

export default function AIWidget({ compact = false, onAction }) {
  const [question, setQuestion] = useState('');
  const dispatch = useDispatch();
  const { messages, loading } = useSelector(state => state.ai);
  const { currentBook } = useSelector(state => state.books);

  const handleSend = () => {
    if (!question.trim()) return;
    dispatch(addUserMessage({ message: question }));
    dispatch(sendChatMessage({ message: question, bookId: currentBook?.id }));
    setQuestion('');
  };

  const handleAction = (action) => {
    onAction?.(action.id);
    dispatch(addUserMessage({ message: `Trigger action: ${action.label}` }));
    dispatch(sendQuickAction({ actionId: action.id, bookId: currentBook?.id }));
  };

  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {}}
        className="ai-float-btn w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-glow"
      >
        <Sparkles size={22} />
      </motion.button>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Sparkles size={15} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text">AI Assistant</h3>
          <p className="text-xs text-muted">Powered by ReadSphere AI</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-border">
        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Quick Actions</p>
        <div className="grid grid-cols-2 gap-1.5">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              className="flex items-center gap-2 p-2 rounded-xl border border-border hover:border-primary/30 hover:bg-primary-50 transition-all text-left group"
            >
              <div className={`p-1.5 rounded-lg ${action.color}`}>
                <action.icon size={12} />
              </div>
              <span className="text-xs font-medium text-text line-clamp-1 group-hover:text-primary">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-primary text-white rounded-br-sm'
                : 'bg-gray-100 text-text rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed bg-gray-100 text-text rounded-bl-sm">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about this book..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
          />
          <Button size="sm" onClick={handleSend}>
            <MessageSquare size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}
