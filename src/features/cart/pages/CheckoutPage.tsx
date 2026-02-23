import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { useCheckoutStore } from '@/features/cart/store/useCheckoutStore';
import { Button } from '@/shared/components/ui/Button';
import { Link } from 'react-router-dom';
import { checkoutSchema } from '@/shared/utils/validation';
import { z } from 'zod';
import { PAYMENT_CONFIG } from '@/shared/config/payment';
import { OrderRepository } from '@/features/cart/services/order.repository';
import { useToastStore } from '@/shared/stores/useToastStore';
import { logger } from '@/shared/lib/logger';
import { ProgressBar } from '@/features/cart/components/checkout/ProgressBar';
import { StepData } from '@/features/cart/components/checkout/StepData';
import { StepPayment } from '@/features/cart/components/checkout/StepPayment';
import { StepSuccess } from '@/features/cart/components/checkout/StepSuccess';
import { OrderSummary } from '@/features/cart/components/checkout/OrderSummary';

type Step = 'DATA' | 'PAYMENT' | 'SUCCESS';

export default function CheckoutPage() {
  const { items, clearCart, getSummary } = useCartStore();
  const { name, email, phone, address, setField, clearCheckout } = useCheckoutStore();
  const { addToast } = useToastStore();

  const [step, setStep] = useState<Step>('DATA');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formData = { name, email, phone, address };
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
    const message = `Hola RYŪKAMI, acabo de hacer un pedido de ${itemsText} por S/. ${total.toFixed(2)}. \n\nMis datos:\nNombre: ${formData.name}\nEmail: ${formData.email}\nCelular: ${formData.phone}\nDirección: ${formData.address}\n\nAquí adjunto mi constancia de Yape/Transferencia.`;

    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleFinish = async () => {
    try {
      await OrderRepository.create({
        total,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    } catch (error) {
      logger.error('Error creating order in Supabase:', error);
      addToast('No pudimos registrar tu orden, pero puedes continuar por WhatsApp', 'info');
    }

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
      <ProgressBar currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 'DATA' && (
              <StepData
                formData={formData}
                errors={errors}
                onFieldChange={setField}
                onSubmit={handleDataSubmit}
              />
            )}
            {step === 'PAYMENT' && (
              <StepPayment
                onBack={() => setStep('DATA')}
                onFinish={handleFinish}
              />
            )}
            {step === 'SUCCESS' && (
              <StepSuccess
                onReopenWhatsApp={() => window.open(generateWhatsAppLink(), '_blank')}
              />
            )}
          </AnimatePresence>
        </div>

        {step !== 'SUCCESS' && (
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
          />
        )}
      </div>
    </div>
  );
}
