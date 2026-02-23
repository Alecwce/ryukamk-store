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

export const checkoutSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo debe contener letras'),
  email: z
    .string()
    .email('Ingresa un correo electrónico válido'),
  phone: z
    .string()
    .regex(/^9\d{8}$/, 'El número debe empezar con 9 y tener 9 dígitos'),
  address: z
    .string()
    .min(10, 'La dirección debe ser más detallada (mín. 10 caracteres)'),
});
