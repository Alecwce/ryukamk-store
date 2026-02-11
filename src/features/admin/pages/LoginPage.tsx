import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/api/supabase';
import { useToastStore } from '@/shared/stores/useToastStore';
import { Button } from '@/shared/components/ui/Button';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToastStore();

  const from = location.state?.from?.pathname || '/admin-ryukami';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      addToast('Bienvenido, Admin.', 'success');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dragon-black flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-8 rounded-3xl border-dragon-fire/20 relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-dragon-fire/10 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-dragon-cyan/10 blur-3xl -z-10" />

        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🐉</div>
          <h1 className="text-3xl font-display font-bold text-dragon-white">ADMIN <span className="text-dragon-fire">LOGIN</span></h1>
          <p className="text-white/40 text-sm mt-2 font-medium tracking-wide">ÁREA RESTRINGIDA RYŪKAMI</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-dragon-cyan font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              <Mail size={12} /> Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-dragon-white focus:border-dragon-fire outline-none transition-all placeholder:text-white/10"
              placeholder="admin@ryukami.store"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-dragon-cyan font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              <Lock size={12} /> Contraseña
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-dragon-white focus:border-dragon-fire outline-none transition-all placeholder:text-white/10"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            icon={loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
          >
            {loading ? 'AUTENTICANDO...' : 'ENTRAR AL PANEL'}
          </Button>
        </form>

        <p className="mt-8 text-center text-white/20 text-[10px] tracking-widest font-bold uppercase">
          Solo personal autorizado
        </p>
      </motion.div>
    </div>
  );
}
