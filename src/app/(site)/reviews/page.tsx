'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import ReviewCard from '@/components/review-card';
import { getCategories, getReviews } from '@/lib/server-actions';
import type { Review, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, Refrigerator, CookingPot, Microwave, WashingMachine, Flame, Coffee, Blend, Tv } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const categoryIcons: { [key: string]: React.ReactNode } = {
  geladeira: <Refrigerator />,
  fogao: <CookingPot />,
  'micro-ondas': <Microwave />,
  'maquina-de-lavar': <WashingMachine />,
  'air-fryer': <Flame />,
  cafeteira: <Coffee />,
  liquidificador: <Blend />,
  televisao: <Tv />,
};

function FilterSidebar({
  categories,
  onFilterChange,
  clearFilters,
}: {
  categories: Category[];
  onFilterChange: (filters: any) => void;
  clearFilters: () => void;
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('rating-desc');

  const onFilterChangeCallback = useCallback(onFilterChange, [onFilterChange]);

  useEffect(() => {
    onFilterChangeCallback({ categories: selectedCategories, minRating, sortBy });
  }, [selectedCategories, minRating, sortBy, onFilterChangeCallback]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  };

  const handleRatingChange = (value: string) => {
    const rating = Number(value);
    setMinRating(prev => (prev === rating ? null : rating));
  };
  
  const handleClear = () => {
    setSelectedCategories([]);
    setMinRating(null);
    setSortBy('rating-desc');
    clearFilters();
  }

  return (
    <Card className="p-4 md:p-6 h-fit sticky top-24">
      <h3 className="text-lg font-headline font-semibold mb-4">Refinar Resultados</h3>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold">Ordenar por</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating-desc">Melhor Avaliação</SelectItem>
              <SelectItem value="recent">Mais Recente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-semibold">Categorias</Label>
          <div className="space-y-2 mt-2">
            {categories.map(category => (
              <div key={category.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category.slug}`}
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => handleCategoryChange(category.slug)}
                />
                <Label
                  htmlFor={`cat-${category.slug}`}
                  className="font-normal cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold">Classificação</Label>
          <RadioGroup
            value={minRating?.toString()}
            onValueChange={handleRatingChange}
            className="mt-2 space-y-1"
          >
            {[4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-2">
                <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center gap-1 font-normal cursor-pointer"
                >
                  <span className="flex">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                    {[...Array(5-rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400" />
                    ))}
                  </span>
                   e acima
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
         <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => onFilterChange({ categories: selectedCategories, minRating, sortBy })}>Aplicar Filtros</Button>
            <Button onClick={handleClear} variant="ghost">Limpar Filtros</Button>
        </div>

      </div>
    </Card>
  );
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    minRating: null as number | null,
    sortBy: 'rating-desc',
  });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [fetchedReviews, fetchedCategories] = await Promise.all([
        getReviews(),
        getCategories(),
      ]);
      setReviews(fetchedReviews);
      setCategories(fetchedCategories);

      // Apply initial category filter from URL if present
      const categoryParam = searchParams.get('category');
      if (categoryParam) {
        setFilters(prev => ({ ...prev, categories: [categoryParam] }));
      }
      setIsLoading(false);
    }
    loadData();
  }, [searchParams]);

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Filter by category
    if (filters.categories.length > 0) {
      result = result.filter(review => filters.categories.includes(review.category));
    }

    // Filter by rating
    if (filters.minRating) {
      result = result.filter(review => review.rating >= filters.minRating!);
    }
    
    // Sort
    if (filters.sortBy === 'rating-desc') {
        result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'recent') {
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return result;
  }, [reviews, filters]);
  
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(prev => ({...prev, ...newFilters}));
  }, []);
  
  const handleClearFilters = useCallback(() => {
     setFilters({
        categories: [],
        minRating: null,
        sortBy: 'rating-desc',
     });
  }, []);

  const handleCategoryClick = (slug: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(slug) ? [] : [slug],
    }));
  };

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            Todos os Reviews
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Filtre, compare e encontre o produto ideal para você.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <aside className="lg:col-span-1">
            <FilterSidebar categories={categories} onFilterChange={handleFilterChange} clearFilters={handleClearFilters} />
          </aside>

          <div className="lg:col-span-4">
             {isLoading ? (
                 <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                    ))
                ) : (
                    <div className="sm:col-span-2 xl:col-span-4 text-center py-16">
                        <p className="text-xl text-muted-foreground">Nenhum resultado encontrado.</p>
                        <p className="mt-2 text-muted-foreground">Tente ajustar seus filtros.</p>
                    </div>
                )}
                </div>
             )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}