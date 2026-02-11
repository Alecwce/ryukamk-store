import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => set((state) => ({
        items: [...state.items, product]
      })),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.id !== productId)
      })),

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      toggleItem: (product) => set((state) => {
        const isAlreadyIn = state.items.some((item) => item.id === product.id);
        if (isAlreadyIn) {
          return { items: state.items.filter((item) => item.id !== product.id) };
        }
        return { items: [...state.items, product] };
      }),

      getWishlistCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'ryukami-wishlist-storage',
    }
  )
);
