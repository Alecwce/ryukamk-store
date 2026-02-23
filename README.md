<![CDATA[# 🐉 RYŪKAMI (龍神) — Streetwear Japonés de Élite

[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**RYŪKAMI** es una plataforma e-commerce de streetwear premium inspirada en la cultura japonesa, diseñada para el mercado peruano. Fusionamos la estética del _Dios Dragón_ (龍神) con la moda urbana moderna.

> **Estado**: MVP funcional — catálogo dinámico, carrito reactivo, checkout, panel admin y autenticación.

---

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** ≥ 18 (o [Bun](https://bun.sh) como alternativa)
- Cuenta en [Supabase](https://supabase.com/) (para backend y auth)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ryukami-store.git
cd ryukami-store

# Instalar dependencias
npm install
# o con Bun: bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

### Variables de Entorno

```env
VITE_SUPABASE_URL=tu_project_url
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_MERCADOPAGO_PUBLIC_KEY=tu_public_key     # Opcional
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X      # Opcional
```

### Scripts Disponibles

| Comando              | Descripción                                  |
| :------------------- | :------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo con HMR (Vite)        |
| `npm run build`      | Build de producción                          |
| `npm run preview`    | Preview del build de producción              |
| `npm run lint`       | Linting con ESLint                           |
| `npm run typecheck`  | Verificación de tipos TypeScript             |

---

## 🎨 Diseño

Filosofía **Dark-First** con sensación de lujo y exclusividad.

| Token              | Valor       | Uso                           |
| :----------------- | :---------- | :---------------------------- |
| `Dragon Black`     | `#0A0A0B`   | Fondo principal               |
| `Dragon Fire`      | `#DC2626`   | Acentos, CTAs primarios       |
| `Dragon Gold`      | `#F59E0B`   | Detalles premium, highlights  |

- **Tipografía**: [Inter](https://fonts.google.com/specimen/Inter) (cuerpo) + [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (headings)
- **Animaciones**: Framer Motion — micro-interacciones, transiciones de página, efectos glare/glow
- **Fondo dinámico**: `ScrollNeonBackground` reactivo al scroll del usuario

---

## 🛠️ Stack Tecnológico

| Categoría          | Tecnología                                                       |
| :----------------- | :--------------------------------------------------------------- |
| **Build Tool**     | [Vite 6](https://vitejs.dev/)                                    |
| **Framework**      | React 18 + TypeScript estricto                                   |
| **Estilos**        | Tailwind CSS 4 (plugin Vite) + PostCSS                           |
| **Animaciones**    | Framer Motion                                                    |
| **Routing**        | React Router DOM                                                 |
| **Estado global**  | Zustand                                                          |
| **Server state**   | TanStack React Query                                             |
| **Backend / Auth** | Supabase (PostgreSQL + Auth + Storage)                           |
| **Validación**     | Zod                                                              |
| **SEO**            | React Helmet Async                                               |
| **Iconos**         | Lucide React                                                     |
| **Utilidades CSS** | clsx                                                             |
| **Error Handling** | React Error Boundary                                             |
| **Linting**        | ESLint 9 + typescript-eslint + react-hooks + react-refresh       |

---

## 📁 Arquitectura del Proyecto

El proyecto sigue una arquitectura **Feature-Based** (monolito modular) con una capa `shared` para código reutilizable.

```
src/
├── api/                        # Cliente API (Supabase)
│   └── supabase.ts
├── features/                   # Módulos de dominio
│   ├── admin/                  # Panel de administración
│   │   └── pages/
│   │       ├── AdminDashboard.tsx
│   │       └── LoginPage.tsx
│   ├── cart/                   # Carrito de compras
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── CheckoutPage.tsx
│   │   └── store/              # Estado del carrito (Zustand)
│   ├── home/                   # Landing page
│   │   ├── components/         # Hero, Featured, Newsletter, etc.
│   │   └── pages/
│   │       └── HomePage.tsx
│   └── products/               # Catálogo y detalle de productos
│       ├── components/         # ProductCard, ProductGrid, etc.
│       ├── data/               # Datos seed / mock
│       ├── pages/
│       │   ├── CatalogPage.tsx
│       │   └── ProductPage.tsx
│       ├── services/           # Lógica de negocio de productos
│       ├── store/              # Estado de productos (Zustand)
│       └── types/              # Tipos e interfaces de productos
├── shared/                     # Código compartido entre features
│   ├── components/
│   │   ├── layout/             # Header, Footer, MobileMenu, SEO, ProtectedRoute
│   │   └── ui/                 # Button, Badge, Toast, Skeleton, ErrorFallback,
│   │                           # OptimizedImage, ImageUpload, ScrollNeonBackground
│   ├── config/                 # Configuración global (payment, etc.)
│   ├── lib/                    # Logger y utilidades core
│   ├── stores/                 # Stores globales (Auth, Toast)
│   └── utils/                  # Validaciones (Zod) y helpers
├── App.tsx                     # Root component, routing, providers
├── main.tsx                    # Entry point
└── index.css                   # Estilos globales + Tailwind
```

---

## 🗺️ Rutas

| Ruta               | Página               | Acceso              |
| :------------------ | :------------------- | :------------------ |
| `/`                 | Landing Page (Home)  | Público             |
| `/productos`        | Catálogo             | Público             |
| `/producto/:id`     | Detalle de Producto  | Público             |
| `/checkout`         | Checkout             | Público             |
| `/admin-login`      | Login Admin          | Público             |
| `/admin-ryukami`    | Dashboard Admin      | Protegido (Auth)    |

---

## 🗄️ Base de Datos

Backend sobre **Supabase (PostgreSQL)** con las siguientes tablas principales:

- `products` — catálogo con categorías, stock, precios en Soles (S/.)
- `categories` — organización del catálogo con slugs para URLs amigables
- `orders` / `order_items` — gestión de pedidos con historial de precios
- `users` — perfiles de clientes (gestionados por Supabase Auth)

> Más detalle en [`docs/base-datos.md`](docs/base-datos.md).

---

## 📚 Documentación

| Documento                                                | Descripción                                      |
| :------------------------------------------------------- | :----------------------------------------------- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)           | Arquitectura técnica y diagramas Mermaid          |
| [`docs/requisitos.md`](docs/requisitos.md)               | Alcance, objetivos y criterios de aceptación      |
| [`docs/base-datos.md`](docs/base-datos.md)               | Esquema ERD y modelos de datos                    |
| [`docs/api.md`](docs/api.md)                             | Documentación de servicios API                    |
| [`docs/decisiones.md`](docs/decisiones.md)               | ADRs (Architecture Decision Records)              |
| [`docs/DIAGRAMS.md`](docs/DIAGRAMS.md)                   | Diagramas de flujo y componentes                  |
| [`docs/architecture_migration.md`](docs/architecture_migration.md) | Log de migración arquitectural          |
| [`AGENTS.md`](AGENTS.md)                                 | Instrucciones para agentes de IA                  |

---

## 📌 Estándares de Código

- **TypeScript estricto** — `any` prohibido. Se usa `unknown` + narrowing.
- **Validación de inputs** — Zod para toda entrada externa.
- **Error handling** — Nunca `catch {}` vacío. Error boundaries en rutas críticas.
- **Feature-Based** — Cada dominio agrupa sus componentes, stores, types y services.
- **Shared layer** — Componentes UI, stores globales y utilidades reutilizables.
- **Performance** — React Query para cache de server state. Lazy loading donde aplique.

> Para guías detalladas, consulta [`.agent/skills/ryukami-standards/SKILL.md`](.agent/skills/ryukami-standards/SKILL.md).

---

## 🤝 Contribución

1. Fork del repositorio
2. Crear branch: `git checkout -b feature/mi-feature`
3. Seguir los estándares documentados en `AGENTS.md` y el skill `ryukami-standards`
4. Asegurar que pasen `npm run typecheck` y `npm run lint`
5. Abrir Pull Request con descripción clara del cambio

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.

---

© 2025 RYŪKAMI. Creado con 🔥 por **alexwce** en Perú 🇵🇪.
]]>
