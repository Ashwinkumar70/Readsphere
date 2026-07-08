import { motion } from 'framer-motion';
import { Users, BookOpen, Lock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';

export default function ClubCard({ club }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden group"
    >
      {/* Cover Image */}
      <div className="h-36 relative overflow-hidden">
        <img
          src={club.cover}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            club.isPublic ? 'bg-white/90 text-green-600' : 'bg-white/90 text-muted'
          }`}>
            {club.isPublic ? <Globe size={10} /> : <Lock size={10} />}
            {club.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
        {club.isJoined && (
          <div className="absolute top-3 left-3">
            <Badge color="success" size="xs" dot>Joined</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-text mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {club.name}
        </h3>
        <p className="text-xs text-muted line-clamp-2 mb-3">{club.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {club.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-primary-50 text-primary text-xs rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted mb-4">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span className="font-semibold text-text">{club.members.toLocaleString()}</span>
            <span>members</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={12} />
            <span className="font-semibold text-text">{club.books}</span>
            <span>books</span>
          </div>
        </div>

        {/* Current book */}
        <p className="text-xs text-muted mb-4">
          Reading: <span className="font-semibold text-text">{club.currentBook}</span>
        </p>

        <Link to={`/clubs/${club.id}`}>
          <Button
            variant={club.isJoined ? 'outline' : 'primary'}
            size="sm"
            full
          >
            {club.isJoined ? 'View Club' : 'Join Club'}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
