import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ShieldCheck, Truck, RotateCcw, ChevronRight, Sparkles, BookOpen, Star, Compass
} from 'lucide-react';
import BookCard from '../components/cards/BookCard.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/slices/bookSlice.js';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

// Service Cards data
const services = [
  { icon: ShieldCheck, title: 'Secure Payments', desc: '100% secure checkout via Stripe' },
  { icon: Truck, title: 'Instant Access', desc: 'Read digitally or track shipping' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day money back guarantee' },
];

export default function Marketplace() {
  const dispatch = useDispatch();
  const { books, loading } = useSelector(state => state.books);

  useEffect(() => {
    if (books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books.length]);

  const [activeCategory, setActiveCategory] = useState('All');

  // Compute dynamic genres
  const dynamicGenres = Object.keys(books.reduce((acc, book) => {
    const genre = book.genre || 'Unknown';
    acc[genre] = true;
    return acc;
  }, {})).sort();

  // Data subsets for sections
  const recommended = books.slice(0, 10);
  const bestSellers = books.filter(b => b.isBestseller || b.is_bestseller).slice(0, 10);
  const trending = books.filter(b => b.isTrending || b.is_trending).slice(0, 10);
  const newReleases = [...books].reverse().slice(0, 10);

  // If a category is selected, we filter the whole view (simplified for this demo)
  const isFiltering = activeCategory !== 'All';
  const filteredBooks = isFiltering ? books.filter(b => b.genre === activeCategory) : [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-12">
        
        {/* 1. Hero Banner */}
        <motion.div variants={fadeUp} className="bg-gradient-primary rounded-[32px] p-8 md:p-12 text-white shadow-soft-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <Badge color="premium" className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-md">
              <Sparkles size={12} className="mr-1" /> Curated Collection
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 tracking-tight leading-tight">
              Find Your Next <br /> Great Read.
            </h1>
            <p className="text-white/80 font-light text-lg md:text-xl mb-8 max-w-lg">
              Explore thousands of digital and physical books curated specifically for you with AI-powered recommendations.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-50 border-none shadow-lg">
                Explore Now
              </Button>
              <Button size="lg" variant="ghost" className="border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                View Best Sellers
              </Button>
            </div>
          </div>

          <div className="relative z-10 hidden md:block w-full max-w-sm">
            {/* Abstract stack of books illustration via CSS */}
            <div className="relative w-64 h-80 mx-auto">
              <div className="absolute top-10 left-10 w-48 h-64 bg-white/10 backdrop-blur-md rounded-2xl rotate-6 border border-white/20 shadow-2xl" />
              <div className="absolute top-5 left-5 w-48 h-64 bg-white/20 backdrop-blur-md rounded-2xl rotate-3 border border-white/30 shadow-2xl" />
              <div className="absolute top-0 left-0 w-48 h-64 bg-white rounded-2xl border border-white/40 shadow-2xl flex items-center justify-center p-4">
                 <div className="w-full h-full border-2 border-dashed border-primary/20 rounded-xl flex items-center justify-center text-primary/30">
                    <BookOpen size={48} />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Category Filters */}
        <motion.div variants={fadeUp}>
          <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x">
            <button
              onClick={() => setActiveCategory('All')}
              className={`snap-start shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === 'All' 
                  ? 'bg-primary text-white shadow-soft' 
                  : 'bg-white text-muted border border-border hover:border-primary/40 hover:text-text'
              }`}
            >
              All Books
            </button>
            {dynamicGenres.map(g => (
              <button
                key={g}
                onClick={() => setActiveCategory(g)}
                className={`snap-start shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === g 
                    ? 'bg-primary text-white shadow-soft' 
                    : 'bg-white text-muted border border-border hover:border-primary/40 hover:text-text'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 3. Book Sections */}
        {isFiltering ? (
          <motion.div variants={fadeUp} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-text">Results for {activeCategory}</h2>
              <span className="text-sm text-muted">{filteredBooks.length} books found</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredBooks.map(book => <BookCard key={book.id} book={book} size="lg" />)}
            </div>
            {filteredBooks.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-sm">
                <Compass size={48} className="text-border mx-auto mb-4" />
                <h3 className="text-xl font-bold text-text mb-2">No books found</h3>
                <p className="text-muted mb-5">We couldn't find any books in this category.</p>
                <Button onClick={() => setActiveCategory('All')}>Clear Filter</Button>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="space-y-16">
            {/* Recommended Section */}
            <Section title="Recommended For You" books={recommended} />
            
            {/* Best Sellers Section */}
            <Section title="Best Sellers" books={bestSellers} />
            
            {/* Trending Section */}
            <Section title="Trending Books" books={trending} />
            
            {/* New Releases Section */}
            <Section title="New Releases" books={newReleases} />
          </div>
        )}

        {/* 4. Marketplace Services Footer */}
        <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-6 pt-10 border-t border-border">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white rounded-[24px] p-6 border border-border flex items-start gap-4 hover:border-primary/20 hover:shadow-soft transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <service.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-text mb-1">{service.title}</h3>
                <p className="text-sm text-muted">{service.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
}

// Helper component for horizontal sections
function Section({ title, books }) {
  if (!books || books.length === 0) return null;
  
  return (
    <motion.section variants={fadeUp} className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-heading font-bold text-text flex items-center gap-2">
          {title}
        </h2>
        <button className="text-sm font-semibold text-primary hover:text-primary-600 flex items-center gap-1 group transition-colors">
          View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 custom-scrollbar snap-x px-1">
        {books.map(book => (
          <div key={book.id} className="snap-start shrink-0">
            <BookCard book={book} size="lg" />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
