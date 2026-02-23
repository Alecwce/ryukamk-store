import { useMemo } from 'react';
import { useProducts } from '@/features/products/hooks/useProducts';
import type { CartItem } from '@/features/cart/types';
import type { Product } from '@/features/products/types';

/**
 * Hook that calculates upselling suggestions based on items in the cart.
 * Prioritizes products from the same category as the last added item.
 * Excludes out-of-stock and already-in-cart products.
 */
export function useCartSuggestions(items: CartItem[]): Product[] {
  const { data: allProducts = [] } = useProducts();

  return useMemo(() => {
    const cartProductIds = new Set(items.map(i => i.id));
    const available = allProducts.filter(p => !cartProductIds.has(p.id) && (p.stock ?? 0) > 0);

    if (items.length > 0) {
      const lastInCart = items[items.length - 1];
      const productInfo = allProducts.find(p => p.id === lastInCart.id);
      const lastCategory = productInfo?.category;

      if (lastCategory) {
        const sameCategory = available.filter(p => p.category === lastCategory);
        const others = available.filter(p => p.category !== lastCategory);
        return [...sameCategory, ...others].slice(0, 3);
      }
    }

    return available.slice(0, 3);
  }, [items, allProducts]);
}
