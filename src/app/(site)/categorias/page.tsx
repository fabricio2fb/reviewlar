import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { getCategories } from '@/lib/server-actions';

export default async function CategoriesPage() {
  const categories = await getCategories();
  
  return (
    <>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <header className="mb-8 md:mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">
              Todas as Categorias
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Navegue por nossas categorias de produtos e encontre o review que você procura.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link href={`/categoria/${category.slug}`} key={category.slug}>
                <Card className="h-full hover:shadow-lg transition-shadow hover:border-primary">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold font-headline">
                      {category.name}
                    </CardTitle>
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
