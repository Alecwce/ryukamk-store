import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  priority?: boolean;
  imgClassName?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  imgClassName,
  aspectRatio = 'square',
  priority = false,
  ...props 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Optimización de URL para Pexels (si aplica)
  const optimizedSrc = useMemo(() => {
    if (src.includes('pexels.com') && !src.includes('fm=webp')) {
      return `${src}${src.includes('?') ? '&' : '?'}auto=compress&cs=tinysrgb&w=800&fm=webp`;
    }
    return src;
  }, [src]);

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '',
  }[aspectRatio];

  return (
    <div className={clsx(
      "relative overflow-hidden bg-dragon-black/20",
      aspectClass,
      className
    )}>
      {/* Shimmer Placeholder */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <div className="w-full h-full bg-gradient-to-r from-dragon-black/40 via-white/5 to-dragon-black/40 animate-shimmer bg-[length:200%_100%]" />
          </motion.div>
        )}
      </AnimatePresence>

      <img
        src={optimizedSrc}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        loading={priority ? "eager" : "lazy"}
        {...(priority ? { fetchPriority: "high" } : {})}
        className={clsx(
          "w-full h-full object-cover transition-all duration-700",
          isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-lg",
          error && "hidden",
          imgClassName
        )}
        {...props}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-dragon-black/40 text-white/20 text-xs text-center p-4">
          Failed to load image
        </div>
      )}
    </div>
  );
}
