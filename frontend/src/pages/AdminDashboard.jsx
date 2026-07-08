import { motion } from 'framer-motion';
import { Shield, Users, BookOpen, AlertCircle, TrendingUp, DollarSign, Activity, CheckCircle, XCircle } from 'lucide-react';
import StatsCard from '../components/ui/StatsCard.jsx';
import ChartCard, { SimpleBarChart } from '../components/ui/ChartCard.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import Avatar from '../components/ui/Avatar.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

// Mock data for Admin Dashboard
const pendingApprovals = [
  { id: 1, title: 'The Quantum Edge', author: 'Dr. Emily Chen', date: '2 hours ago', status: 'Pending' },
  { id: 2, title: 'Echoes of Eternity', author: 'Marcus V.', date: '4 hours ago', status: 'Pending' },
  { id: 3, title: 'Startup Playbook', author: 'Sarah Jenkins', date: '5 hours ago', status: 'Pending' },
];

const recentUsers = [
  { id: 1, name: 'Alex Thompson', role: 'Reader', joined: '10 mins ago', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Maria Garcia', role: 'Author', joined: '1 hour ago', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'James Wilson', role: 'Reader', joined: '2 hours ago', avatar: 'https://i.pravatar.cc/150?u=3' },
];

const revenueData = [
  { label: 'Mon', value: 1200 },
  { label: 'Tue', value: 1900 },
  { label: 'Wed', value: 1500 },
  { label: 'Thu', value: 2200 },
  { label: 'Fri', value: 2800 },
  { label: 'Sat', value: 3400 },
  { label: 'Sun', value: 3100 },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-[1400px]">
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={20} className="text-primary" />
              <Badge color="primary">Admin Portal</Badge>
            </div>
            <h1 className="text-2xl font-bold text-text">Platform Overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={Activity}>System Status</Button>
            <Button icon={AlertCircle}>Reported Content</Button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Total Users', value: '1.2M', icon: Users, color: 'primary', change: 12, changeLabel: 'vs last month' },
            { title: 'Platform Revenue', value: '$245K', icon: DollarSign, color: 'success', change: 8, changeLabel: 'vs last month' },
            { title: 'Books Published', value: '52,431', icon: BookOpen, color: 'secondary', change: 5, changeLabel: 'this week' },
            { title: 'Active Clubs', value: '48,102', icon: TrendingUp, color: 'warning', change: 2, changeLabel: 'this week' },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp}>
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={fadeUp}>
              <ChartCard
                title="Weekly Revenue"
                subtitle="Platform gross revenue across all plans and sales"
                action={
                  <select className="text-sm border border-border rounded-lg px-2 py-1 outline-none">
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
                }
              >
                <div className="mt-4">
                  <SimpleBarChart data={revenueData} height={200} />
                </div>
              </ChartCard>
            </motion.div>

            {/* Pending Approvals */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-5 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-text flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" /> Pending Book Approvals
                </h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted uppercase bg-gray-50 border-y border-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-tl-xl">Book Title</th>
                      <th className="px-4 py-3 font-semibold">Author</th>
                      <th className="px-4 py-3 font-semibold">Submitted</th>
                      <th className="px-4 py-3 font-semibold rounded-tr-xl text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pendingApprovals.map(book => (
                      <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-text">{book.title}</td>
                        <td className="px-4 py-3 font-medium text-muted">{book.author}</td>
                        <td className="px-4 py-3 text-muted">{book.date}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-success hover:bg-green-50 rounded-md transition-colors" title="Approve">
                              <CheckCircle size={18} />
                            </button>
                            <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Reject">
                              <XCircle size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* System Status */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-5 shadow-soft">
              <h3 className="font-bold text-text mb-4">System Status</h3>
              <div className="space-y-4">
                {[
                  { label: 'AI Reading Engine', status: 'Operational', color: 'success' },
                  { label: 'Payment Gateway', status: 'Operational', color: 'success' },
                  { label: 'Book Processing', status: 'Delayed', color: 'warning' },
                ].map((sys, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text">{sys.label}</span>
                    <Badge color={sys.color} size="xs">{sys.status}</Badge>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Users */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text">Recent Registrations</h3>
              </div>
              <div className="space-y-4">
                {recentUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text truncate">{user.name}</p>
                      <p className="text-xs text-muted">{user.joined}</p>
                    </div>
                    <Badge color={user.role === 'Author' ? 'primary' : 'muted'} size="xs">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button full variant="outline" size="sm" className="mt-5">View All Users</Button>
            </motion.div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
