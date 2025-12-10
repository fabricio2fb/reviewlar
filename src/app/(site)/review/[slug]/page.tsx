import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/components/star-rating';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Zap, Info, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react'; 
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
import { Card, CardContent } from '@/components/ui/card';
import ShareButton from '@/components/share-button';
import { cn } from '@/lib/utils';
import StockNotificationForm from '@/components/stock-notification-form';
import { getReviewBySlug, getReviewsByCategory } from '@/lib/server-actions';
import ProductSchema from '@/components/product-schema';
import AdSenseAd from '@/components/adsense-ad';
import FloatingBuyButton from '@/components/floating-buy-button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ReviewPageProps = {
  params: {
    slug: string;
  };
};

const OfferCard = ({ offer, productName }: { offer: Offer, productName: string }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
              <p className="text-xl font-bold text-green-600 dark:text-green-500">
                R$ {offer.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {offer.originalPrice && offer.originalPrice > offer.price && (
                <p className="text-sm text-muted-foreground line-through">
                  R$ {offer.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              )}
              {offer.discount && (
                <p className="text-xs text-green-600 font-semibold">
                  {offer.discount}% OFF
                </p>
              )}
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
    <div className="flex flex-col items-center justify-center text-center gap-2 p-4 rounded-lg bg-muted/50 border">
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
  const faq = review.faq || [];
  
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
        return 'aspect-[9/16]';
      case 'square':
      default:
        return 'aspect-square';
    }
  };
  
  return (
    <main className="flex-1 bg-white dark:bg-card">
      {/* Schema.org para SEO */}
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
              <div className="max-w-3xl mx-auto px-4 md:px-12">
                <Carousel className="w-full">
                  <CarouselContent>
                    {imageList.map((imgSrc, index) => (
                      <CarouselItem key={index}>
                        <div className={cn(
                          "relative w-full overflow-hidden rounded-lg bg-white dark:bg-muted p-4",
                          getAspectRatioClass()
                        )}>
                          <Image
                            src={imgSrc}
                            alt={`${review.title} - imagem ${index + 1}`}
                            fill
                            className="object-contain"
                            priority={index === 0}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {imageList.length > 1 && (
                    <>
                      <CarouselPrevious className="left-0" />
                      <CarouselNext className="right-0" />
                    </>
                  )}
                </Carousel>
              </div>

              <div className="mt-8 text-center max-w-3xl mx-auto">
                <Link 
                  href={`/categoria/${review.category}`} 
                  className="text-primary font-semibold hover:underline mb-2 uppercase text-sm inline-block"
                >
                  {review.category}
                </Link>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {review.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-4 leading-relaxed">
                  {review.summary}
                </p>
                <div className="flex items-center justify-center flex-wrap gap-4 text-muted-foreground my-6">
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
                  <Info className="h-7 w-7" /> Análise Completa
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
                  <div 
                    className="text-justify leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: review.content.replace(/\n/g, '<br /><br />') }} 
                  />
                </div>
              </section>

              {/* Prós e Contras */}
              {(review.pros?.length || review.cons?.length) && (
                <section id="pros-contras" className="py-6">
                  <h2 className="text-2xl md:text-3xl font-headline font-bold text-center mb-8">
                    Prós e Contras
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                    {review.pros?.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
                        <h3 className="text-xl font-headline font-bold flex items-center justify-center gap-2 mb-6 text-green-700 dark:text-green-500">
                          <ThumbsUp className="h-6 w-6" /> Pontos Positivos
                        </h3>
                        <ul className="space-y-3">
                          {review.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="text-green-600 dark:text-green-500 mt-1 flex-shrink-0 text-xl">✔</span>
                              <span className="text-gray-800 dark:text-gray-200 leading-relaxed">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {review.cons?.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-6 border-2 border-red-200 dark:border-red-800">
                        <h3 className="text-xl font-headline font-bold flex items-center justify-center gap-2 mb-6 text-red-700 dark:text-red-500">
                          <ThumbsDown className="h-6 w-6" /> Pontos Negativos
                        </h3>
                        <ul className="space-y-3">
                          {review.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="text-red-600 dark:text-red-500 mt-1 flex-shrink-0 text-xl">✖</span>
                              <span className="text-gray-800 dark:text-gray-200 leading-relaxed">{con}</span>
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
                  <h2 className="text-2xl md:text-3xl font-headline font-bold flex items-center justify-center gap-2 mb-8">
                    <ShieldCheck className="h-7 w-7" /> Ficha Técnica Completa
                  </h2>

                  {dimensionSpecs.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-center mb-4 text-muted-foreground">
                        Dimensões e Peso
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        {dimensionSpecs.map(spec => (
                          <DimensionCard key={spec.key} label={spec.key} value={spec.value} icon={spec.icon} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {otherSpecs.length > 0 && (
                    <div className="max-w-2xl mx-auto overflow-hidden border rounded-lg shadow-sm">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted hover:bg-muted">
                            <TableHead className="font-bold w-[45%]">Especificação</TableHead>
                            <TableHead className="font-bold">Detalhe</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {otherSpecs.map(([key, value], index) => (
                            <TableRow key={key} className={index % 2 === 0 ? 'bg-muted/30 hover:bg-muted/50' : 'hover:bg-muted/50'}>
                              <TableCell className="font-semibold text-muted-foreground align-top py-3">
                                {key}
                              </TableCell>
                              <TableCell className="py-3 whitespace-normal break-words">
                                {value || '—'}
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
                  <h2 className="text-2xl md:text-3xl font-headline font-bold flex items-center justify-center gap-2 mb-8">
                    <Zap className="h-7 w-7" /> Nossas Avaliações
                  </h2>
                  <div className="max-w-2xl mx-auto space-y-5 bg-muted/30 p-6 rounded-lg border">
                    {Object.entries(scores).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-base font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-lg font-bold text-primary">{value.toFixed(1)}/10</span>
                        </div>
                        <Progress value={value * 10} className="h-3" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQ - NOVA SEÇÃO */}
              {faq && faq.length > 0 && (
                <section id="faq" className="py-6">
                  <h2 className="text-2xl md:text-3xl font-headline font-bold flex items-center justify-center gap-2 mb-8">
                    <HelpCircle className="h-7 w-7" /> Perguntas Frequentes
                  </h2>
                  <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="space-y-4">
                      {faq.map((item, index) => (
                        <AccordionItem 
                          key={index} 
                          value={`item-${index}`}
                          className="border rounded-lg px-4 bg-muted/30"
                        >
                          <AccordionTrigger className="text-left font-semibold hover:no-underline">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </section>
              )}

              {/* Onde Comprar */}
              {offers && offers.length > 0 && (
                <section id="onde-comprar" className="py-6">
                  <h2 className="text-2xl md:text-3xl font-headline font-bold mb-2 text-center">
                    🛒 Melhores Ofertas
                  </h2>
                  <p className="text-muted-foreground text-center mb-6">
                    Confira os melhores preços para {review.title}
                  </p>
                  {review.priceRange && (
                    <p className="text-center text-sm font-semibold text-primary mb-6">
                      Faixa de preço: {review.priceRange}
                    </p>
                  )}
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
              <h3 className="text-xl font-bold font-headline">
                Outros Reviews de {review.category.charAt(0).toUpperCase() + review.category.slice(1)}
              </h3>
              {relatedReviews.length > 0 ? (
                <div className="space-y-4">
                  {relatedReviews.slice(0, 5).map(related => (
                    <RelatedReviewCard key={related.id} review={related} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum outro review nesta categoria ainda.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
      
      {/* Botão Flutuante de Compra */}
      {offers && offers.length > 0 && (
        <FloatingBuyButton offers={offers} productName={review.title} />
      )}
    </main>
  );
}