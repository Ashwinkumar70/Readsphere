import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  Star, Heart, BookOpen, ShoppingCart, Sparkles,
  MessageSquare, ChevronRight, Check
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookById, clearCurrentBook } from '../store/slices/bookSlice.js';
import api from '../lib/apiService.js';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import BookCard from '../components/cards/BookCard.jsx';
import ReviewCard from '../components/cards/ReviewCard.jsx';
import toast from 'react-hot-toast';



export default function BookDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBook: book, loading, error } = useSelector((state) => state.books);
  
  const [liked, setLiked] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [similarBooks, setSimilarBooks] = useState([]);

  useEffect(() => {
    dispatch(fetchBookById(id));
    return () => {
      dispatch(clearCurrentBook());
    };
  }, [dispatch, id]);

  useEffect(() => {
    // Fetch similar books simply from API
    if (book) {
      api.get(`/books?category=${book.category}`).then(res => {
        setSimilarBooks(res.data.filter(b => b.id !== book.id).slice(0, 5));
      }).catch(err => console.error("Error fetching similar books", err));
    }
  }, [book]);

  if (loading || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted animate-pulse">Loading book details...</p>
      </div>
    );
  }

  const authorData = book.author || { bio: '', users: { name: 'Unknown Author', avatar_url: '' } };
  const authorName = authorData.users?.name || 'Unknown Author';
  const authorAvatar = authorData.users?.avatar_url || '';
  const authorBio = authorData.bio || 'No biography available.';
  const bookReviews = book.reviews || [];
  const bookTags = Array.isArray(book.tags) ? book.tags : (book.tags ? JSON.parse(book.tags) : []);

  const handleCart = () => {
    setInCart(true);
    toast.success('Added to cart!');
  };

  return (
    <div className="bg-background min-h-screen">
      {/* ====== HERO SECTION ====== */}
      <section className="bg-white border-b border-border pb-12 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link to="/marketplace" className="hover:text-primary">Marketplace</Link>
            <ChevronRight size={14} />
            <span className="hover:text-primary cursor-pointer">{book.genre}</span>
            <ChevronRight size={14} />
            <span className="text-text font-medium truncate">{book.title}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
            {/* Left: Cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full md:w-72 lg:w-80 shrink-0"
            >
              <div className="relative group">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full rounded-2xl book-cover"
                />
                <button
                  onClick={() => setLiked(!liked)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
                >
                  <Heart size={20} className={liked ? 'fill-red-500 text-red-500' : 'text-muted'} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Link to={`/reader/${book.id}`}>
                  <Button full size="xl" icon={BookOpen}>Read Preview</Button>
                </Link>
                <Button
                  full size="lg"
                  variant={inCart ? 'success' : 'outline'}
                  icon={inCart ? Check : ShoppingCart}
                  onClick={handleCart}
                >
                  {inCart ? 'In Cart' : `Buy for ₹${book.price}`}
                </Button>
              </div>
            </motion.div>

            {/* Right: Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge color="muted">{book.category || 'General'}</Badge>
                {book.is_free && <Badge color="success">Free</Badge>}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-text mb-2 leading-tight">
                {book.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <Link to={`/authors/${book.author_id}`} className="flex items-center gap-2 group">
                  <Avatar src={authorAvatar} name={authorName} size="sm" />
                  <span className="font-bold text-text group-hover:text-primary transition-colors">{authorName}</span>
                </Link>
                <span className="text-border">|</span>
                <div className="flex items-center gap-1 cursor-pointer group">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={16} className={i <= Math.floor(book.rating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
                    ))}
                  </div>
                  <span className="font-bold ml-1">{book.rating || 'New'}</span>
                  <span className="text-muted group-hover:text-primary transition-colors">({bookReviews.length} reviews)</span>
                </div>
              </div>

              {/* AI Summary Box */}
              <div className="bg-gradient-to-r from-primary-50/50 to-secondary-50/50 border border-primary-100 rounded-2xl p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={100} />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <span className="font-bold text-primary text-sm">AI Summary</span>
                  </div>
                  <p className="text-text/80 leading-relaxed font-medium">
                    {book.excerpt}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-text mb-2">Synopsis</h3>
                  <p className="text-muted leading-relaxed">{book.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-border">
                  <div>
                    <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Pages</p>
                    <p className="font-bold text-text">{book.pages || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Language</p>
                    <p className="font-bold text-text">{book.language || 'English'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Publisher</p>
                    <p className="font-bold text-text truncate" title={book.publisher}>{book.publisher || 'Independent'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Published</p>
                    <p className="font-bold text-text">{book.published_date ? new Date(book.published_date).getFullYear() : 'Unknown'}</p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-bold text-text mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {bookTags.map(t => (
                      <Badge key={t} color="muted" size="md" className="bg-gray-50">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== REVIEWS & AUTHOR ====== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Reviews */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">Community Reviews</h2>
              <Button variant="outline" size="sm" icon={MessageSquare}>Write Review</Button>
            </div>

            <div className="space-y-4">
              {bookReviews.length > 0 ? bookReviews.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <ReviewCard review={r} />
                </motion.div>
              )) : (
                <p className="text-muted">No reviews yet for this book.</p>
              )}
            </div>
          </div>

          {/* About Author */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-soft">
              <h2 className="text-lg font-bold text-text mb-4">About the Author</h2>
              <div className="flex items-center gap-4 mb-4">
                <Avatar src={authorAvatar} name={authorName} size="xl" ring />
                <div>
                  <h3 className="font-bold text-text text-lg">{authorName}</h3>
                  <p className="text-sm text-muted">Author</p>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-5">{authorBio}</p>
              <Button full variant="outline" size="sm">Follow Author</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ====== SIMILAR BOOKS ====== */}
      <section className="py-12 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-text">Readers also enjoyed</h2>
            <Button variant="ghost" size="sm" icon={ChevronRight} iconRight>View all</Button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {similarBooks.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <BookCard book={b} size="md" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
