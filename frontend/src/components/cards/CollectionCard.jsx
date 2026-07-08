import { motion } from 'framer-motion';
import { BookOpen, Heart, Lock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CollectionCard({ collection }) {
  const gradients = [
    'from-violet-500 via-purple-500 to-indigo-600',
    'from-blue-400 via-cyan-500 to-teal-500',
    'from-green-400 via-emerald-500 to-teal-600',
    'from-pink-400 via-rose-500 to-red-500',
    'from-amber-400 via-orange-500 to-red-500',
    'from-indigo-500 via-blue-500 to-cyan-500',
  ];

  const gradient = gradients[collection.id % gradients.length];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden group cursor-pointer"
    >
      <Link to={`/collections/${collection.id}`}>
        {/* Cover */}
        <div className={`h-32 bg-gradient-to-br ${gradient} relative flex items-center justify-center`}>
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
          <BookOpen size={40} className="text-white/80" />
          <div className="absolute top-3 right-3">
            {(collection.isPublic || collection.is_public)
              ? <Globe size={14} className="text-white/70" />
              : <Lock size={14} className="text-white/70" />
            }
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-text mb-1 group-hover:text-primary transition-colors">
            {collection.name}
          </h3>
          <p className="text-xs text-muted line-clamp-1 mb-3">{collection.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <BookOpen size={11} />
                <span className="font-semibold text-text">{collection.collection_books?.length || collection.bookCount || 0}</span> books
              </span>
              {(collection.isPublic || collection.is_public) && (
                <span className="flex items-center gap-1">
                  <Heart size={11} />
                  <span className="font-semibold text-text">{collection.likes || 0}</span>
                </span>
              )}
            </div>
            <span className="text-xs text-muted">by {collection.author || 'You'}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
