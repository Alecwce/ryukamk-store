import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { HeroSection } from '@/features/home/components/HeroSection';
import { FeaturedProducts } from '@/features/products/components/FeaturedProducts';
import { WhyRyukami } from '@/features/home/components/WhyRyukami';
import { Community } from '@/features/home/components/Community';
import { Newsletter } from '@/features/home/components/Newsletter';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { ScrollNeonBackground } from '@/shared/components/ui/ScrollNeonBackground';

function App() {
  return (
    <div className="min-h-screen bg-dragon-black relative">
      <ScrollNeonBackground />
      <Header />
      <main className="relative z-10 pt-20">
        <HeroSection />
        <FeaturedProducts />
        <WhyRyukami />
        <Community />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
}

export default App;
