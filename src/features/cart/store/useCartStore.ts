import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartItemSchema } from '@/shared/utils/validation';

/**
 * Represents a single item in the shopping cart.
 */
interface CartItem {
  /** Unique identifier for the product */
  id: string;
  /** Name of the product */
  name: string;
  /** Price of the product in local currency */
  price: number;
  /** URL of the product image */
  image: string;
  /** Selected size variant */
  size: string;
  /** Selected color variant */
  color: string;
  /** Quantity of this item in the cart */
  quantity: number;
}

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
   */
  addItem: (item: CartItem) => void;

  /**
   * Removes an item from the cart by its unique composite ID.
   * @param uniqueId The composite ID (id-size-color) of the item to remove.
   */
  removeItem: (uniqueId: string) => void;

  /**
   * Updates the quantity of a specific item in the cart.
   * @param uniqueId The composite ID (id-size-color) of the item.
   * @param quantity The new quantity to set.
   */
  updateQuantity: (uniqueId: string, quantity: number) => void;

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
