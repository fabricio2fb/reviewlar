import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/components/star-rating';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Zap, Info, ShoppingCart, ThumbsUp, ThumbsDown } from 'lucide-react'; 
import RelatedReviewCard from '@/components/related-review-card';
import { Icons } from '@/components/icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Offer } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShareButton from '@/components/share-button';
import { cn } from '@/lib/utils';
import StockNotificationForm from '@/components/stock-notification-form';
import { getReviewBySlug, getReviewsByCategory } from '@/lib/server-actions';
import ProductSchema from '@/components/product-schema';
import AdSenseAd from '@/components/adsense-ad';
import FloatingBuyButton from '@/components/floating-buy-button';

type ReviewPageProps = {
  params: {
    slug: string;
  };
};

const OfferCard = ({ offer, productName }: { offer: Offer, productName: string }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div>
            <p className="font-medium">{productName}</p>
          </div>
        </div>
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4 bg-muted/50 p-4 rounded-md sm:bg-transparent sm:p-0">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-10">
               <Image src={offer.storeLogoUrl} alt={offer.store} fill className="object-contain" />
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">
                R$ {offer.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-green-500 hover:bg-green-600">
            <Link href={offer.offerUrl} target="_blank" rel="noopener noreferrer">
              Ver Oferta
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const DimensionCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2 p-4 rounded-lg bg-muted/50">
      <div className="w-16 h-16">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-bold text-lg text-primary">{value}</p>
      </div>
    </div>
  )
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const review = await getReviewBySlug(params.slug);

  if (!review) {
    notFound();
  }
  
  const technicalSpecs = review.technicalSpecs || {};
  const scores = review.scores || {};
  const offers = review.offers || [];
  
  const imageList = [review.image, ...(review.images || [])].filter(Boolean);

  const relatedReviewsData = await getReviewsByCategory(review.category);
  const relatedReviews = relatedReviewsData.filter(r => r.id !== review.id);
  
  const dimensionSpecs = [
    { key: 'Altura', icon: <Icons.height />, value: technicalSpecs['Altura'] },
    { key: 'Largura', icon: <Icons.width />, value: technicalSpecs['Largura'] },
    { key: 'Profundidade', icon: <Icons.depth />, value: technicalSpecs['Profundidade'] },
    { key: 'Peso', icon: <Icons.weight />, value: technicalSpecs['Peso'] },
  ].filter(spec => spec.value);

  const otherSpecs = Object.entries(technicalSpecs).filter(([key]) => !['Altura', 'Largura', 'Profundidade', 'Peso'].includes(key));

  const reviewUrl = `https://reviewlar.com/review/${review.slug}`;
  
  const lowestPrice = offers && offers.length > 0 
    ? Math.min(...offers.map(o => o.price)) 
    : undefined;
  
  const brand = technicalSpecs['Marca'] || undefined;
  const sku = review.id;

  const getAspectRatioClass = () => {
    switch (review.imageAspectRatio) {
      case 'video':
        return 'aspect-video';
      case 'portrait':
      case 'square':
      default:
        return 'aspect-square';
    }
  };
  
  return (
    <main className="flex-1 bg-white dark:bg-card">
      {/* Schema.org para SEO - MOVIDO PARA DENTRO DO MAIN */}
      <ProductSchema
        name={review.title}
        image={review.image}
        description={review.summary}
        brand={brand}
        sku={sku}
        price={lowestPrice}
        priceCurrency="BRL"
        availability="InStock"
        ratingValue={review.rating}
        reviewCount={1}
        url={reviewUrl}
      />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          
          {/* COLUNA DA ESQUERDA - ANÚNCIOS */}
          <aside className="hidden xl:block xl:col-span-2 lg:sticky lg:top-24 self-start">
            <div className="space-y-6">
              <div className="border rounded-lg p-4 bg-muted/20">
                <p className="text-xs text-muted-foreground text-center mb-2">Publicidade</p>
                <AdSenseAd 
                  adSlot="2453817336"
                  adFormat="vertical"
                  style={{ display: 'block', minHeight: '600px' }}
                />
              </div>
            </div>
          </aside>

          {/* ARTIGO PRINCIPAL */}
          <article className="lg:col-span-8 xl:col-span-7">
            <header className="mb-8 md:mb-12">
              <div className="max-w-3xl mx-auto px-12">
                <Carousel className="w-full">
                  <CarouselContent>
                    {imageList.map((imgSrc, index) => (
                      <CarouselItem key={index}>
                        <div className={cn(
                              "relative w-full overflow-hidden rounded-lg bg-white p-4",
                              getAspectRatioClass()
                            )}>
                          <Image
                            src={imgSrc}
                            alt={`${review.title} - imagem ${index + 1}`}
                            fill
                            className="object-contain"
                            priority={index === 0}
                            data-ai-hint="appliance product"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </Carousel>
              </div>

              <div className="mt-8 text-center max-w-3xl mx-auto">
                <Link href={`/categoria/${review.category}`} className="text-primary font-semibold hover:underline mb-2 uppercase text-sm inline-block">{review.category}</Link>
                <h1 className="text-3xl md:text-4xl font-headline font-bold text-gray-900 dark:text-gray-100">
                  Review: {review.title}
                </h1>
                <p className="text-lg text-muted-foreground mt-3">
                  {review.summary}
                </p>
                <div className="flex items-center justify-center flex-wrap gap-4 text-muted-foreground my-4">
                  <StarRating rating={review.rating} />
                  <span className="font-bold text-lg">{review.rating.toFixed(1)} / 5.0</span>
                  <div className='hidden sm:block w-px h-6 bg-border'></div>
                  <ShareButton title={review.title} url={reviewUrl} />
                </div>
              </div>
            </header>

            <div className="space-y-12">
              
              {/* Análise Completa */}
              <section id="analise" className="py-6">
                <h2 className="text-2xl md:text-3xl font-headline font-bold flex items-center justify-center gap-2 mb-6">
                  <Info /> Análise Completa
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-justify">
                  <div dangerouslySetInnerHTML={{ __html: review.content.replace(/\n/g, '<br />') }} />
                </div>
              </section>

              {/* 🔹 Prós e Contras */}
{(review.pros?.length || review.cons?.length) && (
  <section id="pros-contras" className="py-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {review.pros?.length > 0 && (
        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6">
          <h3 className="text-xl font-headline font-bold flex items-center justify-center gap-2 mb-6 text-green-600">
            <ThumbsUp className="h-5 w-5" /> Prós
          </h3>
          <ul className="space-y-3">
            {review.pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-500 mt-1 flex-shrink-0">✔</span>
                <span className="text-gray-700 dark:text-gray-300">{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {review.cons?.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-6">
          <h3 className="text-xl font-headline font-bold flex items-center justify-center gap-2 mb-6 text-red-600">
            <ThumbsDown className="h-5 w-5" /> Contras
          </h3>
          <ul className="space-y-3">
            {review.cons.map((con, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-red-500 mt-1 flex-shrink-0">✖</span>
                <span className="text-gray-700 dark:text-gray-300">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </section>
)}
              
              {/* Ficha Técnica */}
              {(dimensionSpecs.length > 0 || otherSpecs.length > 0) && (
                <section id="dados-tecnicos" className="py-6">
                  <h2 className="text-2xl md:text-3xl font-headline font-bold flex items-center justify-center gap-2 mb-6">
                    <ShieldCheck /> Ficha Técnica
                  </h2>

                  {dimensionSpecs.length > 0 && (
                    <div className="mb-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        {dimensionSpecs.map(spec => (
                          <DimensionCard key={spec.key} label={spec.key} value={spec.value} icon={spec.icon} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {otherSpecs.length > 0 && (
                    <div className="max-w-2xl mx-auto overflow-hidden border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted">
                            <TableHead className="font-bold w-[40%]">Especificação</TableHead>
                            <TableHead className="font-bold">Detalhe</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {otherSpecs.map(([key, value], index) => (
                            <TableRow key={key} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                              <TableCell className="font-semibold text-muted-foreground align-top py-3">
                                {key}
                              </TableCell>
                              <TableCell className="py-3 whitespace-normal break-words">
                                {value}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </section>
              )}

              {/* Notas */}
              {scores && Object.keys(scores).length > 0 && (
                <section id="notas" className="py-6">
                  <h2 className="text-2xl md:text-3xl font-headline font-bold flex items-center justify-center gap-2 mb-6">
                    <Zap /> Nossas Notas
                  </h2>
                  <div className="max-w-2xl mx-auto space-y-4">
                    {Object.entries(scores).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-base font-medium text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                          <span className="text-base font-bold">{value.toFixed(1)}</span>
                        </div>
                        <Progress value={value * 10} className="h-2" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Onde Comprar */}
              {offers && offers.length > 0 && (
                <section id="onde-comprar" className="py-6">
                  <h2 className="text-2xl md:text-3xl font-headline font-bold mb-2 text-center">
                    Onde Comprar
                  </h2>
                  <p className="text-muted-foreground text-center mb-6">As melhores ofertas para o {review.title}</p>
                  <div className="max-w-4xl mx-auto space-y-4">
                    {offers.map((offer) => (
                      <OfferCard key={offer.id} offer={offer} productName={review.title} />
                    ))}
                  </div>
                </section>
              )}
              
              <StockNotificationForm />
            </div>
          </article>

          {/* COLUNA DA DIREITA - REVIEWS RELACIONADOS */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 self-start">
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-headline">Outros Reviews de {review.category.charAt(0).toUpperCase() + review.category.slice(1)}</h3>
              {relatedReviews.length > 0 ? (
                relatedReviews.map(related => (
                  <RelatedReviewCard key={related.id} review={related} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum outro review nesta categoria.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
      
      {/* Botão Flutuante de Compra */}
      <FloatingBuyButton offers={offers} productName={review.title} />
    </main>
  );
}