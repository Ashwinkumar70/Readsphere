
import { useParams, Link } from 'react-router-dom';
import { Users, BookOpen, MessageSquare, Calendar, Lock, Globe } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClubs, joinClub } from '../store/slices/clubSlice.js';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import Avatar from '../components/ui/Avatar.jsx';

export default function ClubDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { clubs, loading } = useSelector(state => state.clubs);
  
  useEffect(() => {
    if (clubs.length === 0) {
      dispatch(fetchClubs());
    }
  }, [dispatch, clubs.length]);

  const handleJoin = () => {
    dispatch(joinClub(id));
  };

  const club = clubs.find(c => c.id === parseInt(id));

  if (loading || !club) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-muted animate-pulse">Loading club details...</p>
      </div>
    );
  }

  // Fallback for missing current book feature
  const currentBook = {
    id: 1,
    title: 'Placeholder Book',
    author: 'Unknown Author',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Cover */}
      <div className="h-64 sm:h-80 relative">
        <img src={club.cover} alt={club.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-white/20 text-white border-white/20">
                  {club.isPublic ? <Globe size={11} className="mr-1" /> : <Lock size={11} className="mr-1" />}
                  {club.isPublic ? 'Public Club' : 'Private Club'}
                </Badge>
                {club.isJoined && <Badge color="success">Joined</Badge>}
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">{club.name}</h1>
              <p className="text-white/80 max-w-2xl text-sm sm:text-base">{club.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="white" size="lg">Share</Button>
              <Button size="lg" variant={club.isJoined ? 'primary' : 'success'} onClick={handleJoin}>
                {club.isJoined ? 'Leave Club' : 'Join Club'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-border p-2 shadow-soft flex divide-x divide-border">
              {[
                { l: 'Members', v: (club.members || 0).toLocaleString(), i: Users },
                { l: 'Books Read', v: club.books || 0, i: BookOpen },
                { l: 'Discussions', v: '1.2K', i: MessageSquare },
              ].map(s => (
                <div key={s.l} className="flex-1 flex flex-col items-center justify-center py-4">
                  <s.i size={20} className="text-primary mb-2" />
                  <span className="font-bold text-text text-xl">{s.v}</span>
                  <span className="text-xs text-muted font-medium">{s.l}</span>
                </div>
              ))}
            </div>

            {/* Currently Reading */}
            <div>
              <h2 className="text-xl font-bold text-text mb-4">Currently Reading</h2>
              <div className="bg-white rounded-2xl border border-border p-5 shadow-soft flex flex-col sm:flex-row gap-6">
                <img src={currentBook.cover} alt={currentBook.title} className="w-32 rounded-xl book-cover shrink-0" />
                <div className="flex-1">
                  <Badge color="warning" size="xs" className="mb-2">Ends in 5 days</Badge>
                  <h3 className="text-lg font-bold text-text mb-1">{currentBook.title}</h3>
                  <p className="text-sm text-muted mb-4">{currentBook.author}</p>
                  <div className="bg-gray-50 rounded-xl p-4 border border-border mb-4">
                    <p className="text-sm text-text font-medium mb-2">Reading Goal: Chapter 1-10</p>
                    <div className="progress-bar mb-2">
                      <div className="progress-fill" style={{ width: '75%' }} />
                    </div>
                    <p className="text-xs text-muted text-right">75% of members reached goal</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/clubs/${club.id}/discuss`}>
                      <Button size="sm" icon={MessageSquare}>Join Discussion</Button>
                    </Link>
                    <Link to={`/reader/${currentBook.id}`}>
                      <Button size="sm" variant="outline" icon={BookOpen}>Read Book</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-soft">
              <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> Upcoming Events
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'Live Voice Discussion', date: 'Tomorrow, 7:00 PM', type: 'Voice Chat' },
                  { title: 'Chapter 5-10 Review', date: 'Friday, 8:00 PM', type: 'Text Thread' },
                ].map((e, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="font-semibold text-sm text-text group-hover:text-primary transition-colors">{e.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted">{e.date}</p>
                      <Badge color="muted" size="xs">{e.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Members Preview */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text flex items-center gap-2">
                  <Users size={16} className="text-primary" /> Members online
                </h3>
                <span className="text-xs font-bold text-success bg-green-50 px-2 py-1 rounded-lg">242 online</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                  <Avatar key={i} size="sm" online={i % 3 === 0} />
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-border flex items-center justify-center text-xs font-bold text-muted">
                  +8k
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
