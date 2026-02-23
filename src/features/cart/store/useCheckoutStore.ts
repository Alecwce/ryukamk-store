import { create } from 'zustand';

interface CheckoutState {
  name: string;
  email: string;
  phone: string;
  address: string;
  setField: (field: 'name' | 'email' | 'phone' | 'address', value: string) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  name: '',
  email: '',
  phone: '',
  address: '',
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  clearCheckout: () => set({ name: '', email: '', phone: '', address: '' }),
}));
