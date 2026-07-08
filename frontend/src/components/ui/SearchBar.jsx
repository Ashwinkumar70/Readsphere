import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function SearchBar({
  placeholder = 'Search books, authors, clubs...',
  onSearch,
  className = '',
  size = 'md',
}) {
  const [query, setQuery] = useState('');

  const sizes = {
    sm: 'py-2 px-4 pl-9 text-sm',
    md: 'py-2.5 px-4 pl-10 text-sm',
    lg: 'py-3 px-5 pl-12 text-base',
  };

  const iconSizes = {
    sm: 'left-2.5 top-2.5',
    md: 'left-3 top-3',
    lg: 'left-3.5 top-3.5',
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const clear = () => {
    setQuery('');
    onSearch?.('');
  };

  return (
    <div className={clsx('relative', className)}>
      <Search
        size={size === 'lg' ? 18 : 16}
        className={clsx('absolute text-muted pointer-events-none', iconSizes[size])}
      />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-xl border border-border bg-white transition-all outline-none',
          'focus:border-primary focus:ring-2 focus:ring-primary/10',
          'placeholder:text-muted/60',
          sizes[size],
          query && 'pr-8'
        )}
      />
      {query && (
        <button
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
