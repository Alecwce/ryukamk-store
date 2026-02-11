import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'dragon' | 'cyan' | 'gold' | 'outline';
  className?: string;
}

export const Badge = ({ children, variant = 'dragon', className }: BadgeProps) => {
  const variants = {
    dragon: 'bg-dragon-gradient text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]',
    cyan: 'bg-dragon-cyan/20 text-dragon-cyan border border-dragon-cyan/30',
    gold: 'bg-dragon-gold/20 text-dragon-gold border border-dragon-gold/30',
    outline: 'border border-dragon-white/20 text-dragon-white/70',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md',
        variants[variant],
        className
      )}
    >
      {variant === 'dragon' && (
        <span className="mr-1 animate-pulse">🔥</span>
      )}
      {children}
    </motion.span>
  );
};
