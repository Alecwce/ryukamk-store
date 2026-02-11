import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { ScrollNeonBackground } from '@/shared/components/ui/ScrollNeonBackground';
import { HomePage } from '@/features/home/pages/HomePage';
import ProductPage from '@/features/products/pages/ProductPage';
import CatalogPage from '@/features/products/pages/CatalogPage';
import CheckoutPage from '@/features/cart/pages/CheckoutPage';
import AdminDashboard from '@/features/admin/pages/AdminDashboard';
import LoginPage from '@/features/admin/pages/LoginPage';
import { ProtectedRoute } from '@/shared/components/layout/ProtectedRoute';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/shared/components/ui/ErrorFallback';

import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de caché por defecto
      gcTime: 1000 * 60 * 30, // 30 minutos de vida en memoria
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
