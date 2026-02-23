/**
 * Centralized cache time configuration for TanStack Query.
 * Single source of truth for staleTime and gcTime across the app.
 */
export const CACHE_TIMES = {
  /** Default cache times used by QueryClient and most product queries */
  products: {
    stale: 1000 * 60 * 5,   // 5 minutes
    gc: 1000 * 60 * 30,     // 30 minutes
  },
  /** Admin panel needs fresher data */
  admin: {
    stale: 1000 * 60,       // 1 minute
  },
  /** Related products change less frequently */
  related: {
    stale: 1000 * 60 * 10,  // 10 minutes
  },
  /** Individual product detail */
  productDetail: {
    stale: 1000 * 60 * 5,   // 5 minutes
  },
} as const;
