import { z } from 'zod';

/**
 * Zod schema for validating admin product form data.
 * Note: price and stock are strings because they come from form inputs.
 */
export const adminProductSchema = z.object({
  name: z.string().min(10, 'Mínimo 10 caracteres para el nombre'),
  price: z.string().refine(
    val => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'El precio debe ser mayor a 0'
  ),
  image: z.string().url('URL de imagen no válida'),
  category: z.string().min(1, 'Selecciona una categoría'),
  description: z.string().min(20, 'Mínimo 20 caracteres para la descripción'),
  stock: z.string().refine(
    val => !isNaN(parseInt(val)) && parseInt(val) >= 0,
    'El stock no puede ser negativo'
  ),
  colors: z.array(z.string()).optional(),
  colorImages: z.record(z.string(), z.string()).optional(),
});

export type AdminProductFormData = z.infer<typeof adminProductSchema>;
