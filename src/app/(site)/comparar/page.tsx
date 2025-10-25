'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { PlusCircle, Scale, ArrowRight, Trash2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold flex items-center justify-center gap-3">
            <Scale className="h-10 w-10" />
            Comparador de Produtos
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Selecione os produtos e compare lado a lado para fazer a escolha perfeita.
          </p>
        </header>

        <Card className="mb-8 bg-muted/30">
            <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-4">
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
                                <Button onClick={handleAddSlot} variant="ghost" size="icon" className="h-20 w-20 rounded-full" aria-label="Adicionar outro produto para comparar">
                                     <PlusCircle className="h-8 w-8 text-muted-foreground hover:text-primary"/>
                                </Button>
                             </div>
                        )}
                    </div>
                </div>
                 <div className="flex justify-center mt-8">
                        <Button size="lg" onClick={handleCompareClick} disabled={filledSlots.length < 2}>
                            Comparar <ArrowRight className="ml-2"/>
                        </Button>
                    </div>
            </CardContent>
        </Card>
        
        {filledSlots.length > 0 && (
           <div className="overflow-x-auto" ref={comparisonTableRef}>
             <Table className={cn("min-w-full border-collapse", `grid-cols-${filledSlots.length + 1}`)}>
                <TableHeader>
                    <TableRow className="grid w-full">
                    <TableHead className="sticky left-0 bg-background z-10 w-64">Característica</TableHead>
                    {filledSlots.map(review => (
                        <TableHead key={review.id} className="text-center">
                            <div className="flex flex-col items-center gap-2">
                                <Link href={`/review/${review.slug}`}>
                                    <Image src={review.image} alt={review.title} width={120} height={120} className="object-contain rounded-md" />
                                </Link>
                                <Link href={`/review/${review.slug}`} className="font-bold hover:underline">{review.title}</Link>
                            </div>
                        </TableHead>
                    ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Rating */}
                    <TableRow className="grid w-full">
                        <TableCell className="font-semibold sticky left-0 bg-background z-10 w-64">Avaliação</TableCell>
                        {filledSlots.map(review => (
                            <TableCell key={review.id} className="text-center">
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <StarRating rating={review.rating} />
                                    <span className="font-bold">{review.rating.toFixed(1)}</span>
                                </div>
                            </TableCell>
                        ))}
                    </TableRow>

                     {/* Pros */}
                    <TableRow className="grid w-full bg-muted/20">
                        <TableCell className="font-semibold sticky left-0 bg-muted/20 z-10 w-64">Prós</TableCell>
                        {filledSlots.map(review => (
                            <TableCell key={review.id}>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    {review.pros?.map((pro, i) => <li key={i}>{pro}</li>)}
                                </ul>
                            </TableCell>
                        ))}
                    </TableRow>

                    {/* Cons */}
                    <TableRow className="grid w-full">
                        <TableCell className="font-semibold sticky left-0 bg-background z-10 w-64">Contras</TableCell>
                        {filledSlots.map(review => (
                            <TableCell key={review.id}>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    {review.cons?.map((con, i) => <li key={i}>{con}</li>)}
                                </ul>
                            </TableCell>
                        ))}
                    </TableRow>
                    
                    {/* Specs */}
                    {comparisonSpecs.map((spec, index) => (
                        <TableRow key={spec} className={cn("grid w-full", index % 2 === 0 ? 'bg-muted/20' : '')}>
                             <TableCell className={cn("font-semibold sticky left-0 z-10 w-64", index % 2 === 0 ? 'bg-muted/20' : 'bg-background')}>{spec}</TableCell>
                            {filledSlots.map(review => (
                                <TableCell key={review.id} className="text-center">
                                    {review.technicalSpecs[spec] || '-'}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
           </div>
        )}

        {filledSlots.length === 0 && (
             <div className="text-center py-16 px-4 bg-muted rounded-lg">
                <p className="text-2xl font-semibold">Comece a Comparar</p>
                <p className="mt-2 max-w-md mx-auto text-muted-foreground">
                    Selecione dois ou mais produtos na caixa acima para ver uma comparação detalhada de suas características.
                </p>
            </div>
        )}

      </div>
    </main>
  );
}


function EmptySlot({ reviews, selectedIds, onSelect, isLoading }: { reviews: Review[], selectedIds: (string|undefined)[], onSelect: (review: Review) => void, isLoading: boolean }) {
  const [open, setOpen] = useState(false);
  const availableReviews = reviews.filter(r => !selectedIds.includes(r.id));
  
  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center w-40 h-48 rounded-lg border-2 border-dashed border-border">
            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-2" />
            <span className="text-sm font-medium text-muted-foreground">Carregando...</span>
        </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-center justify-center w-40 h-48 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors group">
          <PlusCircle className="h-10 w-10 text-muted-foreground group-hover:text-primary mb-2"/>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">Adicionar Produto</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar produto..." />
          <CommandList>
            <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
            <CommandGroup>
              {availableReviews.map((review) => (
                <CommandItem
                  key={review.id}
                  value={review.title}
                  onSelect={() => {
                    onSelect(review);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                    <Image src={review.image} alt={review.title} width={32} height={32} className="object-contain rounded-sm"/>
                    <span className="flex-1">{review.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ProductSlot({ review, onRemove }: { review: Review; onRemove: () => void }) {
    return (
        <div className="relative flex flex-col items-center justify-center w-40 h-48 rounded-lg border border-border bg-card p-2 group">
            <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={onRemove}>
                <Trash2 className="h-4 w-4 text-destructive"/>
            </Button>
            <Link href={`/review/${review.slug}`} className="flex flex-col items-center justify-center text-center">
                <div className="relative w-24 h-24 mb-2">
                    <Image src={review.image} alt={review.title} fill className="object-contain"/>
                </div>
                <p className="text-xs font-semibold leading-tight line-clamp-2">{review.title}</p>
            </Link>
        </div>
    );
}
