import { HeroSection } from '@/features/home/components/HeroSection';
import { FeaturedProducts } from '@/features/products/components/FeaturedProducts';
import { WhyRyukami } from '@/features/home/components/WhyRyukami';
import { Community } from '@/features/home/components/Community';
import { Newsletter } from '@/features/home/components/Newsletter';
import { SEO } from '@/shared/components/layout/SEO';

export function HomePage() {
  return (
    <>
      <SEO />
      <HeroSection />
      <FeaturedProducts />
      <WhyRyukami />
      <Community />
      <Newsletter />
    </>
  );
}
