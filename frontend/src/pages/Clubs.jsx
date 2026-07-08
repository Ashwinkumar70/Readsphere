import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClubs } from '../store/slices/clubSlice.js';
import ClubCard from '../components/cards/ClubCard.jsx';
import Button from '../components/ui/Button.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function Clubs() {
  const dispatch = useDispatch();
  const { clubs, loading } = useSelector(state => state.clubs);

  useEffect(() => {
    dispatch(fetchClubs());
  }, [dispatch]);

  // Temporary mock split until API supports returning joined status natively
  const myClubs = clubs.filter(c => c.isJoined);
  const discoverClubs = clubs.filter(c => !c.isJoined);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <p className="text-muted animate-pulse">Loading clubs...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Reading Clubs</h1>
            <p className="text-muted">Join communities, discuss books, and make friends.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Find a club..."
                className="pl-10 pr-4 py-2 rounded-xl border border-border bg-white text-sm outline-none focus:border-primary w-full sm:w-64"
              />
            </div>
            <Button icon={Plus}>Create Club</Button>
          </div>
        </motion.div>

        {/* My Clubs */}
        {myClubs.length > 0 && (
          <motion.div variants={fadeUp} className="mb-10">
            <h2 className="text-xl font-bold text-text mb-4">Your Clubs</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myClubs.map(club => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Discover */}
        <motion.div variants={fadeUp}>
          <h2 className="text-xl font-bold text-text mb-4">Discover New Clubs</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {discoverClubs.length > 0 ? discoverClubs.map(club => (
              <ClubCard key={club.id} club={club} />
            )) : (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-border shadow-soft">
                <p className="text-muted">No clubs found to discover.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
