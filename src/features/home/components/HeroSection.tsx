import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui/Button';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dragon-black">
      <div className="absolute inset-0 bg-fire-glow opacity-20"></div>

      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-dragon-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
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
          <Button size="lg" className="min-w-[200px]">
            VER COLECCIÓN
          </Button>
          <Button variant="outline" size="lg" className="min-w-[200px]">
            EXPLORAR
          </Button>
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
