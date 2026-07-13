import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, Flame, Target, ChevronRight, Play, Compass, Users, Flag, Search, Clock, Award, Star, FileText,
  Sparkles, TrendingUp, Calendar, Zap, MessageCircle, Map, Layout, Coffee, ChevronLeft, CheckCircle, BarChart2,
  BookMarked
} from 'lucide-react';
import BookCard from '../components/cards/BookCard.jsx';
import StatsCard from '../components/ui/StatsCard.jsx';
import ChartCard, { SimpleBarChart } from '../components/ui/ChartCard.jsx';
import AnalyticsCard from '../components/ui/AnalyticsCard.jsx';
import TimelineCard from '../components/ui/TimelineCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useSelector } from 'react-redux';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function Dashboard() {
  const user = useSelector(state => state.auth.user);
  const { data } = useSelector(state => state.dashboard);

  const currentBook = data?.currentlyReading?.[0];

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-10 pb-12">

        {/* 1. WELCOME HERO */}
        <motion.div variants={fadeUp} className="relative overflow-hidden bg-gradient-primary rounded-[32px] p-8 md:p-12 text-white shadow-soft-lg">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4 text-white/80 font-medium">
                <Coffee size={16} />
                <span>Good Morning,</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">{user?.name}</h1>
              {currentBook ? (
                <p className="text-lg text-white/90 mb-8 font-light leading-relaxed">
                  You're reading <span className="font-semibold text-white">"{currentBook.title}"</span>. <br/>You are at {currentBook.readProgress}% completion.
                </p>
              ) : (
                <p className="text-lg text-white/90 mb-8 font-light">
                  Ready to dive into a new world today? Find your next great read.
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {currentBook ? (
                  <Link to="/library">
                    <Button icon={Play} className="bg-white text-primary hover:bg-gray-50 border-none shadow-soft">Resume Reading</Button>
                  </Link>
                ) : (
                  <Link to="/marketplace">
                    <Button icon={Compass} className="bg-white text-primary hover:bg-gray-50 border-none shadow-soft">Discover Books</Button>
                  </Link>
                )}
              </div>
            </div>
            
            {/* Quick Hero Stats */}
            <div className="flex gap-6 shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <div className="text-center px-4 border-r border-white/20 last:border-0">
                <div className="flex items-center justify-center gap-1.5 text-accent mb-1">
                  <Flame size={18} className="fill-accent"/>
                  <span className="font-bold">{data?.readingStreak || 0}</span>
                </div>
                <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">Streak</p>
              </div>
              <div className="text-center px-4 border-r border-white/20 last:border-0">
                <div className="flex items-center justify-center gap-1.5 text-white mb-1">
                  <Target size={18} />
                  <span className="font-bold">{data?.readingGoal || 0}</span>
                </div>
                <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">Goal</p>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN - Primary Flow */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 2. CONTINUE READING */}
            <motion.div variants={fadeUp} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-text flex items-center gap-2">
                  <BookOpen className="text-primary"/> Continue Reading
                </h2>
                <Link to="/library" className="text-sm font-semibold text-muted hover:text-primary transition-colors">Library</Link>
              </div>
              
              {currentBook ? (
                <div className="bg-white rounded-[24px] border border-transparent hover:border-primary/10 p-6 shadow-soft transition-colors flex flex-col sm:flex-row gap-6">
                  <div className="w-32 shrink-0">
                    <img src={currentBook.cover} alt="Cover" className="w-full aspect-[2/3] object-cover rounded-xl shadow-soft" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-text font-heading mb-1">{currentBook.title}</h3>
                        <p className="text-muted">{currentBook.author}</p>
                      </div>
                      <Link to="/library">
                        <Button icon={Play} className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-primary text-white shadow-soft shrink-0" />
                      </Link>
                    </div>
                    
                    <div className="mt-auto pt-6">
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-primary">{currentBook.readProgress}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${currentBook.readProgress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState 
                  icon={BookOpen}
                  title="Your library is waiting"
                  description="Discover new worlds and stories. Find your next great read in the marketplace."
                  actionLabel="Browse Books"
                  actionLink="/marketplace"
                />
              )}
            </motion.div>

            {/* 3. READING METRICS */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatsCard title="Completed" value={data?.booksRead || 0} icon={CheckCircle} color="success" />
              <StatsCard title="Pages Read" value={(data?.pagesRead || 0).toLocaleString()} icon={FileText} />
              <StatsCard title="Reading Time" value={data?.readingTime || "0h"} icon={Clock} color="secondary" />
              <StatsCard title="In Progress" value={data?.currentlyReading?.length || 0} icon={Layout} color="warning" />
            </motion.div>

            {/* 4. ANALYTICS */}
            <motion.div variants={fadeUp} className="space-y-4">
              <h2 className="text-xl font-heading font-bold text-text flex items-center gap-2">
                <BarChart2 className="text-primary"/> Reading Analytics
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <AnalyticsCard title="Weekly Reading" subtitle="Pages read per day">
                  {data?.weeklyReadingChart?.length > 0 ? (
                    <SimpleBarChart data={data.weeklyReadingChart} height={140} />
                  ) : (
                    <EmptyState icon={BarChart2} title="No data yet" description="Start reading to see your progress." className="mt-4 p-4 shadow-none border-none bg-transparent" />
                  )}
                </AnalyticsCard>
                <AnalyticsCard title="Genre Distribution" subtitle="Your favorite categories">
                  {data?.genreDistribution?.length > 0 ? (
                    <SimpleBarChart data={data.genreDistribution} height={140} />
                  ) : (
                    <EmptyState icon={BarChart2} title="No data yet" description="Start reading to generate insights." className="mt-4 p-4 shadow-none border-none bg-transparent" />
                  )}
                </AnalyticsCard>
              </div>
            </motion.div>

            {/* 5. RECOMMENDATIONS */}
            <motion.div variants={fadeUp} className="space-y-4">
              <h2 className="text-xl font-heading font-bold text-text flex items-center gap-2">
                <Star className="text-primary"/> Because You Liked Sci-Fi
              </h2>
              <div className="flex gap-5 overflow-x-auto pb-4 custom-scrollbar snap-x">
                {data?.recommendations?.length > 0 ? (
                  data.recommendations.map(book => (
                    <div key={book.id} className="snap-start shrink-0 w-40">
                      <BookCard book={book} size="md" className="border-none shadow-none bg-transparent hover:-translate-y-1 transition-transform" />
                    </div>
                  ))
                ) : (
                  <EmptyState icon={Compass} title="No recommendations" description="We need more reading data to recommend books." actionLabel="Discover Books" actionLink="/marketplace" />
                )}
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN - Widgets */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* 6. AI ASSISTANT */}
            <motion.div variants={fadeUp} className="bg-gradient-card rounded-[24px] border border-border p-6 shadow-soft relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-50 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="font-bold font-heading text-text">AI Assistant</h3>
                </div>
                <p className="text-sm text-muted mb-5">Quick actions for your current read.</p>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="justify-start text-sm border-border hover:border-accent hover:text-accent bg-white shadow-sm"><FileText size={16} className="mr-3 text-muted"/> Summarize Chapter</Button>
                  <Button variant="outline" className="justify-start text-sm border-border hover:border-accent hover:text-accent bg-white shadow-sm"><MessageCircle size={16} className="mr-3 text-muted"/> Explain Concept</Button>
                  <Button variant="outline" className="justify-start text-sm border-border hover:border-accent hover:text-accent bg-white shadow-sm"><Zap size={16} className="mr-3 text-muted"/> Take a Quiz</Button>
                  <Button variant="outline" className="justify-start text-sm border-border hover:border-accent hover:text-accent bg-white shadow-sm"><Map size={16} className="mr-3 text-muted"/> Translate Page</Button>
                </div>
              </div>
            </motion.div>
            
            {/* 7. RECENT ACTIVITY */}
            <motion.div variants={fadeUp} className="bg-white rounded-[24px] border border-transparent p-6 shadow-soft hover:border-primary/10 transition-colors">
              <h3 className="font-bold font-heading text-text mb-6 flex items-center gap-2"><Clock size={18}/> Recent Activity</h3>
              <TimelineCard 
                activities={data?.recentActivity} 
                emptyState={<EmptyState icon={Clock} title="No activity" description="Your reading journey begins here." className="p-4 bg-transparent border-none" />}
              />
            </motion.div>

            {/* 8. COMMUNITY */}
            <motion.div variants={fadeUp} className="bg-white rounded-[24px] border border-transparent p-6 shadow-soft hover:border-primary/10 transition-colors">
              <h3 className="font-bold font-heading text-text mb-4 flex items-center gap-2"><Users size={18}/> Community</h3>
              {data?.clubs?.length > 0 ? (
                <div className="space-y-4">
                  {data.clubs.map((club, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-border flex items-center justify-center text-muted">
                        <Users size={16}/>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-text">{club.name}</p>
                        <p className="text-xs text-muted">Active now</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Users} title="No clubs yet" description="Join a book club to connect." actionLabel="Find Clubs" actionLink="/clubs" className="p-4 bg-transparent border-none" />
              )}
            </motion.div>

          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}


