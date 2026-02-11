import { motion } from 'framer-motion';

const ugcImages = [
  'https://images.pexels.com/photos/1138673/pexels-photo-1138673.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/4381302/pexels-photo-4381302.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2090903/pexels-photo-2090903.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1721159/pexels-photo-1721159.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
];

const tags = [
  { label: '#Ryukami', color: 'bg-dragon-fire/20 text-dragon-fire border-dragon-fire/30' },
  { label: '#RyukamiPeru', color: 'bg-dragon-cyan/20 text-dragon-cyan border-dragon-cyan/30' },
  { label: '#StreetwearPerú', color: 'bg-dragon-gold/20 text-dragon-gold border-dragon-gold/30' }
];

export function Community() {
  return (
    <section className="py-32 relative bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left md:max-w-xl"
          >
            <h2 className="font-display font-bold text-5xl md:text-6xl mb-6">
              <span className="bg-dragon-gradient bg-clip-text text-transparent">
                NUESTRA
              </span>
              <br />
              <span className="text-dragon-white">COMUNIDAD</span>
            </h2>
            <p className="text-dragon-white/60 text-lg mb-6 leading-relaxed">
              El espíritu del dragón vive en nuestra gente. Únete a la legión de seguidores que definen el nuevo streetwear peruano.
            </p>
            <motion.a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-dragon-cyan font-bold tracking-wider hover:text-dragon-fire transition-colors"
            >
              EXPLORA EN TIKTOK →
            </motion.a>
          </motion.div>

          <div className="flex gap-4">
             {tags.map((tag, i) => (
               <motion.span
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 animate={{ y: [0, -10, 0] }}
                 style={{ animationDelay: `${i * 0.5}s` }}
                 className={`px-6 py-3 rounded-2xl glass border ${tag.color} text-sm font-bold tracking-tight shadow-xl animate-float`}
               >
                 {tag.label}
               </motion.span>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {ugcImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                rotate: index % 2 === 0 ? 2 : -2,
                zIndex: 10
              }}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-2xl glass p-1 group"
            >
              <div className="w-full h-full overflow-hidden rounded-xl bg-dragon-black relative">
                <img
                  src={image}
                  alt={`Community ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-dragon-gradient opacity-0 group-hover:opacity-20 transition-all duration-500" />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-dragon-fire/50 rounded-xl transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-24 text-center glass py-12 rounded-3xl border-dragon-fire/10"
        >
          <p className="text-dragon-white/80 text-xl font-display mb-2">
            ¿QUIERES APARECER AQUÍ?
          </p>
          <p className="text-dragon-white/40 mb-0">
             Etiquétanos en tus fotos con <span className="text-dragon-fire font-bold">#RyukamiPeru</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
