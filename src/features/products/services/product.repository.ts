import { supabase } from '@/api/supabase';
import { Product } from '../types';
import { z } from 'zod';

// Schema para validación de datos externos
const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().or(z.string().transform(v => parseFloat(v))),
  image_url: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const ProductRepository = {
  /**
   * Obtiene todos los productos del catálogo.
   */
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    // Validamos cada producto para asegurar que el frontend no reciba basura
    return (data || []).map(p => {
      const result = productSchema.safeParse(p);
      if (!result.success) {
        console.warn('⚠️ Producto con formato inválido omitido:', p.id);
        return null;
      }
      // Mapping a la interfaz Product (ajustando snake_case a camelCase si es necesario)
      return {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.image_url || 'https://placeholder.com/product.jpg',
        category: p.category || 'Varios'
      } as Product;
    }).filter(p => p !== null) as Product[];
  },

  /**
   * Obtiene un producto por su ID.
   */
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }

    return data;
  },

  /**
   * Filtra productos por categoría.
   */
  async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);

    if (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      return [];
    }

    return data;
  }
};
