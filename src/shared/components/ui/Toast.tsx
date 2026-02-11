import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/shared/stores/useToastStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import clsx from 'clsx';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  const icons = {
    success: <CheckCircle className="text-dragon-cyan" size={20} />,
    error: <AlertCircle className="text-dragon-fire" size={20} />,
    info: <Info className="text-dragon-gold" size={20} />,
  };

  const borders = {
    success: 'border-dragon-cyan/50',
    error: 'border-dragon-fire/50',
    info: 'border-dragon-gold/50',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            layout
            className={clsx(
              "pointer-events-auto flex items-center gap-3 p-4 rounded-xl",
              "bg-dragon-black/90 backdrop-blur-xl border shadow-2xl min-w-[300px]",
              borders[toast.type]
            )}
          >
            <div className="flex-shrink-0">
              {icons[toast.type]}
            </div>
            <p className="flex-1 text-sm font-medium text-dragon-white">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: 0 }}
              transition={{ duration: 3, ease: 'linear' }}
              className={clsx(
                "absolute bottom-0 left-0 h-1 bg-current opacity-30",
                toast.type === 'success' && 'text-dragon-cyan',
                toast.type === 'error' && 'text-dragon-fire',
                toast.type === 'info' && 'text-dragon-gold'
              )}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
