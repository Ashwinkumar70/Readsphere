import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, children, action, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={`bg-white rounded-2xl border border-border p-5 shadow-soft ${className}`}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-text">{title}</h3>
          {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </motion.div>
  );
}

// Simple bar chart built with divs
export function SimpleBarChart({ data, height = 120 }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / max) * (height - 24)}px` }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
            className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-300 min-h-[4px]"
            title={`${item.label}: ${item.value}`}
          />
          <span className="text-xs text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Simple line progress
export function ProgressRing({ value, size = 80, strokeWidth = 6, color = '#6D5DFC' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-sm font-bold text-text">{value}%</span>
    </div>
  );
}
