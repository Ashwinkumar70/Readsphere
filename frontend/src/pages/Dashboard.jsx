import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, Flame, Target, Calendar, ChevronRight, Play, Compass, Users, Flag, Search, Clock, Award, Star, FileText
} from 'lucide-react';
import BookCard from '../components/cards/BookCard.jsx';
import StatsCard from '../components/ui/StatsCard.jsx';
import ChartCard, { SimpleBarChart, ProgressRing } from '../components/ui/ChartCard.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Button from '../components/ui/Button.jsx';
import { useSelector } from 'react-redux';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function Dashboard() {
  const user = useSelector(state => state.auth.user);
  const { data } = useSelector(state => state.dashboard);

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8 bg-[#FDFBF7] p-8 rounded-3xl border border-border">

        {/* Header & Quick Actions */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatar} name={user?.name} size="xl" />
            <div>
              <p className="text-muted text-sm font-medium tracking-wide">Welcome back to your library</p>
              <h1 className="text-3xl font-bold text-primary">{user?.name}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/library"><Button icon={Play} size="sm" className="bg-primary hover:bg-primary-hover text-white">Continue Reading</Button></Link>
            <Link to="/marketplace"><Button icon={Compass} size="sm" variant="outline">Find Books</Button></Link>
            <Link to="/clubs"><Button icon={Users} size="sm" variant="outline">Join Club</Button></Link>
            <Button icon={Flag} size="sm" variant="outline">Start Challenge</Button>
            <Button icon={Search} size="sm" variant="ghost" />
          </div>
        </motion.div>

        {/* Extended Stats Grid */}
        <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
          <StatsCard title="Books Read" value={data?.booksRead || 0} icon={BookOpen} />
          <StatsCard title="Pages Read" value={data?.pagesRead || 0} icon={FileText} />
          <StatsCard title="Reading Streak" value={`${data?.readingStreak || 0} Days`} icon={Flame} color="warning" />
          <StatsCard title="Reading Goal" value={data?.readingGoal || 20} icon={Target} />
          <StatsCard title="Reading Time" value="14h" icon={Clock} />
          <StatsCard title="Current Books" value={data?.currentlyReading?.length || 0} icon={BookOpen} />
          <StatsCard title="Favorite Genre" value="Sci-Fi" icon={Star} />
          <StatsCard title="Reading Level" value="Avid" icon={Award} color="primary" />
        </motion.div>

        {/* Main Reading Flow */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Reading (Warm, immersive view) */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text flex items-center gap-2"><BookOpen className="text-primary"/> Continue Reading</h2>
                <Link to="/library" className="text-sm font-medium text-primary hover:underline">View Library</Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {data?.currentlyReading?.length > 0 ? (
                  data.currentlyReading.map(book => (
                    <div key={book.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow group flex gap-4">
                      <img src={book.cover} alt={book.title} className="w-20 h-28 object-cover rounded-lg shadow-sm" />
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-text group-hover:text-primary transition-colors line-clamp-1">{book.title}</h3>
                        <p className="text-xs text-muted mb-3">{book.author}</p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${book.readProgress}%` }} />
                        </div>
                        <p className="text-xs text-muted">{book.readProgress}% complete</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 bg-white rounded-2xl border border-border border-dashed p-8 text-center">
                    <p className="text-muted">You are not reading any books currently.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reading Activity & Heatmap */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold text-text mb-4">Reading Heatmap</h2>
              <div className="h-32 bg-gray-50 rounded-xl border border-border flex items-center justify-center">
                <p className="text-muted text-sm">[Heatmap Widget Placeholder]</p>
              </div>
            </motion.div>

            {/* Discover Books Row */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text">Recommended For You</h2>
                <Link to="/marketplace"><Button variant="ghost" size="sm" icon={ChevronRight} iconRight>Discover</Button></Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {data?.recommendations?.length > 0 ? (
                  data.recommendations.map(book => (
                    <BookCard key={book.id} book={book} size="sm" className="min-w-[140px]" />
                  ))
                ) : (
                  <p className="text-sm text-muted">No recommendations available yet.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar Widgets */}
          <div className="space-y-8">
            
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-text mb-4">Weekly Reading Chart</h3>
              <SimpleBarChart data={[]} height={150} />
              <p className="text-xs text-center text-muted mt-2">Pages read per day</p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-text mb-4 flex items-center gap-2"><Calendar size={18}/> Reading Calendar</h3>
              <div className="space-y-4">
                <div className="text-sm border-l-2 border-primary pl-3 py-1">
                  <p className="font-bold">Book Club Meeting</p>
                  <p className="text-xs text-muted">Today, 7:00 PM</p>
                </div>
                <div className="text-sm border-l-2 border-accent pl-3 py-1">
                  <p className="font-bold">Finish "Dune"</p>
                  <p className="text-xs text-muted">Goal for Friday</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-text mb-4 flex items-center gap-2"><Users size={18}/> Book Club Invitations</h3>
              <p className="text-sm text-muted">No pending invitations.</p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-text mb-4 flex items-center gap-2"><Star size={18}/> Latest Reviews</h3>
              <p className="text-sm text-muted">Write your first review!</p>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
