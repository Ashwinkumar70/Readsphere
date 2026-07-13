import { motion } from 'framer-motion';

export default function AnalyticsCard({ title, subtitle, children, action, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 12px 40px -4px rgba(0, 0, 0, 0.08)' }}
      className={`bg-white rounded-[24px] border border-transparent hover:border-primary/10 p-6 shadow-soft transition-colors ${className}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-bold text-text">{title}</h3>
          {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </motion.div>
  );
}
