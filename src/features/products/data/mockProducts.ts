import { Product } from '../types';

/**
 * Productos mock para ser usados como fallback cuando la base de datos no tiene registros
 * o para pruebas de desarrollo.
 */
export const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Polo Dragon Basic', 
    price: 49.90, 
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800', 
    category: 'Polos', 
    description: 'Nuestro polo insignia. Algodón premium con bordado de alta precisión. El espíritu RYŪKAMI en cada hilo.', 
    stock: 20 
  },
  { 
    id: '2', 
    name: 'Polera Spirit Fire', 
    price: 79.90, 
    image: 'https://images.pexels.com/photos/8532583/pexels-photo-8532583.jpeg?auto=compress&cs=tinysrgb&w=800', 
    category: 'Poleras', 
    description: 'Abriga tu aura con la polera Spirit Fire. Oversized fit para máxima comodidad urbana.', 
    stock: 0 
  },
  { 
    id: '3', 
    name: 'Short Warrior Cargo', 
    price: 59.90, 
    image: 'https://images.pexels.com/photos/7679876/pexels-photo-7679876.jpeg?auto=compress&cs=tinysrgb&w=800', 
    category: 'Shorts', 
    description: 'Resistencia y estilo. Múltiples bolsillos para el guerrero moderno.', 
    stock: 15 
  },
  { 
    id: '4', 
    name: 'Pantalón Shadow Cargo', 
    price: 89.90, 
    image: 'https://images.pexels.com/photos/5886041/pexels-photo-5886041.jpeg?auto=compress&cs=tinysrgb&w=800', 
    category: 'Pantalones', 
    description: 'La sombra se mueve contigo. Ajuste perfecto y tela técnica de alta durabilidad.', 
    stock: 5 
  },
];

/**
 * Helper para obtener un producto mock por su ID.
 * @param id El ID del producto a buscar.
 * @returns El producto encontrado o null si no existe.
 */
export const getMockProductById = (id: string): Product | null => {
  return MOCK_PRODUCTS.find(p => p.id === id) || null;
};
