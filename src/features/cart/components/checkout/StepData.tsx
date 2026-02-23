import { motion } from 'framer-motion';
import { User, Phone, MapPin } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { FieldError } from '@/shared/components/ui/FieldError';
import clsx from 'clsx';

interface StepDataProps {
  formData: { name: string; email: string; phone: string; address: string };
  errors: Record<string, string>;
  onFieldChange: (field: 'name' | 'email' | 'phone' | 'address', value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function StepData({ formData, errors, onFieldChange, onSubmit }: StepDataProps) {
  return (
    <motion.div
      key="step-data"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass p-8 rounded-3xl border-white/10"
    >
      <h2 className="text-2xl font-display font-bold text-dragon-white mb-8">DATOS DE ENTREGA</h2>
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="space-y-2">
          <label className="text-xs text-dragon-cyan font-bold tracking-widest flex items-center gap-2">
            <User size={14} /> NOMBRE COMPLETO
          </label>
          <motion.div
            animate={errors.name ? { x: [-2, 2, -2, 2, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              className={clsx(
                "w-full bg-white/5 border rounded-xl px-4 py-3 text-dragon-white focus:outline-none transition-all",
                errors.name ? "border-dragon-fire/50 bg-dragon-fire/5" : "border-white/10 focus:border-dragon-fire"
              )}
              placeholder="Ej. Juan Pérez"
            />
          </motion.div>
          <FieldError message={errors.name} />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-dragon-cyan font-bold tracking-widest flex items-center gap-2 uppercase">
            ✉️ CORREO ELECTRÓNICO
          </label>
          <motion.div
            animate={errors.email ? { x: [-2, 2, -2, 2, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              className={clsx(
                "w-full bg-white/5 border rounded-xl px-4 py-3 text-dragon-white focus:outline-none transition-all",
                errors.email ? "border-dragon-fire/50 bg-dragon-fire/5" : "border-white/10 focus:border-dragon-fire"
              )}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </motion.div>
          <FieldError message={errors.email} />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-dragon-cyan font-bold tracking-widest flex items-center gap-2">
            <Phone size={14} /> CELULAR (SOLO 9 DÍGITOS)
          </label>
          <motion.div
            animate={errors.phone ? { x: [-2, 2, -2, 2, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onFieldChange('phone', e.target.value.replace(/\D/g, '').slice(0, 9))}
              className={clsx(
                "w-full bg-white/5 border rounded-xl px-4 py-3 text-dragon-white focus:outline-none transition-all",
                errors.phone ? "border-dragon-fire/50 bg-dragon-fire/5" : "border-white/10 focus:border-dragon-fire"
              )}
              placeholder="999 999 999"
            />
          </motion.div>
          <FieldError message={errors.phone} />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-dragon-cyan font-bold tracking-widest flex items-center gap-2">
            <MapPin size={14} /> DIRECCIÓN EXACTA
          </label>
          <motion.div
            animate={errors.address ? { x: [-2, 2, -2, 2, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <textarea
              value={formData.address}
              onChange={(e) => onFieldChange('address', e.target.value)}
              className={clsx(
                "w-full bg-white/5 border rounded-xl px-4 py-3 text-dragon-white focus:outline-none transition-all h-24",
                errors.address ? "border-dragon-fire/50 bg-dragon-fire/5" : "border-white/10 focus:border-dragon-fire"
              )}
              placeholder="Calle, Número, Distrito, Ciudad, Referencia..."
            />
          </motion.div>
          <FieldError message={errors.address} />
        </div>
        <Button type="submit" size="lg" className="w-full">
          CONTINUAR AL PAGO
        </Button>
      </form>
    </motion.div>
  );
}
