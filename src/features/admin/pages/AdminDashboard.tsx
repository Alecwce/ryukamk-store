import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '@/shared/stores/useToastStore';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Button } from '@/shared/components/ui/Button';
import { Product } from '@/features/products/types';
import { useQuery } from '@tanstack/react-query';
import { ProductRepository } from '@/features/products/services/product.repository';
import { CACHE_TIMES } from '@/shared/config/queryConfig';
import { adminProductSchema } from '@/features/admin/schemas/adminProductSchema';
import { useProductMutations } from '@/features/admin/hooks/useProductMutations';
import { ProductForm } from '@/features/admin/components/ProductForm';
import { ProductList } from '@/features/admin/components/ProductList';

export default function AdminDashboard() {
  const { addToast } = useToastStore();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

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
    staleTime: CACHE_TIMES.admin.stale,
  });

  // Mutations
  const { createMutation, updateMutation, deleteMutation, isLoading } = useProductMutations({
    onCreateSuccess: () => resetForm(),
    onUpdateSuccess: () => { setEditingId(null); resetForm(); },
    products,
  });

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
      name: '', price: '', image: '', category: 'Polos',
      description: '', stock: '10', colors: [], colorImages: {}
    });
    setErrors({});
  };

  const cancelEdit = () => { setEditingId(null); resetForm(); };

  const handleDelete = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;
    if (!confirm(`¿Estás seguro de eliminar "${productToDelete.name}"?`)) return;
    deleteMutation.mutate(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = adminProductSchema.safeParse(formData);
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
        <div className="lg:col-span-1">
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            onSubmit={handleSubmit}
            editingId={editingId}
            onCancelEdit={cancelEdit}
            isLoading={isLoading}
            isUploading={isUploadingImage}
            onUploadingChange={setIsUploadingImage}
          />
        </div>

        <ProductList
          products={products}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          editingId={editingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={fetching}
        />
      </div>
    </div>
  );
}
