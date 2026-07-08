import { clsx } from 'clsx';

const colorMap = {
  primary: 'bg-primary-50 text-primary-600 border-primary-100',
  secondary: 'bg-blue-50 text-blue-600 border-blue-100',
  success: 'bg-green-50 text-green-700 border-green-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-red-50 text-red-600 border-red-100',
  muted: 'bg-gray-100 text-muted border-gray-200',
  premium: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white border-transparent',
  new: 'bg-gradient-to-r from-primary-500 to-secondary-400 text-white border-transparent',
};

const sizes = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1 text-xs',
};

export default function Badge({
  children,
  color = 'primary',
  size = 'sm',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold rounded-full border',
        colorMap[color],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full',
          color === 'success' ? 'bg-green-500' :
          color === 'warning' ? 'bg-amber-500' :
          color === 'danger' ? 'bg-red-500' :
          color === 'muted' ? 'bg-gray-400' : 'bg-primary'
        )} />
      )}
      {children}
    </span>
  );
}
