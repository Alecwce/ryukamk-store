import type { CartItem } from '../types';

/**
 * Generates the composite key for a cart item based on product ID, size, and color.
 * This is the single source of truth for cart item identity.
 */
export function getCartItemId(item: Pick<CartItem, 'id' | 'size' | 'color'>): string {
  return `${item.id}-${item.size}-${item.color}`;
}
