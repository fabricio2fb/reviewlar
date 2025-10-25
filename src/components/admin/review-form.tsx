'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Offer, Review, Category } from '@/lib/types';
import { getAiSuggestions } from '@/app/actions';
import { Badge } from '../ui/badge';
import { Lightbulb, Loader2, PlusCircle, Trash2, FileJson } from 'lucide-react';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories, createReview, updateReview } from '@/lib/server-actions';

const formSchema = z.object({
  title: z.string().min(5, 'Título muito curto').max(300, 'Título muito longo'),
  category: z.string().min(1, 'Selecione uma categoria'),
  rating: z.coerce.number().min(0).max(5, 'A nota deve ser entre 0 e 5'),
  image: z.string().url('Insira uma URL de imagem válida'),
  imageAspectRatio: z
    .enum(['square', 'video', 'portrait'])
    .optional()
    .default('square'),
  summary: z.string().min(20, 'Resumo muito curto').max(200, 'Resumo muito longo'),
  content: z.string().min(100, 'O conteúdo do review é muito curto'),
  pros: z.array(z.object({ value: z.string() })).optional(),
  cons: z.array(z.object({ value: z.string() })).optional(),
  images: z.array(z.object({ value: z.string().url() })).optional(),
  technicalSpecs: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional(),
  scores: z
    .array(z.object({ key: z.string(), value: z.coerce.number().min(0).max(10) }))
    .optional(),
  priceRange: z.string().optional(),
  offers: z
    .array(
      z.object({
        store: z.string().min(1, 'Obrigatório'),
        price: z.coerce.number().min(0, 'Inválido'),
        offerUrl: z.string().url('URL inválida'),
        storeLogoUrl: z.string().url('URL do logo inválida'),
      })
    )
    .optional(),
});

type ReviewFormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  initialData?: Review | null;
}

const arrayToFieldArray = (arr: string[] | undefined) =>
  arr?.map((value) => ({ value })) || [];

const objectToFieldArray = (obj: Record<string, any> | undefined) =>
  obj ? Object.entries(obj).map(([key, value]) => ({ key, value })) : [];

const offersToFieldArray = (offers: Offer[] | undefined) =>
  offers?.map(({ id, store, price, offerUrl, storeLogoUrl }) => ({
    id,
    store,
    price,
    offerUrl,
    storeLogoUrl,
  })) || [];

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function ReviewForm({ initialData }: ReviewFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAiPending, startAiTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<{ pros: string[]; cons: string[] }>({
    pros: [],
    cons: [],
  });

  // Estados para os diálogos JSON
  const [prosConsDialogOpen, setProsConsDialogOpen] = useState(false);
  const [prosConsInput, setProsConsInput] = useState('');
  const [specsDialogOpen, setSpecsDialogOpen] = useState(false);
  const [specsInput, setSpecsInput] = useState('');
  const [scoresDialogOpen, setScoresDialogOpen] = useState(false);
  const [scoresInput, setScoresInput] = useState('');
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [imagesInput, setImagesInput] = useState('');
  const [offersDialogOpen, setOffersDialogOpen] = useState(false);
  const [offersInput, setOffersInput] = useState('');
  const [masterJsonDialogOpen, setMasterJsonDialogOpen] = useState(false);
  const [masterJsonInput, setMasterJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const defaultValues: Partial<ReviewFormValues> = initialData
    ? {
        ...initialData,
        rating: initialData.rating || 0,
        imageAspectRatio: initialData.imageAspectRatio || 'square',
        pros: arrayToFieldArray(initialData.pros),
        cons: arrayToFieldArray(initialData.cons),
        images: arrayToFieldArray(initialData.images),
        technicalSpecs: objectToFieldArray(initialData.technicalSpecs),
        scores: objectToFieldArray(initialData.scores),
        offers: offersToFieldArray(initialData.offers),
      }
    : {
        title: '',
        category: '',
        rating: 0,
        image: '',
        imageAspectRatio: 'square',
        summary: '',
        content: '',
        pros: [],
        cons: [],
        images: [],
        technicalSpecs: [],
        scores: [],
        offers: [],
      };

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields: proFields, append: appendPro, remove: removePro } = useFieldArray({
    control: form.control,
    name: 'pros',
  });

  const { fields: conFields, append: appendCon, remove: removeCon } = useFieldArray({
    control: form.control,
    name: 'cons',
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: 'technicalSpecs',
  });

  const { fields: scoreFields, append: appendScore, remove: removeScore } = useFieldArray({
    control: form.control,
    name: 'scores',
  });

  const { fields: offerFields, append: appendOffer, remove: removeOffer } = useFieldArray({
    control: form.control,
    name: 'offers',
  });

  const reviewContent = form.watch('content');
  const debouncedReviewContent = useDebounce(reviewContent, 1500);

  useEffect(() => {
    if (debouncedReviewContent && debouncedReviewContent.length > 100) {
      startAiTransition(async () => {
        const result = await getAiSuggestions(debouncedReviewContent);
        if (result && !result.error) {
          setSuggestions({ pros: result.pros || [], cons: result.cons || [] });
        }
      });
    }
  }, [debouncedReviewContent]);

  const addSuggestion = (type: 'pros' | 'cons', value: string) => {
    if (type === 'pros') appendPro({ value });
    if (type === 'cons') appendCon({ value });
  };

  // Função para importar Prós e Contras
  const handleImportProsConsJson = () => {
    try {
      setJsonError('');
      const parsed = JSON.parse(prosConsInput);

      if (parsed.pros && Array.isArray(parsed.pros)) {
        form.setValue('pros', []);
        parsed.pros.forEach((pro: string) => appendPro({ value: pro }));
      }

      if (parsed.cons && Array.isArray(parsed.cons)) {
        form.setValue('cons', []);
        parsed.cons.forEach((con: string) => appendCon({ value: con }));
      }

      toast({
        title: 'Prós e Contras importados!',
        description: `${parsed.pros?.length || 0} prós e ${parsed.cons?.length || 0} contras adicionados.`,
      });

      setProsConsInput('');
      setProsConsDialogOpen(false);
    } catch (error) {
      setJsonError('JSON inválido! Verifique o formato.');
    }
  };

  // Função para importar Especificações Técnicas
  const handleImportSpecsJson = () => {
    try {
      setJsonError('');
      const parsed = JSON.parse(specsInput);

      form.setValue('technicalSpecs', []);
      Object.entries(parsed).forEach(([key, value]) => {
        appendSpec({ key, value: String(value) });
      });

      toast({
        title: 'Especificações importadas!',
        description: `${Object.keys(parsed).length} especificações adicionadas.`,
      });

      setSpecsInput('');
      setSpecsDialogOpen(false);
    } catch (error) {
      setJsonError('JSON inválido! Verifique o formato.');
    }
  };

  // Função para importar Scores
  const handleImportScoresJson = () => {
    try {
      setJsonError('');
      const parsed = JSON.parse(scoresInput);

      form.setValue('scores', []);
      Object.entries(parsed).forEach(([key, value]) => {
        appendScore({ key, value: Number(value) });
      });

      toast({
        title: 'Notas importadas!',
        description: `${Object.keys(parsed).length} critérios adicionados.`,
      });

      setScoresInput('');
      setScoresDialogOpen(false);
    } catch (error) {
      setJsonError('JSON inválido! Verifique o formato.');
    }
  };

  // Função para importar Galeria de Imagens
  const handleImportImagesJson = () => {
    try {
      setJsonError('');
      const parsed = JSON.parse(imagesInput);

      if (!Array.isArray(parsed)) {
        setJsonError('O JSON deve ser um array de URLs');
        return;
      }

      form.setValue('images', []);
      parsed.forEach((url: string) => appendImage({ value: url }));

      toast({
        title: 'Imagens importadas!',
        description: `${parsed.length} imagens adicionadas à galeria.`,
      });

      setImagesInput('');
      setImagesDialogOpen(false);
    } catch (error) {
      setJsonError('JSON inválido! Verifique o formato.');
    }
  };

  // Função para importar Ofertas
  const handleImportOffersJson = () => {
    try {
      setJsonError('');
      const parsed = JSON.parse(offersInput);

      if (!Array.isArray(parsed)) {
        setJsonError('O JSON deve ser um array de ofertas');
        return;
      }

      form.setValue('offers', []);
      parsed.forEach((offer: any) => {
        appendOffer({
          store: offer.store || '',
          price: offer.price || 0,
          offerUrl: offer.offerUrl || offer.url || '',
          storeLogoUrl: offer.storeLogoUrl || offer.logo || '',
        });
      });

      toast({
        title: 'Ofertas importadas!',
        description: `${parsed.length} ofertas adicionadas.`,
      });

      setOffersInput('');
      setOffersDialogOpen(false);
    } catch (error) {
      setJsonError('JSON inválido! Verifique o formato.');
    }
  };

  // Função para importar JSON Completo
  const handleImportMasterJson = () => {
    try {
      setJsonError('');
      const parsed = JSON.parse(masterJsonInput);

      // Importar campos básicos
      if (parsed.title) form.setValue('title', parsed.title);
      if (parsed.category) form.setValue('category', parsed.category);
      if (parsed.rating !== undefined) form.setValue('rating', parsed.rating);
      if (parsed.summary) form.setValue('summary', parsed.summary);
      if (parsed.content) form.setValue('content', parsed.content);
      if (parsed.priceRange) form.setValue('priceRange', parsed.priceRange);

      // Importar imagem principal
      if (parsed.image) form.setValue('image', parsed.image);
      if (parsed.imageAspectRatio) form.setValue('imageAspectRatio', parsed.imageAspectRatio);

      // Importar prós
      if (parsed.pros && Array.isArray(parsed.pros)) {
        form.setValue('pros', []);
        parsed.pros.forEach((pro: string) => appendPro({ value: pro }));
      }

      // Importar contras
      if (parsed.cons && Array.isArray(parsed.cons)) {
        form.setValue('cons', []);
        parsed.cons.forEach((con: string) => appendCon({ value: con }));
      }

      // Importar galeria de imagens
      if (parsed.images && Array.isArray(parsed.images)) {
        form.setValue('images', []);
        parsed.images.forEach((url: string) => appendImage({ value: url }));
      }

      // Importar especificações técnicas
      if (parsed.technicalSpecs) {
        form.setValue('technicalSpecs', []);
        Object.entries(parsed.technicalSpecs).forEach(([key, value]) => {
          appendSpec({ key, value: String(value) });
        });
      }

      // Importar notas
      if (parsed.scores) {
        form.setValue('scores', []);
        Object.entries(parsed.scores).forEach(([key, value]) => {
          appendScore({ key, value: Number(value) });
        });
      }

      // Importar ofertas
      if (parsed.offers && Array.isArray(parsed.offers)) {
        form.setValue('offers', []);
        parsed.offers.forEach((offer: any) => {
          appendOffer({
            store: offer.store || '',
            price: offer.price || 0,
            offerUrl: offer.offerUrl || offer.url || '',
            storeLogoUrl: offer.storeLogoUrl || offer.logo || '',
          });
        });
      }

      toast({
        title: '✅ Review importado com sucesso!',
        description: 'Todos os dados foram carregados. Revise antes de publicar.',
      });

      setMasterJsonInput('');
      setMasterJsonDialogOpen(false);
    } catch (error) {
      setJsonError('JSON inválido! Verifique o formato e tente novamente.');
    }
  };

  const mutation = useMutation({
    mutationFn: initialData ? updateReview : createReview,
    onSuccess: () => {
      toast({
        title: `Review ${initialData ? 'atualizado' : 'criado'} com sucesso!`,
      });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      router.push('/admin/dashboard');
      router.refresh();
    },
    onError: (error) => {
      console.error('Error saving review: ', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o review. Tente novamente.',
      });
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    const finalData = {
      ...data,
      id: initialData?.id || new Date().toISOString(),
      slug: data.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, ''),
      rating: data.rating,
      imageAspectRatio: data.imageAspectRatio,
      pros: data.pros?.map((p) => p.value).filter(Boolean),
      cons: data.cons?.map((c) => c.value).filter(Boolean),
      images: data.images?.map((img) => img.value).filter(Boolean),
      technicalSpecs:
        data.technicalSpecs?.reduce((acc, { key, value }) => {
          if (key && value) acc[key] = value;
          return acc;
        }, {} as Record<string, string>) || {},
      scores:
        data.scores?.reduce((acc, { key, value }) => {
          if (key) acc[key] = value;
          return acc;
        }, {} as Record<string, number>) || {},
      offers:
        data.offers?.map((o, index) => ({
          ...o,
          id: String(index + 1),
        })) || [],
      publishedAt: initialData?.publishedAt || new Date().toISOString(),
    };

    mutation.mutate(finalData as Review);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Botão JSON Mestre no Topo */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileJson className="h-5 w-5 text-purple-600" />
                  Importação Rápida via JSON
                </h3>
                <p className="text-sm text-muted-foreground">
                  Importe todos os dados do review de uma só vez usando JSON
                </p>
              </div>

              <Dialog open={masterJsonDialogOpen} onOpenChange={setMasterJsonDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" size="lg" className="bg-purple-600 hover:bg-purple-700">
                    <FileJson className="mr-2 h-5 w-5" />
                    Importar JSON Completo
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Importar Review Completo via JSON</DialogTitle>
                    <DialogDescription>
                      Cole o JSON completo do review abaixo. Todos os campos serão preenchidos automaticamente.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">📋 Exemplo de JSON completo:</p>
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`{
  "title": "Review da Geladeira Frost Free Brastemp 375L",
  "category": "eletrodomesticos",
  "rating": 4.5,
  "image": "https://exemplo.com/imagem-principal.jpg",
  "imageAspectRatio": "square",
  "summary": "Uma geladeira moderna e eficiente com excelente custo-benefício.",
  "content": "A Geladeira Frost Free Brastemp 375L é uma excelente opção...",
  "priceRange": "R$ 2.000 - R$ 2.500",
  "pros": [
    "Grande capacidade de armazenamento",
    "Sistema Frost Free eficiente",
    "Baixo consumo de energia"
  ],
  "cons": [
    "Preço um pouco elevado",
    "Barulho leve do compressor"
  ],
  "images": [
    "https://exemplo.com/galeria1.jpg",
    "https://exemplo.com/galeria2.jpg"
  ],
  "technicalSpecs": {
    "Capacidade": "375 litros",
    "Cor": "Branca",
    "Peso": "68 kg",
    "Consumo": "45 kWh/mês"
  },
  "scores": {
    "Design": 9.0,
    "Desempenho": 8.5,
    "Custo-benefício": 8.5
  },
  "offers": [
    {
      "store": "Amazon",
      "price": 2199.90,
      "offerUrl": "https://amazon.com.br/produto",
      "storeLogoUrl": "https://exemplo.com/logo-amazon.png"
    }
  ]
}`}
                      </pre>
                    </div>

                    <Textarea
                      value={masterJsonInput}
                      onChange={(e) => setMasterJsonInput(e.target.value)}
                      placeholder="Cole o JSON completo aqui..."
                      rows={15}
                      className="font-mono text-sm"
                    />
                    {jsonError && (
                      <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                        {jsonError}
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setMasterJsonDialogOpen(false);
                        setMasterJsonInput('');
                        setJsonError('');
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleImportMasterJson}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Importar Tudo
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* Conteúdo Principal */}
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo Principal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Review da Geladeira XYZ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumo (2-3 linhas)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Um breve resumo do review..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Completo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escreva a análise completa aqui..."
                          rows={15}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Prós e Contras com JSON */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>Prós e Contras</CardTitle>
                    {isAiPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>

                  <Dialog open={prosConsDialogOpen} onOpenChange={setProsConsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        <FileJson className="mr-2 h-4 w-4" />
                        Importar JSON
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Importar Prós e Contras via JSON</DialogTitle>
                        <DialogDescription>
                          Cole o JSON com prós e contras. Exemplo:
                          <pre className="mt-2 p-2 bg-muted rounded text-xs">
{`{
  "pros": [
    "Grande capacidade",
    "Econômico"
  ],
  "cons": [
    "Preço elevado",
    "Barulhento"
  ]
}`}
                          </pre>
                        </DialogDescription>
                      </DialogHeader>

                      <Textarea
                        value={prosConsInput}
                        onChange={(e) => setProsConsInput(e.target.value)}
                        placeholder='{"pros": [...], "cons": [...]}'
                        rows={10}
                        className="font-mono text-sm"
                      />
                      {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setProsConsDialogOpen(false);
                            setProsConsInput('');
                            setJsonError('');
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button type="button" onClick={handleImportProsConsJson}>
                          Importar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {(suggestions.pros.length > 0 || suggestions.cons.length > 0) && (
                  <div className="space-y-2 pt-4">
                    <p className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Lightbulb className="h-4 w-4 text-yellow-400" /> Sugestões da IA (clique
                      para adicionar):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.pros.map((pro, i) => (
                        <Badge
                          key={`pro-${i}`}
                          variant="outline"
                          className="cursor-pointer bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-300 dark:border-green-800 hover:bg-green-200"
                          onClick={() => addSuggestion('pros', pro)}
                        >
                          + {pro}
                        </Badge>
                      ))}
                      {suggestions.cons.map((con, i) => (
                        <Badge
                          key={`con-${i}`}
                          variant="outline"
                          className="cursor-pointer bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 hover:bg-red-200"
                          onClick={() => addSuggestion('cons', con)}
                        >
                          - {con}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel>Prós</FormLabel>
                    <div className="space-y-2 mt-2">
                      {proFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`pros.${index}.value`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input {...field} placeholder="Ponto positivo" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removePro(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => appendPro({ value: '' })}
                    >
                      Adicionar Pró
                    </Button>
                  </div>

                  <div>
                    <FormLabel>Contras</FormLabel>
                    <div className="space-y-2 mt-2">
                      {conFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`cons.${index}.value`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input {...field} placeholder="Ponto negativo" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCon(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => appendCon({ value: '' })}
                    >
                      Adicionar Contra
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ficha Técnica e Notas com JSON */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Ficha Técnica e Notas</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Especificações Técnicas */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Especificações Técnicas</FormLabel>

                    <Dialog open={specsDialogOpen} onOpenChange={setSpecsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="sm">
                          <FileJson className="mr-2 h-4 w-4" />
                          Importar JSON
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Importar Especificações via JSON</DialogTitle>
                          <DialogDescription>
                            Cole o JSON das especificações. Exemplo:
                            <pre className="mt-2 p-2 bg-muted rounded text-xs">
{`{
  "Cor": "Branca",
  "Peso": "58 kg",
  "Altura": "166,9 cm"
}`}
                            </pre>
                          </DialogDescription>
                        </DialogHeader>

                        <Textarea
                          value={specsInput}
                          onChange={(e) => setSpecsInput(e.target.value)}
                          placeholder='{"Cor": "Branca", "Peso": "58 kg"}'
                          rows={10}
                          className="font-mono text-sm"
                        />
                        {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}

                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSpecsDialogOpen(false);
                              setSpecsInput('');
                              setJsonError('');
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button type="button" onClick={handleImportSpecsJson}>
                            Importar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2 mt-2">
                    {specFields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-5 gap-2 items-center">
                        <FormField
                          control={form.control}
                          name={`technicalSpecs.${index}.key`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormControl>
                                <Input {...field} placeholder="Característica" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`technicalSpecs.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormControl>
                                <Input {...field} placeholder="Valor" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="col-span-1"
                          onClick={() => removeSpec(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => appendSpec({ key: '', value: '' })}
                  >
                    Adicionar Especificação
                  </Button>
                </div>

                <Separator />

                {/* Notas por Critério */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Notas por Critério (0 a 10)</FormLabel>

                    <Dialog open={scoresDialogOpen} onOpenChange={setScoresDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="sm">
                          <FileJson className="mr-2 h-4 w-4" />
                          Importar JSON
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Importar Notas via JSON</DialogTitle>
                          <DialogDescription>
                            Cole o JSON com as notas. Exemplo:
                            <pre className="mt-2 p-2 bg-muted rounded text-xs">
{`{
  "Design": 9.5,
  "Desempenho": 9.0,
  "Custo-benefício": 8.5
}`}
                            </pre>
                          </DialogDescription>
                        </DialogHeader>

                        <Textarea
                          value={scoresInput}
                          onChange={(e) => setScoresInput(e.target.value)}
                          placeholder='{"Design": 9.5, "Desempenho": 9.0}'
                          rows={10}
                          className="font-mono text-sm"
                        />
                        {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}

                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setScoresDialogOpen(false);
                              setScoresInput('');
                              setJsonError('');
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button type="button" onClick={handleImportScoresJson}>
                            Importar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2 mt-2">
                    {scoreFields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-5 gap-2 items-center">
                        <FormField
                          control={form.control}
                          name={`scores.${index}.key`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormControl>
                                <Input {...field} placeholder="Critério" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`scores.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormControl>
                                <Input type="number" step="0.1" {...field} placeholder="Nota" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="col-span-1"
                          onClick={() => removeScore(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => appendScore({ key: '', value: 0 })}
                  >
                    Adicionar Critério
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Onde Comprar */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Onde Comprar</CardTitle>

                  <Dialog open={offersDialogOpen} onOpenChange={setOffersDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        <FileJson className="mr-2 h-4 w-4" />
                        Importar JSON
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Importar Ofertas via JSON</DialogTitle>
                        <DialogDescription>
                          Cole o JSON com as ofertas das lojas. Exemplo:
                          <pre className="mt-2 p-2 bg-muted rounded text-xs">
{`[
  {
    "store": "Amazon",
    "price": 2199.90,
    "offerUrl": "https://amazon.com.br/produto",
    "storeLogoUrl": "https://exemplo.com/logo-amazon.png"
  },
  {
    "store": "Magazine Luiza",
    "price": 2299.00,
    "offerUrl": "https://magazineluiza.com.br/produto",
    "storeLogoUrl": "https://exemplo.com/logo-magalu.png"
  }
]`}
                          </pre>
                        </DialogDescription>
                      </DialogHeader>

                      <Textarea
                        value={offersInput}
                        onChange={(e) => setOffersInput(e.target.value)}
                        placeholder='[{"store": "Amazon", "price": 2199.90, ...}]'
                        rows={10}
                        className="font-mono text-sm"
                      />
                      {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setOffersDialogOpen(false);
                            setOffersInput('');
                            setJsonError('');
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button type="button" onClick={handleImportOffersJson}>
                          Importar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {offerFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1"
                      onClick={() => removeOffer(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`offers.${index}.store`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loja</FormLabel>
                            <FormControl>
                              <Input placeholder="Amazon" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`offers.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço (ex: 2199)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="2199" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`offers.${index}.storeLogoUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Logo da Loja</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`offers.${index}.offerUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link da Oferta</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    appendOffer({ store: '', price: 0, offerUrl: '', storeLogoUrl: '' })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Oferta
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
            <Card>
              <CardHeader>
                <CardTitle>Publicação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loadingCategories}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={loadingCategories ? 'Carregando...' : 'Selecione uma categoria'}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((c) => (
                            <SelectItem key={c.slug} value={c.slug}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nota Geral (0 a 5)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faixa de Preço</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: R$ 1.500 - R$ 2.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mídia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem Principal</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageAspectRatio"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Proporção da Imagem</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="square" />
                            </FormControl>
                            <FormLabel className="font-normal">Quadrado (1:1)</FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="video" />
                            </FormControl>
                            <FormLabel className="font-normal">Vídeo (16:9)</FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="portrait" />
                            </FormControl>
                            <FormLabel className="font-normal">Retrato (9:16)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Galeria de Imagens</FormLabel>

                    <Dialog open={imagesDialogOpen} onOpenChange={setImagesDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="sm">
                          <FileJson className="mr-2 h-4 w-4" />
                          Importar JSON
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Importar Galeria de Imagens via JSON</DialogTitle>
                          <DialogDescription>
                            Cole o JSON com as URLs das imagens. Exemplo:
                            <pre className="mt-2 p-2 bg-muted rounded text-xs">
{`[
  "https://exemplo.com/imagem1.jpg",
  "https://exemplo.com/imagem2.jpg",
  "https://exemplo.com/imagem3.jpg"
]`}
                            </pre>
                          </DialogDescription>
                        </DialogHeader>

                        <Textarea
                          value={imagesInput}
                          onChange={(e) => setImagesInput(e.target.value)}
                          placeholder='["https://...", "https://..."]'
                          rows={8}
                          className="font-mono text-sm"
                        />
                        {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}

                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setImagesDialogOpen(false);
                              setImagesInput('');
                              setJsonError('');
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button type="button" onClick={handleImportImagesJson}>
                            Importar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2 mt-2">
                    {imageFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`images.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input type="url" {...field} placeholder="https://..." />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => appendImage({ value: '' })}
                  >
                    Adicionar Imagem
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : initialData ? (
                'Atualizar Review'
              ) : (
                'Publicar Review'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}