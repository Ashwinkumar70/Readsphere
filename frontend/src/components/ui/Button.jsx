import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const variants = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm hover:shadow-glow-sm border-transparent',
  secondary: 'bg-secondary-50 text-secondary-500 border border-secondary-200 hover:bg-secondary-100',
  outline: 'bg-white text-primary border border-primary-300 hover:bg-primary-50',
  ghost: 'bg-transparent text-muted hover:bg-gray-100 border-transparent',
  danger: 'bg-red-500 text-white hover:bg-red-600 border-transparent shadow-sm',
  success: 'bg-success text-white hover:bg-green-600 border-transparent shadow-sm',
  white: 'bg-white text-text border border-border hover:bg-gray-50 shadow-soft',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight,
  full = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={disabled || loading ? {} : { scale: 1.03, y: -2 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 border cursor-pointer select-none',
        variants[variant],
        sizes[size],
        full && 'w-full',
        (disabled || loading) && 'opacity-60 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon && !iconRight ? (
        <Icon size={size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'lg' ? 18 : size === 'xl' ? 20 : 16} />
      ) : null}
      {children}
      {Icon && iconRight ? (
        <Icon size={size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'lg' ? 18 : size === 'xl' ? 20 : 16} />
      ) : null}
    </motion.button>
  );
}
