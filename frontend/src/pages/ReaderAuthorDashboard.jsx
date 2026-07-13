import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Flame, TrendingUp, Users, IndianRupee, Play, UploadCloud, Search, 
  BarChart2, Star, Target, Edit3, Compass, LayoutList, CheckCircle, Sparkles, Activity, Clock,
  FileText
} from 'lucide-react';
import StatsCard from '../components/ui/StatsCard.jsx';
import ChartCard, { SimpleBarChart } from '../components/ui/ChartCard.jsx';
import AnalyticsCard from '../components/ui/AnalyticsCard.jsx';
import TimelineCard from '../components/ui/TimelineCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import BookCard from '../components/cards/BookCard.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function ReaderAuthorDashboard() {
  const { data } = useSelector(state => state.dashboard);
  const user = useSelector(state => state.auth.user);

  const { reader, author, combined } = data || {};
  const currentBook = reader?.currentlyReading?.[0];

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-10 pb-12">

        {/* 1. GLOBAL HERO */}
        <motion.div variants={fadeUp} className="bg-gradient-primary rounded-[32px] p-8 md:p-10 text-white shadow-soft-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="max-w-xl">
              <Badge color="premium" className="mb-4 bg-white/20 text-white border-none backdrop-blur-sm">Hybrid Workspace</Badge>
              <h1 className="text-4xl font-heading font-bold mb-2 tracking-tight">Morning Brief, {user?.name?.split(' ')[0]}</h1>
              <p className="text-white/80 font-light text-lg">Manage your reading journey and publishing empire in one unified place.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/library">
                <Button icon={Play} className="w-full bg-white text-primary hover:bg-gray-50 border-none shadow-soft">Continue Reading</Button>
              </Link>
              <Link to="/upload">
                <Button icon={UploadCloud} variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">Upload Book</Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10 relative z-10">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-semibold mb-1">Reading Goal</p>
              <p className="text-2xl font-bold font-heading">{reader?.readingGoal || 0} <span className="text-sm font-normal text-white/60">books</span></p>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-semibold mb-1">Reading Streak</p>
              <p className="text-2xl font-bold font-heading">{reader?.readingStreak || 0} <span className="text-sm font-normal text-white/60">days</span></p>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-semibold mb-1">Books Published</p>
              <p className="text-2xl font-bold font-heading">{author?.publishedBooks || 0}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-semibold mb-1">Total Revenue</p>
              <p className="text-2xl font-bold font-heading">₹{(author?.revenue || 0).toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* ======================================= */}
          {/* READER WORKSPACE */}
          {/* ======================================= */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[16px] bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen size={20} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-text">Reading Progress</h2>
            </div>
            
            <motion.div variants={fadeUp} className="bg-white rounded-[24px] border border-transparent hover:border-primary/10 p-6 shadow-soft transition-colors group">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold font-heading text-text">Currently Reading</h3>
                <Link to="/library" className="text-xs text-primary font-medium hover:underline">Library</Link>
              </div>
              {currentBook ? (
                <div className="flex gap-4 items-center">
                  <img src={currentBook.cover} alt="Cover" className="w-16 h-24 object-cover rounded-lg shadow-soft" />
                  <div className="flex-1">
                    <h4 className="font-bold text-text line-clamp-1">{currentBook.title}</h4>
                    <p className="text-sm text-muted mb-3">{currentBook.author}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                      <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${currentBook.readProgress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted">
                      <span>{currentBook.readProgress}%</span>
                    </div>
                  </div>
                  <Link to="/library">
                    <Button icon={Play} className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-gray-50 text-primary hover:bg-primary hover:text-white border border-border transition-colors shrink-0" />
                  </Link>
                </div>
              ) : (
                <EmptyState icon={BookOpen} title="No active books" description="Find your next read." actionLabel="Discover" actionLink="/marketplace" className="p-4 border-none bg-transparent"/>
              )}
            </motion.div>
            
            <motion.div variants={fadeUp} className="bg-white rounded-[24px] border border-transparent p-6 shadow-soft hover:border-primary/10 transition-colors">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold font-heading text-text">Recommendations</h3>
                <Link to="/marketplace" className="text-xs text-primary font-medium hover:underline">Discover</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar snap-x">
                {combined?.recommendations?.length > 0 ? (
                  combined.recommendations.map((book, i) => (
                    <div key={i} className="snap-start shrink-0 w-28">
                      <BookCard book={book} size="sm" className="border-none shadow-none bg-transparent hover:-translate-y-1 transition-transform" />
                    </div>
                  ))
                ) : (
                  <EmptyState icon={Compass} title="No recommendations" description="Check the marketplace for suggestions." className="p-4 w-full border-none bg-transparent" />
                )}
              </div>
            </motion.div>
          </section>

          {/* ======================================= */}
          {/* AUTHOR WORKSPACE */}
          {/* ======================================= */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-[16px] bg-text text-white flex items-center justify-center shadow-soft">
                <Edit3 size={20} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-text">Sales Progress</h2>
            </div>
            
            <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
              <StatsCard title="Monthly Sales" value={(author?.sales || 0).toLocaleString()} icon={TrendingUp} color="primary" className="bg-white border-transparent hover:border-primary/10 transition-colors" />
              <StatsCard title="Total Readers" value={(author?.readers || 0).toLocaleString()} icon={Users} color="secondary" className="bg-white border-transparent hover:border-primary/10 transition-colors" />
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1">
              <AnalyticsCard title="Revenue Growth" subtitle="Earnings tracking">
                {combined?.monthlyRevenue?.length > 0 ? (
                  <SimpleBarChart data={combined.monthlyRevenue} height={140} />
                ) : (
                  <EmptyState icon={IndianRupee} title="No revenue data" description="Publish a book to start tracking earnings." className="mt-4 p-4 border-none shadow-none bg-transparent"/>
                )}
              </AnalyticsCard>
            </motion.div>
            
          </section>

        </div>

        {/* ======================================= */}
        {/* UNIFIED ACTIVITY & AI WORKSPACE */}
        {/* ======================================= */}
        <section className="pt-6 border-t border-gray-100">
          <div className="grid lg:grid-cols-3 gap-8">
            
            <motion.div variants={fadeUp} className="bg-gradient-card rounded-[24px] border border-border p-6 shadow-soft relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-50 pointer-events-none" />
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      <Sparkles size={16} />
                    </div>
                    <h3 className="font-bold font-heading text-text">AI Workspace</h3>
                  </div>
                  <p className="text-sm text-muted mb-5">Smart tools for both reading and writing.</p>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-white hover:border-accent hover:text-accent border-border shadow-sm"><BookOpen size={16} className="mr-2"/> AI Reader Assistant</Button>
                    <Button variant="outline" className="w-full justify-start bg-white hover:border-accent hover:text-accent border-border shadow-sm"><Edit3 size={16} className="mr-2"/> AI Writing Assistant</Button>
                    <Button variant="outline" className="w-full justify-start bg-white hover:border-accent hover:text-accent border-border shadow-sm"><BarChart2 size={16} className="mr-2"/> AI Marketing Copilot</Button>
                  </div>
               </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white rounded-[24px] border border-transparent hover:border-primary/10 p-6 shadow-soft transition-colors lg:col-span-2">
               <h3 className="font-bold font-heading text-text mb-6 flex items-center gap-2"><Activity size={18}/> Unified Timeline</h3>
               <TimelineCard 
                 activities={combined?.recentActivity} 
                 emptyState={<EmptyState icon={Clock} title="No activity" description="Your reading and publishing journey will appear here." className="p-4 border-none bg-transparent"/>}
               />
            </motion.div>

          </div>
        </section>

      </motion.div>
    </DashboardLayout>
  );
}
