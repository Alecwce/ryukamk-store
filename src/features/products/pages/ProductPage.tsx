import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ProductRepository } from '../services/product.repository';
import { PRODUCT_KEYS } from '@/shared/lib/query-keys';
import { Product } from '../types';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { OptimizedImage } from '@/shared/components/ui/OptimizedImage';
import { RelatedProducts } from '../components/RelatedProducts';
import { SEO } from '@/shared/components/layout/SEO';
import { getMockProductById } from '../data/mockProducts';
import clsx from 'clsx';

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = ['Negro', 'Blanco', 'Gris'];

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();

  const { data: product, isLoading } = useQuery<Product | null>({
    queryKey: id ? PRODUCT_KEYS.detail(id) : PRODUCT_KEYS.all,
    queryFn: async () => {
      if (!id) return null;
      const data = await ProductRepository.getById(id);
      
      // Fallback manual si no hay DB configurada para que el usuario pruebe la UI
      if (!data) {
        return getMockProductById(id);
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!id, // Only run query if id is available
  });

  // Solo para el scroll al inicio al cambiar de ID
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Set initial color when product loads
  useEffect(() => {
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    } else {
      setSelectedColor('Negro');
    }
  }, [product]);

  const displayImage = useMemo(() => {
    if (product?.colorImages && selectedColor && product.colorImages[selectedColor]) {
      return product.colorImages[selectedColor];
    }
    return product?.image || '';
  }, [product, selectedColor]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });
    addToast(`${product.name} (${selectedSize}) añadido al carrito`, 'success');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 text-center">
        <h2 className="text-3xl font-display font-bold text-dragon-white mb-4">Producto no encontrado</h2>
        <Link to="/">
          <Button variant="outline">VOLVER AL INICIO</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      <SEO 
        title={product.name}
        description={product.description || `Compra ${product.name} en RYŪKAMI. Streetwear premium con envío a todo el Perú.`}
        image={product.image}
        url={`https://ryukami.store/producto/${product.id}`}
        type="product"
      />
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-dragon-white/60 hover:text-dragon-cyan transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          VOLVER AL CATÁLOGO
        </Link>
        <button 
          onClick={() => toggleItem(product)}
          className={`p-3 rounded-full border transition-all ${
            isInWishlist(product.id) 
              ? 'bg-dragon-fire/10 border-dragon-fire text-dragon-fire' 
              : 'bg-white/5 border-white/10 text-white/40 hover:text-dragon-fire hover:border-dragon-fire/30'
          }`}
        >
          <motion.div whileTap={{ scale: 1.5 }}>
            < Star size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
          </motion.div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Imagen */}
        <AnimatePresence mode="wait">
          <motion.div
            key={displayImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-square rounded-2xl overflow-hidden glass border-dragon-fire/20"
          >
            <OptimizedImage
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover"
              priority
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="dragon" className="text-xl px-6 py-2">AGOTADO</Badge>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Detalles */}
        <div className="flex flex-col">
          <Badge variant="cyan" className="self-start mb-4">
            {product.category}
          </Badge>
          
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dragon-white mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold bg-dragon-gradient bg-clip-text text-transparent">
              S/. {product.price.toFixed(2)}
            </span>
            {product.reviewCount && product.reviewCount > 0 ? (
              <div className="flex items-center gap-1 text-dragon-gold">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} 
                    className={i < Math.floor(product.rating || 0) ? "" : "text-white/20"}
                  />
                ))}
                <span className="text-xs text-dragon-white/40 ml-1">({product.reviewCount} reviews)</span>
              </div>
            ) : (
              <Badge variant="gold" className="text-[10px] py-0.5">
                ⭐ NUEVO
              </Badge>
            )}
          </div>

          <p className="text-dragon-white/70 text-lg leading-relaxed mb-8 text-left">
            {product.description || 'Una prenda diseñada con la esencia de lo urbano y lo tradicional japonés. Calidad garantizada para el estilo de vida RYŪKAMI.'}
          </p>

          {/* Selectores */}
          <div className="space-y-6 mb-10">
            <div>
              <span className="block text-sm font-bold text-dragon-cyan tracking-widest uppercase mb-3 text-left">
                TALLA
              </span>
              <div className="flex gap-3">
                {(product.sizes && product.sizes.length > 0 ? product.sizes : SIZES).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-all font-bold ${
                      selectedSize === size
                        ? 'border-dragon-fire bg-dragon-fire/10 text-dragon-white'
                        : 'border-white/10 text-dragon-white/40 hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-bold text-dragon-cyan tracking-widest uppercase mb-3 text-left">
                COLOR
              </span>
              <div className="flex gap-3 flex-wrap">
                {(product.colors && product.colors.length > 0 ? product.colors : COLORS).map(color => {
                  const colorConfig = {
                    'Negro': 'bg-black',
                    'Blanco': 'bg-white',
                    'Gris': 'bg-gray-500',
                    'Rojo': 'bg-red-600',
                    'Azul': 'bg-blue-600',
                    'Verde': 'bg-green-600',
                    'Beige': 'bg-[#F5F5DC]',
                    'Crema': 'bg-[#FFFDD0]'
                  };

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm flex items-center gap-2 ${
                        selectedColor === color
                          ? 'border-dragon-cyan bg-dragon-cyan/10 text-dragon-white'
                          : 'border-white/10 text-dragon-white/40 hover:border-white/30'
                      }`}
                    >
                      <div className={clsx(
                        "w-3 h-3 rounded-full border border-white/20",
                        colorConfig[color as keyof typeof colorConfig] || 'bg-white/20'
                      )} />
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full mb-8 relative group overflow-hidden"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            icon={<ShoppingCart size={20} />}
          >
            {product.stock === 0 ? 'SIN STOCK' : 'AÑADIR AL CARRITO'}
          </Button>

          {/* Trust points */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            <div className="text-center">
              <ShieldCheck className="mx-auto text-dragon-cyan mb-2" size={24} />
              <span className="block text-[10px] text-dragon-white/60 uppercase tracking-tighter">Calidad<br/>Premium</span>
            </div>
            <div className="text-center">
              <Truck className="mx-auto text-dragon-gold mb-2" size={24} />
              <span className="block text-[10px] text-dragon-white/60 uppercase tracking-tighter">Envío<br/>Rápido</span>
            </div>
            <div className="text-center">
              <RefreshCw className="mx-auto text-dragon-fire mb-2" size={24} />
              <span className="block text-[10px] text-dragon-white/60 uppercase tracking-tighter">Cambios<br/>Fáciles</span>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts currentProductId={product.id} category={product.category || ''} />
    </div>
  );
}
