import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLikeBook } from '../../store/slices/librarySlice';
import { addToCart } from '../../store/slices/cartSlice';
import Badge from '../ui/Badge.jsx';

export default function BookCard({ book, size = 'md', showProgress = false }) {
  const dispatch = useDispatch();
  const likedBookIds = useSelector(state => state.library.likedBookIds);
  const liked = likedBookIds.includes(book.id);

  const sizes = {
    sm: { card: 'w-40', cover: 'h-56', title: 'text-sm', compact: true },
    md: { card: 'w-48', cover: 'h-64', title: 'text-base', compact: false },
    lg: { card: 'w-56', cover: 'h-80', title: 'text-lg', compact: false },
  };

  const s = sizes[size];

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`${s.card} shrink-0 group flex flex-col h-full cursor-pointer bg-white rounded-2xl border border-transparent hover:border-border hover:shadow-soft-lg transition-all duration-300 p-2`}
    >
      <Link to={`/books/${book.id}`} className="block relative mb-3 overflow-hidden rounded-xl">
        {/* Cover */}
        <div className={`${s.cover} relative bg-gray-100 overflow-hidden shadow-soft transition-all duration-500 group-hover:shadow-lg ring-1 ring-black/5`}>
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-xl">
              <Eye size={20} />
            </motion.div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {book.is_free && <Badge color="success" size="xs" className="shadow-sm">Free</Badge>}
            {(book.isBestseller || book.is_bestseller) && <Badge color="warning" size="xs" className="shadow-sm">Bestseller</Badge>}
            {book.isPremium && <Badge color="premium" size="xs" className="shadow-sm">Premium</Badge>}
          </div>

          {/* Wishlist Floating Button */}
          <button
            onClick={(e) => { e.preventDefault(); dispatch(toggleLikeBook(book.id)); }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
          >
            <Heart size={14} className={liked ? 'fill-red-500 text-red-500' : 'text-muted hover:text-text transition-colors'} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 px-1">
        <Link to={`/books/${book.id}`}>
          <h3 className={`${s.title} font-heading font-bold text-text line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-1`}>
            {book.title}
          </h3>
          <p className="text-xs text-muted font-medium mb-2">
            {typeof book.author === 'string' ? book.author : (book.author?.users?.name || 'Unknown')}
          </p>
        </Link>

        {/* Category & Rating */}
        {!s.compact && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 mt-auto">
            {book.genre && <Badge color="muted" size="xs">{book.genre}</Badge>}
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-text">{book.rating || 0}</span>
            </div>
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <p className="text-base font-bold text-primary">
            {book.is_free ? 'Free' : `₹${book.price}`}
          </p>
          {!s.compact && (
            <button 
              onClick={(e) => { 
                e.preventDefault(); 
                dispatch(addToCart({ bookId: book.id, quantity: 1 })); 
              }}
              className="bg-primary/10 hover:bg-primary text-primary hover:text-white p-2 rounded-lg transition-colors flex items-center justify-center"
              title="Add to Cart"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
