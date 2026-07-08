import { Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import Avatar from '../ui/Avatar.jsx';
import { formatDistanceToNow } from 'date-fns';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={13}
          className={i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function ReviewCard({ review }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(review.likes);

  const handleLike = () => {
    if (liked) {
      setLikes(l => l - 1);
    } else {
      setLikes(l => l + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-soft">
      <div className="flex items-start gap-3 mb-3">
        <Avatar src={review.avatar} name={review.user} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-text text-sm">{review.user}</span>
            <StarRating rating={review.rating} />
          </div>
          <p className="text-xs text-muted">
            {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
          </p>
        </div>
      </div>
      <p className="text-sm text-text/80 leading-relaxed mb-3">{review.content}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            liked
              ? 'bg-primary-50 text-primary'
              : 'text-muted hover:bg-gray-100 hover:text-text'
          }`}
        >
          <ThumbsUp size={12} className={liked ? 'fill-primary' : ''} />
          {likes} helpful
        </button>
      </div>
    </div>
  );
}
