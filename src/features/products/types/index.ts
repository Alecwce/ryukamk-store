export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  created_at?: string;
  colors?: string[];
  colorImages?: Record<string, string>;
}
