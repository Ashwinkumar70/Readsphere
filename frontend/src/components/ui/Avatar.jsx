import { clsx } from 'clsx';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
  '3xl': 'w-24 h-24 text-3xl',
};

export default function Avatar({
  src,
  name,
  size = 'md',
  className = '',
  online = false,
  ring = false,
}) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const colors = [
    'from-violet-500 to-purple-600',
    'from-blue-400 to-cyan-500',
    'from-green-400 to-emerald-600',
    'from-pink-400 to-rose-500',
    'from-amber-400 to-orange-500',
    'from-indigo-500 to-blue-600',
  ];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  return (
    <div className={clsx('relative inline-flex shrink-0', className)}>
      <div
        className={clsx(
          'rounded-full overflow-hidden flex items-center justify-center font-bold text-white',
          sizes[size],
          ring && 'ring-2 ring-white ring-offset-1 ring-offset-background',
          !src && `bg-gradient-to-br ${colors[colorIndex]}`
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-white rounded-full" />
      )}
    </div>
  );
}
