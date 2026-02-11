import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { ProductRepository } from '@/features/products/services/product.repository';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Button } from '@/shared/components/ui/Button';
import { 
  Plus, Package, Loader2, LogOut, Edit2, Trash2, Search, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Product } from '@/features/products/types';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function AdminDashboard() {
  const { addToast } = useToastStore();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Polos',
    description: '',
    stock: '10',
    colors: [] as string[],
    colorImages: {} as Record<string, string>
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // TanStack Query: Fetching
  const { data: products = [], isLoading: fetching } = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductRepository.getAll(),
    staleTime: 1000 * 60, // 1 minuto para admin
  });

  // TanStack Query: CRUD Mutations
  const createMutation = useMutation({
    mutationFn: (newProduct: Omit<Product, 'id'>) => ProductRepository.create(newProduct),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      }
      addToast('Producto creado', 'success');
      resetForm();
    },
    onError: (err: Error) => addToast(err.message, 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Product, 'id'>> }) => 
      ProductRepository.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      addToast('Producto actualizado', 'success');
      setEditingId(null);
      resetForm();
    },
    onError: (err: Error) => addToast(err.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductRepository.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      const deletedProduct = products.find(p => p.id === id);
      
      if (deletedProduct) {
        addToast(`Producto "${deletedProduct.name}" eliminado`, 'success', {
          label: 'Deshacer',
          callback: async () => {
             createMutation.mutate({
               name: deletedProduct.name,
               price: deletedProduct.price,
               image: deletedProduct.image,
               category: deletedProduct.category,
               description: deletedProduct.description,
               stock: deletedProduct.stock
             });
          }
        });
      }
    },
    onError: (err: Error) => addToast(err.message, 'error'),
  });

  const productSchema = z.object({
    name: z.string().min(10, 'Mínimo 10 caracteres para el nombre'),
    price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'El precio debe ser mayor a 0'),
    image: z.string().url('URL de imagen no válida'),
    category: z.string().min(1, 'Selecciona una categoría'),
    description: z.string().min(20, 'Mínimo 20 caracteres para la descripción'),
    stock: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, 'El stock no puede ser negativo'),
    colors: z.array(z.string()).optional(),
    colorImages: z.record(z.string(), z.string()).optional(),
  });

  const categories = ['Polos', 'Poleras', 'Casacas', 'Pantalones', 'Accesorios'];
  const AVAILABLE_COLORS = [
    { name: 'Negro', class: 'bg-black border-white/20' },
    { name: 'Blanco', class: 'bg-white border-black/10' },
    { name: 'Gris', class: 'bg-gray-500 border-white/10' },
  ];

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      description: product.description || '',
      stock: (product.stock ?? 10).toString(),
      colors: product.colors || [],
      colorImages: product.colorImages || {}
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      image: '',
      category: 'Polos',
      description: '',
      stock: '10',
      colors: [],
      colorImages: {}
    });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;

    if (!confirm(`¿Estás seguro de eliminar "${productToDelete.name}"?`)) return;

    deleteMutation.mutate(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = productSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      addToast('Datos inválidos', 'error');
      return;
    }

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category,
      description: formData.description,
      stock: parseInt(formData.stock),
      colors: formData.colors,
      colorImages: formData.colorImages
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, updates: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-dragon-white mb-2">
            ADMIN <span className="text-dragon-fire">PANEL</span>
          </h1>
          <p className="text-white/40">Gestión de inventario RYŪKAMI</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/')} icon={<LogOut size={16} />}>
            WEB
          </Button>
          <Button 
            variant="outline" 
            className="border-dragon-fire/30 text-dragon-fire hover:bg-dragon-fire/10"
            onClick={async () => {
              await signOut();
              addToast('Sesión cerrada.', 'info');
              navigate('/');
            }} 
            icon={<LogOut size={16} />}
          >
            SALIR
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
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
                <button onClick={cancelEdit} className="text-white/40 hover:text-dragon-fire transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campos compactos para el sidebar */}
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
                    {categories.map(cat => <option key={cat} value={cat} className="bg-dragon-black">{cat}</option>)}
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
                              onUploading={setIsUploadingImage}
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
                    onUploading={setIsUploadingImage}
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
                disabled={loading || isUploadingImage}
                icon={loading ? <Loader2 className="animate-spin" /> : editingId ? <Edit2 size={16} /> : <Plus size={16} />}
              >
                {loading ? 'PROCESANDO...' : isUploadingImage ? 'SUBIENDO...' : editingId ? 'ACTUALIZAR' : 'PUBLICAR'}
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
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <Search className="text-white/20" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o categoría..."
              className="bg-transparent border-none outline-none text-dragon-white w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {fetching ? (
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
                      onClick={() => handleEdit(product)}
                      className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-dragon-cyan hover:bg-dragon-cyan/10 transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
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
      </div>
    </div>
  );
}
