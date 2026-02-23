import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductRepository } from '@/features/products/services/product.repository';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Product } from '@/features/products/types';

interface UseProductMutationsOptions {
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  products?: Product[];
}

export function useProductMutations({
  onCreateSuccess,
  onUpdateSuccess,
  products = [],
}: UseProductMutationsOptions) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const createMutation = useMutation({
    mutationFn: (newProduct: Omit<Product, 'id'>) => ProductRepository.create(newProduct),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      }
      addToast('Producto creado', 'success');
      onCreateSuccess?.();
    },
    onError: (err: Error) => addToast(err.message, 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Product, 'id'>> }) =>
      ProductRepository.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      addToast('Producto actualizado', 'success');
      onUpdateSuccess?.();
    },
    onError: (err: Error) => addToast(err.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductRepository.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      const deletedProduct = products.find(p => p.id === id);
      if (deletedProduct) {
        addToast(`Producto "${deletedProduct.name}" eliminado`, 'success');
      }
    },
    onError: (err: Error) => addToast(err.message, 'error'),
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    isLoading,
  };
}
