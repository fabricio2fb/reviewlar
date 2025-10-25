import { notFound } from 'next/navigation';
import ReviewCard from '@/components/review-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCategories, getCategoryBySlug, getReviewsByCategory } from '@/lib/server-actions';

type CategoryPageProps = {
  params: {
    name: string;
  };
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    name: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.name);
  if (!category) {
    notFound();
  }
  
  const filteredReviews = await getReviewsByCategory(params.name);


  return (
    <>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <header className="mb-8 md:mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">
              {category.name}
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Explore os melhores reviews da categoria
            </p>
          </header>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">{filteredReviews.length} reviews encontrados</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Ordenar por:</span>
              <Select defaultValue="rating">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Melhor Avaliação</SelectItem>
                  <SelectItem value="recent">Mais Recente</SelectItem>
                  <SelectItem value="oldest">Mais Antigo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <p className="md:col-span-2 lg:col-span-3 xl:col-span-4 text-center text-muted-foreground">
                Nenhum review encontrado para esta categoria ainda.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
