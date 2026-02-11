import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useToastStore } from '@/shared/stores/useToastStore';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();
  const { addToast } = useToastStore();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      const email = user.email || '';
      if (!email.endsWith('@ryukami.store')) {
        addToast('Acceso restringido: Solo personal de RYŪKAMI autorizado.', 'error');
      }
    }
  }, [user, isLoading, addToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dragon-black flex items-center justify-center">
        <Loader2 className="animate-spin text-dragon-fire" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  const email = user.email || '';
  if (!email.endsWith('@ryukami.store')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
