export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type'], action?: Toast['action']) => void;
  removeToast: (id: string) => void;
}
