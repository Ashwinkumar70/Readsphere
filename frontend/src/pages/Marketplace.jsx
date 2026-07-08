import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Grid, List, Star, SlidersHorizontal, X, ChevronDown
} from 'lucide-react';
import BookCard from '../components/cards/BookCard.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/slices/bookSlice.js';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

const sortOptions = ['Trending', 'Newest', 'Top Rated', 'Price: Low to High', 'Price: High to Low', 'Most Reviews'];

export default function Marketplace() {
  const dispatch = useDispatch();
  const { books, loading } = useSelector(state => state.books);

  useEffect(() => {
    if (books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books.length]);

  const [query, setQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sort, setSort] = useState('Trending');
  const [view, setView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Compute dynamic genres from the live books data
  const dynamicGenres = Object.values(books.reduce((acc, book) => {
    const genre = book.genre || 'Unknown';
    if (!acc[genre]) {
      acc[genre] = { id: genre, name: genre, count: 0 };
    }
    acc[genre].count += 1;
    return acc;
  }, {}));

  const toggleGenre = (g) => {
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  };

  const filtered = books.filter(b => {
    const authorName = b.author?.users?.name || '';
    const matchQ = !query || b.title.toLowerCase().includes(query.toLowerCase()) || authorName.toLowerCase().includes(query.toLowerCase());
    const matchG = selectedGenres.length === 0 || selectedGenres.includes(b.genre);
    return matchQ && matchG;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted animate-pulse">Loading marketplace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Page Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Marketplace</h1>
          <p className="text-muted">Discover your next great read from 50,000+ books</p>
        </motion.div>

        {/* Search + Controls Bar */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search books, authors, genres..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-border bg-white text-sm font-medium text-text outline-none focus:border-primary cursor-pointer"
            >
              {sortOptions.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters ? 'primary' : 'white'}
            icon={SlidersHorizontal}
            size="md"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
            {selectedGenres.length > 0 && (
              <span className="ml-1 w-5 h-5 bg-white/30 rounded-full text-xs flex items-center justify-center font-bold">
                {selectedGenres.length}
              </span>
            )}
          </Button>

          {/* View Toggle */}
          <div className="flex border border-border rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setView('grid')}
              className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-primary text-white' : 'text-muted hover:bg-gray-50'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2.5 transition-colors ${view === 'list' ? 'bg-primary text-white' : 'text-muted hover:bg-gray-50'}`}
            >
              <List size={16} />
            </button>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-border rounded-2xl p-5 mb-6 shadow-soft">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Genres */}
                  <div>
                    <p className="text-sm font-bold text-text mb-3">Genre</p>
                    <div className="flex flex-wrap gap-2">
                      {dynamicGenres.map(g => (
                        <button
                          key={g.id}
                          onClick={() => toggleGenre(g.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            selectedGenres.includes(g.name)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-muted border-border hover:border-primary/40 hover:text-text'
                          }`}
                        >
                          {g.name} <span className="opacity-60">({g.count})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <p className="text-sm font-bold text-text mb-3">Minimum Rating</p>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5, 3.0].map(r => (
                        <label key={r} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="rating" className="accent-primary" />
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={12} className={s <= r ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />
                            ))}
                            <span className="text-xs text-muted ml-1">{r}+</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <p className="text-sm font-bold text-text mb-3">Availability</p>
                    <div className="space-y-2">
                      {['All Books', 'Free Books', 'Premium Only', 'Bestsellers', 'Trending'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-muted hover:text-text">
                          <input type="radio" name="avail" className="accent-primary" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => { setSelectedGenres([]); }}
                    className="text-sm text-muted hover:text-red-500 font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                  <Button size="sm" onClick={() => setShowFilters(false)}>Apply Filters</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Genre Quick Pills */}
        <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <button
            onClick={() => setSelectedGenres([])}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              selectedGenres.length === 0 ? 'bg-primary text-white border-primary' : 'bg-white text-muted border-border hover:border-primary/40'
            }`}
          >
            All
          </button>
          {dynamicGenres.map(g => (
            <button
              key={g.id}
              onClick={() => toggleGenre(g.name)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                selectedGenres.includes(g.name) ? 'bg-primary text-white border-primary' : 'bg-white text-muted border-border hover:border-primary/40'
              }`}
            >
              {g.name}
            </button>
          ))}
        </motion.div>

        {/* Results Count */}
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted">
            Showing <span className="font-bold text-text">{filtered.length}</span> books
            {selectedGenres.length > 0 && (
              <span> in <span className="text-primary font-semibold">{selectedGenres.join(', ')}</span></span>
            )}
          </p>
          {selectedGenres.length > 0 && (
            <button onClick={() => setSelectedGenres([])} className="text-xs text-red-500 font-semibold hover:underline flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          )}
        </motion.div>

        {/* Book Grid */}
        <AnimatePresence mode="wait">
          {view === 'grid' ? (
            <motion.div
              key="grid"
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
            >
              {filtered.map(book => (
                <motion.div key={book.id} variants={fadeUp}>
                  <BookCard book={book} size="md" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="list" variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {filtered.map(book => (
                <motion.div
                  key={book.id}
                  variants={fadeUp}
                  whileHover={{ x: 2 }}
                  className="bg-white rounded-2xl border border-border p-4 shadow-soft flex gap-4 group"
                >
                  <Link to={`/books/${book.id}`}>
                    <img src={book.cover} alt={book.title} className="w-16 h-22 object-cover rounded-xl book-cover shrink-0" style={{ height: 88 }} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link to={`/books/${book.id}`}>
                          <h3 className="font-bold text-text group-hover:text-primary transition-colors">{book.title}</h3>
                        </Link>
                        <p className="text-sm text-muted">{book.author}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary text-lg">₹{book.price}</p>
                        <div className="flex items-center gap-1 justify-end">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold">{book.rating}</span>
                          <span className="text-xs text-muted">({book.reviews.toLocaleString()})</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted/80 mt-2 line-clamp-2">{book.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge color="muted" size="xs">{book.genre}</Badge>
                      {book.isBestseller && <Badge color="warning" size="xs">Bestseller</Badge>}
                      {book.isPremium && <Badge color="premium" size="xs">Premium</Badge>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link to={`/books/${book.id}`}>
                      <Button size="sm">Buy Now</Button>
                    </Link>
                    <Link to={`/reader/${book.id}`}>
                      <Button size="sm" variant="outline">Preview</Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div variants={fadeUp} className="text-center py-20">
            <Search size={48} className="text-border mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text mb-2">No books found</h3>
            <p className="text-muted mb-5">Try adjusting your search or filters</p>
            <Button onClick={() => { setQuery(''); setSelectedGenres([]); }}>Clear Search</Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
