import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateAIContent, clearActiveResponse } from '../../store/slices/aiSlice';
import Badge from './Badge';
import Button from './Button';
import { Sparkles, Zap, X, Loader2 } from 'lucide-react';

export default function AIWorkspaceWidget() {
  const dispatch = useDispatch();
  const { activeResponse, activeConversationId, loading, error, usageCounter } = useSelector(state => state.ai);
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // chat, summarize, translate, seo, etc.

  const readerTabs = ['summarize', 'translate', 'quiz', 'flashcards', 'explain'];
  const authorTabs = ['seo', 'marketing'];
  const allTabs = ['chat', ...readerTabs, ...authorTabs];

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    dispatch(generateAIContent({ 
      endpoint: activeTab, 
      prompt, 
      model: 'gemini-2.5-flash',
      conversationId: activeConversationId
    }));
  };

  return (
    <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col h-[500px]">
      <div className="absolute -top-10 -right-10 opacity-10">
        <Zap size={200} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Sparkles size={24} /> AI Workspace
            </h3>
            <p className="text-primary-100 text-sm">
              Tokens used this session: {usageCounter}
            </p>
          </div>
          {activeResponse && (
            <button onClick={() => dispatch(clearActiveResponse())} className="text-white/60 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {allTabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab ? 'bg-white text-primary-900' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Output Area */}
        <div className="flex-1 bg-black/20 rounded-xl p-4 mb-4 overflow-y-auto text-sm border border-white/10">
          {loading ? (
            <div className="flex items-center justify-center h-full text-white/70">
              <Loader2 className="animate-spin mr-2" size={20} /> Generating...
            </div>
          ) : error ? (
            <div className="text-red-300">{error}</div>
          ) : activeResponse ? (
            <div className="whitespace-pre-wrap">{activeResponse.content}</div>
          ) : (
            <div className="flex items-center justify-center h-full text-white/50 text-center italic">
              Select an action and enter a prompt to begin.
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleGenerate} className="flex gap-2">
          <input 
            type="text" 
            placeholder={`Enter text to ${activeTab}...`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <Button type="submit" variant="white" disabled={loading || !prompt.trim()}>
            Go
          </Button>
        </form>
      </div>
    </div>
  );
}
