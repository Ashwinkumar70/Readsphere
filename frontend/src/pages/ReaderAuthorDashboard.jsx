import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Flame, TrendingUp, Users, IndianRupee, Play, UploadCloud, Search, 
  BarChart2, Star, Target, Edit3, Compass, LayoutList
} from 'lucide-react';
import StatsCard from '../components/ui/StatsCard.jsx';
import ChartCard, { SimpleBarChart, ProgressRing } from '../components/ui/ChartCard.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import BookCard from '../components/cards/BookCard.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function ReaderAuthorDashboard() {
  const { data } = useSelector(state => state.dashboard);
  const user = useSelector(state => state.auth.user);

  const { reader, author, combined } = data || {};

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-12 pb-12">

        {/* Global Header */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-border shadow-soft">
          <div>
            <Badge color="premium" className="mb-2">Hybrid Workspace</Badge>
            <h1 className="text-3xl font-bold text-text">Welcome, {user?.name}</h1>
            <p className="text-muted mt-2">Manage your reading journey and publishing empire in one place.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/library"><Button icon={Play} size="sm" className="bg-primary hover:bg-primary-hover">Continue Reading</Button></Link>
            <Link to="/upload"><Button icon={UploadCloud} size="sm" className="bg-gray-900 text-white hover:bg-gray-800 border-none">Upload Book</Button></Link>
            <Button icon={Edit3} size="sm" variant="outline">Edit Draft</Button>
            <Link to="/marketplace"><Button icon={Search} size="sm" variant="outline">Search Books</Button></Link>
            <Button icon={BarChart2} size="sm" variant="ghost" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* ======================================= */}
          {/* READER SECTION */}
          {/* ======================================= */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen size={20} />
              </div>
              <h2 className="text-2xl font-bold text-text">Reader Hub</h2>
            </div>
            
            <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
              <StatsCard title="Books Read" value={reader?.booksRead || 0} icon={BookOpen} trend="On track" />
              <StatsCard title="Pages Read" value={reader?.pagesRead || 0} icon={LayoutList} trendUp />
              <StatsCard title="Reading Streak" value={`${reader?.readingStreak || 0} Days`} icon={Flame} color="warning" />
              <StatsCard title="Reading Goal" value={reader?.readingGoal || 20} icon={Target} />
            </motion.div>

            <motion.div variants={fadeUp} className="bg-[#FDFBF7] rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-text mb-4">Continue Reading</h3>
              {reader?.currentlyReading?.length > 0 ? (
                <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-border">
                  <img src={reader.currentlyReading[0].cover} alt="Cover" className="w-14 h-20 object-cover rounded shadow-sm" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm line-clamp-1">{reader.currentlyReading[0].title}</h4>
                    <p className="text-xs text-muted mb-2">{reader.currentlyReading[0].author}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${reader.currentlyReading[0].readProgress}%` }} />
                    </div>
                  </div>
                  <Button icon={Play} size="sm" variant="outline" className="px-2 py-1 h-auto" />
                </div>
              ) : (
                <p className="text-sm text-muted">No active books.</p>
              )}
            </motion.div>
            
            <motion.div variants={fadeUp} className="bg-[#FDFBF7] rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text">Recommended</h3>
                <Link to="/marketplace" className="text-xs text-primary font-medium hover:underline">View All</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {combined?.recommendations?.length > 0 ? (
                  combined.recommendations.map((book, i) => (
                    <BookCard key={i} book={book} size="sm" className="min-w-[120px]" />
                  ))
                ) : (
                  <p className="text-sm text-muted">Check out the marketplace for suggestions.</p>
                )}
              </div>
            </motion.div>
          </section>

          {/* ======================================= */}
          {/* AUTHOR SECTION */}
          {/* ======================================= */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                <Edit3 size={20} />
              </div>
              <h2 className="text-2xl font-bold text-text">Author Hub</h2>
            </div>
            
            <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
              <StatsCard title="Books Published" value={(author?.publishedBooks || 0).toLocaleString()} icon={BookOpen} />
              <StatsCard title="Total Readers" value={(author?.readers || 0).toLocaleString()} icon={Users} color="secondary" />
              <StatsCard title="Total Revenue" value={`₹${(author?.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={IndianRupee} color="success" />
              <StatsCard title="Downloads" value={(author?.sales || 0).toLocaleString()} icon={TrendingUp} color="primary" />
            </motion.div>

            <motion.div variants={fadeUp} className="bg-gray-50 rounded-2xl border border-border p-6 shadow-sm">
              <ChartCard title="Revenue Growth" subtitle="Sales performance">
                <div className="mt-4">
                  <SimpleBarChart data={combined?.monthlyRevenue || []} height={150} />
                </div>
              </ChartCard>
            </motion.div>
            
            <motion.div variants={fadeUp} className="bg-gray-50 rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-text mb-4">Publishing Tasks</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-border text-sm">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span className="flex-1">Finish drafting Chapter 5</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-border text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="flex-1">Review editor feedback</span>
                </div>
              </div>
            </motion.div>
          </section>

        </div>

        {/* ======================================= */}
        {/* COMBINED ACTIVITY SECTION */}
        {/* ======================================= */}
        <section>
          <h2 className="text-xl font-bold text-text mb-6">Combined Activity</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-text mb-4 text-sm text-muted uppercase tracking-wider">Book Performance</h3>
              {combined?.topSellingBook ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-16 bg-gray-100 rounded border border-border flex-shrink-0" />
                  <div>
                    <p className="font-bold">{combined.topSellingBook.title}</p>
                    <p className="text-sm text-success font-medium">Top Seller</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted">No books published yet.</p>
              )}
            </motion.div>
            
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-text mb-4 text-sm text-muted uppercase tracking-wider">Recent Reviews</h3>
              {combined?.recentReviews?.length > 0 ? (
                combined.recentReviews.slice(0, 2).map((r, i) => (
                  <div key={i} className="flex items-center gap-2 mt-2">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm text-muted">{r.rating} - {r.bookTitle}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted mt-1">No reviews received yet.</p>
              )}
            </motion.div>
            
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-text mb-4 text-sm text-muted uppercase tracking-wider">Notifications</h3>
              <p className="text-sm text-muted">You're all caught up!</p>
            </motion.div>

          </div>
        </section>

      </motion.div>
    </DashboardLayout>
  );
}
