import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Mail } from 'lucide-react';
import { supabase } from '@/api/supabase';
import { useToastStore } from '@/shared/stores/useToastStore';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        // Supabase retorna código 23505 para unique violation
        if (error.code === '23505') {
          addToast('Ya estás suscrito al clan 🐉', 'info');
        } else {
          throw error;
        }
        return;
      }

      setSubscribed(true);
      addToast('¡Bienvenido al clan RYŪKAMI! 🐉', 'success');
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      addToast('Error al suscribirse. Intenta de nuevo.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-dragon-black to-dragon-black/60 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-dragon-gradient opacity-5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-dragon-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 border-2 border-dragon-fire rounded-2xl"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(220, 38, 38, 0.3)',
                  '0 0 40px rgba(220, 38, 38, 0.5)',
                  '0 0 20px rgba(220, 38, 38, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-dragon-gradient rounded-full mb-6">
                <Mail className="text-dragon-white" size={32} />
              </div>

              <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
                <span className="text-dragon-white">ÚNETE AL </span>
                <span className="bg-dragon-gradient bg-clip-text text-transparent">
                  CLAN
                </span>
              </h2>

              <p className="text-dragon-white/70 mb-8 max-w-xl mx-auto">
                Recibe ofertas exclusivas, lanzamientos anticipados y contenido especial del mundo RYŪKAMI
              </p>

              {!subscribed ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-4 bg-dragon-black/60 border border-dragon-fire/30 rounded-lg text-dragon-white placeholder-dragon-white/40 focus:outline-none focus:border-dragon-fire transition-colors disabled:opacity-50"
                  />
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'ENVIANDO...' : 'SUSCRIBIRME'}
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-dragon-cyan font-bold text-lg"
                >
                  ¡Gracias por unirte al clan! 🐉
                </motion.div>
              )}

              <p className="text-dragon-white/40 text-sm mt-4">
                No spam, solo contenido de fuego. Puedes cancelar cuando quieras.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
