import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import type { Review } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import StarRating from '@/components/star-rating';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/review/${review.slug}`} className="block">
          <div className="relative aspect-video">
            <Image
              src={review.image}
              alt={review.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint="appliance product"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4 flex flex-col">
        <div className="flex-1">
          <Badge variant="secondary" className="mb-2 uppercase">{review.category}</Badge>
          <Link href={`/review/${review.slug}`}>
            <CardTitle className="font-headline text-xl leading-tight hover:text-primary transition-colors">
              {review.title}
            </CardTitle>
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={review.rating} starSize={4} />
            <span className="text-sm font-bold text-muted-foreground">{review.rating.toFixed(1)}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
            {review.summary}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/review/${review.slug}`}>
            Ver Review <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}