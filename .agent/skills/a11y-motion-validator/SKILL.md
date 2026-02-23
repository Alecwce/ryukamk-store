---
name: a11y-motion-validator
description: Validador de accesibilidad para animaciones con Framer Motion. Asegura que las micro-interacciones premium no rompan la experiencia de usuario ni causen fatiga visual. Úsalo al implementar transiciones, efectos hover o animaciones de entrada.
---

# 🎨 A11y Motion Validator

## Resumen

Este skill garantiza que el diseño visual "WOW" de RYŪKAMI sea inclusivo. Valida que las animaciones de `framer-motion` sean fluidas, no causen saltos de diseño y respeten las preferencias del sistema del usuario.

## Workflow de Validación

### 1. Respetar Preferencias del Sistema

- **Principio**: Si el usuario activó "Reducir movimiento" en su OS, la web debe obedecer.
- **Implementación**: Usar el hook `useReducedMotion()` de Framer Motion para simplificar o desactivar animaciones.

### 2. Prevención de CLS (Cumulative Layout Shift)

- **Regla**: Las animaciones no deben mover elementos circundantes a menos que sea intencionado.
- **Acción**: Usar `layout` prop con precaución y asegurar placeholders de tamaño fijo.

### 3. Foco e Interactividad

- **Regla**: Los elementos que se animan (modales, drawers) deben capturar o devolver el foco correctamente.
- **Acción**: Validar que `AnimatePresence` no deje elementos fantasma en el DOM que interfieran con el lector de pantalla.

## Patrones de Código Seguro

### Ejemplo de Botón con Respeto a Accesibilidad

```tsx
import { motion, useReducedMotion } from "framer-motion";

export const AccessibleButton = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  const hoverAnimation = shouldReduceMotion
    ? { opacity: 0.8 }
    : { scale: 1.05, y: -2 };

  return <motion.button whileHover={hoverAnimation}>{children}</motion.button>;
};
```

## Recursos

- `references/motion-guidelines.md`: Checklist detallada de tiempos, curvas (easings) y accesibilidad.
- `assets/motion-variants.ts`: Colección de variantes de Framer Motion optimizadas y seguras.
