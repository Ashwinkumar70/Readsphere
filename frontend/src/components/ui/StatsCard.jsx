import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

export default function StatsCard({ title, value, change, changeLabel, icon: Icon, color = 'primary', className = '' }) {
  const colors = {
    primary: { bg: 'bg-primary-50', text: 'text-primary', icon: 'text-primary-500' },
    secondary: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    success: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'text-amber-500' },
    danger: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
  };

  const c = colors[color] || colors.primary;
  const isPositive = change >= 0;

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 40px 0 rgba(109, 93, 252, 0.12)' }}
      className={clsx(
        'bg-white rounded-2xl border border-border p-5 shadow-soft',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('p-2.5 rounded-xl', c.bg)}>
          {Icon && <Icon size={20} className={c.icon} />}
        </div>
        {change !== undefined && (
          <div className={clsx(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
            isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-text tracking-tight">{value}</p>
        <p className="text-sm text-muted font-medium">{title}</p>
        {changeLabel && (
          <p className="text-xs text-muted/70">{changeLabel}</p>
        )}
      </div>
    </motion.div>
  );
}
