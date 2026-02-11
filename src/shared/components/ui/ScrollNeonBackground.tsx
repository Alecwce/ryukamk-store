import { motion, useScroll, useTransform } from 'framer-motion';

export function ScrollNeonBackground() {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-dragon-fire/5 rounded-full blur-[120px]"
      />
      <motion.div
        style={{ y: y2, rotate: -rotate }}
        className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-dragon-cyan/5 rounded-full blur-[100px]"
      />
      <motion.div
        style={{ scale: scrollYProgress }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-dragon-gold/[0.02] rounded-full blur-[150px]"
      />
    </div>
  );
}
