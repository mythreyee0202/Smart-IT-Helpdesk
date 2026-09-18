import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readonly = false,
  size = 'md'
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const activeValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(star => {
        const isFilled = star <= activeValue;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(null)}
            className={`transition-transform duration-150 ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 focus:outline-none'
            }`}
            aria-label={`${star} Star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`${starSizes[size]} transition-colors ${
                isFilled
                  ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                  : 'text-slate-300 fill-transparent hover:text-amber-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
