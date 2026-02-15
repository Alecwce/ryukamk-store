# 🐉 RYŪKAMI (龍神) — Streetwear Japonés de Élite

[![Bun](https://img.shields.io/badge/Runtime-Bun%20v1.0+-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![React](https://img.shields.io/badge/Framework-React%20v18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%20v5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Styles-Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**RYŪKAMI** es el e-commerce definitivo de streetwear japonés para el mercado peruano. Fusionamos la mística del "Dios Dragón" con una arquitectura de software de élite.

---

## 🏗️ Arquitectura del Sistema

Este proyecto implementa una arquitectura **Modular Monolith** enfocada en escalabilidad y separación de responsabilidades.

### Estructura de Directorios

```bash
src/
├── features/           # Dominios de negocio encapsulados
│   ├── cart/           # Lógica del carrito (Store, Componentes)
│   ├── products/       # Catálogo, Cards, Hooks de productos
│   └── home/           # Landing page y secciones principales
├── shared/             # Código reutilizable transversal
│   ├── components/ui/  # Design System (Button, inputs, etc.)
│   ├── components/layout/ # Header, Footer
│   ├── stores/         # Stores globales (Toast, UI)
│   └── utils/          # Helpers y validaciones
└── lib/                # Configuración de terceros (Supabase)
```

### Patrones Clave

- **State Management**: Zustand para manejo de estado global ligero y persistente.
- **Data Integrity**: Zod para validación estricta de esquemas en tiempo de ejecución.
- **Security**: Row Level Security (RLS) en Supabase para autorización a nivel de base de datos.
- **Accessibility (A11y)**: Cumplimiento de WCAG 2.1 (Foco visible, ARIA, navegación por teclado).

---

## 🚀 Guía de Instalación (Bun)

Este proyecto está optimizado para **[Bun](https://bun.sh)**. Asegúrate de tenerlo instalado.

### 1. Clonar el repositorio

```bash
git clone git@github.com:Alecwce/ryukamk-store.git
cd ryukamk.store-main
```

### 2. Variables de Entorno

Copia el archivo de ejemplo y configura tus credenciales de Supabase:

```bash
cp .env.example .env
```

_Asegúrate de llenar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`._

### 3. Instalar Dependencias

```bash
bun install
```

### 4. Ejecutar en Desarrollo

```bash
bun dev
```

_La aplicación estará disponible en `http://localhost:5174`_

---

## 🎨 Design System & Naming (Tailwind v4)

Utilizamos una convención semántica estricta para los tokens de diseño vinculados a la identidad de marca RYŪKAMI.

| Token Variable | Valor Hex | Uso Recomendado                            |
| :------------- | :-------- | :----------------------------------------- |
| `dragon-black` | `#0A0A0B` | Fondos principales, superficies oscuras    |
| `dragon-white` | `#F4F4F5` | Texto principal, fondos secundarios        |
| `dragon-fire`  | `#DC2626` | Colores de acento, errores, CTAs primarios |
| `dragon-gold`  | `#F59E0B` | Detalles premium, advertencias             |
| `dragon-cyan`  | `#06B6D4` | Elementos de tecnología, focus rings       |

**Ejemplo de uso:**

```tsx
<div className="bg-dragon-black text-dragon-white border-dragon-fire">
  RYŪKAMI
</div>
```

---

## 📚 Documentación Técnica

La documentación de funciones críticas se genera automáticamente mediante JSDoc.

### `CartStore` (Zustand)

El núcleo del e-commerce. Gestiona la persistencia del carrito y operaciones CRUD.

- **`addItem(item)`**: Añade un producto o incrementa cantidad. Valida con Zod `cartItemSchema`.
- **`removeItem(uniqueId)`**: Elimina por ID compuesto (`id-size-color`).
- **`updateQuantity(uniqueId, quantity)`**: Actualiza cantidad (min: 1).

_(Ver `src/features/cart/store/useCartStore.ts` para detalles completos)_

---

## 🤝 Tabla de Contribución

¡Tu código es bienvenido en el Dojo!

| Rol               | Responsable | GitHub                                 |
| :---------------- | :---------- | :------------------------------------- |
| **Lead Engineer** | Alecwce     | [@Alecwce](https://github.com/Alecwce) |
| **AI Agent**      | Antigravity | _System_                               |

### Flujo de Trabajo (Git Pro Human)

1. **Atomic Commits**: Un cambio lógico = Un commit.
2. **Conventional Commits**: Usa prefijos semánticos (`feat:`, `fix:`, `ui:`, `a11y:`).
   - _Ejemplo_: `a11y(header): add aria-labels to navigation buttons`
3. **No 'any'**: TypeScript strict mode es ley.

---

© 2026 RYŪKAMI Store. Code with Honor. 🐉
