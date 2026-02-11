import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, ShoppingBag, Info, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { name: 'INICIO', path: '/', icon: Home },
  { name: 'PRODUCTOS', path: '/productos', icon: ShoppingBag },
  { name: 'CONTACTO', path: '/#contacto', icon: Phone },
  { name: 'NOSOTROS', path: '/#nosotros', icon: Info },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dragon-black/80 backdrop-blur-sm z-[100] md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-dragon-black border-r border-dragon-fire/20 z-[101] md:hidden flex flex-col pt-20 pb-10 px-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-dragon-white hover:text-dragon-fire transition-colors p-2"
              aria-label="Cerrar menú"
            >
              <X size={28} />
            </button>

            <div className="flex flex-col gap-6">
              <Link
                to="/"
                onClick={onClose}
                className="text-2xl font-display font-bold bg-dragon-gradient bg-clip-text text-transparent mb-8"
              >
                RYŪKAMI
              </Link>

              <nav className="flex flex-col gap-2">
                {MENU_ITEMS.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className="flex items-center gap-4 text-dragon-white hover:text-dragon-fire text-lg font-bold py-3 transition-colors group"
                      >
                        <span className="p-2 rounded-lg bg-white/5 group-hover:bg-dragon-fire/20 transition-colors">
                          <Icon size={20} />
                        </span>
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto pt-10 border-t border-white/10">
              <p className="text-[10px] text-white/20 tracking-widest font-bold mb-4 uppercase">REDES SOCIALES</p>
              <div className="flex gap-4">
                {['Instagram', 'Facebook', 'TikTok'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-sm text-dragon-white/60 hover:text-dragon-cyan transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
