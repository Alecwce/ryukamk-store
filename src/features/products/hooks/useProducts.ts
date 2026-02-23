import { useQuery } from '@tanstack/react-query';
import { ProductRepository } from '../services/product.repository';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { CACHE_TIMES } from '@/shared/config/queryConfig';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await ProductRepository.getAll();
      return data.length > 0 ? data : MOCK_PRODUCTS;
    },
    staleTime: CACHE_TIMES.products.stale,
  });
}
