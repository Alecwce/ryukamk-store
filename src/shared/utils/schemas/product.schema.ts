import { z } from 'zod';

/**
 * Master Product Schema
 * This schema contains all the possible fields for a product.
 * Use .pick(), .omit(), or .extend() to create specialized schemas.
 */
export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  image: z.string().url('URL de imagen no válida'),
  category: z.string().min(1, 'La categoría es obligatoria'),
  description: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  colorImages: z.record(z.string(), z.string()).optional(),
  created_at: z.string().optional(),
});

/**
 * Schema for Admin Form Validation
 * Includes stricter rules and handles string-to-number conversions for form inputs.
 */
export const adminProductSchema = productSchema.extend({
  name: z.string().min(10, 'Mínimo 10 caracteres para el nombre'),
  price: z.string()
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'El precio debe ser mayor a 0'),
  category: z.string().min(1, 'Selecciona una categoría'),
  description: z.string().min(20, 'Mínimo 20 caracteres para la descripción'),
  stock: z.string()
    .refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, 'El stock no puede ser negativo'),
}).omit({ id: true, rating: true, reviewCount: true, created_at: true });

/**
 * Schema for Database Mapping (Raw Supabase Data)
 * Handles transformations and snake_case fields from the database.
 */
export const dbProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().or(z.string().transform(v => parseFloat(v))),
  image_url: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  stock: z.number().nullable().optional(),
  colors: z.array(z.string()).nullable().optional(),
  sizes: z.array(z.string()).nullable().optional(),
  color_images: z.record(z.string(), z.string()).nullable().optional(),
});
