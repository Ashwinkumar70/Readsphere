import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../store/slices/dashboardSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Flame, TrendingUp, Users, IndianRupee, Play, UploadCloud, Search, 
  BarChart2, Star, Target, Edit3, Compass, LayoutList, CheckCircle, Sparkles, Activity, Clock,
  FileText, ShoppingCart, Bell, Heart, Package, Download, UserCheck, MessageSquare, Zap
} from 'lucide-react';
import StatsCard from '../components/ui/StatsCard.jsx';
import ChartCard, { SimpleBarChart } from '../components/ui/ChartCard.jsx';
import TimelineCard from '../components/ui/TimelineCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import BookCard from '../components/cards/BookCard.jsx';
import AIWorkspaceWidget from '../components/ui/AIWorkspaceWidget.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function ReaderAuthorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading || !data) {
    return (
      <DashboardLayout title="Workspace">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Workspace">
        <EmptyState
          icon={Activity}
          title="Unable to load workspace"
          description={error}
          action={{ label: "Retry", onClick: () => dispatch(fetchDashboard()) }}
        />
      </DashboardLayout>
    );
  }

  const { reader, author, marketplace, combined, notifications } = data;

  return (
    <DashboardLayout title="Workspace">
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-12 pb-24">
        
        {/* 1. Morning Brief */}
        <motion.section variants={fadeUp} className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 border border-primary-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-heading font-bold text-text mb-2">Morning, {user?.name?.split(' ')[0]}!</h2>
              <p className="text-muted">You have {notifications?.length || 0} unread notifications. Here's your unified summary for today.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/60 p-4 rounded-xl border border-white/40">
              <div className="text-sm text-muted mb-1 flex items-center gap-2"><BookOpen size={14}/> Reading Progress</div>
              <div className="text-2xl font-bold">{reader?.booksRead || 0} <span className="text-sm text-muted font-normal">/ {reader?.readingGoal || 20} Goal</span></div>
            </div>
            <div className="bg-white/60 p-4 rounded-xl border border-white/40">
              <div className="text-sm text-muted mb-1 flex items-center gap-2"><IndianRupee size={14}/> Revenue Today</div>
              <div className="text-2xl font-bold">₹{(combined?.monthlyRevenue?.[new Date().getMonth()]?.value || 0)}</div>
            </div>
            <div className="bg-white/60 p-4 rounded-xl border border-white/40">
              <div className="text-sm text-muted mb-1 flex items-center gap-2"><ShoppingCart size={14}/> Books Purchased</div>
              <div className="text-2xl font-bold">{combined?.booksPurchased || 0}</div>
            </div>
            <div className="bg-white/60 p-4 rounded-xl border border-white/40">
              <div className="text-sm text-muted mb-1 flex items-center gap-2"><UploadCloud size={14}/> Books Published</div>
              <div className="text-2xl font-bold">{author?.publishedBooks || 0}</div>
            </div>
          </div>
        </motion.section>

        {/* 2. Continue Reading */}
        <motion.section variants={fadeUp}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text flex items-center gap-2">
              <Play size={20} className="text-primary" /> Continue Reading
            </h3>
            <Link to="/library" className="text-primary text-sm font-medium hover:underline">View Library</Link>
          </div>
          
          {reader?.currentlyReading?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reader.currentlyReading.map((book) => (
                <div key={book.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm hover:border-primary/30 transition-colors flex flex-col justify-between">
                  <div className="flex gap-4">
                    <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-text truncate mb-1">{book.title}</h4>
                      <p className="text-xs text-muted mb-3">{book.author}</p>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${book.readProgress}%` }}></div>
                      </div>
                      <div className="text-xs text-muted">{book.readProgress}% complete</div>
                    </div>
                  </div>
                  <Button size="sm" full className="mt-4" onClick={() => navigate(`/reader/${book.id}`)}>Resume Reading</Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={BookOpen} title="No books in progress" description="Start reading from your library" />
          )}
        </motion.section>

        {/* 3. Author Overview */}
        <motion.section variants={fadeUp}>
          <h3 className="text-xl font-bold text-text flex items-center gap-2 mb-6">
             <BarChart2 size={20} className="text-primary" /> Author Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard title="Revenue" value={`₹${author?.revenue || 0}`} icon={IndianRupee} />
            <StatsCard title="Books Sold" value={author?.sales || 0} icon={ShoppingCart} />
            <StatsCard title="Downloads" value={author?.downloads || 0} icon={Download} />
            <StatsCard title="Readers" value={author?.readers || 0} icon={UserCheck} />
            <StatsCard title="Avg Rating" value="4.8" icon={Star} color="secondary" />
            <StatsCard title="Reviews" value={(author?.recentReviews?.length || 0) * 12} icon={MessageSquare} />
            <StatsCard title="Published" value={author?.publishedBooks || 0} icon={CheckCircle} color="success" />
            <StatsCard title="Drafts" value={author?.draftBooks || 0} icon={Edit3} color="warning" />
          </div>
        </motion.section>

        {/* 4 & 5. Reading & Publishing Analytics */}
        <motion.section variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reading Analytics */}
          <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
            <h3 className="text-xl font-bold text-text flex items-center gap-2 mb-6">
              <Activity size={20} className="text-secondary" /> Reading Analytics
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div className="flex items-center gap-3"><BookOpen size={18} className="text-muted"/> Books Read</div>
                <div className="font-bold">{reader?.booksRead || 0}</div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div className="flex items-center gap-3"><FileText size={18} className="text-muted"/> Pages Read</div>
                <div className="font-bold">{reader?.pagesRead || 0}</div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div className="flex items-center gap-3"><Clock size={18} className="text-muted"/> Reading Time</div>
                <div className="font-bold">{Math.floor((reader?.pagesRead || 0) * 1.5)} mins</div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div className="flex items-center gap-3"><Target size={18} className="text-muted"/> Reading Goal</div>
                <div className="font-bold">{reader?.booksRead || 0} / {reader?.readingGoal || 20}</div>
              </div>
              <div className="flex justify-between items-center pb-4">
                <div className="flex items-center gap-3"><Flame size={18} className="text-orange-500"/> Reading Streak</div>
                <div className="font-bold text-orange-500">{reader?.readingStreak || 0} days</div>
              </div>
            </div>
          </div>

          {/* Publishing Analytics */}
          <div className="bg-white rounded-3xl border border-border p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-text flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-primary" /> Publishing Analytics
            </h3>
            <div className="flex-1 flex flex-col justify-between">
              <div className="mb-6">
                <div className="text-sm font-medium text-muted mb-2">Revenue vs Sales (Last 6 Months)</div>
                <div className="h-48">
                  <SimpleBarChart data={combined?.monthlyRevenue || []} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs text-muted uppercase tracking-wider mb-1">Reader Growth</div>
                  <div className="text-lg font-bold text-green-600">+24%</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs text-muted uppercase tracking-wider mb-1">Draft vs Pub</div>
                  <div className="text-lg font-bold">{author?.draftBooks || 0} / {author?.publishedBooks || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 6 & 7. Marketplace Summary & Notifications */}
        <motion.section variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Marketplace Summary */}
          <div>
            <h3 className="text-xl font-bold text-text flex items-center gap-2 mb-6">
              <Package size={20} className="text-primary" /> Marketplace Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
               <StatsCard title="Orders" value={marketplace?.orders || 0} icon={Package} />
               <StatsCard title="Wishlist" value={marketplace?.wishlist || 0} icon={Heart} />
            </div>
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold">Recent Purchases</h4>
                <Link to="/orders" className="text-primary text-sm hover:underline">View Orders</Link>
              </div>
              {marketplace?.recentOrders?.length > 0 ? (
                <div className="space-y-3">
                  {marketplace.recentOrders.slice(0,3).map((o, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium truncate max-w-[200px]">{o.items}</div>
                      <Badge color={o.status === 'Completed' ? 'success' : 'warning'}>{o.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={ShoppingCart} title="No purchases" />
              )}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-xl font-bold text-text flex items-center gap-2 mb-6">
              <Bell size={20} className="text-primary" /> Notifications
            </h3>
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm min-h-[340px] max-h-[340px] overflow-y-auto">
              {notifications?.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map(note => (
                    <div key={note.id} className="flex gap-3 border-b border-border pb-3 last:border-0">
                      <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${note.is_read ? 'bg-gray-300' : 'bg-primary'}`}></div>
                      <div>
                        <div className="font-medium text-sm text-text">{note.title}</div>
                        <div className="text-xs text-muted mt-1">{note.message}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(note.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Bell} title="All caught up" description="No new notifications" />
              )}
            </div>
          </div>
        </motion.section>

        {/* 8. Recent Activity */}
        <motion.section variants={fadeUp}>
          <h3 className="text-xl font-bold text-text flex items-center gap-2 mb-6">
             <Activity size={20} className="text-primary" /> Recent Activity
          </h3>
          <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
            {combined?.recentActivity?.length > 0 ? (
              <div className="space-y-6">
                {combined.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                      {activity.type === 'reading' && <BookOpen size={18} />}
                      {activity.type === 'publishing' && <Star size={18} />}
                      {activity.type === 'purchase' && <ShoppingCart size={18} />}
                    </div>
                    <div>
                      <div className="font-medium text-text">{activity.action} <span className="font-bold text-primary">{activity.bookTitle}</span></div>
                      <div className="text-sm text-muted mt-1">{new Date(activity.date).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Activity} title="No recent activity" />
            )}
          </div>
        </motion.section>

        {/* 9. AI Workspace & 10. Quick Actions */}
        <motion.section variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Workspace */}
          <AIWorkspaceWidget />

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="space-y-6">
              
              <div>
                <div className="text-xs text-muted uppercase tracking-wider mb-3">Author</div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/upload')}><UploadCloud size={16}/> Upload Book</Button>
                  <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/author')}><BarChart2 size={16}/> Manage Books</Button>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted uppercase tracking-wider mb-3">Reader</div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/library')}><BookOpen size={16}/> Library</Button>
                  <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/marketplace')}><Search size={16}/> Marketplace</Button>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted uppercase tracking-wider mb-3">Shared</div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="ghost" className="justify-start gap-2 bg-gray-50" onClick={() => navigate('/orders')}><Package size={16}/> Orders</Button>
                  <Button variant="ghost" className="justify-start gap-2 bg-gray-50" onClick={() => navigate('/settings')}><Compass size={16}/> Settings</Button>
                </div>
              </div>

            </div>
          </div>
        </motion.section>

      </motion.div>
    </DashboardLayout>
  );
}
