export interface CheckoutState {
  name: string;
  phone: string;
  address: string;
  setField: (field: 'name' | 'phone' | 'address', value: string) => void;
  clearCheckout: () => void;
}
