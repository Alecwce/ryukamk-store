import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductRepository } from '@/features/products/services/product.repository';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Product } from '@/features/products/types';
import { PRODUCT_KEYS } from '@/shared/lib/query-keys';

export const useProductActions = (products: Product[]) => {
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newProduct: Omit<Product, 'id'>) => ProductRepository.create(newProduct),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(data.id) });
      }
      addToast('Producto creado', 'success');
    },
    onError: (err: Error) => addToast(err.message, 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Product, 'id'>> }) => 
      ProductRepository.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(variables.id) });
      addToast('Producto actualizado', 'success');
    },
    onError: (err: Error) => addToast(err.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductRepository.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
      const deletedProduct = products.find(p => p.id === id);
      
      if (deletedProduct) {
        addToast(`Producto "${deletedProduct.name}" eliminado`, 'success', {
          label: 'Deshacer',
          callback: async () => {
             createMutation.mutate({
               name: deletedProduct.name,
               price: deletedProduct.price,
               image: deletedProduct.image,
               category: deletedProduct.category,
               description: deletedProduct.description,
               stock: deletedProduct.stock
             });
          }
        });
      }
    },
    onError: (err: Error) => addToast(err.message, 'error'),
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};
