import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UploadCloud, TrendingUp, IndianRupee, Users, BookOpen, Star, 
  BarChart2, Edit3, MessageSquare, Activity, Download, PieChart, FileText,
  Sparkles, PenTool, Image as ImageIcon, Search, ChevronRight, CheckCircle, Clock
} from 'lucide-react';
import StatsCard from '../components/ui/StatsCard.jsx';
import ChartCard, { SimpleBarChart } from '../components/ui/ChartCard.jsx';
import AnalyticsCard from '../components/ui/AnalyticsCard.jsx';
import TimelineCard from '../components/ui/TimelineCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function AuthorDashboard() {
  const { data } = useSelector(state => state.dashboard);
  const user = useSelector(state => state.auth.user);

  const reviewTimeline = data?.recentReviews?.map(r => ({
    time: "Recent",
    title: `${r.rating} Star Review from ${r.reviewer}`,
    description: `"${r.comment}"`,
    color: r.rating >= 4 ? '#10B981' : '#F59E0B'
  })) || [];

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-10 pb-12">

        {/* 1. STUDIO OVERVIEW HERO */}
        <motion.div variants={fadeUp} className="bg-white rounded-[32px] border border-border p-8 md:p-10 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge color="premium" className="bg-text text-white border-text">Creator Studio</Badge>
                <span className="text-sm font-medium text-success flex items-center gap-1"><CheckCircle size={14}/> Operational</span>
              </div>
              <h1 className="text-4xl font-heading font-bold text-text mb-2">Welcome Back, {user?.name?.split(' ')[0]}</h1>
              <p className="text-lg text-muted">Manage your publishing empire and track performance.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <div className="bg-gray-50 border border-border rounded-[24px] p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 text-success rounded-[16px] flex items-center justify-center">
                  <IndianRupee size={24} />
                </div>
                <div>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">Monthly Revenue</p>
                  <p className="text-xl font-bold font-heading text-text">₹{(data?.revenue || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-border rounded-[24px] p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-[16px] flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">Followers</p>
                  <p className="text-xl font-bold font-heading text-text">{data?.followers || 0}</p>
                </div>
              </div>
              <Link to="/upload">
                <Button icon={UploadCloud} className="bg-text hover:bg-gray-800 text-white shadow-soft rounded-full h-14 px-6">Upload Book</Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Left Area */}
          <div className="lg:col-span-8 space-y-10">
            
            <motion.div variants={fadeUp} className="space-y-4">
               <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-text flex items-center gap-2">
                  <Activity className="text-primary"/> Performance Overview
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatsCard title="Total Readers" value={(data?.readers || 0).toLocaleString()} icon={Users} color="primary" />
                <StatsCard title="Downloads" value={(data?.downloads || 0).toLocaleString()} icon={Download} color="secondary" />
                <StatsCard title="Published" value={data?.publishedBooks || 0} icon={BookOpen} color="success" />
                <StatsCard title="Drafts" value={data?.draftBooks || 0} icon={Edit3} color="warning" />
              </div>
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-6">
              <AnalyticsCard title="Gross Revenue" subtitle="Earnings over time" action={<Button variant="ghost" size="sm" icon={Download}></Button>}>
                {data?.monthlySalesChart?.length > 0 ? (
                  <SimpleBarChart data={data.monthlySalesChart} height={180} />
                ) : (
                  <EmptyState icon={IndianRupee} title="No revenue data" description="Publish a book to start earning." actionLabel="Upload Book" actionLink="/upload" className="mt-4 p-4 border-none shadow-none bg-transparent"/>
                )}
              </AnalyticsCard>
              <AnalyticsCard title="Unit Sales" subtitle="Volume over time" action={<Button variant="ghost" size="sm" icon={Download}></Button>}>
                {data?.monthlySalesChart?.length > 0 ? (
                  <SimpleBarChart data={data.monthlySalesChart} height={180} />
                ) : (
                  <EmptyState icon={TrendingUp} title="No sales data" description="Publish a book to generate sales." actionLabel="Upload Book" actionLink="/upload" className="mt-4 p-4 border-none shadow-none bg-transparent"/>
                )}
              </AnalyticsCard>
            </motion.div>

            {/* Book Performance Table */}
            <motion.div variants={fadeUp} className="bg-white rounded-[24px] border border-border overflow-hidden shadow-soft">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-heading font-bold text-text flex items-center gap-2"><BookOpen size={18}/> Book Management</h2>
                <Link to="/upload" className="text-sm font-semibold text-primary hover:underline">View All Books</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted uppercase bg-gray-50/50 border-b border-gray-100 tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Title & Status</th>
                      <th className="px-6 py-4 font-semibold">Downloads</th>
                      <th className="px-6 py-4 font-semibold">Revenue</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data?.booksList?.length > 0 ? data.booksList.map(book => (
                      <tr key={book.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={book.cover} alt="Cover" className="w-10 h-14 object-cover rounded-md" />
                            <div>
                              <p className="font-bold text-text mb-1">{book.title}</p>
                              <Badge color={book.status === 'Published' ? 'success' : 'default'} size="xs">{book.status}</Badge>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted">{(book.downloads || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 font-semibold text-text">₹{(book.price || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" icon={Edit3} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="p-0">
                          <EmptyState icon={BookOpen} title="No books published yet" description="Time to start writing!" actionLabel="Publish Book" actionLink="/upload" className="border-none rounded-none"/>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

          </div>

          {/* Right Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* 3. AI AUTHOR STUDIO */}
            <motion.div variants={fadeUp} className="bg-gradient-card rounded-[24px] border border-border p-6 shadow-soft relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Sparkles size={16} />
                    </div>
                    <h3 className="font-bold font-heading text-text">AI Author Studio</h3>
                  </div>
                  <p className="text-sm text-muted mb-5">Supercharge your publishing workflow.</p>
                  
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-white hover:border-primary hover:text-primary transition-colors text-sm font-medium text-text text-left shadow-sm">
                      <span className="flex items-center gap-2"><PenTool size={16}/> Improve Description</span>
                      <ChevronRight size={16} className="text-muted"/>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-white hover:border-primary hover:text-primary transition-colors text-sm font-medium text-text text-left shadow-sm">
                      <span className="flex items-center gap-2"><ImageIcon size={16}/> Generate Cover Prompt</span>
                      <ChevronRight size={16} className="text-muted"/>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-white hover:border-primary hover:text-primary transition-colors text-sm font-medium text-text text-left shadow-sm">
                      <span className="flex items-center gap-2"><FileText size={16}/> Grammar Check</span>
                      <ChevronRight size={16} className="text-muted"/>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-white hover:border-primary hover:text-primary transition-colors text-sm font-medium text-text text-left shadow-sm">
                      <span className="flex items-center gap-2"><Search size={16}/> SEO & Marketing Caption</span>
                      <ChevronRight size={16} className="text-muted"/>
                    </button>
                  </div>
               </div>
            </motion.div>

            {/* 5. LATEST REVIEWS */}
            <motion.div variants={fadeUp} className="bg-white rounded-[24px] border border-transparent hover:border-primary/10 p-6 shadow-soft transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold font-heading text-text flex items-center gap-2"><MessageSquare size={18}/> Latest Reviews</h3>
                <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
              </div>
              <TimelineCard 
                activities={reviewTimeline}
                emptyState={<EmptyState icon={MessageSquare} title="No reviews yet" description="Publish a book and wait for readers." className="p-4 border-none bg-transparent"/>}
              />
            </motion.div>

          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
