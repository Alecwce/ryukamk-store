import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton = ({ className, variant = 'rect' }: SkeletonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={clsx(
        'bg-white/5 relative overflow-hidden',
        variant === 'circle' ? 'rounded-full' : 'rounded-md',
        className
      )}
    >
      <motion.div
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-dragon-fire/10 to-transparent w-full h-full"
      />
    </motion.div>
  );
};
