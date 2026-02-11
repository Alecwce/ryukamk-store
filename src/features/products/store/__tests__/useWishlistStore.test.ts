import { describe, it, expect, beforeEach } from 'vitest';
import { useWishlistStore } from '../useWishlistStore';
import { Product } from '../../types';

describe('useWishlistStore', () => {
  beforeEach(() => {
    // Reset Zustand state (using private method clear is not possible with persist easily,
    // so we just filter items to empty if needed, but Zustand stores stay in memory).
    // Better way: useWishlistStore.setState({ items: [] });
    useWishlistStore.setState({ items: [] });
  });

  const mockProduct: Product = {
    id: '1',
    name: 'Polo Dragon',
    price: 50,
    image: 'https://example.com/polo.jpg',
    category: 'Polos',
    stock: 10
  };

  it('debe inicializar con una lista vacía', () => {
    expect(useWishlistStore.getState().items).toEqual([]);
    expect(useWishlistStore.getState().getWishlistCount()).toBe(0);
  });

  it('debe añadir un producto a la wishlist', () => {
    useWishlistStore.getState().addItem(mockProduct);
    expect(useWishlistStore.getState().items).toHaveLength(1);
    expect(useWishlistStore.getState().isInWishlist('1')).toBe(true);
  });

  it('debe eliminar un producto de la wishlist', () => {
    useWishlistStore.getState().addItem(mockProduct);
    useWishlistStore.getState().removeItem('1');
    expect(useWishlistStore.getState().items).toHaveLength(0);
    expect(useWishlistStore.getState().isInWishlist('1')).toBe(false);
  });

  it('debe alternar (toggle) un producto en la wishlist', () => {
    // Añadir con toggle
    useWishlistStore.getState().toggleItem(mockProduct);
    expect(useWishlistStore.getState().items).toHaveLength(1);
    
    // Eliminar con toggle
    useWishlistStore.getState().toggleItem(mockProduct);
    expect(useWishlistStore.getState().items).toHaveLength(0);
  });

  it('debe contar correctamente los elementos', () => {
    useWishlistStore.getState().addItem(mockProduct);
    useWishlistStore.getState().addItem({ ...mockProduct, id: '2' });
    expect(useWishlistStore.getState().getWishlistCount()).toBe(2);
  });
});
