import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartStore } from '../useCartStore';

// Mock de localStorage para Zustand persist
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    vi.clearAllMocks();
  });

  const mockItem = {
    id: '123e4567-e89b-12d3-a456-426614174000', // UUID válido
    name: 'Polo Dragon',
    price: 50,
    image: 'https://example.com/polo.jpg',
    size: 'M',
    color: 'Negro',
    quantity: 1,
  };

  it('debe inicializar con un carrito vacío', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.getItemCount()).toBe(0);
    expect(state.getTotal()).toBe(0);
  });

  it('debe añadir un producto nuevo al carrito', () => {
    useCartStore.getState().addItem(mockItem);
    
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(mockItem.id);
    expect(state.getItemCount()).toBe(1);
  });

  it('debe incrementar la cantidad si el producto ya existe (mismo id, talla y color)', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().addItem(mockItem);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
    expect(state.getItemCount()).toBe(2);
  });

  it('debe añadir como productos diferentes si cambia la talla o color', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().addItem({ ...mockItem, size: 'L' });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(2);
    expect(state.getItemCount()).toBe(2);
  });

  it('debe eliminar un producto por su uniqueId', () => {
    useCartStore.getState().addItem(mockItem);
    const uniqueId = `${mockItem.id}-${mockItem.size}-${mockItem.color}`;
    
    useCartStore.getState().removeItem(uniqueId);
    
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('debe actualizar la cantidad de un producto específico', () => {
    useCartStore.getState().addItem(mockItem);
    const uniqueId = `${mockItem.id}-${mockItem.size}-${mockItem.color}`;
    
    useCartStore.getState().updateQuantity(uniqueId, 5);
    
    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(5);
    expect(state.getItemCount()).toBe(5);
  });

  it('debe calcular el total correctamente', () => {
    useCartStore.getState().addItem(mockItem); // 50
    useCartStore.getState().addItem({ ...mockItem, id: '2', price: 100 }); // +100
    
    const state = useCartStore.getState();
    expect(state.getTotal()).toBe(150);
  });

  it('debe limpiar el carrito por completo', () => {
    useCartStore.getState().addItem(mockItem);
    useCartStore.getState().clearCart();
    
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('debe calcular el resumen (subtotal, envío, total) correctamente', () => {
    // 1. Carrito vacío
    const emptySummary = useCartStore.getState().getSummary();
    expect(emptySummary.subtotal).toBe(0);
    expect(emptySummary.shipping).toBe(0);
    expect(emptySummary.total).toBe(0);

    // 2. Con envío ( < 99 )
    useCartStore.getState().addItem(mockItem); // 50
    const summaryWithShipping = useCartStore.getState().getSummary();
    expect(summaryWithShipping.subtotal).toBe(50);
    expect(summaryWithShipping.shipping).toBe(12);
    expect(summaryWithShipping.total).toBe(62);

    // 3. Envío gratis ( >= 99 )
    useCartStore.getState().addItem(mockItem); // 50 + 50 = 100
    const freeShippingSummary = useCartStore.getState().getSummary();
    expect(freeShippingSummary.subtotal).toBe(100);
    expect(freeShippingSummary.shipping).toBe(0);
    expect(freeShippingSummary.total).toBe(100);
  });

  it('no debe añadir productos inválidos (Zod validation)', () => {
    // @ts-ignore - Ignoramos error de tipo para testear robustez en runtime
    const invalidItem = { ...mockItem, price: -10 };
    
    useCartStore.getState().addItem(invalidItem);
    
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });
});
