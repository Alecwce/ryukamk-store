import { create } from 'zustand';
import { CheckoutState } from './checkout.types';

export const useCheckoutStore = create<CheckoutState>((set) => ({
  name: '',
  phone: '',
  address: '',
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  clearCheckout: () => set({ name: '', phone: '', address: '' }),
}));
