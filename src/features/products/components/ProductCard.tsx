import { memo, useCallback, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { OptimizedImage } from '@/shared/components/ui/OptimizedImage';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { useWishlistStore } from '@/features/products/store/useWishlistStore';
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
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();
  const controls = useAnimation();

  const isOutOfStock = stock <= 0;
  const isFavorite = isInWishlist(id);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isOutOfStock) {
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

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleItem({ id, name, price, image, category, stock });
    addToast(
      isFavorite ? `${name} eliminado de favoritos` : `${name} añadido a favoritos`,
      isFavorite ? 'info' : 'success'
    );
  }, [id, name, price, image, category, stock, toggleItem, isFavorite, addToast]);

  const formattedPrice = useMemo(() => `S/. ${price.toFixed(2)}`, [price]);

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
          onClick={handleFavorite}
          className={clsx(
            "bg-dragon-black/80 backdrop-blur-sm p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-dragon-cyan",
            isFavorite ? "text-dragon-fire" : "text-dragon-white hover:text-dragon-fire"
          )}
          aria-label={isFavorite ? `Quitar ${name} de favoritos` : `Añadir ${name} a favoritos`}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </motion.button>
      </div>

      <Link to={`/producto/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-dragon-black/60">
          <OptimizedImage
            src={image}
            alt={name}
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
          <h3 className="font-display font-bold text-lg text-dragon-white mb-2 group-hover:text-dragon-fire transition-colors line-clamp-2 min-h-[3.5rem] flex items-center">
            {name}
          </h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold bg-dragon-gradient bg-clip-text text-transparent">
              {formattedPrice}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          variant={isOutOfStock ? 'outline' : 'primary'}
          className="w-full"
          aria-label={isOutOfStock ? `Stock agotado para ${name}` : `Añadir ${name} al carrito por ${formattedPrice}`}
          icon={<ShoppingCart size={18} />}
        >
          {isOutOfStock ? 'AGOTADO' : 'AÑADIR'}
        </Button>
      </div>

      {/* Glow solo visible en hover */}
      <div
        className="absolute inset-0 border-2 border-dragon-fire rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
      />
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

