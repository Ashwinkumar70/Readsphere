import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UploadCloud, TrendingUp, IndianRupee, Users, BookOpen, Star, 
  BarChart2, Edit3, MessageSquare, Globe, Activity, Download, PieChart, FileText
} from 'lucide-react';
import StatsCard from '../components/ui/StatsCard.jsx';
import ChartCard, { SimpleBarChart, ProgressRing } from '../components/ui/ChartCard.jsx';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function AuthorDashboard() {
  const { data } = useSelector(state => state.dashboard);

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8 p-8 bg-gray-50 rounded-3xl border border-gray-200">

        {/* Header - Studio Feel */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-200">
          <div>
            <Badge color="premium" className="mb-2 bg-gray-900 text-white border-gray-900">Publishing Studio</Badge>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Author Workspace</h1>
            <p className="text-gray-500 mt-1">Manage your books, track performance, and grow your audience.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/upload"><Button icon={UploadCloud} size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">Upload Book</Button></Link>
            <Button icon={Edit3} size="sm" variant="outline" className="border-gray-300 text-gray-700">Edit Draft</Button>
            <Button icon={BarChart2} size="sm" variant="outline" className="border-gray-300 text-gray-700">View Analytics</Button>
          </div>
        </motion.div>

        {/* Deep Stats Grid */}
        <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Total Revenue" value={`₹${(data?.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={IndianRupee} color="success" />
          <StatsCard title="Monthly Sales" value={(data?.sales || 0).toLocaleString()} icon={TrendingUp} color="primary" />
          <StatsCard title="Total Readers" value={(data?.readers || 0).toLocaleString()} icon={Users} color="secondary" />
          <StatsCard title="Downloads" value={(data?.downloads || 0).toLocaleString()} icon={Download} color="warning" />
          <StatsCard title="Avg Rating" value={data?.averageRating || "0.0"} icon={Star} color="warning" />
          
          <StatsCard title="Published Books" value={(data?.publishedBooks || 0).toLocaleString()} icon={BookOpen} />
          <StatsCard title="Draft Books" value={(data?.draftBooks || 0).toLocaleString()} icon={FileText} />
          <StatsCard title="Followers" value="0" icon={Users} />
          <StatsCard title="Royalty Earned" value="₹0.00" icon={PieChart} />
          <StatsCard title="Profile Views" value="0" icon={Activity} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Analytics Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <ChartCard title="Revenue Graph" subtitle="Gross earnings over time">
                  <div className="mt-4">
                    <SimpleBarChart data={data?.monthlySalesChart || []} height={180} />
                  </div>
                </ChartCard>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <ChartCard title="Sales Graph" subtitle="Unit sales volume">
                  <div className="mt-4">
                    <SimpleBarChart data={data?.monthlySalesChart || []} height={180} />
                  </div>
                </ChartCard>
              </motion.div>
            </div>

            {/* Book Performance Table */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Book Performance</h2>
                <Button variant="ghost" size="sm">Download CSV</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-tl-xl">Title</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Downloads</th>
                      <th className="px-4 py-3 font-semibold">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data?.booksList?.length > 0 ? data.booksList.map(book => (
                      <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-bold text-gray-900 truncate max-w-[200px]">{book.title}</td>
                        <td className="px-4 py-4"><Badge color={book.status === 'Published' ? 'success' : 'default'} size="xs">{book.status}</Badge></td>
                        <td className="px-4 py-4 text-gray-600">{(book.downloads || 0).toLocaleString()}</td>
                        <td className="px-4 py-4 font-medium text-gray-900">₹{(book.price || 0).toLocaleString()}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No data available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Traffic Analytics */}
              <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Activity size={18}/> Traffic Analytics</h3>
                <p className="text-sm text-gray-500">No traffic data available yet.</p>
              </motion.div>
              {/* Country-wise Readers */}
              <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe size={18}/> Country-wise Readers</h3>
                <p className="text-sm text-gray-500">Insufficient geographic data.</p>
              </motion.div>
            </div>
          </div>

          {/* Right Sidebar - Social & Engagement */}
          <div className="space-y-8">
            
            <motion.div variants={fadeUp} className="bg-gray-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-white mb-2">Top Selling Book</h3>
              {data?.bestSellingBook ? (
                <div className="flex items-center gap-4 mt-4">
                  <div className="w-16 h-24 bg-gray-800 rounded flex-shrink-0" />
                  <div>
                    <p className="font-bold">{data.bestSellingBook.title}</p>
                    <p className="text-sm text-gray-400 mt-1">Leading sales this month</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-2">Publish a book to see rankings.</p>
              )}
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><MessageSquare size={18}/> Reader Reviews</h3>
                <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">Respond</span>
              </div>
              <div className="space-y-4">
                {data?.recentReviews?.length > 0 ? (
                  data.recentReviews.map((r, i) => (
                    <div key={i} className="text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-1 mb-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="font-bold">{r.rating}</span>
                      </div>
                      <p className="text-gray-600 line-clamp-2">"{r.comment}"</p>
                      <p className="text-xs text-gray-400 mt-1">- {r.reviewer}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No reviews to moderate.</p>
                )}
              </div>
            </motion.div>
            
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><IndianRupee size={18}/> Recent Purchases</h3>
              <div className="space-y-4">
                {data?.recentPurchases?.length > 0 ? (
                  data.recentPurchases.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">{p.bookTitle}</span>
                      <span className="font-bold text-success">+₹{p.amount}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent transactions.</p>
                )}
              </div>
            </motion.div>

          </div>
        </div>

      </motion.div>
    </DashboardLayout>
  );
}
