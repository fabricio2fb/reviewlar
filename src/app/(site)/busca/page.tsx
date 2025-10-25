'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import ReviewCard from '@/components/review-card'
import { Review } from '@/lib/types'
import { Loader2 } from 'lucide-react'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
        if (query) {
            setLoading(true);
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const reviews = await response.json();
            setFilteredReviews(reviews);
            setLoading(false);
        } else {
            setFilteredReviews([]);
            setLoading(false);
        }
    }
    fetchReviews();
  }, [query]);

  return (
    <>
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Resultados da Busca
        </h1>
        {query && (
          <p className="text-lg text-muted-foreground mt-2">
            Mostrando resultados para: <span className="font-semibold text-foreground">&quot;{query}&quot;</span>
          </p>
        )}
      </header>
      {loading ? (
        <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">Nenhum resultado encontrado.</p>
          <p className="mt-2 text-muted-foreground">Tente buscar por um termo diferente.</p>
        </div>
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Suspense fallback={<div className="flex justify-center items-center py-16"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
            <SearchResults />
          </Suspense>
        </div>
      </main>
    </>
  )
}
