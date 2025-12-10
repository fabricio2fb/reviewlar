
export interface Review {
  id: string;
  slug: string;
  title: string;
  category: string;
  rating: number;
  image: string;
  images?: string[];
  imageAspectRatio?: 'square' | 'video' | 'portrait';
  summary: string;
  content: string;
  pros?: string[];
  cons?: string[];
  technicalSpecs?: Record<string, string>;
  scores?: Record<string, number>;
  priceRange?: string;
  publishedAt: string;
  offers?: Offer[];
  
  // 🆕 ADICIONE ESTAS LINHAS:
  keywords?: string[];
  metaDescription?: string;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export type Category = {
  name: string;
  slug: string;
};

export type NavItem = {
  title: string;
  href: string;
};

export type Offer = {
  id: string;
  store: string;
  storeLogoUrl: string;
  price: number;
  offerUrl: string;
};
