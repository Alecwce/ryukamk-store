import { memo, useCallback, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useToastStore } from '@/shared/stores/useToastStore';
import { OptimizedImage } from '@/shared/components/ui/OptimizedImage';
import { useQueryClient } from '@tanstack/react-query';
import { PRODUCT_KEYS } from '@/shared/lib/query-keys';
import { ProductRepository } from '../services/product.repository';
import { getMockProductById } from '../data/mockProducts';
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
  const queryClient = useQueryClient();

  const isOutOfStock = stock <= 0;
  const isFavorite = isInWishlist(id);

  // Predictive Prefetching: Cargar datos del producto al hacer hover para navegación instantánea
  const handlePrefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_KEYS.detail(id),
      queryFn: async () => {
        const data = await ProductRepository.getById(id);
        return data || getMockProductById(id);
      },
      staleTime: 1000 * 60 * 5, // 5 minutos de validez para el prefetch
    });
  }, [id, queryClient]);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
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

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({ id, name, price, image, category, stock });
    addToast(
      isFavorite ? `Eliminado de favoritos` : `Añadido a favoritos`,
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
      onMouseEnter={handlePrefetch}
      className="group relative bg-dragon-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-dragon-fire/20 hover:border-dragon-fire/50 transition-all duration-300 focus-within:ring-2 focus-within:ring-dragon-cyan"
      role="article"
      aria-label={`Producto: ${name}`}
    >
      <Link to={`/producto/${id}`} className="block">
        <div className="absolute top-4 right-4 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWishlist}
            className={clsx(
              "backdrop-blur-sm p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-dragon-cyan border",
              isFavorite 
                ? "bg-dragon-fire text-white border-dragon-fire" 
                : "bg-dragon-black/80 text-dragon-white border-white/10 hover:border-dragon-fire hover:text-dragon-fire"
            )}
            aria-label={isFavorite ? `Eliminar ${name} de favoritos` : `Añadir ${name} a favoritos`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </motion.button>
        </div>

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
          {!isOutOfStock && stock < 5 && (
            <div className="absolute top-4 left-4 z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-dragon-fire text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-dragon-fire/40 animate-pulse"
              >
                ¡ÚLTIMAS UNIDADES!
              </motion.div>
            </div>
          )}
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-dragon-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          )}
        </div>

        <div className="p-4">
          <div className="text-dragon-cyan text-xs tracking-wider mb-2 uppercase text-left">
            {category}
          </div>
          <h3 className="font-display font-bold text-lg text-dragon-white mb-2 group-hover:text-dragon-fire transition-colors text-left">
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
            disabled={false}
            aria-label={isOutOfStock ? `Stock agotado para ${name}` : `Añadir ${name} al carrito por ${formattedPrice}`}
            icon={<ShoppingCart size={18} />}
          >
            {isOutOfStock ? 'AGOTADO' : 'AÑADIR'}
          </Button>
        </div>
      </Link>

      <div 
        className={clsx(
          "absolute inset-0 border-2 border-dragon-fire rounded-lg pointer-events-none",
          "opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100",
          "transition-all duration-500 ease-out will-change-[opacity,transform]",
          "shadow-[0_0_30px_rgba(220,38,38,0.4)]"
        )}
      />
    </motion.div>
  );
});


ProductCard.displayName = 'ProductCard';

