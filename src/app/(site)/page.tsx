import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ReviewCard from '@/components/review-card';
import heroImage from '@/lib/placeholder-images.json';
import { getReviews } from '@/lib/server-actions';

export default async function Home() {
  const reviews = await getReviews();
  const recentReviews = reviews.slice(0, 6);
  const heroImageData = heroImage.placeholderImages.find(img => img.id === 'hero-appliances');

  return (
    <>
      
      <main className="flex-1">
        <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white">
          {heroImageData && (
            <Image
              src={heroImageData.imageUrl}
              alt={heroImageData.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImageData.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 drop-shadow-lg">
              Os melhores reviews de eletrodomésticos 2025
            </h1>
            <p className="text-lg md:text-xl text-gray-200 drop-shadow-md">
              Análises completas e imparciais para te ajudar a fazer a escolha certa.
            </p>
          </div>
        </section>

        <section id="destaques" className="py-12 md:py-20 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">
              Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
