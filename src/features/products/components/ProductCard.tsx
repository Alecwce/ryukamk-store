import { memo, useCallback, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { useToastStore } from '@/shared/stores/useToastStore';
import clsx from 'clsx';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
}

export const ProductCard = memo(({ id, name, price, image, category, stock = 10 }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const controls = useAnimation();

  const isOutOfStock = stock <= 0;

  const handleAddToCart = useCallback(async () => {
    if (isOutOfStock) {
      // Feedback visual tipo "haptic" (vibración)
      await controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
      addToast(`Lo sentimos, ${name} está agotado`, 'error');
      return;
    }

    addItem({
      id,
      name,
      price,
      image,
      size: 'M',
      color: 'Negro',
      quantity: 1,
    });
    addToast(`${name} añadido al carrito`, 'success');
  }, [id, name, price, image, addItem, addToast, isOutOfStock, controls]);

  const formattedPrice = useMemo(() => `S/. ${price.toFixed(2)}`, [price]);
  
  const optimizedImage = useMemo(() => {
    if (image.includes('pexels.com')) {
      return `${image}${image.includes('?') ? '&' : '?'}fm=webp`;
    }
    return image;
  }, [image]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      animate={controls}
      className="group relative bg-dragon-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-dragon-fire/20 hover:border-dragon-fire/50 transition-all duration-300 focus-within:ring-2 focus-within:ring-dragon-cyan"
      role="article"
      aria-label={`Producto: ${name}`}
    >
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-dragon-black/80 backdrop-blur-sm p-2 rounded-full text-dragon-white hover:text-dragon-fire transition-colors focus:outline-none focus:ring-2 focus:ring-dragon-cyan"
          aria-label={`Añadir ${name} a favoritos`}
        >
          <Heart size={20} />
        </motion.button>
      </div>

      <div className="relative aspect-square overflow-hidden bg-dragon-black/60">
        <img
          src={optimizedImage}
          alt={name}
          loading="lazy"
          width={400}
          height={400}
          className={clsx(
            "w-full h-full object-cover transition-transform duration-500",
            !isOutOfStock && "group-hover:scale-110",
            isOutOfStock && "grayscale opacity-50"
          )}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="bg-dragon-fire text-white px-3 py-1 text-sm font-bold uppercase tracking-wider rounded">
              Agotado
            </span>
          </div>
        )}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-dragon-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        )}
      </div>

      <div className="p-4">
        <div className="text-dragon-cyan text-xs tracking-wider mb-2 uppercase">
          {category}
        </div>
        <h3 className="font-display font-bold text-lg text-dragon-white mb-2 group-hover:text-dragon-fire transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold bg-dragon-gradient bg-clip-text text-transparent">
            {formattedPrice}
          </span>
        </div>

        <Button
          onClick={handleAddToCart}
          variant={isOutOfStock ? 'outline' : 'primary'}
          className="w-full"
          disabled={false} // Mantenemos habilitado para permitir el feedback de "error/vibración"
          aria-label={isOutOfStock ? `Stock agotado para ${name}` : `Añadir ${name} al carrito por ${formattedPrice}`}
          icon={<ShoppingCart size={18} />}
        >
          {isOutOfStock ? 'AGOTADO' : 'AÑADIR'}
        </Button>
      </div>

      <motion.div
        className="absolute inset-0 border-2 border-dragon-fire rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 20px rgba(220, 38, 38, 0.3)',
            '0 0 40px rgba(220, 38, 38, 0.5)',
            '0 0 20px rgba(220, 38, 38, 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';
