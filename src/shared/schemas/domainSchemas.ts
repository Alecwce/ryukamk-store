import { z } from 'zod';

/**
 * 🔗 Source of Truth: Domain Schemas
 * These schemas match the Supabase database structure exactly.
 * Use them for data fetching validation (Zero Trust).
 */

// --- PRODUCT SCHEMA ---
export const dbProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.number().or(z.string().transform(v => parseFloat(v))),
  image_url: z.string().url().nullable().optional(),
  category: z.string().nullable().optional(),
  stock: z.number().int().nonnegative().default(0),
  colors: z.array(z.string()).default([]),
  color_images: z.record(z.string(), z.string()).default({}),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type DbProduct = z.infer<typeof dbProductSchema>;

// --- ORDER SCHEMA ---
export const dbOrderSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  total: z.number().positive(),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']).default('pending'),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type DbOrder = z.infer<typeof dbOrderSchema>;

// --- NEWSLETTER SCHEMA ---
export const dbNewsletterSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Email inválido para el clan 🐉'),
  subscribed_at: z.string().datetime().optional(),
});

export type DbNewsletter = z.infer<typeof dbNewsletterSchema>;
