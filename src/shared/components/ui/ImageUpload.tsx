import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/api/supabase';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useToastStore } from '@/shared/stores/useToastStore';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUploading?: (isUploading: boolean) => void;
}

export function ImageUpload({ value, onChange, onUploading }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    onUploading?.(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to 'products' bucket
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      const { addToast } = useToastStore.getState();
      addToast('Error al subir imagen. Verifica el bucket "products" y los permisos RLS.', 'error');
    } finally {
      setIsUploading(false);
      onUploading?.(false);
    }
  }, [onChange, onUploading]);

  const removeImage = () => {
    onChange('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div className="space-y-2">
      <label className="text-[10px] text-dragon-cyan font-bold tracking-widest uppercase flex items-center gap-2">
        <ImageIcon size={12} /> IMAGEN DEL PRODUCTO
      </label>

      {value ? (
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden glass border border-white/10 group">
          <img src={value} alt="Product" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={removeImage}
              className="p-2 rounded-full bg-dragon-fire/20 text-dragon-fire hover:bg-dragon-fire/40 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
            ${isDragActive ? 'border-dragon-cyan bg-dragon-cyan/5' : 'border-white/10 hover:border-white/20 bg-white/5'}
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            {isUploading ? (
              <Loader2 className="animate-spin text-dragon-cyan" size={40} />
            ) : (
              <Upload className={isDragActive ? 'text-dragon-cyan' : 'text-white/20'} size={40} />
            )}
            <div>
              <p className="text-sm font-bold text-dragon-white">
                {isUploading ? 'SUBIENDO...' : isDragActive ? 'SUELTA AQUÍ' : 'SUBIR IMAGEN'}
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                DRAG & DROP O HAZ CLIC
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
