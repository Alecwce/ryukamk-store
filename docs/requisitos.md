# 📋 Requisitos del Proyecto - RYŪKAMI

Este documento define el alcance, los objetivos y las fronteras técnicas del proyecto RYŪKAMI.

---

## 🎯 Objetivo del Proyecto

El objetivo principal de **RYŪKAMI** es establecer una plataforma de e-commerce de streetwear premium que combine la estética tradicional japonesa con la moda urbana contemporánea, ofreciendo una experiencia de usuario excepcional y visualmente impactante para el mercado peruano.

### Objetivos Específicos:

1.  **Diferenciación Visual**: Implementar un diseño "Dark Mode First" con animaciones de alta fidelidad que transmitan exclusividad.
2.  **Rendimiento Superior**: Garantizar tiempos de carga mínimos y una interactividad fluida (Core Web Vitals óptimos) mediante el uso de **Bun** y **Vite**.
3.  **Conversión Mobile**: Optimizar la experiencia móvil para capturar el tráfico predominante del sector retail en Perú.

---

## 🛠️ Funcionalidades Principales (MVP+)

### 1. Catálogo de Productos Dinámico

- Visualización de productos en grid responsive.
- Hover effects premium con previsualización y sombras dinámicas.
- Categorización y etiquetado (ej. "Summer Collection").

### 2. Sistema de Carrito de Compras

- Estado global reactivo mediante **Zustand**.
- Drawer lateral animado para gestión de productos.
- Lógica de actualización de cantidades y eliminación en tiempo real.
- Cálculo automático de totales y sub-totales.

### 3. Experiencia de Usuario (UX/UI)

- Animaciones de entrada (`Framer Motion`) en todas las secciones.
- Micro-interacciones en botones y elementos clicables.
- Diseño totalmente responsivo (Adaptación a Mobile, Tablet y Desktop).

### 4. Componentes de Conversión

- Sección de comunidad (UGC) para generar confianza.
- Newsletter para retención de clientes.
- Hero interactivo con llamada a la acción (CTA) clara.

---

## 🚫 Limitaciones y Alcance Actual

### 1. Persistencia de Datos

- **Limitación**: Actualmente, el carrito se gestiona en memoria volátil.
- _Nota_: La persistencia en `localStorage` o base de datos (Supabase) está planificada para la siguiente fase.

### 2. Procesamiento de Pagos

- **Limitación**: El proyecto no procesa transacciones reales en esta fase.
- _Nota_: Se requiere la integración de un SDK como MercadoPago o Culqi para el checkout final.

### 3. Autenticación

- **Limitación**: No existe un portal de usuario o sistema de perfiles activo.
- _Nota_: Supabase Auth es la solución elegida para la integración futura.

### 4. Gestión de Inventario

- **Limitación**: Los productos están definidos de forma estática en el frontend.
- _Nota_: Se requiere un CMS o panel administrativo para la gestión dinámica por parte del negocio.

---

## 📈 Criterios de Aceptación

- El proyecto debe pasar `bun run build` y `bun run typecheck` sin errores.
- Todas las animaciones deben ejecutarse a 60fps sin tirones visuales.
- El diseño debe mantenerse íntegro en resoluciones desde 320px hasta 4K.
