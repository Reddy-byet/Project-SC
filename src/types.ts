export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  primaryImage: string;
  hoverImage: string;
  category: "hoodies" | "tees" | "denim" | "accessories";
  sizes: string[];
  badge?: string;
  materials: string;
  fit: string;
  limitedRunCount: number;
  stockCount: number;
}

export interface HeroConfig {
  heading: string;
  subheading: string;
  bannerImage: string;
  ctaText: string;
  overlayOpacity: number;
  fullscreen: boolean;
  accentColor: string;
}

export interface BrandStory {
  quote: string;
  description: string;
  timeline: Array<{ year: string; event: string }>;
}

export interface LookbookConfig {
  title: string;
  credits: string;
  overview: string;
  notes: string;
}

export interface CmsData {
  hero: HeroConfig;
  dropDate: string;
  marqueeTexts: string[];
  brandStory: BrandStory;
  products: Product[];
  lookbooks: LookbookConfig[];
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface StylingSuggestion {
  conceptName: string;
  editorialVibeDescription: string;
  layeringDirectives: string[];
  accessoriesMatching: string;
  designerQuote: string;
}
