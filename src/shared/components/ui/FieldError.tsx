import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-dragon-fire text-[10px] font-bold mt-1 flex items-center gap-1"
        >
          <AlertCircle size={10} /> {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
