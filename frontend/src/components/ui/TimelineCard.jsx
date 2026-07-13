import { motion } from 'framer-motion';

export default function TimelineCard({ activities = [], emptyState, className = "" }) {
  if (!activities || activities.length === 0) {
    return emptyState || (
      <div className="text-sm text-muted p-4 text-center border border-dashed rounded-xl border-gray-200">
        No recent activity.
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {activities.map((activity, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-6 border-l-2"
          style={{ borderColor: activity.color || '#E2E8F0' }}
        >
          <div 
            className="absolute -left-[9px] top-0 w-4 h-4 rounded-full ring-4 ring-white" 
            style={{ backgroundColor: activity.color || '#94A3B8' }}
          />
          <p className="text-xs text-muted mb-1">{activity.time}</p>
          <p className="text-sm font-semibold text-text">{activity.title}</p>
          {activity.description && (
            <p className="text-sm text-muted mt-1">{activity.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
