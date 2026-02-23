import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { OptimizedImage } from '@/shared/components/ui/OptimizedImage';
import { PAYMENT_CONFIG } from '@/shared/config/payment';

interface StepPaymentProps {
  onBack: () => void;
  onFinish: () => void;
}

export function StepPayment({ onBack, onFinish }: StepPaymentProps) {
  return (
    <motion.div
      key="step-pay"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass p-8 rounded-3xl border-white/10 text-center"
    >
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-dragon-white/40 hover:text-dragon-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-display font-bold text-dragon-white">PAGO Y CONFIRMACIÓN</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white/5 p-6 rounded-2xl border-2 border-dragon-fire/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-dragon-fire text-white text-[8px] px-2 py-1 font-bold rounded-bl-lg">RECOMENDADO</div>
          <h3 className="text-dragon-white font-bold mb-4">YAPE / PLIN</h3>
          <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-lg">
            <OptimizedImage
              src={PAYMENT_CONFIG.qrImageUrl}
              alt="QR de Pago RYŪKAMI"
              aspectRatio="square"
              className="w-full h-full"
            />
          </div>
          <p className="text-xl text-dragon-cyan font-display">{PAYMENT_CONFIG.yapeNumber}</p>
          <p className="text-[10px] text-white/40">{PAYMENT_CONFIG.accountHolder}</p>
        </div>

        <div className="space-y-4">
          {PAYMENT_CONFIG.bankAccounts.map((account, idx) => (
            <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 text-left">
              <span className="text-[10px] text-dragon-gold font-bold uppercase block mb-1">{account.bank}</span>
              <p className="text-sm text-dragon-white font-mono">{account.number}</p>
              {account.cci && <p className="text-[9px] text-white/40">CCI: {account.cci}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-dragon-cyan/5 border border-dragon-cyan/20 p-4 rounded-xl mb-8 flex items-start gap-3 text-left">
        <MessageCircle className="text-dragon-cyan flex-shrink-0" size={20} />
        <p className="text-xs text-dragon-white/70">
          Al hacer clic en el botón de abajo, se abrirá **WhatsApp** para que nos envíes tu comprobante y confirmemos tu pedido.
        </p>
      </div>

      <Button onClick={onFinish} size="lg" className="w-full gap-2 bg-green-600 hover:bg-green-700 hover:shadow-green-500/20">
        <MessageCircle size={20} />
        CONFIRMAR ORDEN POR WHATSAPP
      </Button>
    </motion.div>
  );
}
