
export type Review = {
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
  technicalSpecs: Record<string, string>;
  publishedAt: Date | string;
  scores?: Record<string, number>;
  priceRange?: string;
  pros?: string[];
  cons?: string[];
  offers?: Offer[];
};

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
