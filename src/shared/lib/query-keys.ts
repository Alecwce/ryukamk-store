/**
 * RYŪKAMI Query Keys
 * Centralized query keys for TanStack Query to ensure consistent caching and invalidation.
 */

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
  list: (filters: string) => [...PRODUCT_KEYS.lists(), { filters }] as const,
  details: () => [...PRODUCT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCT_KEYS.details(), id] as const,
  categories: () => [...PRODUCT_KEYS.all, 'categories'] as const,
  byCategory: (category: string) => [...PRODUCT_KEYS.all, 'category', category] as const,
};

export const ORDER_KEYS = {
  all: ['orders'] as const,
  lists: () => [...ORDER_KEYS.all, 'list'] as const,
  mine: () => [...ORDER_KEYS.lists(), 'mine'] as const,
  detail: (id: string) => [...ORDER_KEYS.all, 'detail', id] as const,
};
