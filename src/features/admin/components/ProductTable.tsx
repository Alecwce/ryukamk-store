import { motion } from 'framer-motion';
import { Edit2, Trash2, Package, Loader2, Search } from 'lucide-react';
import { Product } from '@/features/products/types';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  editingId: string | null;
}

export const ProductTable = ({ 
  products, 
  isLoading, 
  onEdit, 
  onDelete, 
  searchTerm, 
  onSearchChange,
  editingId
}: ProductTableProps) => {
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
        <Search className="text-white/20" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o categoría..."
          className="bg-transparent border-none outline-none text-dragon-white w-full text-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-xs tracking-widest uppercase font-bold">Cargando Inventario...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border-white/5">
            <Package className="mx-auto text-white/10 mb-4" size={48} />
            <p className="text-white/40 uppercase tracking-widest text-sm">No se encontraron productos</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`glass p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                editingId === product.id ? 'border-dragon-cyan bg-dragon-cyan/5' : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-dragon-black flex-shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow min-w-0">
                <p className="text-[10px] text-dragon-cyan font-bold uppercase tracking-widest mb-0.5">{product.category}</p>
                <h3 className="text-dragon-white font-bold truncate">{product.name}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-white/60 font-mono">S/. {product.price.toFixed(2)}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                    (product.stock ?? 0) < 5 
                      ? 'bg-dragon-fire text-white shadow-lg shadow-dragon-fire/20 animate-pulse' 
                      : 'bg-green-500/20 text-green-500'
                  }`}>
                    {product.stock ?? 0} { (product.stock ?? 0) < 5 ? '⚠️ BAJO STOCK' : 'EN STOCK' }
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit(product)}
                  className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-dragon-cyan hover:bg-dragon-cyan/10 transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => onDelete(product.id)}
                  className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-dragon-fire hover:bg-dragon-fire/10 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
