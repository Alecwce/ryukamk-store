import { z } from 'zod';
import { logger } from '../lib/logger';

export const cartItemSchema = z.object({
  id: z.string().min(1),
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

export const checkoutSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'Nombre demasiado largo')
    .regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/, 'El nombre solo debe contener letras'),
  phone: z.string()
    .regex(/^9\d{8}$/, 'El número debe empezar con 9 y tener 9 dígitos'),
  address: z.string()
    .min(10, 'La dirección debe ser más detallada (mín. 10 caracteres)')
    .max(200, 'Dirección demasiado larga'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Introduce un email válido'),
});

/**
 * Validation middleware for Zustand stores.
 * It intercepts State updates and prevents invalid data from entering the store.
 */
export const validateState = <T>(schema: z.ZodSchema<T>) => (state: unknown) => {
  try {
    const result = schema.safeParse(state);
    if (!result.success) {
      logger.error('❌ Validation Error:', result.error.format());
      return false;
    }
    return true;
  } catch (error) {
    logger.error('❌ Unexpected Validation Error:', error);
    return false;
  }
};
