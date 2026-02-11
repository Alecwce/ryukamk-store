import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CheckoutState {
  name: string;
  phone: string;
  address: string;
  setField: (field: 'name' | 'phone' | 'address', value: string) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      name: '',
      phone: '',
      address: '',
      setField: (field, value) => set((state) => ({ ...state, [field]: value })),
      clearCheckout: () => set({ name: '', phone: '', address: '' }),
    }),
    {
      name: 'ryukami-checkout-storage',
    }
  )
);
