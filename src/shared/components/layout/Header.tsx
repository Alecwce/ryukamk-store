import { ShoppingCart, Menu, Search, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/features/cart/store/useCartStore';

export function Header() {
  const { toggleCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dragon-black/95 backdrop-blur-md border-b border-dragon-fire/20"
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="nav-container flex items-center justify-between h-20">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded-lg p-1"
            aria-label="Ir a inicio de RYŪKAMI"
          >
            <div className="text-3xl" aria-hidden="true">🐉</div>
            <div>
              <div className="font-display font-bold text-2xl bg-dragon-gradient bg-clip-text text-transparent">
                RYŪKAMI
              </div>
              <div className="text-xs text-dragon-cyan tracking-widest">龍神</div>
            </div>
          </motion.a>

          <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Navegación principal">
            <a href="#productos" className="text-dragon-white hover:text-dragon-fire transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded px-2 py-1">
              PRODUCTOS
            </a>
            <a href="#nosotros" className="text-dragon-white hover:text-dragon-fire transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded px-2 py-1">
              NOSOTROS
            </a>
            <a href="#contacto" className="text-dragon-white hover:text-dragon-fire transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded px-2 py-1">
              CONTACTO
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-dragon-white hover:text-dragon-cyan transition-colors hidden md:block focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded-full p-1"
              aria-label="Buscar productos"
            >
              <Search size={24} aria-hidden="true" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-dragon-white hover:text-dragon-fire transition-colors hidden md:block focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded-full p-1"
              aria-label="Ver favoritos"
            >
              <Heart size={24} aria-hidden="true" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleCart}
              className="relative text-dragon-white hover:text-dragon-gold transition-colors focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded-full p-1"
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
              className="text-dragon-white md:hidden focus:outline-none focus:ring-2 focus:ring-dragon-cyan rounded-full p-1"
              aria-label="Abrir menú"
            >
              <Menu size={24} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
