# 📐 Especificaciones Glassmorphism RYŪKAMI

Valores exactos para mantener la consistencia en el sistema de diseño.

## 1. Niveles de Desenfoque (Backdrop Blur)

- **Sutil (Card/TopNav)**: `8px` (`backdrop-blur-md`)
- **Estándar (Sidebars/Drawers)**: `12px` (`backdrop-blur-lg`)
- **Extremo (Modales/Overlays)**: `20px` (`backdrop-blur-xl`)

## 2. Definición de Bordes (Glass Stroke)

Para que el efecto cristal funcione, el borde debe ser más claro que el fondo en la parte superior y ligeramente más oscuro en la inferior (simulando luz).

- **Borde simple**: `border: 1px solid rgba(255, 255, 255, 0.1);`
- **Borde Gradiente**: `border-image: linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.05)) 1;`

## 3. Paleta de Colores HSL (Vibrante)

| Nombre          | HSL                 | HEX (Ref) | Uso                          |
| :-------------- | :------------------ | :-------- | :--------------------------- |
| **Dragon Fire** | `0, 84%, 60%`       | `#F04444` | Primario / Call to Action    |
| **Deep Void**   | `240, 10%, 4%`      | `#0A0A0C` | Fondos base / Body           |
| **Glass White** | `0, 0%, 100%, 0.05` | `N/A`     | Fondo de contenedores glass  |
| **Cyber Cyan**  | `180, 100%, 50%`    | `#00FFFF` | Acentos secundarios / Status |

## 4. Checklist para el Final de Tarea

1. **[ ] Profundidad**: ¿El elemento se siente "encima" del fondo gracias a sombras y desenfoque?
2. **[ ] Legibilidad**: ¿El contraste del texto sobre el cristal es al menos de 4.5:1?
3. **[ ] Consistencia**: ¿Se están usando los tokens de `design-tokens.json` o variables CSS globales?
4. **[ ] Animación**: ¿El cambio entre estados (ej: abrir modal) es fluido y usa `AnimatePresence`?
