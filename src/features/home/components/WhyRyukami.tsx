import { motion } from 'framer-motion';
import { Truck, Award, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'ENVÍO GRATIS',
    description: 'En compras mayores a S/.99',
    color: 'text-dragon-cyan',
    glow: 'group-hover:shadow-dragon-cyan/20',
  },
  {
    icon: Award,
    title: 'CALIDAD PREMIUM',
    description: 'Materiales de primera garantizados',
    color: 'text-dragon-gold',
    glow: 'group-hover:shadow-dragon-gold/20',
  },
  {
    icon: RefreshCw,
    title: 'CAMBIOS FÁCILES',
    description: 'Hasta 7 días para cambios',
    color: 'text-dragon-fire',
    glow: 'group-hover:shadow-dragon-fire/20',
  },
];

export function WhyRyukami() {
  return (
    <section className="py-32 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span 
            className="text-dragon-cyan text-sm tracking-[0.4em] uppercase mb-4 block"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Excelencia RYŪKAMI
          </motion.span>
          <h2 className="font-display font-bold text-5xl md:text-6xl mb-6">
            <span className="text-dragon-white">EL PODER DE </span>
            <span className="bg-dragon-gradient bg-clip-text text-transparent">
              NUESTRA IDENTIDAD
            </span>
          </h2>
          <div className="w-24 h-1 bg-dragon-gradient mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100, rotateX: 45 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                damping: 15
              }}
              whileHover={{ 
                y: -20,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group"
            >
              <div className="glass h-full relative p-10 rounded-2xl flex flex-col items-center text-center transition-all duration-500 hover:border-white/20">
                {/* Floating animation for the icon container */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                  className={`w-24 h-24 mb-8 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 ${feature.color} ${feature.glow} shadow-2xl transition-all duration-300`}
                >
                  <feature.icon size={40} />
                </motion.div>

                <h3 className="font-display font-bold text-2xl text-dragon-white mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-dragon-white/60 leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated corner decorations */}
                <div className="absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2 border-dragon-fire opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 w-2 h-2 border-b-2 border-l-2 border-dragon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
