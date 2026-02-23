import { supabase } from '@/api/supabase';
import { Product } from '../types';
import { dbProductSchema } from '@/shared/schemas/domainSchemas';
import { logger } from '@/shared/lib/logger';

const mapToProduct = (p: Record<string, unknown>): Product => ({
  id: p.id as string,
  name: p.name as string,
  price: Number(p.price),
  image: (p.image_url as string) || 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
  category: (p.category as string) || 'Varios',
  description: (p.description as string) || '',
  stock: (p.stock as number) ?? 10,
  colors: (p.colors as string[]) || [],
  colorImages: (p.color_images as Record<string, string>) || {}
});

/**
 * Validates and maps an array of raw DB rows to Product[]
 * Filters out any rows that fail Zod validation.
 */
function parseProducts(data: unknown[]): Product[] {
  return data
    .map(p => {
      const result = dbProductSchema.safeParse(p);
      return result.success ? mapToProduct(p as Record<string, unknown>) : null;
    })
    .filter((p): p is Product => p !== null);
}

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
      logger.error('Error fetching products:', error);
      return [];
    }

    return parseProducts(data || []);
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
      logger.error(`Error fetching product ${id}:`, error);
      return null;
    }

    const result = dbProductSchema.safeParse(data);
    return result.success ? mapToProduct(data) : null;
  },

  /**
   * Filtra productos por categoría.
   */
  async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .limit(4);

    if (error) {
      logger.error(`Error fetching products for category ${category}:`, error);
      return [];
    }

    return parseProducts(data || []);
  },

  /**
   * Crea un nuevo producto.
   */
  async create(product: Omit<Product, 'id'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: product.name,
          price: product.price,
          image_url: product.image,
          category: product.category,
          description: product.description,
          stock: product.stock,
          colors: product.colors,
          color_images: product.colorImages
        }
      ])
      .select();

    if (error) {
      logger.error('Error creating product:', error);
      throw error;
    }

    return data && data[0] ? mapToProduct(data[0]) : null;
  },

  /**
   * Actualiza un producto existente.
   */
  async update(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...(updates.name && { name: updates.name }),
        ...(updates.price !== undefined && { price: updates.price }),
        ...(updates.image && { image_url: updates.image }),
        ...(updates.category && { category: updates.category }),
        ...(updates.description && { description: updates.description }),
        ...(updates.stock !== undefined && { stock: updates.stock }),
        ...(updates.colors && { colors: updates.colors }),
        ...(updates.colorImages && { color_images: updates.colorImages })
      })
      .eq('id', id)
      .select();

    if (error) {
      logger.error('Error updating product:', error);
      throw error;
    }

    return data && data[0] ? mapToProduct(data[0]) : null;
  },

  /**
   * Elimina un producto.
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting product:', error);
      throw error;
    }
  }
};
