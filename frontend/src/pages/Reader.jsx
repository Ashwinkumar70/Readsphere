import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, Search,
  List, Sparkles, Settings
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookById, clearCurrentBook } from '../store/slices/bookSlice.js';
import { fetchPreferences, updatePreferences, fetchBookFileUrl } from '../store/slices/readerSlice.js';
import AIWidget from '../components/cards/AIWidget.jsx';

export default function Reader() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBook: book, loading: bookLoading } = useSelector(state => state.books);
  const { preferences, fileUrl, loading: readerLoading } = useSelector(state => state.reader);

  useEffect(() => {
    dispatch(fetchBookById(id));
    dispatch(fetchPreferences());
    dispatch(fetchBookFileUrl(id));
    return () => dispatch(clearCurrentBook());
  }, [dispatch, id]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Use DB preferences with fallbacks
  const theme = preferences?.theme || 'light'; 
  const fontSize = preferences?.font_size || 18;
  const fontFamily = preferences?.font_family || 'Georgia, serif';
  const lineHeight = preferences?.line_height || 1.5;

  const textClass =
    theme === 'dark' ? 'bg-[#121212] text-[#E0E0E0]' :
    theme === 'sepia' ? 'bg-[#F4ECD8] text-[#5B4636]' :
    'bg-white text-[#1E293B]';

  const textBlock = `
    Nora Seed sat on a low wall beside the crumbling church...
    [NOTE: Actual EPUB/PDF rendering requires react-reader/react-pdf libraries which failed to install due to local SSL errors. The file URL is: ${fileUrl}]
  `;

  if (bookLoading || readerLoading || !book) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted animate-pulse">Loading reader...</p>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${textClass}`} style={{ fontFamily }}>
      {/* Top Navbar */}
      <header className={`h-14 shrink-0 flex items-center justify-between px-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
        <div className="flex items-center gap-4">
          <Link to={`/books/${book.id}`} className="p-2 -ml-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs">{book.title}</h1>
            <p className="text-xs opacity-60">Chapter 1</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10" title="Search (Ctrl+F)">
            <Search size={18} />
          </button>
          <button className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10" title="Table of Contents">
            <List size={18} />
          </button>
          <button className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10" title="Display Settings">
            <Settings size={18} />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl flex items-center gap-2 transition-colors ${sidebarOpen ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
          >
            <Sparkles size={18} />
            <span className="text-sm font-bold hidden sm:block">AI Assistant</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Reader container */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth scrollbar-hide">
          <div className="max-w-2xl mx-auto px-6 py-12 pb-32">
            <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: 'Georgia, serif' }}>Chapter 1</h2>
            <div
              className="reader-page space-y-6 text-justify"
              style={{ fontSize: `${fontSize}px` }}
            >
              {textBlock.split('\n\n').map((para, i) => (
                <p key={i} className="group relative">
                  {para.trim()}
                  {/* Inline AI Quick Action Hint */}
                  <span className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1 rounded-md bg-primary-50 text-primary shadow-sm border border-primary-100 hover:bg-primary hover:text-white"
                      title="Explain with AI"
                    >
                      <Sparkles size={14} />
                    </button>
                  </span>
                </p>
              ))}
            </div>

            {/* Footer Navigation */}
            <div className="mt-16 pt-8 flex items-center justify-between border-t border-current/10">
              <button className="text-sm font-medium opacity-50 cursor-not-allowed">
                ← Previous Chapter
              </button>
              <button className="text-sm font-medium hover:text-primary transition-colors">
                Next Chapter →
              </button>
            </div>
          </div>
        </div>

        {/* AI Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="shrink-0 border-l border-border bg-white"
            >
              <AIWidget />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Progress Bar */}
      <div className={`h-10 shrink-0 border-t flex items-center px-6 ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
        <div className="flex-1 flex items-center gap-4">
          <span className="text-xs font-medium opacity-60 w-10 text-right">67%</span>
          <div className="flex-1 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '67%' }} />
          </div>
          <span className="text-xs font-medium opacity-60 w-16">Page 142</span>
        </div>
      </div>
    </div>
  );
}
