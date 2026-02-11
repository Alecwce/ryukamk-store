import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ProductRepository } from '../services/product.repository';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'related', category, currentProductId],
    queryFn: async () => {
      const data = await ProductRepository.getByCategory(category);
      // Filtramos el producto actual y limitamos a 4
      return data.filter(p => p.id !== currentProductId).slice(0, 4);
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
    enabled: !!category,
  });

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="mt-24 border-t border-white/10 pt-16">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-dragon-white mb-10 text-center md:text-left">
        TAMBIÉN TE PUEDE <span className="text-dragon-fire">INTERESAR</span>
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {isLoading 
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
            ))
          : products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))
        }
      </div>
    </section>
  );
}
