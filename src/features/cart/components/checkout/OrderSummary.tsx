import { ShieldCheck, Truck } from 'lucide-react';
import { OptimizedImage } from '@/shared/components/ui/OptimizedImage';
import type { CartItem } from '@/features/cart/types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export function OrderSummary({ items, subtotal, shipping, total }: OrderSummaryProps) {
  return (
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
  );
}
