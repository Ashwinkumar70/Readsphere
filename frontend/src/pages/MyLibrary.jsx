import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Bookmark } from 'lucide-react';
import BookCard from '../components/cards/BookCard.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardStats, fetchWishlist } from '../store/slices/userSlice.js';
import { useEffect } from 'react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function MyLibrary({ tab = 'reading' }) {
  const [activeTab, setActiveTab] = useState(tab);
  const user = useSelector(state => state.auth.user);
  const { dashboardStats, wishlist, loading } = useSelector(state => state.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && !dashboardStats && !loading) {
      dispatch(fetchDashboardStats());
    }
    if (user && wishlist.length === 0 && !loading) {
      dispatch(fetchWishlist());
    }
  }, [user, dispatch, dashboardStats, wishlist.length, loading]);

  if (!user || loading || !dashboardStats) return (
    <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
      <p className="text-muted animate-pulse">Loading library...</p>
    </div>
  );

  const currentlyReading = dashboardStats.currentlyReading || [];
  const completedBooks = dashboardStats.completedBooks || [];
  const purchasedBooks = dashboardStats.purchasedBooks || [];
  const bookmarkBooks = wishlist?.map(w => w.book) || [];

  const tabs = [
    { id: 'reading', label: 'Reading Now', icon: Clock, books: currentlyReading },
    { id: 'completed', label: 'Completed', icon: CheckCircle, books: completedBooks },
    { id: 'purchased', label: 'Purchased', icon: BookOpen, books: purchasedBooks },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, books: bookmarkBooks },
  ];

  const currentBooks = tabs.find(t => t.id === activeTab)?.books || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">My Library</h1>
          <p className="text-muted">Manage your books, bookmarks, and reading progress.</p>
        </motion.div>

        {/* Custom Tabs */}
        <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto pb-2 border-b border-border mb-8">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-colors shrink-0 ${
                activeTab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-text hover:bg-gray-50'
              }`}
            >
              <t.icon size={16} />
              {t.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === t.id ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                {t.books.length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {currentBooks.length > 0 ? (
              currentBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-muted bg-white rounded-2xl border border-border shadow-soft">
                <p>No books found in this category.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {currentBooks.length === 0 && (
          <motion.div variants={fadeUp} className="text-center py-20 bg-white rounded-2xl border border-border shadow-soft">
            <BookOpen size={48} className="text-border mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text mb-2">No books found</h3>
            <p className="text-muted">You don't have any books in this section yet.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
