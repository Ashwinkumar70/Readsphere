
import { useParams, Link } from 'react-router-dom';
import {
  Hash, ChevronLeft, Search, Users, Settings, Hash as HashIcon,
  MessageSquare, PlusCircle, Smile, Paperclip, Send
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClubs, fetchClubMessages, postClubMessage } from '../store/slices/clubSlice.js';
import Avatar from '../components/ui/Avatar.jsx';

export default function ClubDiscussion() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { clubs, currentClubMessages: messages, loading } = useSelector(state => state.clubs);
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    if (clubs.length === 0) {
      dispatch(fetchClubs());
    }
    dispatch(fetchClubMessages(id));
  }, [dispatch, id, clubs.length]);

  const club = clubs.find(c => c.id === parseInt(id));

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(postClubMessage({ clubId: id, content: input }));
    setInput('');
  };

  if (!club) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <p className="text-muted animate-pulse">Loading club details...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Channels Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-border flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-border">
          <Link to={`/clubs/${club.id}`} className="flex items-center gap-2 text-sm font-bold text-text hover:text-primary transition-colors">
            <ChevronLeft size={16} />
            <span className="truncate">{club.name}</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 px-2">Book Discussions</p>
            <div className="space-y-0.5">
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-200 text-text font-medium text-sm">
                <Hash size={16} className="text-muted" /> general
              </button>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-200 text-muted hover:text-text font-medium text-sm transition-colors">
                <Hash size={16} /> spoilers-ch1-to-10
              </button>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-200 text-muted hover:text-text font-medium text-sm transition-colors">
                <Hash size={16} /> theories-and-predictions
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 px-2">Community</p>
            <div className="space-y-0.5">
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-200 text-muted hover:text-text font-medium text-sm transition-colors">
                <Hash size={16} /> introductions
              </button>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-200 text-muted hover:text-text font-medium text-sm transition-colors">
                <Hash size={16} /> off-topic
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Chat Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <HashIcon size={20} className="text-muted md:hidden" />
            <h2 className="font-bold text-text flex items-center gap-2">
              <HashIcon size={20} className="text-muted hidden md:block" /> general
            </h2>
            <span className="text-muted text-sm border-l border-border pl-2 ml-2 hidden sm:block">
              Main discussion for Project Hail Mary
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Search size={18} className="text-muted cursor-pointer hover:text-text transition-colors" />
            <Users size={18} className="text-muted cursor-pointer hover:text-text transition-colors" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="pb-8 border-b border-border mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <HashIcon size={32} className="text-muted" />
            </div>
            <h1 className="text-2xl font-bold text-text mb-1">Welcome to #general!</h1>
            <p className="text-muted text-sm">This is the start of the #general channel in {club.name}.</p>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className="group relative flex gap-3 hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors">
              <Avatar src={msg.sender?.avatar_url} name={msg.sender?.name || 'Unknown'} size="md" className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-text">{msg.sender?.name || 'Unknown'}</span>
                  {msg.role === 'Admin' && <span className="text-[10px] uppercase font-bold bg-primary-100 text-primary px-1.5 py-0.5 rounded">Admin</span>}
                  {msg.role === 'Moderator' && <span className="text-[10px] uppercase font-bold bg-green-100 text-green-600 px-1.5 py-0.5 rounded">Mod</span>}
                  <span className="text-xs text-muted font-medium">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-text/90 leading-relaxed text-[15px] whitespace-pre-wrap">{msg.content}</p>

                {/* Replies preview */}
                {msg.replies && msg.replies.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex -space-x-1">
                      {msg.replies.map((r, i) => <Avatar key={i} src={r.avatar} size="xs" ring />)}
                    </div>
                    <button className="text-xs font-semibold text-primary hover:underline">
                      {msg.replies.length} {msg.replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                    <span className="text-xs text-muted">Last reply at {msg.replies[msg.replies.length-1].time}</span>
                  </div>
                )}
              </div>

              {/* Message Actions (Hover) */}
              <div className="absolute right-4 top-[-12px] bg-white border border-border shadow-sm rounded-lg flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-muted hover:text-text hover:bg-gray-50 rounded-l-lg transition-colors"><Smile size={16} /></button>
                <div className="w-px h-4 bg-border" />
                <button className="p-1.5 text-muted hover:text-text hover:bg-gray-50 transition-colors"><MessageSquare size={16} /></button>
                <div className="w-px h-4 bg-border" />
                <button className="p-1.5 text-muted hover:text-text hover:bg-gray-50 rounded-r-lg transition-colors"><Settings size={16} /></button>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 shrink-0">
          <div className="bg-gray-100 rounded-xl flex items-end border border-transparent focus-within:border-primary/50 focus-within:bg-white focus-within:shadow-sm transition-all overflow-hidden">
            <button className="p-3 text-muted hover:text-text shrink-0">
              <PlusCircle size={20} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Message #general`}
              className="flex-1 max-h-32 min-h-[44px] py-3 bg-transparent outline-none resize-none text-[15px] text-text placeholder:text-muted"
              rows={1}
            />
            <div className="flex items-center gap-1 p-2 shrink-0">
              <button className="p-2 text-muted hover:text-text rounded-lg hover:bg-gray-200 transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="p-2 text-muted hover:text-text rounded-lg hover:bg-gray-200 transition-colors">
                <Smile size={18} />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-2 rounded-lg transition-colors ${
                  input.trim() ? 'bg-primary text-white' : 'text-muted hover:bg-gray-200'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
