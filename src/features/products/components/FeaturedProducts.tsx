import { memo } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { useProducts } from '../hooks/useProducts';

export const FeaturedProducts = memo(() => {
  const { data: products = [], isLoading } = useProducts();

  const featured = products.slice(0, 4);

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
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-lg" />
              ))
            : featured.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))
          }
        </div>
      </div>
    </section>
  );
});

FeaturedProducts.displayName = 'FeaturedProducts';
