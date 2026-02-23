import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ScrollNeonBackground() {
  const { scrollYProgress } = useScroll();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-dragon-fire/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-dragon-cyan/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-dragon-gold/[0.02] rounded-full blur-[150px]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        style={{ y: y1, rotate, willChange: 'transform' }}
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-dragon-fire/5 rounded-full blur-[120px]"
      />
      <motion.div
        style={{ y: y2, rotate: -rotate, willChange: 'transform' }}
        className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-dragon-cyan/5 rounded-full blur-[100px]"
      />
      <motion.div
        style={{ scale: scrollYProgress, willChange: 'transform' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-dragon-gold/[0.02] rounded-full blur-[150px]"
      />
    </div>
  );
}
