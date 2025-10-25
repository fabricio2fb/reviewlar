import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import type { Review } from '@/lib/types';
import StarRating from '@/components/star-rating';

interface RelatedReviewCardProps {
  review: Review;
}

export default function RelatedReviewCard({ review }: RelatedReviewCardProps) {
  return (
    <Link href={`/review/${review.slug}`} className="flex items-center gap-4 group p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={review.image}
          alt={review.title}
          fill
          className="object-contain rounded-md"
          sizes="80px"
          data-ai-hint="appliance product"
        />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {review.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={review.rating} starSize={3} />
          <span className="text-xs font-bold text-muted-foreground">{review.rating.toFixed(1)}</span>
        </div>
      </div>
       <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </Link>
  );
}