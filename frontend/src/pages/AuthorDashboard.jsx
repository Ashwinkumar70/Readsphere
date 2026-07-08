import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UploadCloud, TrendingUp, IndianRupee, Users, BookOpen, Star, MoreVertical } from 'lucide-react';
import StatsCard from '../components/ui/StatsCard.jsx';
import ChartCard, { SimpleBarChart } from '../components/ui/ChartCard.jsx';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthorDashboard } from '../store/slices/authorSlice.js';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function AuthorDashboard() {
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector(state => state.author);

  useEffect(() => {
    dispatch(fetchAuthorDashboard());
  }, [dispatch]);

  if (loading || !dashboardData) {
    return (
      <div className="p-6 max-w-[1400px] flex items-center justify-center min-h-[50vh]">
        <p className="text-muted animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  const { stats, revenueData, books: authorBooks } = dashboardData;

  return (
    <div className="p-6 max-w-[1400px]">
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge color="premium" className="mb-2">Author Hub</Badge>
            <h1 className="text-2xl font-bold text-text">Overview</h1>
          </div>
          <Link to="/upload">
            <Button icon={UploadCloud} size="md">Publish New Book</Button>
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: IndianRupee, color: 'success', change: 18, changeLabel: 'vs last month' },
            { title: 'Books Sold', value: (stats?.booksSold || 0).toLocaleString(), icon: TrendingUp, color: 'primary', change: 12, changeLabel: 'vs last month' },
            { title: 'Total Readers', value: (stats?.totalReaders || 0).toLocaleString(), icon: Users, color: 'secondary', change: 24, changeLabel: 'all time' },
            { title: 'Avg Rating', value: stats?.avgRating || '0.0', icon: Star, color: 'warning', change: 2, changeLabel: 'vs last month' },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp}>
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={fadeUp}>
              <ChartCard
                title="Revenue Overview"
                subtitle="Monthly earnings from book sales"
                action={
                  <select className="text-sm border border-border rounded-lg px-2 py-1 outline-none">
                    <option>Last 6 Months</option>
                    <option>This Year</option>
                  </select>
                }
              >
                <div className="mt-4">
                  <SimpleBarChart
                    data={revenueData?.map(d => ({ label: d.name, value: d.value })) || []}
                    height={200}
                  />
                </div>
              </ChartCard>
            </motion.div>

            {/* Published Books List */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-5 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-text">Published Books</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted uppercase bg-gray-50 border-y border-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-tl-xl">Book</th>
                      <th className="px-4 py-3 font-semibold">Sales</th>
                      <th className="px-4 py-3 font-semibold">Revenue</th>
                      <th className="px-4 py-3 font-semibold">Rating</th>
                      <th className="px-4 py-3 font-semibold rounded-tr-xl"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {authorBooks?.map(book => {
                      // Generating the mock sales/revenue from the controller logic again for display consistency
                      const sold = Math.floor(Math.random() * 500); 
                      const revenue = (book.price || 0) * sold;
                      return (
                      <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={book.cover} alt={book.title} className="w-10 h-14 rounded object-cover shadow-sm" />
                            <div>
                              <p className="font-bold text-text truncate max-w-[200px]">{book.title}</p>
                              <Badge color="success" size="xs" className="mt-1">Published</Badge>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">{sold.toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-success">₹{revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span className="font-bold">{book.rating || 0}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-1.5 text-muted hover:bg-gray-200 rounded-md transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-5 shadow-soft">
              <h3 className="font-bold text-text mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button full variant="outline" className="justify-start border-gray-200">
                  <UploadCloud size={16} className="text-muted mr-2" /> Upload Draft
                </Button>
                <Button full variant="outline" className="justify-start border-gray-200">
                  <Users size={16} className="text-muted mr-2" /> Message Followers
                </Button>
                <Button full variant="outline" className="justify-start border-gray-200">
                  <DollarSign size={16} className="text-muted mr-2" /> Request Payout
                </Button>
              </div>
            </motion.div>

            {/* Reader Insights */}
            <motion.div variants={fadeUp} className="bg-gradient-primary rounded-2xl p-6 text-white shadow-card relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BookOpen size={100} />
              </div>
              <div className="relative">
                <Badge className="bg-white/20 text-white border-white/20 mb-4">Insights</Badge>
                <h3 className="text-lg font-bold mb-2">Did you know?</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  78% of your readers finish your books within the first 3 days. Your most highlighted chapter is Chapter 4 of "Project Hail Mary".
                </p>
                <Button variant="white" size="sm">View Deep Analytics</Button>
              </div>
            </motion.div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
