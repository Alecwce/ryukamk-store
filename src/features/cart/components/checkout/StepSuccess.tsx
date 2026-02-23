import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';

interface StepSuccessProps {
  onReopenWhatsApp: () => void;
}

export function StepSuccess({ onReopenWhatsApp }: StepSuccessProps) {
  return (
    <motion.div
      key="step-success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-12 rounded-3xl border-dragon-cyan/20 text-center"
    >
      <div className="w-24 h-24 bg-dragon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 size={48} className="text-dragon-cyan" />
      </div>
      <h2 className="text-3xl font-display font-bold text-dragon-white mb-4">¡CASI LISTO!</h2>
      <p className="text-dragon-white/60 mb-8 max-w-sm mx-auto">
        Tu pedido ha sido registrado. Si no se abrió WhatsApp automáticamente, haz clic abajo.
      </p>
      <div className="space-y-4">
        <Button onClick={onReopenWhatsApp} variant="outline" className="w-full">
          ABRIR WHATSAPP NUEVAMENTE
        </Button>
        <Link to="/" className="block">
          <Button className="w-full">VOLVER A LA TIENDA</Button>
        </Link>
      </div>
    </motion.div>
  );
}
