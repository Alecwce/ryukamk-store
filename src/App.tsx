import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { ScrollNeonBackground } from '@/shared/components/ui/ScrollNeonBackground';
import { HomePage } from '@/features/home/pages/HomePage';
import { ProtectedRoute } from '@/shared/components/layout/ProtectedRoute';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/shared/components/ui/ErrorFallback';
import { Loader2 } from 'lucide-react';

import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lazy-loaded routes (non-critical path)
const ProductPage = lazy(() => import('@/features/products/pages/ProductPage'));
const CatalogPage = lazy(() => import('@/features/products/pages/CatalogPage'));
const CheckoutPage = lazy(() => import('@/features/cart/pages/CheckoutPage'));
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard'));
const LoginPage = lazy(() => import('@/features/admin/pages/LoginPage'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-dragon-fire" size={48} />
    </div>
  );
}
import { CACHE_TIMES } from '@/shared/config/queryConfig';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIMES.products.stale,
      gcTime: CACHE_TIMES.products.gc,
    },
  },
});

function App() {
  const initializeAuth = useAuthStore(state => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-dragon-black relative">
          <ScrollNeonBackground />
          <Header />
          <main className="relative z-10">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/productos" element={<CatalogPage />} />
                <Route 
                  path="/producto/:id" 
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <ProductPage />
                    </ErrorBoundary>
                  } 
                />
                <Route 
                  path="/checkout" 
                  element={
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                      <CheckoutPage />
                    </ErrorBoundary>
                  } 
                />
                <Route path="/admin-login" element={<LoginPage />} />
                <Route 
                  path="/admin-ryukami" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <AdminDashboard />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <CartDrawer />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  </QueryClientProvider>
  );
}

export default App;
