# 🐉 RYŪKAMI (龍神) — Streetwear Japonés de Élite

[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**RYŪKAMI** es una plataforma de e-commerce de streetwear inspirada en la cultura japonesa, diseñada específicamente para el mercado peruano. Fusionamos la estética tradicional del "Dios Dragón" con la moda urbana moderna.

---

## 🚀 Inicio Rápido

Este proyecto utiliza **Bun** para máxima velocidad y eficiencia.

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ryukami.store.git

# Instalar dependencias (ultra-rápido con Bun)
bun install

# Levantar servidor de desarrollo
bun dev

# Compilar para producción
bun run build
```

---

## 🎨 Diseño y UX

La plataforma sigue una filosofía **Dark-First**, priorizando el impacto visual y una sensación de lujo.

- **Paleta de Colores**: Inspirada en la tinta japonesa y el "Fuego del Dragón".
  - `Dragon Black (#0A0A0B)`: Fondo negro profundo.
  - `Dragon Fire (#DC2626)`: Acentos rojo carmesí.
  - `Dragon Gold (#F59E0B)`: Detalles en dorado prestigio.
- **Movimiento**: Impulsado por `framer-motion`. Cada interacción es fluida y premium.

---

## 🛠️ Stack Tecnológico

| Categoría        | Tecnología               |
| :--------------- | :----------------------- |
| **Runtime / PM** | [Bun](https://bun.sh)    |
| **Framework**    | React 18 (TypeScript)    |
| **Estilos**      | Tailwind CSS 4 + PostCSS |
| **Animaciones**  | Framer Motion            |
| **Estado**       | Zustand                  |
| **Backend**      | Supabase                 |
| **Validación**   | Zod                      |

---

## 📁 Arquitectura del Proyecto

```typescript
src/
├── components/
│   ├── ui/          // Componentes atómicos (Botones, Inputs, Modales)
│   ├── layout/      // Estructura (Header, Footer, Navegación)
│   ├── home/        // Secciones de la Landing Page
│   ├── products/    // Cards y lógica de productos
│   └── cart/        // Carrito de compras
├── store/           // Gestión de estado global (Zustand)
├── types/           // Interfaces de TypeScript y esquemas Zod
├── lib/             // Utilidades, cliente de Supabase y funciones helper
└── App.tsx          // Punto de entrada de la aplicación
```

---

## 📌 Estándares de Código

- **TypeScript Estricto**: Prohibido el uso de `any`.
- **Monolito Modular**: Funcionalidades agrupadas por dominio.
- **Performance**: Obsesión con los Core Web Vitals.
- **Mentalidad Staff**: Código limpio, documentado y sin placeholders.

---

## 🤝 Contribución

Sigue las reglas definidas en `.agent/skills/ryukami-standards/SKILL.md` para cualquier cambio en el código.

---

© 2025 RYŪKAMI. Creado con 🔥 por **alexwce** en Perú 🇵🇪.
