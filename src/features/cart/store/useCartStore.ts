import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartItemSchema } from '@/shared/utils/validation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => set((state) => {
        // Validación con Zod antes de procesar
        const validation = cartItemSchema.safeParse(item);
        if (!validation.success) {
          console.error('❌ Datos de producto inválidos:', validation.error.format());
          return state;
        }

        const uniqueId = `${item.id}-${item.size}-${item.color}`;
        const existingItem = state.items.find(
          i => `${i.id}-${i.size}-${i.color}` === uniqueId
        );

        if (existingItem) {
          return {
            items: state.items.map(i =>
              `${i.id}-${i.size}-${i.color}` === uniqueId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }

        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),

      removeItem: (uniqueId) => set((state) => ({
        items: state.items.filter(item => `${item.id}-${item.size}-${item.color}` !== uniqueId),
      })),

      updateQuantity: (uniqueId, quantity) => set((state) => ({
        items: state.items.map(item =>
          `${item.id}-${item.size}-${item.color}` === uniqueId ? { ...item, quantity } : item
        ),
      })),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'ryukami-cart-storage',
    }
  )
);
