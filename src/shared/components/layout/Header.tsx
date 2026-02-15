import { useState, useEffect, useRef, useMemo } from 'react';
import { ShoppingCart, Menu, Heart, X, Search as SearchIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { useWishlistStore } from '@/features/products/store/useWishlistStore';
import { ProductRepository } from '@/features/products/services/product.repository';
import { OptimizedImage } from '@/shared/components/ui/OptimizedImage';
import { MobileMenu } from './MobileMenu';
import { MOCK_PRODUCTS } from '@/features/products/data/mockProducts';
import { useQuery } from '@tanstack/react-query';
import { PRODUCT_KEYS } from '@/shared/lib/query-keys';

export function Header() {
  const { toggleCart, getItemCount } = useCartStore();
  const { getWishlistCount } = useWishlistStore();
  const itemCount = getItemCount();
  const wishlistCount = getWishlistCount();
  const navigate = useNavigate();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load all products once for cache sharing across the app
  const { data: allProducts = MOCK_PRODUCTS, isLoading } = useQuery({
    queryKey: PRODUCT_KEYS.all,
    queryFn: async () => {
      const data = await ProductRepository.getAll();
      if (!data || data.length === 0) {
        return MOCK_PRODUCTS;
      }
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
  });


  // Focus input when opening search
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Handle debounce for search query filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Clientside filtering
  const filteredResults = useMemo(() => {
    if (debouncedSearchQuery.length < 2) return [];
    
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, allProducts]);

  const handleResultClick = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    navigate(`/producto/${productId}`);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dragon-black/95 backdrop-blur-md border-b border-dragon-fire/20"
      role="banner"
    >
      <div className="container mx-auto px-4 relative">
        <div className="nav-container flex items-center justify-between h-20">
          {/* Logo - Hidden when search is open on mobile */}
          <div className={`${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
            <Link
              to="/"
              className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded-lg p-1"
              aria-label="Ir a inicio de RYŪKAMI"
              onClick={() => setIsSearchOpen(false)}
            >
              <div className="text-3xl" aria-hidden="true">🐉</div>
              <div>
                <div className="font-display font-bold text-2xl bg-dragon-gradient bg-clip-text text-transparent">
                  RYŪKAMI
                </div>
                <div className="text-xs text-dragon-cyan tracking-widest text-left">龍神</div>
              </div>
            </Link>
          </div>

          {/* Search Input Bar (Animated) */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="absolute inset-0 bg-dragon-black z-20 flex items-center px-4 md:static md:max-w-md md:mx-8"
              >
                <div className="relative w-full">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-dragon-cyan" size={18} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Busca tu armadura streetwear..."
                    className="w-full bg-white/5 border border-dragon-cyan/30 rounded-full py-2 pl-12 pr-10 text-dragon-white focus:outline-none focus:border-dragon-cyan transition-all"
                  />
                  {isLoading ? (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-dragon-cyan animate-spin" size={18} />
                  ) : (
                    <button 
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(''); setDebouncedSearchQuery(''); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  )}

                  {/* Search Results Dropdown */}
                  <AnimatePresence>
                    {searchQuery.length >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-dragon-black border border-white/10 rounded-2xl shadow-2xl shadow-dragon-cyan/10 overflow-hidden z-30 max-h-[70vh] overflow-y-auto"
                      >
                        {filteredResults.length > 0 ? (
                          <div className="p-2">
                            {filteredResults.map(product => (
                              <button
                                key={product.id}
                                onClick={() => handleResultClick(product.id)}
                                className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
                              >
                                <OptimizedImage 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-12 h-12 rounded-lg" 
                                />
                                <div>
                                  <p className="text-sm font-bold text-dragon-white">{product.name}</p>
                                  <p className="text-xs text-dragon-cyan">S/. {product.price.toFixed(2)}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : searchQuery === debouncedSearchQuery && !isLoading && (
                          <div className="p-8 text-center">
                            <p className="text-sm text-white/40 italic">No se encontraron tesoros con "{searchQuery}"</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Default Navigation - Hidden when search is open */}
          {!isSearchOpen && (
            <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Navegación principal">
              <Link to="/productos" className="text-dragon-white hover:text-dragon-fire transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded px-2 py-1">
                PRODUCTOS
              </Link>
              <a href="/#nosotros" className="text-dragon-white hover:text-dragon-fire transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded px-2 py-1">
                NOSOTROS
              </a>
              <a href="/#contacto" className="text-dragon-white hover:text-dragon-fire transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded px-2 py-1">
                CONTACTO
              </a>
            </nav>
          )}

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {!isSearchOpen && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className="text-dragon-white hover:text-dragon-cyan transition-colors focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded-full p-1"
                aria-label="Buscar productos"
              >
                <SearchIcon size={24} aria-hidden="true" />
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative text-dragon-white hover:text-dragon-fire transition-colors focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded-full p-1 ${isSearchOpen ? 'hidden md:block' : 'block'}`}
              aria-label={`Ver favoritos, ${wishlistCount} items`}
            >
              <Heart size={24} aria-hidden="true" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-dragon-cyan text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  aria-hidden="true"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleCart}
              className={`relative text-dragon-white hover:text-dragon-gold transition-colors focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded-full p-1 ${isSearchOpen && 'scale-90 md:scale-100'}`}
              aria-label={`Carrito de compras, ${itemCount} items`}
            >
              <ShoppingCart size={24} aria-hidden="true" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-dragon-fire text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  aria-hidden="true"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-dragon-white md:hidden focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded-full p-1"
              aria-label="Abrir menú"
            >
              <Menu size={24} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </motion.header>
  );
}
