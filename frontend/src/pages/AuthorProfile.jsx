import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { UserPlus, MessageSquare, BookOpen, MapPin, Link as LinkIcon, Star } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthorProfile, clearCurrentProfile } from '../store/slices/authorSlice.js';
import Avatar from '../components/ui/Avatar.jsx';
import Button from '../components/ui/Button.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function AuthorProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProfile: authorData, loading } = useSelector(state => state.author);

  useEffect(() => {
    dispatch(fetchAuthorProfile(id));
    return () => dispatch(clearCurrentProfile());
  }, [dispatch, id]);

  if (loading || !authorData) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-muted animate-pulse">Loading author profile...</p>
      </div>
    );
  }

  const authorName = authorData.users?.name || 'Unknown Author';
  const authorAvatar = authorData.users?.avatar_url || '';
  const authorFollowers = authorData.followers || 0;
  const authorBio = authorData.bio || 'No biography available.';
  const authorBooks = authorData.books || [];

  return (
    <div className="bg-background min-h-screen">
      {/* Cover */}
      <div className="h-48 sm:h-64 bg-gradient-to-r from-gray-800 to-gray-900 relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-20 sm:-mt-24 mb-8 sm:mb-12 flex flex-col sm:flex-row gap-6 sm:items-end">
          {/* Avatar */}
          <div className="relative inline-block">
            <Avatar src={authorAvatar} name={authorName} size="3xl" ring className="border-4 border-white shadow-xl" />
            <div className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-primary w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Verified Author">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>

          {/* Info & Actions */}
          <div className="flex-1 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text mb-1">{authorName}</h1>
                <p className="text-muted text-sm flex items-center gap-2">
                  <Star size={14} className="fill-amber-400 text-amber-400" /> 4.9 Average Rating • {authorFollowers.toLocaleString()} Followers
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" icon={MessageSquare}>Message</Button>
                <Button icon={UserPlus}>Follow Author</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 pb-12">
          {/* Left Sidebar */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-soft">
              <h2 className="font-bold text-text mb-3">About {authorName}</h2>
              <p className="text-sm text-text/80 leading-relaxed mb-6">{authorBio}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <MapPin size={16} /> London, UK
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <LinkIcon size={16} /> <a href="#" className="text-primary hover:underline">matthaig.com</a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 shadow-soft">
              <h3 className="font-bold text-text mb-4">Latest Achievement</h3>
              <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <Star size={24} className="text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-amber-900 text-sm">NYT Bestseller</p>
                  <p className="text-xs text-amber-700">The Midnight Library (2020)</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Books List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
                <BookOpen size={20} className="text-primary" /> Published Works ({authorBooks.length})
              </h2>
              <select className="text-sm border border-border rounded-lg px-3 py-1.5 outline-none font-medium">
                <option>Newest First</option>
                <option>Most Popular</option>
                <option>Highest Rated</option>
              </select>
            </div>

            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
              {authorBooks.map((book) => (
                <motion.div key={book.id} variants={fadeUp} className="bg-white rounded-2xl border border-border p-4 shadow-soft flex gap-5 group">
                  <Link to={`/books/${book.id}`} className="shrink-0">
                    <img src={book.cover} alt={book.title} className="w-24 h-36 object-cover rounded-xl book-cover" />
                  </Link>
                  <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/books/${book.id}`}>
                        <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors mb-1">{book.title}</h3>
                      </Link>
                      <p className="text-sm text-muted/80 line-clamp-2 mb-2">{book.description}</p>
                      <div className="flex items-center gap-4 text-xs font-medium text-muted">
                        <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400"/> {book.rating}</span>
                        <span>{book.reviews.toLocaleString()} reviews</span>
                        <span>{new Date(book.publishedDate).getFullYear()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Link to={`/books/${book.id}`}>
                        <Button size="sm">View Book</Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
