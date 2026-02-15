import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { ScrollNeonBackground } from '@/shared/components/ui/ScrollNeonBackground';
import { HomePage } from '@/features/home/pages/HomePage';
import { ProtectedRoute } from '@/shared/components/layout/ProtectedRoute';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useEffect, lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/shared/components/ui/ErrorFallback';
import { motion } from 'framer-motion';

import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lazy imports para optimizar el bundle principal (reducción de ~300KB initial)
const ProductPage = lazy(() => import('@/features/products/pages/ProductPage'));
const CatalogPage = lazy(() => import('@/features/products/pages/CatalogPage'));
const CheckoutPage = lazy(() => import('@/features/cart/pages/CheckoutPage'));
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard'));
const LoginPage = lazy(() => import('@/features/admin/pages/LoginPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de caché por defecto
      gcTime: 1000 * 60 * 30, // 30 minutos de vida en memoria
    },
  },
});

/**
 * PageLoader: Componente minimalista y premium para transiciones de ruta.
 * Utiliza los colores de identidad: Dragon Fire y Dragon Cyan.
 */
const PageLoader = () => (
  <div className="min-h-[60vh] w-full flex flex-col items-center justify-center">
    <div className="relative">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5] 
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl filter drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]"
      >
        🐉
      </motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-4 border-2 border-t-dragon-fire border-r-transparent border-b-dragon-cyan border-l-transparent rounded-full"
      />
    </div>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-12 text-dragon-cyan text-xs font-bold tracking-[0.4em] uppercase"
    >
      Invocando al Dragón...
    </motion.p>
  </div>
);

function AppContent() {
  const location = useLocation();
  const showScrollBackground = location.pathname === '/' || location.pathname === '/productos';

  return (
    <div className="min-h-screen bg-dragon-black relative">
      {showScrollBackground && <ScrollNeonBackground />}
      <Header />
      <main className="relative z-10">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/productos" element={<CatalogPage />} />
              <Route path="/producto/:id" element={<ProductPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin-login" element={<LoginPage />} />
              <Route 
                path="/admin-ryukami" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
}

function App() {
  const initializeAuth = useAuthStore(state => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
