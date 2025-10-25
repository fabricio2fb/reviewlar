import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  className?: string;
  starSize?: number;
}

export default function StarRating({ rating, className, starSize = 5 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-0.5 text-amber-400', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" className={`w-${starSize} h-${starSize}`} />
      ))}
      {halfStar && <StarHalf fill="currentColor" className={`w-${starSize} h-${starSize}`} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`w-${starSize} h-${starSize}`} />
      ))}
    </div>
  );
}