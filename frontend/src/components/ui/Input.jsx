import { clsx } from 'clsx';
import { forwardRef } from 'react';

import { motion } from 'framer-motion';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  iconRight,
  className = '',
  containerClass = '',
  type = 'text',
  size = 'md',
  ...props
}, ref) => {
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const shakeVariants = {
    error: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.3 } },
    normal: { x: 0 }
  };

  return (
    <motion.div 
      variants={shakeVariants}
      animate={error ? 'error' : 'normal'}
      className={clsx('flex flex-col gap-1.5', containerClass)}
    >
      {label && (
        <label className="text-sm font-semibold text-text">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-muted pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            'w-full rounded-xl border bg-white transition-all duration-200 outline-none placeholder-muted/60',
            'focus:border-primary focus:ring-2 focus:ring-primary/10',
            error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-border hover:border-primary/40',
            sizes[size],
            Icon && 'pl-10',
            iconRight && 'pr-10',
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 text-muted">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    </motion.div>
  );
});

Input.displayName = 'Input';
export default Input;
