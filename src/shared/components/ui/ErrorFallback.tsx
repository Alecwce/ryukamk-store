import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-10 rounded-3xl border-dragon-fire/20 max-w-lg w-full text-center relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-dragon-fire/10 blur-[100px] -z-10" />

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-dragon-fire/10 text-dragon-fire mb-8">
          <AlertTriangle size={40} />
        </div>

        <h2 className="text-3xl font-display font-bold text-dragon-white mb-4">
          ALGO SALIÓ <span className="text-dragon-fire">MAL</span>
        </h2>
        
        <p className="text-white/60 mb-8 leading-relaxed">
          Hubo un error inesperado en la energía del dragón. No te preocupes, tu carrito está a salvo.
        </p>

        {/* Error Detail (Mini) */}
        <div className="bg-black/40 rounded-xl p-4 mb-10 border border-white/5 overflow-hidden">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-2 font-bold">Detalle Técnico</p>
          <p className="text-xs text-dragon-fire/60 font-mono truncate">
            {errorMessage}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={resetErrorBoundary}
            className="w-full"
            icon={<RefreshCw size={18} />}
          >
            REINTENTAR
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
            icon={<Home size={18} />}
          >
            IR AL INICIO
          </Button>
        </div>

        <p className="mt-8 text-[10px] text-white/20 tracking-[0.3em] font-bold uppercase">
          Ryūkami Infrastructure Protection
        </p>
      </motion.div>
    </div>
  );
}
