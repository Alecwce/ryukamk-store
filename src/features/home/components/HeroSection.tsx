import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  // Optimization: Stable random values for particles to avoid jank on re-render
  // Reduced from 50 to 15 to improve LCP and reduce main thread load
  const particles = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dragon-black">
      <div className="absolute inset-0 bg-fire-glow opacity-20"></div>

      {/* Optimized Particles Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-dragon-cyan rounded-full animate-flicker"
            style={{
              left: p.left,
              top: p.top,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              willChange: 'opacity, transform',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-9xl mb-6 filter drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]"
          >
            🐉
          </motion.div>

          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-6">
            <span className="bg-dragon-gradient bg-clip-text text-transparent">
              DESPIERTA AL
            </span>
            <br />
            <span className="text-dragon-white">DRAGÓN</span>
          </h1>

          <p className="text-dragon-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-4">
            Streetwear japonés de alta calidad. Estilo único, identidad poderosa.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-dragon-cyan text-sm tracking-[0.3em] mb-8"
          >
            龍神 · RYŪKAMI · PERÚ
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a href="#productos">
            <Button size="lg" className="min-w-[200px]">
              VER COLECCIÓN
            </Button>
          </a>
          <a 
            href="https://wa.me/51999999999?text=Hola%20RYŪKAMI%2C%20quisiera%20más%20información%20sobre%20la%20colección." 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="min-w-[200px]">
              EXPLORAR
            </Button>
          </a>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="text-dragon-fire" size={32} />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dragon-black to-transparent"></div>
    </section>
  );
}
