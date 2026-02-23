import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, Edit2, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';

const CATEGORIES = ['Polos', 'Poleras', 'Casacas', 'Pantalones', 'Accesorios'];
const AVAILABLE_COLORS = [
  { name: 'Negro', class: 'bg-black border-white/20' },
  { name: 'Blanco', class: 'bg-white border-black/10' },
  { name: 'Gris', class: 'bg-gray-500 border-white/10' },
];

interface ProductFormData {
  name: string;
  price: string;
  image: string;
  category: string;
  description: string;
  stock: string;
  colors: string[];
  colorImages: Record<string, string>;
}

interface ProductFormProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  errors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  editingId: string | null;
  onCancelEdit: () => void;
  isLoading: boolean;
  isUploading: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

export function ProductForm({
  formData,
  setFormData,
  errors,
  onSubmit,
  editingId,
  onCancelEdit,
  isLoading,
  isUploading,
  onUploadingChange,
}: ProductFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-6 rounded-3xl border-white/10 sticky top-32"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-dragon-white">
          {editingId ? 'EDITAR' : 'NUEVO'} <span className="text-dragon-cyan">PRODUCTO</span>
        </h2>
        {editingId && (
          <button onClick={onCancelEdit} className="text-white/40 hover:text-dragon-fire transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-dragon-cyan font-bold tracking-widest uppercase">Nombre</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full bg-white/5 border rounded-xl px-4 py-2 text-sm text-dragon-white outline-none transition-all ${
                errors.name ? 'border-dragon-fire' : 'border-white/10'
              }`}
            />
            {errors.name && <p className="text-[9px] text-dragon-fire font-bold uppercase">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-dragon-cyan font-bold tracking-widest uppercase">Precio</label>
              <input
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full bg-white/5 border rounded-xl px-4 py-2 text-sm text-dragon-white outline-none transition-all ${
                  errors.price ? 'border-dragon-fire' : 'border-white/10'
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-dragon-cyan font-bold tracking-widest uppercase">Stock</label>
              <input
                required
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className={`w-full bg-white/5 border rounded-xl px-4 py-2 text-sm text-dragon-white outline-none transition-all ${
                  errors.stock ? 'border-dragon-fire' : 'border-white/10'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-dragon-cyan font-bold tracking-widest uppercase">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-dragon-white outline-none appearance-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-dragon-black">{cat}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-dragon-cyan font-bold tracking-widest uppercase">Colores Disponibles</label>
            <div className="flex gap-3">
              {AVAILABLE_COLORS.map(color => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => {
                    const newColors = formData.colors.includes(color.name)
                      ? formData.colors.filter(c => c !== color.name)
                      : [...formData.colors, color.name];
                    setFormData({ ...formData, colors: newColors });
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${color.class} ${
                    formData.colors.includes(color.name) ? 'ring-2 ring-dragon-fire ring-offset-2 ring-offset-dragon-black scale-110' : 'opacity-40 hover:opacity-100'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Individual Color Images Upload */}
          <AnimatePresence>
            {formData.colors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-white/5"
              >
                <label className="text-[10px] text-dragon-gold font-bold tracking-widest uppercase">Fotos por Color</label>
                <div className="space-y-3">
                  {formData.colors.map(colorName => (
                    <div key={colorName} className="space-y-1">
                      <label className="text-[9px] text-white/40 font-bold uppercase">{colorName}</label>
                      <ImageUpload 
                        value={formData.colorImages[colorName] || ''} 
                        onChange={(url) => setFormData({ 
                          ...formData, 
                          colorImages: { ...formData.colorImages, [colorName]: url } 
                        })}
                        onUploading={onUploadingChange}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[10px] text-dragon-cyan font-bold tracking-widest uppercase">Imagen de Portada (General)</label>
            <ImageUpload 
              value={formData.image} 
              onChange={(url) => setFormData({ ...formData, image: url })}
              onUploading={onUploadingChange}
            />
            {errors.image && <p className="text-[9px] text-dragon-fire font-bold uppercase">{errors.image}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-dragon-cyan font-bold tracking-widest uppercase">Descripción</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full bg-white/5 border rounded-xl px-4 py-2 text-sm text-dragon-white outline-none transition-all resize-none ${
                errors.description ? 'border-dragon-fire' : 'border-white/10'
              }`}
            />
            {errors.description && <p className="text-[9px] text-dragon-fire font-bold uppercase">{errors.description}</p>}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isUploading}
          icon={isLoading ? <Loader2 className="animate-spin" /> : editingId ? <Edit2 size={16} /> : <Plus size={16} />}
        >
          {isLoading ? 'PROCESANDO...' : isUploading ? 'SUBIENDO...' : editingId ? 'ACTUALIZAR' : 'PUBLICAR'}
        </Button>
      </form>

      <AnimatePresence>
        {formData.image && formData.name && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 pt-6 border-t border-white/5 text-center"
          >
            <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden glass border-white/10 mb-2">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <p className="text-[10px] text-dragon-white font-bold uppercase truncate">{formData.name}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
