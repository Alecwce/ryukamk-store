---
name: glassmorphism-design-audit
description: Auditoría estética para asegurar que la interfaz cumpla con los estándares "Premium" y "Glassmorphism" de RYŪKAMI. Úsalo al crear componentes UI, modificar el sistema de diseño o antes de finalizar una tarea visual para garantizar el efecto WOW.
---

# 💎 Glassmorphism Design Audit

## Resumen

Este skill es el guardián de la identidad visual de RYŪKAMI. Su objetivo es evitar que la interfaz se vuelva genérica, asegurando que cada componente tenga ese acabado vibrante, moderno y traslúcido característico del estilo Glassmorphism Premium.

## Workflow de Auditoría Visual

### 1. La Regla de las Capas (Layering)

- **Fondo**: Debe ser un gradiente dinámico o una imagen con profundidad, nunca un color plano.
- **Contenedor**: Uso obligatorio de `backdrop-blur-[md/lg/xl]`.
- **Borde**: Borde sutil (1px) con opacidad baja (ej: `border-white/10`) para definir la silueta sin pesar.

### 2. Vibrancia y Color

- **Principio**: Usar colores HSL para mejor control de saturación y luminosidad.
- **Contraste**: El texto debe ser `white/90` o `white/100` sobre fondos oscuros difuminados para máxima legibilidad.
- **Acentos**: El color primario (`dragon-fire`) debe usarse para guiar la atención, no para rellenar áreas grandes.

### 3. Micro-interacciones (El "Brillo")

- Todo elemento interactivo debe reaccionar no solo con movimiento, sino con cambios de luz/gradiente.
- Uso de `linear-gradient` en estados hover para simular reflejos.

## Checklist de Estilo WOW

| Elemento    | Requisito Glassmorphism                | Tailwind v4 Sugerido                                                            |
| :---------- | :------------------------------------- | :------------------------------------------------------------------------------ |
| **Cards**   | Difuminado de fondo + Borde sutil      | `bg-white/5 backdrop-blur-md border border-white/10`                            |
| **Modales** | Superposición con desenfoque extremo   | `bg-black/40 backdrop-blur-xl`                                                  |
| **Inputs**  | Foco con resplandor suave (Outer Glow) | `focus:ring-2 focus:ring-dragon-fire/50`                                        |
| **Botones** | Gradiente interno + Sombra de color    | `bg-gradient-to-br from-dragon-fire to-red-600 shadow-lg shadow-dragon-fire/30` |

## Recursos

- `references/glassmorphism-specs.md`: Especificaciones de opacidad, desenfoque y paleta HSL.
- `assets/design-tokens.json`: JSON con los tokens de diseño para sincronizar con Tailwind/CSS.
