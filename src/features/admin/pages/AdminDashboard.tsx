import { useState } from 'react';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Button } from '@/shared/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Product } from '@/features/products/types';
import { useQuery } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { ProductRepository } from '@/features/products/services/product.repository';
import { PRODUCT_KEYS } from '@/shared/lib/query-keys';
import { useProductActions } from '../hooks/useProductActions';
import { ProductForm } from '../components/ProductForm';
import { ProductTable } from '../components/ProductTable';

export default function AdminDashboard() {
  const { addToast } = useToastStore();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  
  // States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formKey, setFormKey] = useState(0); // Para forzar reset de ProductForm
  const [initialData, setInitialData] = useState<any>(null);

  // TanStack Query: Fetching
  const { data: products = [], isLoading: fetching } = useQuery({
    queryKey: PRODUCT_KEYS.all,
    queryFn: () => ProductRepository.getAll(),
    staleTime: 1000 * 60,
  });

  const { createMutation, updateMutation, deleteMutation, isLoading } = useProductActions(products);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setInitialData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      description: product.description || '',
      stock: (product.stock ?? 10).toString(),
      colors: product.colors || [],
      colorImages: product.colorImages || {}
    });
    setFormKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setInitialData(null);
    setFormKey(prev => prev + 1);
  };

  const handleDelete = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product && confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (formData: any) => {
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
      updateMutation.mutate({ id: editingId, updates: productData }, {
        onSuccess: () => handleCancel()
      });
    } else {
      createMutation.mutate(productData, {
        onSuccess: () => handleCancel()
      });
    }
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 max-w-5xl">
      {/* Header */}
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
          <ProductForm 
            key={formKey}
            editingId={editingId}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            initialData={initialData}
            loading={isLoading}
          />
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <ProductTable 
            products={products}
            isLoading={fetching}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            editingId={editingId}
          />
        </div>
      </div>
    </div>
  );
}
