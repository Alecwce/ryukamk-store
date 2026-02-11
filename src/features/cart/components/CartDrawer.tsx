import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { Button } from '@/shared/components/ui/Button';

export function CartDrawer() {
  const { isOpen, toggleCart, items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();

  const handleCheckout = () => {
    // Simulación de compra exitosa
    if (items.length === 0) return;
    
    // Aquí podrías añadir una animación de éxito antes de limpiar
    alert('¡Pedido realizado con éxito! Gracias por elegir RYŪKAMI.');
    clearCart();
    toggleCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-dragon-black border-l border-dragon-fire text-dragon-white z-50 flex flex-col shadow-2xl shadow-dragon-fire/20"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className="flex items-center justify-between p-6 border-b border-dragon-fire/20">
              <h2 id="cart-title" className="font-display font-bold text-2xl text-dragon-white">
                MI CARRITO
              </h2>
              <button
                onClick={toggleCart}
                className="text-dragon-white hover:text-dragon-fire transition-colors focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded p-1"
                aria-label="Cerrar carrito"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4 opacity-50" aria-hidden="true">🛒</div>
                  <p className="text-dragon-white/60 mb-2">Tu carrito está vacío</p>
                  <p className="text-dragon-white/40 text-sm">
                    Agrega productos para comenzar
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <motion.li
                      key={`${item.id}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-dragon-black/40 border border-dragon-fire/20 rounded-lg p-4"
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={`Imagen de ${item.name}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-dragon-white mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-dragon-white/60 mb-2">
                            {item.color} / {item.size}
                          </p>
                          <p className="text-dragon-fire font-bold">
                            S/. {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2" role="group" aria-label={`Cantidad para ${item.name}`}>
                          <button
                            onClick={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, Math.max(1, item.quantity - 1))}
                            className="bg-dragon-fire/20 hover:bg-dragon-fire/30 text-dragon-white w-8 h-8 rounded flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-dragon-cyan"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={16} aria-hidden="true" />
                          </button>
                          <span className="text-dragon-white font-bold w-8 text-center" aria-live="polite">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, item.quantity + 1)}
                            className="bg-dragon-fire/20 hover:bg-dragon-fire/30 text-dragon-white w-8 h-8 rounded flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-dragon-cyan"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={16} aria-hidden="true" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(`${item.id}-${item.size}-${item.color}`)}
                          className="text-dragon-white/60 hover:text-dragon-fire transition-colors focus:outline-none focus:ring-2 focus:ring-dragon-fire rounded p-1"
                          aria-label={`Eliminar ${item.name} del carrito`}
                        >
                          <Trash2 size={20} aria-hidden="true" />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-dragon-fire/20 p-6 space-y-4 bg-dragon-black/95">
                <div className="flex justify-between text-lg">
                  <span className="text-dragon-white">Subtotal:</span>
                  <span className="text-dragon-white font-bold">
                    S/. {getTotal().toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-dragon-white/60">Envío:</span>
                  <span className="text-dragon-cyan">
                    {getTotal() >= 99 ? 'GRATIS' : 'S/. 12.00'}
                  </span>
                </div>

                <div className="border-t border-dragon-fire/20 pt-4 flex justify-between text-xl">
                  <span className="text-dragon-white font-bold">Total:</span>
                  <span className="font-bold bg-dragon-gradient bg-clip-text text-transparent">
                    S/. {(getTotal() + (getTotal() >= 99 ? 0 : 12)).toFixed(2)}
                  </span>
                </div>

                <Button size="lg" className="w-full" onClick={handleCheckout}>
                  PROCEDER AL PAGO
                </Button>

                <p className="text-center text-xs text-dragon-white/40">
                  🔒 Pago 100% seguro
                </p>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
