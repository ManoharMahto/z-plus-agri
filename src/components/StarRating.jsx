import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, reviewCount = null, size = "sm", showBadgeOnly = false }) {
  // Flipkart style badge (e.g. 4.8 ★ in green badge)
  if (showBadgeOnly) {
    return (
      <span className="inline-flex items-center gap-1 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
        {rating.toFixed(1)}
        <Star className="w-3 h-3 fill-current text-white inline" />
      </span>
    );
  }

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const starSizeClass = iconSizes[size] || iconSizes.sm;

  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-flex items-center gap-1 bg-green-700 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
        {rating.toFixed(1)}
        <Star className="w-3 h-3 fill-white text-white" />
      </span>

      <div className="flex items-center text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSizeClass} ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 fill-gray-100'
            }`}
          />
        ))}
      </div>

      {reviewCount !== null && (
        <span className="text-xs text-gray-500 font-medium">
          ({reviewCount.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
}
