import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-display font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-dragon-gradient text-dragon-white hover:shadow-lg hover:shadow-dragon-fire/50 border border-white/10',
    secondary: 'bg-dragon-white/10 backdrop-blur-md text-dragon-white border border-white/20 hover:bg-dragon-white/20',
    outline: 'border border-dragon-white/20 bg-dragon-white/5 backdrop-blur-sm text-dragon-white hover:border-dragon-fire hover:bg-dragon-fire/20',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        baseStyles, 
        variants[variant], 
        sizes[size], 
        'focus:outline-none focus:ring-2 focus:ring-dragon-cyan focus:ring-offset-2 focus:ring-offset-dragon-black',
        className
      )}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}
