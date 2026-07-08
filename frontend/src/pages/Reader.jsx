import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, Search,
  List, Sparkles, Settings
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookById, clearCurrentBook } from '../store/slices/bookSlice.js';
import AIWidget from '../components/cards/AIWidget.jsx';

export default function Reader() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBook: book, loading } = useSelector(state => state.books);

  useEffect(() => {
    dispatch(fetchBookById(id));
    return () => dispatch(clearCurrentBook());
  }, [dispatch, id]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = 'light'; // light, sepia, dark
  const fontSize = 18;

  const textClass =
    theme === 'dark' ? 'bg-[#121212] text-[#E0E0E0]' :
    theme === 'sepia' ? 'bg-[#F4ECD8] text-[#5B4636]' :
    'bg-white text-[#1E293B]';

  const textBlock = `
    Nora Seed sat on a low wall beside the crumbling church. She looked at the digital display of her watch. 23:22.
    \n\n
    The air was cold, and her breath plumed out in front of her like smoke. There was a thin layer of frost on the pavement, glittering under the weak glow of the streetlamp. She had made her decision. It wasn't a sudden impulse, but a slow, creeping realization that had settled in her bones over the past year.
    \n\n
    A cat, a ginger tom missing half its left ear, rubbed against her legs, purring loudly. Nora reached down and stroked its head, feeling a pang of sorrow. "Sorry, Volts," she whispered. "I won't be able to feed you tomorrow."
    \n\n
    She stood up, pulling her coat tighter around her. The library. She remembered Mrs. Elm, the school librarian, telling her once that every life is a book waiting to be read. She hadn't understood it then.
    \n\n
    The fog thickened as she walked toward the river. But then, something strange happened. The fog didn't just obscure the street; it seemed to replace it. The concrete beneath her feet softened. The cold air turned warm and still. The distant hum of traffic vanished, replaced by an absolute, profound silence.
    \n\n
    When the fog cleared, Nora wasn't standing by the river.
    \n\n
    She was standing inside a building. A building that defied all logic. It stretched out in every direction—left, right, up, down—as far as the eye could see. And every inch of it was lined with bookshelves.
    \n\n
    Millions of books. Billions. An infinite number of books. Their spines were all shades of green, from the palest mint to the deepest emerald.
    \n\n
    In the center of the room, behind a sturdy oak desk, sat a woman. She looked exactly as Nora remembered her from nineteen years ago.
    \n\n
    "Mrs. Elm?" Nora croaked, her voice barely a whisper.
    \n\n
    The older woman looked up, adjusting her glasses. "Hello, Nora," she said kindly. "Welcome to the Midnight Library."
  `;

  if (loading || !book) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted animate-pulse">Loading reader...</p>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${textClass}`}>
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
