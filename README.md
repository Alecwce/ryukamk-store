<div align="center">
  <h1>🐉 RYŪKAMI (龍神)</h1>
  <p><strong>Streetwear Premium: Estética Tradicional Japonesa & Alta Ingeniería Urbana</strong></p>

![Licencia](https://img.shields.io/badge/license-MIT-red?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 🎯 Visión

**RYŪKAMI** es una plataforma e-commerce de streetwear premium inspirada en la cultura japonesa, diseñada para el mercado peruano. Fusionamos la estética del _Dios Dragón_ (龍神) con la moda urbana moderna mediante un diseño **Glassmorphism Premium** y una infraestructura de datos **Zero Trust**.

> **Estado**: MVP funcional — catálogo dinámico, carrito reactivo, checkout, panel admin y autenticación.

---

## ✨ Características Premium

- **Diseño WOW**: Interfaz "Dark Mode First" con transiciones fluidas de Framer Motion y efectos de iluminación dinámica.
- **Glassmorphism**: Componentes con desenfoque de fondo optimizado (`backdrop-blur`) y bordes de cristal sutiles.
- **Rendimiento Staff**: Optimización obsesiva de Core Web Vitals y carga perezosa mediante **Bun** y **Vite**.

---

## 🛠️ Stack Tecnológico

| Categoría                | Tecnología                                            |
| :----------------------- | :---------------------------------------------------- |
| **Build Tool / Runtime** | [Vite 6](https://vitejs.dev/) + [Bun](https://bun.sh) |
| **Framework**            | React 18 + TypeScript estricto                        |
| **Estilos**              | Tailwind CSS v4 + PostCSS                             |
| **Animaciones**          | Framer Motion                                         |
| **Estado Global**        | Zustand                                               |
| **Server State**         | TanStack React Query                                  |
| **Backend / Auth**       | Supabase (PostgreSQL + Auth + Storage)                |
| **Validación**           | Zod                                                   |

---

## 🛡️ Estándares Staff (Engineering Skills)

Este repositorio utiliza un ecosistema de agentes y habilidades personalizadas para mantener la excelencia técnica:

1.  **Git-Humanizer**: Historial de commits con tono profesional humano y en español.
2.  **Supabase-Guardian**: Auditoría de seguridad Zero Trust y políticas RLS constantes.
3.  **A11y-Motion-Validator**: Garantía de accesibilidad en todas las micro-interacciones.
4.  **Zod-Contract-Sync**: Integridad total de contratos entre base de datos, API y UI.
5.  **Glassmorphism-Audit**: Validación de consistencia estética premium.
6.  **README-Architect**: Mantenimiento de documentación de alto impacto.

---

## � Inicio Rápido

### Requisitos

- [Bun](https://bun.sh) instalado (Recomendado).

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Alexwce/ryukamk-store.git
cd ryukamk-store

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

### Ejecución

```bash
bun dev          # Servidor de desarrollo
bun run build    # Build de producción
bun run typecheck # Verificación de tipos
```

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura **Feature-Based** optimizada para escalabilidad:

```text
src/
├── api/          # Clientes core (Supabase)
├── features/     # Módulos de dominio (admin, cart, home, products)
│   ├── [feature]/components    # UI específica del feature
│   ├── [feature]/store        # Estado (Zustand)
│   ├── [feature]/pages        # Páginas del módulo
│   └── [feature]/types        # Tipos locales
├── shared/       # Código compartido (UI Atómica, Layout, Utils)
├── hooks/        # Hooks globales reutilizables
└── lib/          # Logger y utilidades core
```

---

## 📚 Documentación Detallada

Para profundizar en la ingeniería del proyecto:

- [Arquitectura Técnica](docs/ARCHITECTURE.md)
- [Esquema de Base de Datos](docs/base-datos.md)
- [Requisitos y Alcance](docs/requisitos.md)

---

<div align="center">
  © 2025 RYŪKAMI. Creado con 🔥 por <strong>Alexwce</strong> en Perú 🇵🇪.
</div>
