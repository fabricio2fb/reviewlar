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
import { Lightbulb, Loader2, PlusCircle, Trash2, FileJson, Tag, X } from 'lucide-react';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories, createReview, updateReview } from '@/lib/server-actions';

const formSchema = z.object({
  title: z.string().min(5, 'Título muito curto').max(1000, 'Título muito longo'),
  category: z.string().min(1, 'Selecione uma categoria'),
  rating: z.coerce.number().min(0).max(5, 'A nota deve ser entre 0 e 5'),
  image: z.string().url('Insira uma URL de imagem válida'),
  imageAspectRatio: z
    .enum(['square', 'video', 'portrait'])
    .optional()
    .default('square'),
  summary: z.string().min(20, 'Resumo muito curto').max(1000, 'Resumo muito longo'),
  content: z.string().min(100, 'O conteúdo do review é muito curto'),
  // Campos SEO
  keywords: z.array(z.object({ value: z.string() })).optional(),
  metaDescription: z.string().max(160, 'Meta descrição muito longa').optional(),
  // FAQ para SEO
  faq: z.array(z.object({ 
    question: z.string().min(5, 'Pergunta muito curta'), 
    answer: z.string().min(10, 'Resposta muito curta') 
  })).optional(),
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

const faqToFieldArray = (faq: Array<{question: string, answer: string}> | undefined) =>
  faq?.map(({ question, answer }) => ({ question, answer })) || [];

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
  const [keywordsDialogOpen, setKeywordsDialogOpen] = useState(false);
  const [keywordsInput, setKeywordsInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  
  // NOVO: Estado para adicionar keyword individual
  const [newKeyword, setNewKeyword] = useState('');

  const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Templates de JSON por categoria (definido antes de usar)
  const jsonTemplates: Record<string, any> = {
    geladeira: {
      title: "Review da Geladeira Frost Free Brastemp 375L",
      slug: "geladeira-frost-free-brastemp-375l",
      category: "geladeira",
      brand: "Brastemp",
      model: "BRM45HK",
      rating: 4.5,
      image: "https://exemplo.com/imagem-principal.jpg",
      imageAspectRatio: "square",
      summary: "Uma geladeira moderna e eficiente com excelente custo-benefício.",
      content: "A Geladeira Frost Free Brastemp 375L é uma excelente opção para quem busca capacidade e economia...",
      priceRange: "R$ 2.000 - R$ 2.500",
      metaDescription: "Review completo da Geladeira Brastemp 375L com análise detalhada de recursos, consumo e custo-benefício",
      keywords: ["geladeira brastemp", "frost free", "geladeira 375 litros", "review geladeira", "brastemp 2024"],
      tags: ["geladeira", "frost-free", "brastemp", "375-litros", "2000-2500-reais"],
      pros: ["Grande capacidade de armazenamento", "Sistema Frost Free eficiente", "Baixo consumo de energia"],
      cons: ["Preço um pouco elevado", "Barulho leve do compressor"],
      images: ["https://exemplo.com/galeria1.jpg", "https://exemplo.com/galeria2.jpg"],
      technicalSpecs: {
        "Altura": "166.9 cm",
        "Largura": "60 cm",
        "Profundidade": "65 cm",
        "Peso": "68 kg",
        "Capacidade Total (Litros)": "375L",
        "Capacidade do Refrigerador (Litros)": "275L",
        "Capacidade do Freezer (Litros)": "100L",
        "Voltagem (Tensão)": "220V",
        "Potência (Watts)": "180W",
        "Frost Free": "Sim",
        "Quantidade de Portas": "2",
        "Cor": "Branca",
        "Consumo de Energia Mensal (kWh)": "45 kWh/mês",
        "Classificação Procel": "A"
      },
      scores: {
        "overall": 8.5,
        "design": 9.0,
        "performance": 8.5,
        "costBenefit": 8.5,
        "easeOfUse": 8.0,
        "energyEfficiency": 9.0
      },
      faq: [
        {
          "question": "Qual o consumo mensal de energia?",
          "answer": "Aproximadamente 45 kWh/mês, classificação A pelo Procel"
        },
        {
          "question": "Tem sistema Frost Free?",
          "answer": "Sim, não forma gelo e dispensa degelo manual"
        }
      ],
      offers: [
        {
          store: "Magazine Luiza",
          price: 2199.90,
          originalPrice: 2699.90,
          discount: 19,
          offerUrl: "https://magazineluiza.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/rsM4T89r/Magalu-novo-logo.png",
          availability: "in_stock"
        },
        {
          store: "Amazon",
          price: 2299.90,
          originalPrice: 2799.90,
          discount: 18,
          offerUrl: "https://amazon.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/5yWDPMFK/Design-sem-nome-27.png",
          availability: "in_stock"
        },
        {
          store: "Mercado Livre",
          price: 2399.90,
          originalPrice: 2899.90,
          discount: 17,
          offerUrl: "https://mercadolivre.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/NFrfXYvJ/Design-sem-nome-28.png",
          availability: "in_stock"
        }
      ]
    },
    airfryer: {
      title: "Review da Air Fryer Philco Gourmet Black 4.4L",
      slug: "air-fryer-philco-gourmet-black-pfr15p-44l",
      category: "airfryer",
      brand: "Philco",
      model: "PFR15P",
      rating: 4.7,
      image: "https://exemplo.com/airfryer.jpg",
      imageAspectRatio: "square",
      summary: "Uma air fryer potente e espaçosa para frituras saudáveis.",
      content: "A Air Fryer Philco Gourmet Black oferece 4.4L de capacidade e tecnologia de circulação de ar...",
      priceRange: "R$ 250 - R$ 400",
      metaDescription: "Review completo da Air Fryer Philco 4.4L - análise de capacidade, desempenho e custo-benefício",
      keywords: ["air fryer philco", "fritadeira elétrica", "air fryer 4.4 litros", "philco gourmet", "fritadeira sem óleo"],
      tags: ["air-fryer", "philco", "4-litros", "ate-400-reais"],
      pros: ["Grande capacidade (3-4 pessoas)", "Fácil de limpar", "Econômica e eficiente"],
      cons: ["Barulho do ventilador", "Timer poderia ser mais preciso"],
      images: ["https://exemplo.com/airfryer1.jpg", "https://exemplo.com/airfryer2.jpg"],
      technicalSpecs: {
        "Altura": "34.6 cm",
        "Largura": "29.5 cm",
        "Profundidade": "32 cm",
        "Peso": "4.22 kg",
        "Capacidade (Litros)": "4.4L",
        "Capacidade (Porções)": "3-4 pessoas",
        "Potência (Watts)": "1500W",
        "Voltagem (Tensão)": "127V ou 220V",
        "Temperatura Máxima": "200°C",
        "Temperatura Mínima": "80°C",
        "Timer Programável": "Até 30 minutos",
        "Cesto Antiaderente": "Sim",
        "Cor": "Preto",
        "Consumo Médio de Energia": "1.5 kWh/uso"
      },
      scores: {
        "overall": 8.8,
        "design": 8.5,
        "performance": 9.0,
        "costBenefit": 9.0,
        "easeOfUse": 8.5,
        "cleaning": 9.0
      },
      faq: [
        {
          "question": "Quantas porções cabem na Air Fryer?",
          "answer": "Serve confortavelmente 3-4 pessoas com seus 4.4 litros"
        },
        {
          "question": "É fácil de limpar?",
          "answer": "Sim, o cesto é antiaderente e removível, pode lavar na mão ou lava-louças"
        },
        {
          "question": "Faz muito barulho?",
          "answer": "O barulho do ventilador é moderado, similar a um micro-ondas em funcionamento"
        }
      ],
      offers: [
        {
          store: "Magazine Luiza",
          price: 289.90,
          originalPrice: 399.90,
          discount: 27,
          offerUrl: "https://magazineluiza.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/rsM4T89r/Magalu-novo-logo.png",
          availability: "in_stock"
        },
        {
          store: "Amazon",
          price: 319.90,
          originalPrice: 429.90,
          discount: 26,
          offerUrl: "https://amazon.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/5yWDPMFK/Design-sem-nome-27.png",
          availability: "in_stock"
        },
        {
          store: "Mercado Livre",
          price: 349.90,
          originalPrice: 449.90,
          discount: 22,
          offerUrl: "https://mercadolivre.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/NFrfXYvJ/Design-sem-nome-28.png",
          availability: "in_stock"
        }
      ]
    },
    televisao: {
      title: "Review da Smart TV Samsung 55 4K QLED",
      slug: "smart-tv-samsung-55-4k-qled",
      category: "televisao",
      brand: "Samsung",
      model: "QN55Q60C",
      rating: 4.8,
      image: "https://exemplo.com/tv.jpg",
      imageAspectRatio: "video",
      summary: "Uma Smart TV com qualidade de imagem excepcional e recursos inteligentes.",
      content: "A Samsung QLED 55 polegadas oferece resolução 4K, HDR e sistema operacional Tizen...",
      priceRange: "R$ 2.500 - R$ 3.500",
      metaDescription: "Review completo da Smart TV Samsung 55 QLED 4K - análise de imagem, som e recursos smart",
      keywords: ["smart tv samsung", "tv 55 polegadas", "qled 4k", "samsung 2024", "tv smart"],
      tags: ["smart-tv", "samsung", "55-polegadas", "4k", "qled", "2500-3500-reais"],
      pros: ["Qualidade de imagem excelente", "Sistema operacional rápido", "Design elegante"],
      cons: ["Preço elevado", "Som poderia ser melhor"],
      images: ["https://exemplo.com/tv1.jpg", "https://exemplo.com/tv2.jpg"],
      technicalSpecs: {
        "Altura": "70.4 cm",
        "Largura": "123.1 cm",
        "Profundidade (com base)": "25.6 cm",
        "Peso": "18.5 kg",
        "Tamanho da Tela (Polegadas)": "55\"",
        "Resolução": "4K UHD (3840x2160)",
        "Taxa de Atualização (Hz)": "120Hz",
        "HDR": "HDR10+",
        "Sistema Operacional": "Tizen",
        "Quantidade de HDMI": "4",
        "HDMI ARC/eARC": "eARC",
        "Quantidade de USB": "2",
        "Wi-Fi": "Sim (Wi-Fi 5)",
        "Bluetooth": "Sim (5.2)",
        "Potência de Áudio (Watts RMS)": "20W",
        "Consumo de Energia (Operação)": "95W"
      },
      scores: {
        "overall": 8.8,
        "design": 9.5,
        "performance": 9.0,
        "costBenefit": 8.0,
        "imageQuality": 9.5,
        "soundQuality": 7.5
      },
      faq: [
        {
          "question": "Tem suporte para jogos com 120Hz?",
          "answer": "Sim, suporta até 120Hz para jogos compatíveis via HDMI 2.1"
        },
        {
          "question": "Qual sistema operacional?",
          "answer": "Usa o Tizen da Samsung, com acesso a todos os principais apps de streaming"
        }
      ],
      offers: [
        {
          store: "Magazine Luiza",
          price: 2899.90,
          originalPrice: 3499.90,
          discount: 17,
          offerUrl: "https://magazineluiza.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/rsM4T89r/Magalu-novo-logo.png",
          availability: "in_stock"
        },
        {
          store: "Amazon",
          price: 2999.90,
          originalPrice: 3599.90,
          discount: 17,
          offerUrl: "https://amazon.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/5yWDPMFK/Design-sem-nome-27.png",
          availability: "in_stock"
        },
        {
          store: "Mercado Livre",
          price: 3199.90,
          originalPrice: 3799.90,
          discount: 16,
          offerUrl: "https://mercadolivre.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/NFrfXYvJ/Design-sem-nome-28.png",
          availability: "in_stock"
        }
      ]
    },
    cafeteira: {
      title: "Review da Cafeteira Nespresso Essenza Mini",
      slug: "cafeteira-nespresso-essenza-mini",
      category: "cafeteira",
      brand: "Nespresso",
      model: "Essenza Mini",
      rating: 4.6,
      image: "https://exemplo.com/cafeteira.jpg",
      imageAspectRatio: "square",
      summary: "Cafeteira compacta e eficiente para café expresso de qualidade.",
      content: "A Nespresso Essenza Mini é perfeita para espaços pequenos e oferece café de qualidade profissional...",
      priceRange: "R$ 400 - R$ 600",
      metaDescription: "Review completo da Cafeteira Nespresso Essenza Mini - análise de desempenho e qualidade do café",
      keywords: ["cafeteira nespresso", "essenza mini", "cafeteira expresso", "nespresso", "café em cápsula"],
      tags: ["cafeteira", "nespresso", "espresso", "cafe-em-capsula"],
      pros: ["Compacta", "Café de qualidade", "Fácil de usar"],
      cons: ["Cápsulas caras", "Reservatório pequeno"],
      images: ["https://exemplo.com/cafeteira1.jpg", "https://exemplo.com/cafeteira2.jpg"],
      technicalSpecs: {
        "Altura": "20.4 cm",
        "Largura": "8.4 cm",
        "Profundidade": "33 cm",
        "Peso": "2.3 kg",
        "Capacidade do Reservatório (mL)": "600ml",
        "Potência (Watts)": "1260W",
        "Voltagem (Tensão)": "127V",
        "Tipo de Cafeteira": "Cápsulas",
        "Desligamento Automático": "Sim",
        "Cor": "Preto"
      },
      scores: {
        "overall": 8.5,
        "design": 9.0,
        "performance": 9.0,
        "costBenefit": 7.5,
        "easeOfUse": 9.5,
        "coffeeQuality": 9.5
      },
      faq: [
        {
          "question": "Aceita cápsulas de outras marcas?",
          "answer": "Funciona melhor com cápsulas Nespresso originais, mas aceita algumas compatíveis"
        },
        {
          "question": "Quanto tempo leva para fazer um café?",
          "answer": "Aproximadamente 25-30 segundos após o aquecimento inicial"
        }
      ],
      offers: [
        {
          store: "Magazine Luiza",
          price: 499.90,
          originalPrice: 649.90,
          discount: 23,
          offerUrl: "https://magazineluiza.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/rsM4T89r/Magalu-novo-logo.png",
          availability: "in_stock"
        },
        {
          store: "Amazon",
          price: 529.90,
          originalPrice: 679.90,
          discount: 22,
          offerUrl: "https://amazon.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/5yWDPMFK/Design-sem-nome-27.png",
          availability: "in_stock"
        },
        {
          store: "Mercado Livre",
          price: 549.90,
          originalPrice: 699.90,
          discount: 21,
          offerUrl: "https://mercadolivre.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/NFrfXYvJ/Design-sem-nome-28.png",
          availability: "in_stock"
        }
      ]
    },
    fogao: {
      title: "Review do Fogão Brastemp 5 Bocas Ative Timer",
      slug: "fogao-brastemp-5-bocas-ative-timer",
      category: "fogao",
      brand: "Brastemp",
      model: "BFS5TCR",
      rating: 4.4,
      image: "https://exemplo.com/fogao.jpg",
      imageAspectRatio: "square",
      summary: "Fogão completo com timer e mesa de vidro temperado.",
      content: "O Fogão Brastemp Ative possui 5 bocas, forno espaçoso e sistema de segurança...",
      priceRange: "R$ 1.200 - R$ 1.800",
      metaDescription: "Review completo do Fogão Brastemp 5 Bocas - análise de recursos, forno e custo-benefício",
      keywords: ["fogão brastemp", "fogão 5 bocas", "fogão com timer", "brastemp ative", "fogão mesa vidro"],
      tags: ["fogao", "brastemp", "5-bocas", "timer", "1200-1800-reais"],
      pros: ["Timer útil", "Mesa de vidro fácil de limpar", "Forno grande"],
      cons: ["Pesado", "Acendimento automático pode falhar"],
      images: ["https://exemplo.com/fogao1.jpg", "https://exemplo.com/fogao2.jpg"],
      technicalSpecs: {
        "Altura": "90 cm",
        "Largura": "76 cm",
        "Profundidade": "62 cm",
        "Peso": "45 kg",
        "Quantidade de Bocas": "5",
        "Tipo de Gás Compatível": "GLP/GN",
        "Mesa (Material)": "Vidro temperado",
        "Capacidade do Forno (Litros)": "65L",
        "Timer": "Sim",
        "Acendimento Automático": "Sim",
        "Cor": "Inox"
      },
      scores: {
        "overall": 8.5,
        "design": 8.5,
        "performance": 8.5,
        "costBenefit": 8.5,
        "easeOfUse": 8.0,
        "ovenCapacity": 9.0
      },
      faq: [
        {
          "question": "O timer funciona para o forno?",
          "answer": "Sim, o timer é para o forno e emite um alarme sonoro quando o tempo termina"
        },
        {
          "question": "Funciona com gás de rua?",
          "answer": "Sim, é compatível com GLP (botijão) e GN (gás encanado)"
        }
      ],
      offers: [
        {
          store: "Magazine Luiza",
          price: 1399.90,
          originalPrice: 1799.90,
          discount: 22,
          offerUrl: "https://magazineluiza.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/rsM4T89r/Magalu-novo-logo.png",
          availability: "in_stock"
        },
        {
          store: "Amazon",
          price: 1499.90,
          originalPrice: 1899.90,
          discount: 21,
          offerUrl: "https://amazon.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/5yWDPMFK/Design-sem-nome-27.png",
          availability: "in_stock"
        },
        {
          store: "Mercado Livre",
          price: 1599.90,
          originalPrice: 1999.90,
          discount: 20,
          offerUrl: "https://mercadolivre.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/NFrfXYvJ/Design-sem-nome-28.png",
          availability: "in_stock"
        }
      ]
    },
    liquidificador: {
      title: "Review do Liquidificador Philips Walita Problend 6",
      slug: "liquidificador-philips-walita-problend-6",
      category: "liquidificador",
      brand: "Philips Walita",
      model: "RI2134",
      rating: 4.5,
      image: "https://exemplo.com/liquidificador.jpg",
      imageAspectRatio: "square",
      summary: "Liquidificador potente com 1000W e lâminas ProBlend.",
      content: "O Philips Walita Problend 6 oferece motor potente, jarra de vidro e múltiplas velocidades...",
      priceRange: "R$ 250 - R$ 400",
      metaDescription: "Review completo do Liquidificador Philips Problend 6 - análise de potência e desempenho",
      keywords: ["liquidificador philips", "walita problend", "liquidificador 1000w", "liquidificador potente", "philips 2024"],
      tags: ["liquidificador", "philips", "1000w", "250-400-reais"],
      pros: ["Muito potente", "Jarra de vidro resistente", "Silencioso"],
      cons: ["Pesado", "Preço médio-alto"],
      images: ["https://exemplo.com/liquidificador1.jpg", "https://exemplo.com/liquidificador2.jpg"],
      technicalSpecs: {
        "Altura": "42 cm",
        "Largura": "21 cm",
        "Profundidade": "22 cm",
        "Peso": "3.8 kg",
        "Capacidade do Copo (Litros)": "2.0L",
        "Potência (Watts)": "1000W",
        "Voltagem (Tensão)": "220V",
        "Quantidade de Velocidades": "5",
        "Função Pulsar": "Sim",
        "Copo (Material)": "Vidro",
        "Lâminas (Material)": "Aço inox",
        "Cor": "Vermelho"
      },
      scores: {
        "overall": 8.8,
        "design": 8.5,
        "performance": 9.5,
        "costBenefit": 8.5,
        "easeOfUse": 9.0,
        "durability": 9.0
      },
      faq: [
        {
          "question": "Tritura gelo com facilidade?",
          "answer": "Sim, com 1000W tritura gelo facilmente em segundos"
        },
        {
          "question": "A jarra é resistente?",
          "answer": "Sim, jarra de vidro temperado muito resistente a impactos"
        }
      ],
      offers: [
        {
          store: "Magazine Luiza",
          price: 299.90,
          originalPrice: 399.90,
          discount: 25,
          offerUrl: "https://magazineluiza.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/rsM4T89r/Magalu-novo-logo.png",
          availability: "in_stock"
        },
        {
          store: "Amazon",
          price: 329.90,
          originalPrice: 429.90,
          discount: 23,
          offerUrl: "https://amazon.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/5yWDPMFK/Design-sem-nome-27.png",
          availability: "in_stock"
        },
        {
          store: "Mercado Livre",
          price: 349.90,
          originalPrice: 449.90,
          discount: 22,
          offerUrl: "https://mercadolivre.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/NFrfXYvJ/Design-sem-nome-28.png",
          availability: "in_stock"
        }
      ]
    },
    maquinadelavar: {
      title: "Review da Máquina de Lavar LG 11kg Inverter",
      slug: "maquina-lavar-lg-11kg-inverter",
      category: "maquinadelavar",
      brand: "LG",
      model: "FV3011WG4",
      rating: 4.7,
      image: "https://exemplo.com/maquina.jpg",
      imageAspectRatio: "square",
      summary: "Máquina de lavar eficiente com motor inverter e 11kg de capacidade.",
      content: "A LG 11kg com tecnologia Inverter oferece economia de energia, várias funções e grande capacidade...",
      priceRange: "R$ 1.800 - R$ 2.500",
      metaDescription: "Review completo da Máquina de Lavar LG 11kg Inverter - análise de eficiência e programas",
      keywords: ["máquina lavar lg", "lavadora 11kg", "lg inverter", "máquina lavar inverter", "lavadora lg 2024"],
      tags: ["maquina-lavar", "lg", "11kg", "inverter", "1800-2500-reais"],
      pros: ["Grande capacidade", "Econômica", "Silenciosa"],
      cons: ["Preço elevado", "Ciclos longos"],
      images: ["https://exemplo.com/maquina1.jpg", "https://exemplo.com/maquina2.jpg"],
      technicalSpecs: {
        "Altura": "93 cm",
        "Largura": "60 cm",
        "Profundidade": "64 cm",
        "Peso": "62 kg",
        "Capacidade de Lavagem (kg)": "11kg",
        "Potência (Watts)": "2000W",
        "Voltagem (Tensão)": "220V",
        "Inverter": "Sim",
        "Centrifugação (RPM)": "1200 RPM",
        "Quantidade de Programas": "12",
        "Cor": "Branca",
        "Consumo de Água por Ciclo (L)": "95L",
        "Selo Procel": "A"
      },
      scores: {
        "overall": 8.9,
        "design": 8.5,
        "performance": 9.0,
        "costBenefit": 8.5,
        "easeOfUse": 9.0,
        "energyEfficiency": 9.5
      },
      faq: [
        {
          "question": "O que é tecnologia Inverter?",
          "answer": "Motor que ajusta a velocidade conforme necessário, economizando até 30% de energia"
        },
        {
          "question": "Faz muito barulho na centrifugação?",
          "answer": "Não, é muito silenciosa mesmo a 1200 RPM graças ao motor Inverter"
        }
      ],
      offers: [
        {
          store: "Magazine Luiza",
          price: 1999.90,
          originalPrice: 2499.90,
          discount: 20,
          offerUrl: "https://magazineluiza.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/rsM4T89r/Magalu-novo-logo.png",
          availability: "in_stock"
        },
        {
          store: "Amazon",
          price: 2099.90,
          originalPrice: 2599.90,
          discount: 19,
          offerUrl: "https://amazon.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/5yWDPMFK/Design-sem-nome-27.png",
          availability: "in_stock"
        },
        {
          store: "Mercado Livre",
          price: 2199.90,
          originalPrice: 2699.90,
          discount: 19,
          offerUrl: "https://mercadolivre.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/NFrfXYvJ/Design-sem-nome-28.png",
          availability: "in_stock"
        }
      ]
    },
    microondas: {
      title: "Review do Micro-ondas Panasonic 32L com Grill",
      slug: "micro-ondas-panasonic-32l-grill",
      category: "microondas",
      brand: "Panasonic",
      model: "NN-GT68HSRUN",
      rating: 4.6,
      image: "https://exemplo.com/microondas.jpg",
      imageAspectRatio: "square",
      summary: "Micro-ondas espaçoso com função grill e receitas pré-programadas.",
      content: "O Panasonic 32L oferece grande capacidade, grill integrado e diversas funções automáticas...",
      priceRange: "R$ 600 - R$ 900",
      metaDescription: "Review completo do Micro-ondas Panasonic 32L - análise de capacidade e funções",
      keywords: ["micro-ondas panasonic", "microondas 32 litros", "microondas com grill", "panasonic 2024", "microondas grande"],
      tags: ["micro-ondas", "panasonic", "32-litros", "grill", "600-900-reais"],
      pros: ["Grande capacidade", "Grill eficiente", "Muitas receitas automáticas"],
      cons: ["Pesado", "Ocupa espaço"],
      images: ["https://exemplo.com/microondas1.jpg", "https://exemplo.com/microondas2.jpg"],
      technicalSpecs: {
        "Altura": "31.6 cm",
        "Largura": "54.9 cm",
        "Profundidade": "43.5 cm",
        "Peso": "16.5 kg",
        "Capacidade Interna (Litros)": "32L",
        "Potência (Watts)": "1200W",
        "Potência do Grill": "1000W",
        "Voltagem (Tensão)": "127V",
        "Grill": "Sim",
        "Receitas Pré-programadas": "15",
        "Descongelamento Automático": "Sim",
        "Cor": "Inox"
      },
      scores: {
        "overall": 8.7,
        "design": 8.5,
        "performance": 9.0,
        "costBenefit": 8.5,
        "easeOfUse": 9.0,
        "capacity": 9.5
      },
      faq: [
        {
          "question": "O grill realmente funciona bem?",
          "answer": "Sim, com 1000W o grill doura muito bem carnes e gratinados"
        },
        {
          "question": "Cabe um prato grande?",
          "answer": "Sim, com 32L cabe pratos de até 36cm de diâmetro"
        }
      ],
      offers: [
        {
          store: "Magazine Luiza",
          price: 699.90,
          originalPrice: 899.90,
          discount: 22,
          offerUrl: "https://magazineluiza.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/rsM4T89r/Magalu-novo-logo.png",
          availability: "in_stock"
        },
        {
          store: "Amazon",
          price: 749.90,
          originalPrice: 949.90,
          discount: 21,
          offerUrl: "https://amazon.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/5yWDPMFK/Design-sem-nome-27.png",
          availability: "in_stock"
        },
        {
          store: "Mercado Livre",
          price: 799.90,
          originalPrice: 999.90,
          discount: 20,
          offerUrl: "https://mercadolivre.com.br/produto",
          storeLogoUrl: "https://i.postimg.cc/NFrfXYvJ/Design-sem-nome-28.png",
          availability: "in_stock"
        }
      ]
    }
  };

  const defaultValues: Partial<ReviewFormValues> = initialData
    ? {
        ...initialData,
        rating: initialData.rating || 0,
        imageAspectRatio: initialData.imageAspectRatio || 'square',
        keywords: arrayToFieldArray(initialData.keywords),
        metaDescription: initialData.metaDescription || '',
        faq: faqToFieldArray(initialData.faq),
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
        keywords: [],
        metaDescription: '',
        faq: [],
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

  // AGORA sim podemos usar form.watch - depois que form foi inicializado
  const selectedCategory = form.watch('category');

  const { fields: keywordFields, append: appendKeyword, remove: removeKeyword } = useFieldArray({
    control: form.control,
    name: 'keywords',
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: 'faq',
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

  // NOVO: Função para adicionar keyword individual
  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      appendKeyword({ value: newKeyword.trim() });
      setNewKeyword('');
    }
  };

  // NOVO: Função para importar Keywords via JSON
  const handleImportKeywordsJson = () => {
    try {
      setJsonError('');
      const parsed = JSON.parse(keywordsInput);

      // Formato obrigatório: { "metaDescription": "...", "keywords": [...] }
      if (!parsed.metaDescription && !parsed.keywords) {
        setJsonError('JSON deve conter "metaDescription" e/ou "keywords"');
        return;
      }
      
      if (parsed.metaDescription) {
        form.setValue('metaDescription', parsed.metaDescription);
      }
      
      if (parsed.keywords && Array.isArray(parsed.keywords)) {
        form.setValue('keywords', []);
        parsed.keywords.forEach((keyword: string) => appendKeyword({ value: keyword.trim() }));
      }
      
      const importedCount = parsed.keywords?.length || 0;
      const hasMetaDesc = parsed.metaDescription ? ' e meta descrição' : '';
      
      toast({
        title: 'SEO importado com sucesso!',
        description: `${importedCount} palavras-chave${hasMetaDesc} adicionadas.`,
      });

      setKeywordsInput('');
      setKeywordsDialogOpen(false);
    } catch (error) {
      setJsonError('JSON inválido! Verifique o formato.');
    }
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
      if (parsed.metaDescription) form.setValue('metaDescription', parsed.metaDescription);

      // Importar imagem principal
      if (parsed.image) form.setValue('image', parsed.image);
      if (parsed.imageAspectRatio) form.setValue('imageAspectRatio', parsed.imageAspectRatio);

      // NOVO: Importar keywords
      if (parsed.keywords && Array.isArray(parsed.keywords)) {
        form.setValue('keywords', []);
        parsed.keywords.forEach((keyword: string) => appendKeyword({ value: keyword }));
      }

      // NOVO: Importar FAQ
      if (parsed.faq && Array.isArray(parsed.faq)) {
        form.setValue('faq', []);
        parsed.faq.forEach((item: any) => appendFaq({ question: item.question, answer: item.answer }));
      }

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
      keywords: data.keywords?.map((k) => k.value).filter(Boolean),
      metaDescription: data.metaDescription || data.summary,
      faq: data.faq?.map((f) => ({ question: f.question, answer: f.answer })).filter(f => f.question && f.answer),
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
{JSON.stringify(
  jsonTemplates[selectedCategory] || jsonTemplates.geladeira,
  null,
  2
)}
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

            {/* NOVO: Card de SEO */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-green-600" />
                    <CardTitle>SEO - Otimização para Google</CardTitle>
                  </div>

                  <Dialog open={keywordsDialogOpen} onOpenChange={setKeywordsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        <FileJson className="mr-2 h-4 w-4" />
                        Importar JSON
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Importar SEO via JSON</DialogTitle>
                        <DialogDescription>
                          Cole o JSON com meta descrição e palavras-chave. Exemplo:
                          <pre className="mt-2 p-2 bg-muted rounded text-xs">
{`{
  "metaDescription": "Review completo da Geladeira Brastemp 375L",
  "keywords": [
    "geladeira brastemp",
    "frost free",
    "geladeira 375 litros",
    "review geladeira",
    "melhor geladeira 2024"
  ]
}`}
                          </pre>
                        </DialogDescription>
                      </DialogHeader>

                      <Textarea
                        value={keywordsInput}
                        onChange={(e) => setKeywordsInput(e.target.value)}
                        placeholder='{"metaDescription": "...", "keywords": [...]}'
                        rows={10}
                        className="font-mono text-sm"
                      />
                      {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setKeywordsDialogOpen(false);
                            setKeywordsInput('');
                            setJsonError('');
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button type="button" onClick={handleImportKeywordsJson}>
                          Importar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Meta Description */}
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Descrição (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrição curta que aparece nos resultados do Google (máx. 160 caracteres)" 
                          rows={3}
                          maxLength={160}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/160 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Palavras-chave */}
                <div>
                  <FormLabel className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4" />
                    Palavras-Chave (Keywords)
                  </FormLabel>
                  <FormDescription className="mb-3">
                    Adicione palavras-chave relevantes para melhorar o SEO e aparecer melhor nas buscas do Google
                  </FormDescription>

                  {/* Adicionar nova keyword */}
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Ex: geladeira frost free"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddKeyword}
                      variant="outline"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Lista de keywords */}
                  <div className="flex flex-wrap gap-2">
                    {keywordFields.map((field, index) => (
                      <Badge
                        key={field.id}
                        variant="secondary"
                        className="pl-3 pr-1 py-1.5 text-sm flex items-center gap-2"
                      >
                        <FormField
                          control={form.control}
                          name={`keywords.${index}.value`}
                          render={({ field }) => (
                            <span>{field.value}</span>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 hover:bg-destructive/20"
                          onClick={() => removeKeyword(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>

                  {keywordFields.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Nenhuma palavra-chave adicionada ainda. Adicione pelo menos 3-5 keywords relevantes.
                    </p>
                  )}
                </div>

                <Separator />

                {/* FAQ Section */}
                <div>
                  <FormLabel className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4" />
                    Perguntas Frequentes (FAQ)
                  </FormLabel>
                  <FormDescription className="mb-3">
                    Adicione perguntas e respostas comuns sobre o produto. Ótimo para SEO!
                  </FormDescription>

                  <div className="space-y-3">
                    {faqFields.map((field, index) => (
                      <div key={field.id} className="p-3 border rounded-md space-y-2 relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1"
                          onClick={() => removeFaq(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>

                        <FormField
                          control={form.control}
                          name={`faq.${index}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Pergunta</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ex: Quantas porções cabem?" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`faq.${index}.answer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Resposta</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="Resposta detalhada..." rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => appendFaq({ question: '', answer: '' })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Pergunta
                  </Button>
                </div>
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

            {/* Restante do código continua igual... */}
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
  "https://exemplo.com/imagem2.jpg"
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