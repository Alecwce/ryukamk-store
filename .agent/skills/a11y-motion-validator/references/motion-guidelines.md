# 📜 Guía de Movimiento RYŪKAMI

Estándares para mantener la interfaz fluida, premium y accesible.

## 🕒 Tiempos y Curvas (Easings)

| Tipo de Animación       | Duración (ms) | Curva (Easing) | Propósito                          |
| :---------------------- | :------------ | :------------- | :--------------------------------- |
| **Micro-interacción**   | 100-200ms     | `easeInOut`    | Feedback inmediato (hover, click). |
| **Entrada de Elemento** | 300-400ms     | `easeOut`      | Aparecer contenido nuevo.          |
| **Salida de Elemento**  | 200-250ms     | `easeIn`       | Descartar elementos.               |
| **Layout Shift**        | 400-500ms     | `spring`       | Reordenamiento de listas o cards.  |

## ♿ Checklist de Accesibilidad (A11y)

1. **[ ] Preferencias**: ¿Se usa `useReducedMotion` para animaciones de gran escala (desplazamientos de pantalla completa)?
2. **[ ] Duración**: ¿La animación dura menos de 5 segundos? (Evitar distracciones infinitas).
3. **[ ] Contenido**: ¿El texto sigue siendo legible durante la transición?
4. **[ ] Foco**: Si es un Modal, ¿el foco se queda atrapado dentro del modal mientras está abierto?

## 🚫 Qué Evitar

- **Escalados extremos**: No superar el `scale(1.1)` para evitar pixelación o mareos.
- **Opacidad 0 persistente**: No ocultar elementos con `opacity: 0` si todavía son detectables por tabulación (usar `display: none` o `exit` de AnimatePresence).
- **Z-index Wars**: No animar el z-index; manejarlo estéticamente con `relative/absolute` previo.
