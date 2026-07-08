import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollections } from '../store/slices/librarySlice.js';
import CollectionCard from '../components/cards/CollectionCard.jsx';
import Button from '../components/ui/Button.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function Collections() {
  const [tab, setTab] = useState('all'); // all, public, private
  const dispatch = useDispatch();
  const { collections, loading } = useSelector(state => state.library);

  useEffect(() => {
    dispatch(fetchCollections());
  }, [dispatch]);

  const filtered = collections.filter(c => {
    if (tab === 'public') return c.is_public;
    if (tab === 'private') return !c.is_public;
    return true;
  });

  if (loading && collections.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <p className="text-muted animate-pulse">Loading collections...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Collections</h1>
            <p className="text-muted">Curate and share your favorite reading lists.</p>
          </div>
          <Button icon={Plus}>Create Collection</Button>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeUp} className="flex gap-2 mb-8">
          {['all', 'public', 'private'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize border transition-all ${
                tab === t ? 'bg-primary text-white border-primary' : 'bg-white text-muted border-border hover:border-primary/40'
              }`}
            >
              {t} Collections
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div variants={stagger} className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.length > 0 ? (
            filtered.map(collection => (
              <motion.div key={collection.id} variants={fadeUp}>
                <CollectionCard collection={collection} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-border shadow-soft">
              <p className="text-muted">No collections found.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
