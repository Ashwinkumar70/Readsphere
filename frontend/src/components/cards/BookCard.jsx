import { motion } from 'framer-motion';
import { Star, BookOpen, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLikeBook } from '../../store/slices/librarySlice';
import Badge from '../ui/Badge.jsx';

export default function BookCard({ book, size = 'md', showProgress = false }) {
  const dispatch = useDispatch();
  const likedBookIds = useSelector(state => state.library.likedBookIds);
  const liked = likedBookIds.includes(book.id);

  const sizes = {
    sm: { card: 'w-36', cover: 'h-48', title: 'text-sm', compact: true },
    md: { card: 'w-44', cover: 'h-60', title: 'text-sm', compact: false },
    lg: { card: 'w-52', cover: 'h-72', title: 'text-base', compact: false },
  };

  const s = sizes[size];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`${s.card} shrink-0 group cursor-pointer`}
    >
      <Link to={`/books/${book.id}`}>
        <div className="relative mb-3">
          {/* Cover */}
          <div className={`${s.cover} rounded-[20px] overflow-hidden book-cover relative shadow-soft group-hover:shadow-soft-lg transition-all duration-300 ring-1 ring-black/5`}>
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 gap-2">
              <button className="flex-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 hover:bg-white transition-colors">
                <BookOpen size={12} />
                Preview
              </button>
              <button className="bg-primary text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 hover:bg-primary-600 transition-colors">
                <ShoppingCart size={12} />
              </button>
            </div>
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {book.is_free && <Badge color="success" size="xs">Free</Badge>}
              {(book.isBestseller || book.is_bestseller) && <Badge color="warning" size="xs">Bestseller</Badge>}
              {book.isPremium && <Badge color="premium" size="xs">Premium</Badge>}
              {(book.isTrending || book.is_trending) && !(book.isBestseller || book.is_bestseller) && <Badge color="new" size="xs">Trending</Badge>}
            </div>
          </div>

          {/* Like button */}
          <button
            onClick={(e) => { e.preventDefault(); dispatch(toggleLikeBook(book.id)); }}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all"
          >
            <Heart size={13} className={liked ? 'fill-red-500 text-red-500' : 'text-muted'} />
          </button>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className={`${s.title} font-bold text-text line-clamp-2 leading-tight group-hover:text-primary transition-colors`}>
            {book.title}
          </h3>
          <p className="text-xs text-muted font-medium">
            {typeof book.author === 'string' ? book.author : (book.author?.users?.name || 'Unknown')}
          </p>

          {!s.compact && (
            <div className="flex items-center gap-1 mt-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-text">{book.rating || 0}</span>
              <span className="text-xs text-muted">
                ({Array.isArray(book.reviews) ? book.reviews.length : (book.reviews || 0)})
              </span>
            </div>
          )}

          {showProgress && book.readProgress > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Reading</span>
                <span className="font-semibold text-primary">{book.readProgress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${book.readProgress}%` }} />
              </div>
            </div>
          )}

          {!s.compact && (
            <p className="text-sm font-bold text-primary mt-1">₹{book.price}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
