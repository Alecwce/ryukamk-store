import { memo } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';

const products = [
  {
    id: '1',
    name: 'Polo Dragon Basic',
    price: 49.90,
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Polos',
    stock: 20
  },
  {
    id: '2',
    name: 'Polera Spirit Fire',
    price: 79.90,
    image: 'https://images.pexels.com/photos/8532583/pexels-photo-8532583.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Poleras',
    stock: 0 // Agotado para probar feedback visual
  },
  {
    id: '3',
    name: 'Short Warrior Cargo',
    price: 59.90,
    image: 'https://images.pexels.com/photos/7679876/pexels-photo-7679876.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Shorts',
    stock: 15
  },
  {
    id: '4',
    name: 'Pantalón Shadow Cargo',
    price: 89.90,
    image: 'https://images.pexels.com/photos/5886041/pexels-photo-5886041.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pantalones',
    stock: 5
  },
];

export const FeaturedProducts = memo(() => {
  return (
    <section id="productos" className="py-20 bg-dragon-black relative overflow-hidden">
      <div className="absolute inset-0 bg-fire-glow opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <span className="text-dragon-cyan text-sm tracking-[0.3em] uppercase">
              Colección
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
            <span className="bg-dragon-gradient bg-clip-text text-transparent">
              PRODUCTOS
            </span>
            <span className="text-dragon-white"> DESTACADOS</span>
          </h2>
          <p className="text-dragon-white/60 max-w-2xl mx-auto">
            Descubre nuestra selección de streetwear japonés. Cada prenda es una obra de arte.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

FeaturedProducts.displayName = 'FeaturedProducts';
