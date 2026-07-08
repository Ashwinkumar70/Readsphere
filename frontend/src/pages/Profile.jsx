import { motion } from 'framer-motion';
import { Settings, MapPin, Link as LinkIcon, Calendar, Edit3, Grid, BookOpen, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../store/slices/userSlice.js';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import BookCard from '../components/cards/BookCard.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function Profile() {
  const [tab, setTab] = useState('books'); // books, collections, clubs
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { wishlist, loading } = useSelector(state => state.userData);
  
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const favoriteBooks = wishlist?.map(w => w.book).slice(0, 4) || [];

  if (!user) return null;

  return (
    <div className="bg-background min-h-screen">
      {/* Cover Header */}
      <div className="h-48 sm:h-64 bg-gradient-to-r from-primary-400 to-secondary-500 relative">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]" />
        <div className="absolute bottom-4 right-4">
          <Button variant="white" size="sm" icon={Edit3}>Edit Cover</Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative mb-8 sm:mb-12 flex flex-col sm:flex-row gap-6 sm:items-end">
          {/* Avatar */}
          <div className="relative inline-block -mt-16 sm:-mt-20 z-10">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            {user.isPremium && (
              <div className="absolute bottom-2 right-2 bg-gradient-to-r from-amber-400 to-orange-500 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Premium Member">
                <span className="text-white text-xs sm:text-sm">✦</span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 pb-2 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text mb-1">{user.name}</h1>
                <p className="text-muted text-sm">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" icon={Settings}>Settings</Button>
                <Button icon={Edit3}>Edit Profile</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 pb-12">
          {/* Left Sidebar */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-6">
            <div className="bg-white rounded-2xl border border-border shadow-soft p-6 mb-8">
              <h3 className="font-bold text-text mb-4">About Me</h3>
              <p className="text-muted text-sm leading-relaxed">
                {user.bio || "Hi there! I'm an avid reader who loves exploring new worlds. Currently diving deep into sci-fi and historical fiction."}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 shadow-soft">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <MapPin size={16} /> San Francisco, CA
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <LinkIcon size={16} /> <a href="#" className="text-primary hover:underline">santhosh.dev</a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Calendar size={16} /> Joined June 2023
                </div>
              </div>

              <h3 className="font-bold text-text mb-3 text-sm">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {user.favoriteGenres.map(g => (
                  <Badge key={g} color="muted" size="md" className="bg-gray-50">{g}</Badge>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 shadow-soft grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-text">{user.stats.followers}</p>
                <p className="text-xs text-muted uppercase tracking-wider font-semibold">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{user.stats.following}</p>
                <p className="text-xs text-muted uppercase tracking-wider font-semibold">Following</p>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-border mb-6">
              {[
                { id: 'books', label: 'Favorite Books', icon: BookOpen },
                { id: 'collections', label: 'Collections', icon: Grid },
                { id: 'clubs', label: 'Clubs', icon: Users },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 pb-4 font-semibold text-sm transition-colors border-b-2 ${
                    tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text'
                  }`}
                >
                  <t.icon size={16} /> {t.label}
                </button>
              ))}
            </div>

            <motion.div variants={stagger} initial="hidden" animate="show">
              {tab === 'books' && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {loading ? (
                    <div className="col-span-4 text-center py-10 text-muted">Loading favorite books...</div>
                  ) : favoriteBooks.length > 0 ? (
                    favoriteBooks.map(book => (
                      <motion.div key={book.id} variants={fadeUp}>
                        <BookCard book={book} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-10 text-muted">No favorite books yet.</div>
                  )}
                </div>
              )}

              {tab === 'collections' && (
                <div className="text-center py-20 bg-white rounded-2xl border border-border shadow-soft">
                  <Grid size={48} className="text-border mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-text mb-2">No public collections</h3>
                  <p className="text-muted">Create a collection to share your favorite reads.</p>
                </div>
              )}

              {tab === 'clubs' && (
                <div className="text-center py-20 bg-white rounded-2xl border border-border shadow-soft">
                  <Users size={48} className="text-border mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-text mb-2">Clubs are hidden</h3>
                  <p className="text-muted">You've chosen to keep your club memberships private.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
