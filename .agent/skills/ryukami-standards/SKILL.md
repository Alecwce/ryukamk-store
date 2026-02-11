---
name: ryukami-standards
description: Estándares de desarrollo y arquitectura para la tienda RYŪKAMI.
---

# 🐉 Estándares RYŪKAMI

Este skill define las reglas de oro y procedimientos para desarrollar en la plataforma RYŪKAMI, asegurando un nivel de ingeniería Staff/Elite.

## Cuándo usar este Skill

Usa este skill siempre que realices tareas de codificación, revisión o arquitectura en el proyecto RYŪKAMI, especialmente al:

- Crear o modificar componentes React.
- Gestionar el estado global con Zustand.
- Implementar animaciones con Framer Motion.
- Configurar conexiones con Supabase o APIs externas.

## Instrucciones

### 1. Filosofía de Desarrollo (Zero Trust)

- **Cero Código Perezoso**: Prohibido el uso de placeholders como `// implement here`. Entrega archivos completos o bloques exactos.
- **Preservar Contexto**: No elimines funcionalidades ni estilos aprobados sin orden explícita.
- **Fidelidad UI**: Respeta el diseño al detalle usando Tailwind CSS v4.

### 2. Stack & Estándares Técnicos

- **Runtime**: Usa **Bun** obligatoriamente para instalar paquetes (`bun install`) y ejecutar scripts (`bun dev`).
- **TypeScript Estricto**: El uso de `any` es pecado mortal. Define interfaces para props, estados y respuestas de API.
- **Validación**: Usa **Zod** para validar cualquier entrada de datos externa.
- **Fetch de Datos**: Prohibido usar `useEffect` para fetching. Prefiere Server Actions o TanStack Query.

### 3. Arquitectura de Componentes

- **Ubicación**:
  - `src/components/ui`: Componentes atómicos (Botones, inputs).
  - `src/components/[feature]`: Componentes específicos de dominio (carrito, productos).
- **Animaciones**: Todo elemento interactivo debe incluir micro-interacciones premium usando `framer-motion` (`whileHover`, `whileTap`).

### 4. Rendimiento & Calidad

- **Core Web Vitals**: Optimización obsesiva de imágenes y prevención de Cumulative Layout Shift (CLS).
- **Verificación**: Antes de dar por terminada una tarea, ejecuta `bun run typecheck`.

## Ejemplos de Implementación

### Estructura de un Componente UI

```tsx
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface CustomButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
}

export const CustomButton = ({
  children,
  className,
  ...props
}: CustomButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={clsx(
      "bg-dragon-fire px-4 py-2 text-white font-bold rounded",
      className,
    )}
    {...props}
  >
    {children}
  </motion.button>
);
```
