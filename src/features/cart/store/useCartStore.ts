import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartItemSchema } from '@/shared/utils/validation';
import type { CartItem } from '../types';
import { getCartItemId } from '../utils/cartItemId';

export type { CartItem };

/**
 * State and actions for the Shopping Cart Store.
 */
interface CartStore {
  /** List of items currently in the cart */
  items: CartItem[];
  /** Whether the cart drawer is open */
  isOpen: boolean;

  /**
   * Adds an item to the cart.
   * If the item already exists (same id, size, and color), increments its quantity.
   * Validates the item using Zod schema before adding.
   * @param item The item to add.
   * @param maxStock Optional max stock to validate against.
   */
  addItem: (item: CartItem, maxStock?: number) => void;

  /**
   * Removes an item from the cart by its unique composite ID.
   * @param cartItemKey The composite ID (id-size-color) of the item to remove.
   */
  removeItem: (cartItemKey: string) => void;

  /**
   * Updates the quantity of a specific item in the cart.
   * @param cartItemKey The composite ID (id-size-color) of the item.
   * @param quantity The new quantity to set.
   * @param maxStock Optional max stock to validate against.
   */
  updateQuantity: (cartItemKey: string, quantity: number, maxStock?: number) => void;

  /**
   * Toggles the visibility of the cart drawer.
   */
  toggleCart: () => void;

  /**
   * Removes all items from the cart.
   */
  clearCart: () => void;

  /**
   * Calculates the total price of all items in the cart.
   * @returns The total price.
   */
  getTotal: () => number;

  /**
   * Calculates the total number of items in the cart.
   * @returns The total count of items.
   */
  getItemCount: () => number;

  /**
   * Gets a summary of the cart including shipping and discounts.
   */
  getSummary: () => {
    subtotal: number;
    shipping: number;
    total: number;
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, maxStock) => set((state) => {
        // Validación con Zod antes de procesar
        const validation = cartItemSchema.safeParse(item);
        if (!validation.success) {
          console.error('❌ Datos de producto inválidos:', validation.error.format());
          return state;
        }

        const itemKey = getCartItemId(item);
        const existingItem = state.items.find(i => getCartItemId(i) === itemKey);

        if (existingItem) {
          if (maxStock !== undefined && existingItem.quantity + 1 > maxStock) {
            console.warn(`⚠️ Stock máximo alcanzado (${maxStock}) para ${item.name}`);
            return state;
          }
          return {
            items: state.items.map(i =>
              getCartItemId(i) === itemKey
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
            isOpen: true
          };
        }

        if (maxStock !== undefined && maxStock < 1) {
          console.warn(`⚠️ Sin stock disponible para ${item.name}`);
          return state;
        }

        return { 
          items: [...state.items, { ...item, quantity: 1 }],
          isOpen: true
        };
      }),

      removeItem: (cartItemKey) => set((state) => ({
        items: state.items.filter(item => getCartItemId(item) !== cartItemKey),
      })),

      updateQuantity: (cartItemKey, quantity, maxStock) => set((state) => {
        if (maxStock !== undefined && quantity > maxStock) {
          console.warn(`⚠️ No puedes agregar más de ${maxStock} unidades`);
          return state;
        }
        return {
          items: state.items.map(item =>
            getCartItemId(item) === cartItemKey ? { ...item, quantity } : item
          ),
        };
      }),

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

      getSummary: () => {
        const subtotal = get().getTotal();
        const shipping = subtotal >= 99 || subtotal === 0 ? 0 : 12;
        return {
          subtotal,
          shipping,
          total: subtotal + shipping
        };
      },
    }),
    {
      name: 'ryukami-cart-storage',
    }
  )
);
