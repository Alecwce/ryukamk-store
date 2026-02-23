import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '@/shared/components/ui/Button';
import { SEO } from '@/shared/components/layout/SEO';
import { useProducts } from '../hooks/useProducts';
import clsx from 'clsx';

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(200);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetching data — uses shared queryKey ['products'] with MOCK_PRODUCTS fallback
  const { data: products = [], isLoading } = useProducts();

  // Get unique categories
  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return Array.from(new Set(cats));
  }, [products]);

  // Filter application
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, search, selectedCategory, maxPrice]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory(null);
    setMaxPrice(200);
  };

  const FilterSection = () => (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-dragon-white text-sm uppercase tracking-widest flex items-center gap-2">
          <Search size={14} className="text-dragon-cyan" /> Búsqueda
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dragon-cyan transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-dragon-white text-sm uppercase tracking-widest flex items-center gap-2">
          <Filter size={14} className="text-dragon-cyan" /> Categorías
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={clsx(
              "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
              !selectedCategory 
                ? "bg-dragon-gradient text-white border-transparent" 
                : "bg-white/5 text-white/60 border-white/10 hover:border-white/30"
            )}
          >
            TODOS
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                selectedCategory === cat 
                  ? "bg-dragon-gradient text-white border-transparent" 
                  : "bg-white/5 text-white/60 border-white/10 hover:border-white/30"
              )}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-bold text-dragon-white text-sm uppercase tracking-widest flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-dragon-cyan" /> Precio Máx.
          </h3>
          <span className="text-dragon-cyan font-mono text-xs font-bold">S/. {maxPrice}</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-dragon-cyan"
        />
        <div className="flex justify-between text-[10px] text-white/40 font-mono">
          <span>S/. 0</span>
          <span>S/. 200</span>
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-2 text-xs font-bold text-dragon-fire uppercase tracking-widest border border-dragon-fire/30 rounded-lg hover:bg-dragon-fire/10 transition-colors"
      >
        Limpiar Filtros
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <SEO 
        title="Colección Completa | RYŪKAMI" 
        description="Explora nuestra colección completa de streetwear premium inspirado en la mitología japonesa."
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-4">
            <Link to="/" className="hover:text-dragon-cyan transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-dragon-cyan font-bold">Productos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-dragon-white">
            NUESTRA <span className="bg-dragon-gradient bg-clip-text text-transparent italic">COLECCIÓN</span>
          </h1>
          <p className="text-white/40 mt-2 text-sm max-w-xl text-left">
            Diseños limitados fabricados con algodón premium. Estilo urbano diseñado para el guerrero contemporáneo.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
              <FilterSection />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileFilterOpen(true)}
                icon={<Filter size={16} />}
                className="w-full"
              >
                FILTRAR Y BUSCAR
              </Button>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white/20">
                  <X size={40} />
                </div>
                <h2 className="text-xl font-display font-bold text-dragon-white mb-2">SIN RESULTADOS</h2>
                <p className="text-white/40 text-sm mb-6">No encontramos productos que coincidan con tus filtros.</p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  VER TODO EL CATÁLOGO
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-dragon-black border-l border-white/10 z-[101] p-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display font-bold text-dragon-white text-xl">FILTRAR</h2>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <FilterSection />
              <div className="absolute bottom-6 left-6 right-6">
                <Button 
                  className="w-full" 
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  APLICAR FILTROS
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
