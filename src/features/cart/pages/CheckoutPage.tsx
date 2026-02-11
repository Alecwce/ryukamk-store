import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { useCheckoutStore } from '@/features/cart/store/useCheckoutStore';
import { Button } from '@/shared/components/ui/Button';
import { ShieldCheck, Truck, MessageCircle, ArrowLeft, User, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkoutSchema } from '@/shared/utils/validation';
import { z } from 'zod';
import { OptimizedImage } from '@/shared/components/ui/OptimizedImage';
import { PAYMENT_CONFIG } from '@/shared/config/payment';
import clsx from 'clsx';

type Step = 'DATA' | 'PAYMENT' | 'SUCCESS';

export default function CheckoutPage() {
  const { items, clearCart, getSummary } = useCartStore();
  const { name, phone, address, setField, clearCheckout } = useCheckoutStore();
  
  const [step, setStep] = useState<Step>('DATA');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formData = { name, phone, address };

  const { subtotal, shipping, total } = getSummary();

  const handleDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      checkoutSchema.parse(formData);
      setStep('PAYMENT');
      window.scrollTo(0, 0);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const generateWhatsAppLink = () => {
    const whatsappPhone = PAYMENT_CONFIG.whatsappNumber;
    const itemsText = items.map(i => `${i.quantity}x ${i.name} (${i.size}/${i.color})`).join(', ');
    const message = `Hola RYŪKAMI, acabo de hacer un pedido de ${itemsText} por S/. ${total.toFixed(2)}. \n\nMis datos:\nNombre: ${formData.name}\nCelular: ${formData.phone}\nDirección: ${formData.address}\n\nAquí adjunto mi constancia de Yape/Transferencia.`;
    
    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleFinish = () => {
    window.open(generateWhatsAppLink(), '_blank');
    setStep('SUCCESS');
    clearCart();
    clearCheckout();
  };

  if (items.length === 0 && step !== 'SUCCESS') {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 text-center">
        <h2 className="text-3xl font-display font-bold text-dragon-white mb-4">Tu carrito está vacío</h2>
        <Link to="/">
          <Button variant="outline">VOLVER A COMPRAR</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 max-w-md mx-auto relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 -z-10" />
        {[
          { key: 'DATA', label: 'Datos' },
          { key: 'PAYMENT', label: 'Pago' },
          { key: 'SUCCESS', label: 'Listo' }
        ].map((s, i) => (
          <div key={s.key} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
              step === s.key ? 'bg-dragon-fire text-dragon-white' : 
              (i === 0 && step !== 'DATA') || (i === 1 && step === 'SUCCESS') ? 'bg-dragon-cyan text-dragon-white' : 'bg-dragon-black border-2 border-white/10 text-white/40'
            }`}>
              {i + 1}
            </div>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${step === s.key ? 'text-dragon-fire' : 'text-white/40'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 'DATA' && (
              <motion.div
                key="step-data"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass p-8 rounded-3xl border-white/10"
              >
                <h2 className="text-2xl font-display font-bold text-dragon-white mb-8">DATOS DE ENTREGA</h2>
                <form onSubmit={handleDataSubmit} className="space-y-6" noValidate>
                  <div className="space-y-2">
                    <label className="text-xs text-dragon-cyan font-bold tracking-widest flex items-center gap-2">
                      <User size={14} /> NOMBRE COMPLETO
                    </label>
                    <motion.div
                      animate={errors.name ? { x: [-2, 2, -2, 2, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setField('name', e.target.value)}
                        className={clsx(
                          "w-full bg-white/5 border rounded-xl px-4 py-3 text-dragon-white focus:outline-none transition-all",
                          errors.name ? "border-dragon-fire/50 bg-dragon-fire/5" : "border-white/10 focus:border-dragon-fire"
                        )}
                        placeholder="Ej. Juan Pérez"
                      />
                    </motion.div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-dragon-fire text-[10px] font-bold mt-1 flex items-center gap-1"
                        >
                          <AlertCircle size={10} /> {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-dragon-cyan font-bold tracking-widest flex items-center gap-2">
                      <Phone size={14} /> CELULAR (SOLO 9 DÍGITOS)
                    </label>
                    <motion.div
                      animate={errors.phone ? { x: [-2, 2, -2, 2, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 9))}
                        className={clsx(
                          "w-full bg-white/5 border rounded-xl px-4 py-3 text-dragon-white focus:outline-none transition-all",
                          errors.phone ? "border-dragon-fire/50 bg-dragon-fire/5" : "border-white/10 focus:border-dragon-fire"
                        )}
                        placeholder="999 999 999"
                      />
                    </motion.div>
                    <AnimatePresence>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-dragon-fire text-[10px] font-bold mt-1 flex items-center gap-1"
                        >
                          <AlertCircle size={10} /> {errors.phone}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-dragon-cyan font-bold tracking-widest flex items-center gap-2">
                      <MapPin size={14} /> DIRECCIÓN EXACTA
                    </label>
                    <motion.div
                      animate={errors.address ? { x: [-2, 2, -2, 2, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <textarea
                        value={formData.address}
                        onChange={(e) => setField('address', e.target.value)}
                        className={clsx(
                          "w-full bg-white/5 border rounded-xl px-4 py-3 text-dragon-white focus:outline-none transition-all h-24",
                          errors.address ? "border-dragon-fire/50 bg-dragon-fire/5" : "border-white/10 focus:border-dragon-fire"
                        )}
                        placeholder="Calle, Número, Distrito, Ciudad, Referencia..."
                      />
                    </motion.div>
                    <AnimatePresence>
                      {errors.address && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-dragon-fire text-[10px] font-bold mt-1 flex items-center gap-1"
                        >
                          <AlertCircle size={10} /> {errors.address}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    CONTINUAR AL PAGO
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 'PAYMENT' && (
              <motion.div
                key="step-pay"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass p-8 rounded-3xl border-white/10 text-center"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep('DATA')} className="text-dragon-white/40 hover:text-dragon-white transition-colors">
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

                <Button onClick={handleFinish} size="lg" className="w-full gap-2 bg-green-600 hover:bg-green-700 hover:shadow-green-500/20">
                  <MessageCircle size={20} />
                  CONFIRMAR ORDEN POR WHATSAPP
                </Button>
              </motion.div>
            )}

            {step === 'SUCCESS' && (
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
                   <Button onClick={() => window.open(generateWhatsAppLink(), '_blank')} variant="outline" className="w-full">
                     ABRIR WHATSAPP NUEVAMENTE
                   </Button>
                   <Link to="/" className="block">
                     <Button className="w-full">VOLVER A LA TIENDA</Button>
                   </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Order Summary (visible in steps 1 and 2) */}
        {step !== 'SUCCESS' && (
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-3xl border-white/10 sticky top-24">
              <h3 className="font-display font-bold text-dragon-white mb-6 uppercase tracking-wider">Tu Orden</h3>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3">
                    <OptimizedImage src={item.image} alt={item.name} className="w-12 h-12 rounded-lg" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-dragon-white line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-white/40">{item.size} / {item.color} x{item.quantity}</p>
                    </div>
                    <p className="text-xs text-dragon-white font-bold">S/. {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-white/10 pt-4 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-dragon-white">S/. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Envío</span>
                  <span className={shipping === 0 ? 'text-dragon-cyan' : 'text-dragon-white'}>
                    {shipping === 0 ? 'GRATIS' : `S/. ${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-display font-bold border-t border-white/10 pt-4">
                <span className="text-dragon-white">TOTAL</span>
                <span className="bg-dragon-gradient bg-clip-text text-transparent">S/. {total.toFixed(2)}</span>
              </div>

              <div className="mt-8 space-y-3">
                 <div className="flex items-center gap-2 text-[10px] text-white/40">
                   <ShieldCheck size={14} className="text-dragon-cyan" /> Pago 100% seguro y directo
                 </div>
                 <div className="flex items-center gap-2 text-[10px] text-white/40">
                   <Truck size={14} className="text-dragon-gold" /> Envío a todo el Perú
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
