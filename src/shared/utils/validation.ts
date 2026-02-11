import { z } from 'zod';

export const cartItemSchema = z.object({
  id: z.string().uuid().or(z.string().regex(/^[0-9a-fA-F-]+$/)),
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  image: z.string().url(),
  size: z.string().min(1),
  color: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const toastSchema = z.object({
  id: z.string(),
  message: z.string().min(1),
  type: z.enum(['success', 'error', 'info']),
});

/**
 * Validation middleware for Zustand stores.
 * It intercepts State updates and prevents invalid data from entering the store.
 */
export const validateState = <T>(schema: z.ZodSchema<T>) => (state: any) => {
  try {
    const result = schema.safeParse(state);
    if (!result.success) {
      console.error('❌ Validation Error:', result.error.format());
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Unexpected Validation Error:', error);
    return false;
  }
};
