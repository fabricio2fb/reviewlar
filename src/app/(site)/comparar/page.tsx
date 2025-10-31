'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { PlusCircle, Scale, ArrowRight, Trash2, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/components/star-rating';
import { cn } from '@/lib/utils';
import type { Review } from '@/lib/types';
import { getReviews } from '@/lib/server-actions';

const MAX_ITEMS_TO_COMPARE = 4;

export default function ComparatorPage() {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [selectedReviews, setSelectedReviews] = useState<(Review | null)[]>(
    Array(2).fill(null)
  );
  const [isLoading, setIsLoading] = useState(true);
  const comparisonTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadReviews() {
      setIsLoading(true);
      try {
        const reviews = await getReviews();
        setAllReviews(reviews);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, []);

  const handleSelectReview = (review: Review, index: number) => {
    if (selectedReviews.some(r => r?.id === review.id)) return;
    
    const newSelectedReviews = [...selectedReviews];
    newSelectedReviews[index] = review;
    setSelectedReviews(newSelectedReviews);
  };

  const removeReviewFromCompare = (index: number) => {
    const newSelectedReviews = [...selectedReviews];
    if (selectedReviews.filter(Boolean).length > 2) {
      newSelectedReviews.splice(index, 1);
    } else {
      newSelectedReviews[index] = null;
    }
    setSelectedReviews(newSelectedReviews);
  };

  const handleAddSlot = () => {
    if (selectedReviews.length < MAX_ITEMS_TO_COMPARE) {
      setSelectedReviews([...selectedReviews, null]);
    }
  }
  
  const handleCompareClick = () => {
    if (comparisonTableRef.current) {
        comparisonTableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const comparisonSpecs = useMemo(() => {
    const allSpecs = new Set<string>();
    selectedReviews.forEach(review => {
        if(review) {
            Object.keys(review.technicalSpecs).forEach(spec => allSpecs.add(spec));
        }
    });
    return Array.from(allSpecs).sort();
  }, [selectedReviews]);

  const filledSlots = selectedReviews.filter(Boolean) as Review[];

  return (
    <main className="flex-1 bg-muted/30">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold flex items-center justify-center gap-2 md:gap-3">
            <Scale className="h-8 w-8 md:h-10 md:w-10" />
            Comparador de Produtos
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mt-2">
            Selecione os produtos e compare lado a lado para fazer a escolha perfeita.
          </p>
        </header>

        <Card className="mb-8 border shadow-sm">
            <CardContent className="p-4 md:p-6 lg:p-8">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                        {selectedReviews.map((review, index) => (
                            <div key={index} className="flex items-center justify-center">
                                {review ? (
                                    <ProductSlot
                                        review={review}
                                        onRemove={() => removeReviewFromCompare(index)}
                                    />
                                ) : (
                                    <EmptySlot
                                        reviews={allReviews}
                                        selectedIds={filledSlots.map(r => r.id)}
                                        onSelect={(newReview) => handleSelectReview(newReview, index)}
                                        isLoading={isLoading}
                                    />
                                )}
                            </div>
                        ))}
                        {selectedReviews.length < MAX_ITEMS_TO_COMPARE && (
                             <div className="flex items-center justify-center">
                                <Button onClick={handleAddSlot} variant="ghost" size="icon" className="h-16 w-16 md:h-20 md:w-20 rounded-full" aria-label="Adicionar outro produto para comparar">
                                     <PlusCircle className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground hover:text-primary"/>
                                </Button>
                             </div>
                        )}
                    </div>
                </div>
                 <div className="flex justify-center mt-6 md:mt-8">
                        <Button size="lg" onClick={handleCompareClick} disabled={filledSlots.length < 2} className="w-full sm:w-auto">
                            Comparar <ArrowRight className="ml-2"/>
                        </Button>
                    </div>
            </CardContent>
        </Card>
        
        {filledSlots.length > 0 && (
           <div ref={comparisonTableRef}>
             {/* Sticky Product Headers */}
             <div className="sticky top-0 z-30 bg-muted/30 pb-4 pt-2">
               <div className="grid gap-2 sm:gap-3 md:gap-4" style={{ gridTemplateColumns: `repeat(${filledSlots.length}, minmax(0, 1fr))` }}>
                 {filledSlots.map(review => (
                   <Card key={review.id} className="border shadow-md bg-card">
                     <CardContent className="p-3 sm:p-4 md:p-6">
                       <Link href={`/review/${review.slug}`} className="block">
                         <div className="relative w-full h-24 sm:h-32 md:h-40 lg:h-48 mb-2 sm:mb-3 md:mb-4 bg-muted/30 rounded-lg flex items-center justify-center">
                           <Image 
                             src={review.image} 
                             alt={review.title} 
                             fill
                             className="object-contain p-2"
                           />
                         </div>
                         <h3 className="font-bold text-center text-xs sm:text-sm md:text-base lg:text-lg hover:text-primary transition-colors line-clamp-2">
                           {review.title}
                         </h3>
                       </Link>
                       <div className="flex flex-col items-center gap-1 sm:gap-2 pt-2 sm:pt-3 md:pt-4 border-t mt-2 sm:mt-3 md:mt-4">
                         <div className="scale-75 sm:scale-90 md:scale-100">
                           <StarRating rating={review.rating} />
                         </div>
                         <span className="text-lg sm:text-xl md:text-2xl font-bold">{review.rating.toFixed(1)}</span>
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             </div>

             {/* Pros Section */}
             <Card className="mb-3 sm:mb-4 border shadow-sm">
               <CardContent className="p-0">
                 <div className="bg-green-50 dark:bg-green-950/20 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b flex items-center gap-2">
                   <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                   <h3 className="font-bold text-sm sm:text-base md:text-lg text-green-900 dark:text-green-100">Pontos Positivos</h3>
                 </div>
                 <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${filledSlots.length}, minmax(0, 1fr))` }}>
                   {filledSlots.map((review, idx) => (
                     <div 
                       key={review.id} 
                       className={cn(
                         "p-3 sm:p-4 md:p-6",
                         idx !== filledSlots.length - 1 && "border-r"
                       )}
                     >
                       <ul className="space-y-1.5 sm:space-y-2">
                         {review.pros?.map((pro, i) => (
                           <li key={i} className="flex items-start gap-2">
                             <span className="text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0">✓</span>
                             <span className="text-xs sm:text-sm">{pro}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>

             {/* Cons Section */}
             <Card className="mb-3 sm:mb-4 border shadow-sm">
               <CardContent className="p-0">
                 <div className="bg-red-50 dark:bg-red-950/20 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b flex items-center gap-2">
                   <ThumbsDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-500 flex-shrink-0" />
                   <h3 className="font-bold text-sm sm:text-base md:text-lg text-red-900 dark:text-red-100">Pontos Negativos</h3>
                 </div>
                 <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${filledSlots.length}, minmax(0, 1fr))` }}>
                   {filledSlots.map((review, idx) => (
                     <div 
                       key={review.id} 
                       className={cn(
                         "p-3 sm:p-4 md:p-6",
                         idx !== filledSlots.length - 1 && "border-r"
                       )}
                     >
                       <ul className="space-y-1.5 sm:space-y-2">
                         {review.cons?.map((con, i) => (
                           <li key={i} className="flex items-start gap-2">
                             <span className="text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0">✗</span>
                             <span className="text-xs sm:text-sm">{con}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>

             {/* Technical Specs */}
             <Card className="border shadow-sm">
               <CardContent className="p-0">
                 <div className="bg-primary/5 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b">
                   <h3 className="font-bold text-sm sm:text-base md:text-lg">Especificações Técnicas</h3>
                 </div>
                 <div>
                   {comparisonSpecs.map((spec, index) => (
                     <div 
                       key={spec} 
                       className={cn(
                         "border-b last:border-b-0",
                         index % 2 === 0 ? 'bg-muted/30' : 'bg-card'
                       )}
                     >
                       {/* Spec Name */}
                       <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-semibold bg-muted/50 border-b text-xs sm:text-sm md:text-base">
                         {spec}
                       </div>
                       {/* Spec Values Side by Side */}
                       <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${filledSlots.length}, minmax(0, 1fr))` }}>
                         {filledSlots.map((review, idx) => (
                           <div 
                             key={review.id} 
                             className={cn(
                               "px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm",
                               idx !== filledSlots.length - 1 && "border-r"
                             )}
                           >
                             {review.technicalSpecs[spec] || <span className="text-muted-foreground">-</span>}
                           </div>
                         ))}
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
           </div>
        )}

      </div>
    </main>
  );
}


function EmptySlot({ reviews, selectedIds, onSelect, isLoading }: { reviews: Review[], selectedIds: (string|undefined)[], onSelect: (review: Review) => void, isLoading: boolean }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const availableReviews = reviews.filter(r => !selectedIds.includes(r.id));
  
  const filteredReviews = availableReviews.filter(review =>
    review.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center w-32 h-40 md:w-40 md:h-48 rounded-lg border-2 border-dashed bg-card">
            <Loader2 className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground animate-spin mb-2" />
            <span className="text-xs md:text-sm font-medium text-muted-foreground">Carregando...</span>
        </div>
    )
  }

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center justify-center w-32 h-40 md:w-40 md:h-48 rounded-lg border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors group bg-card"
      >
        <PlusCircle className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground group-hover:text-primary mb-2"/>
        <span className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-primary text-center px-2">Adicionar Produto</span>
      </button>
      
      {open && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-[280px] sm:w-80 bg-popover border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
            <div className="p-3 border-b">
              <input
                type="text"
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-80">
              {filteredReviews.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Nenhum produto encontrado.
                </div>
              ) : (
                <div className="p-2">
                  {filteredReviews.map((review) => (
                    <button
                      key={review.id}
                      type="button"
                      onClick={() => {
                        onSelect(review);
                        setOpen(false);
                        setSearch('');
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
                    >
                      <Image 
                        src={review.image} 
                        alt={review.title} 
                        width={40} 
                        height={40} 
                        className="object-contain rounded-sm flex-shrink-0"
                      />
                      <span className="text-sm flex-1">{review.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ProductSlot({ review, onRemove }: { review: Review; onRemove: () => void }) {
    return (
        <div className="relative flex flex-col items-center justify-center w-32 h-40 md:w-40 md:h-48 rounded-lg border bg-card p-2 group shadow-sm">
            <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 hover:bg-background z-10" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
            >
                <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-destructive"/>
            </Button>
            <Link href={`/review/${review.slug}`} className="flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
                    <Image src={review.image} alt={review.title} fill className="object-contain"/>
                </div>
                <p className="text-[10px] md:text-xs font-semibold leading-tight line-clamp-2">{review.title}</p>
            </Link>
        </div>
    );
}