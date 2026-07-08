import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  BookOpen, Flame, TrendingUp, Star,
  ChevronRight, Play, Trophy, Target, Calendar
} from 'lucide-react';
import BookCard from '../components/cards/BookCard.jsx';
import StatsCard from '../components/ui/StatsCard.jsx';
import ChartCard, { SimpleBarChart, ProgressRing } from '../components/ui/ChartCard.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import AIWidget from '../components/cards/AIWidget.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardStats } from '../store/slices/userSlice.js';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function Dashboard() {
  const user = useSelector(state => state.auth.user);
  const { dashboardStats, loading } = useSelector(state => state.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.role === 'Admin') navigate('/admin');
    if (user?.role === 'Author') navigate('/author');
    if (user && !dashboardStats && !loading) {
      dispatch(fetchDashboardStats());
    }
  }, [user, navigate, dispatch, dashboardStats, loading]);

  if (!user || !dashboardStats) return (
    <div className="p-6 max-w-[1400px] flex items-center justify-center min-h-[50vh]">
      <p className="text-muted text-lg animate-pulse">Loading dashboard...</p>
    </div>
  );

  const currentlyReading = dashboardStats.currentlyReading || [];
  const recommended = dashboardStats.recommended || [];
  const weeklyData = dashboardStats.weeklyData || [];

  return (
    <div className="p-6 max-w-[1400px]">
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-muted text-sm mb-1">Good afternoon 👋</p>
            <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <Flame size={16} className="text-amber-500" />
              <span className="text-sm font-bold text-amber-700">{dashboardStats.readingStreak || 0} day streak</span>
            </div>
            <Link to="/reader/1">
              <Button icon={Play} size="sm">Continue Reading</Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="Books Read" value={dashboardStats.booksCompleted || 0} icon={BookOpen} trend="+2 this month" />
          <StatsCard title="Reading Streak" value={`${dashboardStats.readingStreak || 0} Days`} icon={Flame} trend="Personal best!" trendUp />
          <StatsCard title="Pages Read" value={dashboardStats.pagesRead || 0} icon={Target} trend="+450 this week" trendUp />
          <StatsCard title="Reading Time" value="0h" icon={Calendar} trend="Just started" />
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Continue Reading */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-text">Continue Reading</h2>
                <Link to="/library" className="text-sm text-primary font-semibold hover:underline">View all</Link>
              </div>
              <div className="space-y-4">
                {currentlyReading.length > 0 ? (
                  currentlyReading.map(book => (
                    <div key={book.id} className="flex gap-4 items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-xl book-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-text text-sm mb-0.5 truncate group-hover:text-primary transition-colors">{book.title}</h3>
                        <p className="text-xs text-muted mb-2">{book.author}</p>
                        <div className="progress-bar mb-1">
                          <div className="progress-fill" style={{ width: `${book.readProgress}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">{book.readProgress}% complete</span>
                          <span className="text-muted">{Math.round((100 - book.readProgress) / 100 * book.pages)} pages left</span>
                        </div>
                      </div>
                      <Link to={`/reader/${book.id}`}>
                        <Button size="sm" variant="outline" icon={Play}>Read</Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted">You are not reading any books currently.</p>
                    <Link to="/marketplace">
                      <Button size="sm" className="mt-3">Explore Books</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reading Activity Chart */}
            <motion.div variants={fadeUp}>
              <ChartCard
                title="Reading Activity"
                subtitle="Pages read this week"
                action={<Badge color="success" dot>On track</Badge>}
              >
                <SimpleBarChart data={weeklyData} height={140} />
              </ChartCard>
            </motion.div>

            {/* Recommended Books */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-5 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-text">Recommended For You</h2>
                  <p className="text-xs text-muted">Based on your reading history</p>
                </div>
                <Link to="/marketplace">
                  <Button variant="ghost" size="sm" icon={ChevronRight} iconRight>Explore</Button>
                </Link>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-2">
                {recommended.length > 0 ? (
                  recommended.map(book => (
                    <BookCard key={book.id} book={book} size="sm" />
                  ))
                ) : (
                  <p className="text-sm text-muted">No recommendations available yet.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* User Profile Card */}
            <motion.div variants={fadeUp} className="bg-gradient-primary rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Avatar src={user.avatar} name={user.name} size="lg" ring />
                <div>
                  <p className="font-bold">{user.name}</p>
                  <Badge className="mt-1 bg-white/20 text-white border-white/20">✦ Premium</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { v: dashboardStats.booksCompleted || 0, l: 'Books' },
                  { v: dashboardStats.followers || 0, l: 'Followers' },
                  { v: dashboardStats.following || 0, l: 'Following' },
                ].map(s => (
                  <div key={s.l} className="text-center">
                    <p className="text-xl font-bold">{s.v}</p>
                    <p className="text-xs text-white/70">{s.l}</p>
                  </div>
                ))}
              </div>
              <Link to="/profile">
                <Button variant="white" size="sm" full>View Profile</Button>
              </Link>
            </motion.div>

            {/* Reading Goals */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-5 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} className="text-primary" />
                <h3 className="font-bold text-text text-sm">2024 Reading Goal</h3>
              </div>
              <div className="flex items-center gap-4">
                <ProgressRing value={Math.round((user.stats.booksRead / 60) * 100)} size={80} />
                <div>
                  <p className="text-2xl font-bold text-text">{user.stats.booksRead}<span className="text-muted text-base font-normal">/60</span></p>
                  <p className="text-xs text-muted">books this year</p>
                  <Badge color="success" size="xs" dot className="mt-2">Ahead of schedule</Badge>
                </div>
              </div>
            </motion.div>

            {/* AI Assistant Widget */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border overflow-hidden shadow-soft" style={{ height: 400 }}>
              <AIWidget />
            </motion.div>

            {/* Reading Schedule */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-5 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={16} className="text-primary" />
                <h3 className="font-bold text-text text-sm">This Week's Events</h3>
              </div>
              <div className="space-y-3">
                {[
                  { day: 'Tomorrow', event: 'Sci-Fi Universe Book Club', time: '7:00 PM', color: 'bg-primary-100 text-primary' },
                  { day: 'Thursday', event: 'Author Q&A: Andy Weir', time: '6:00 PM', color: 'bg-blue-100 text-blue-600' },
                  { day: 'Saturday', event: 'Weekend Reading Challenge', time: 'All Day', color: 'bg-green-100 text-green-600' },
                ].map((e, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${e.color} shrink-0`}>{e.day}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text truncate">{e.event}</p>
                      <p className="text-xs text-muted">{e.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
