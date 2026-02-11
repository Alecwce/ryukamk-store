# 📝 Registro de Decisiones de Arquitectura (ADR) - RYŪKAMI

Este documento registra las decisiones técnicas críticas tomadas durante el desarrollo de la plataforma, detallando el contexto, la justificación y las consecuencias.

---

## ADR 001: Uso de Bun como Runtime y Gestor de Paquetes

- **Estatus**: Aceptado
- **Fecha**: 2025-02-08

### Contexto

Necesitábamos un entorno de ejecución y gestión de dependencias que fuera rápido y eficiente para optimizar el ciclo de desarrollo (DX) y la velocidad de construcción (Build).

### Decisión

Adoptamos **Bun** en lugar de Node.js/NPM.

### Consecuencias

- **Positivas**: Instalaciones de dependencias hasta 20 veces más rápidas, ejecución de scripts optimizada y un ecosistema moderno.
- **Negativas**: Posibles incompatibilidades menores con paquetes antiguos que dependan estrictamente de APIs internas de Node.js.

---

## ADR 002: Tailwind CSS v4 para el Sistema de Estilos

- **Estatus**: Aceptado
- **Fecha**: 2025-02-08

### Contexto

Buscamos un sistema de diseño altamente personalizable que no comprometa el rendimiento de carga y que permita iteraciones visuales rápidas.

### Decisión

Usar **Tailwind CSS v4** con PostCSS.

### Consecuencias

- **Positivas**: Tamaño de CSS final mínimo (eliminación de clases no usadas), consistencia total mediante tokens de diseño y compatibilidad con las últimas funciones de CSS moderno.
- **Negativas**: Curva de aprendizaje inicial para desarrolladores no familiarizados con el enfoque _utility-first_.

---

## ADR 003: Zustand para la Gestión de Estado Global

- **Estatus**: Aceptado
- **Fecha**: 2025-02-08

### Contexto

El carrito de compras y la UI requieren un estado compartido. Redux se consideró demasiado pesado y boilerplate-heavy para las necesidades actuales.

### Decisión

Implementar **Zustand**.

### Consecuencias

- **Positivas**: API minimalistat, menos "boilerplate", alto rendimiento (evita re-renders innecesarios) y fácil integración con middlewares de persistencia.

---

## ADR 004: Framer Motion para Animaciones de Alta Fidelidad

- **Estatus**: Aceptado
- **Fecha**: 2025-02-08

### Contexto

La marca RYŪKAMI debe sentirse premium y lujosa. Las animaciones CSS estándar a veces resultan limitadas para micro-interacciones complejas.

### Decisión

Estandarizar el uso de **Framer Motion**.

### Consecuencias

- **Positivas**: Animaciones declarativas potentes, soporte para gestos (drag, hover, tap) y control total sobre el ciclo de vida de los componentes al entrar/salir del DOM.
- **Negativas**: Aumento ligero en el tamaño del bundle de JavaScript.

---

## ADR 005: Arquitectura de Componentes de Dominio (Modular Monolith)

- **Estatus**: Aceptado
- **Fecha**: 2025-02-08

### Contexto

A medida que la tienda crece, mezclar todos los componentes en una sola carpeta `components` genera desorden.

### Decisión

Organizar `src/components/` por dominios de negocio (ej. `cart/`, `products/`, `home/`).

### Consecuencias

- **Positivas**: Localización rápida de código, mejor encapsulación y facilidad para extraer micro-frontends en el futuro si fuera necesario.

---

## ADR 006: Supabase como Backend-as-a-Service (BaaS)

- **Estatus**: Aceptado
- **Fecha**: 2025-02-08

### Contexto

Necesitamos una base de datos robusta, autenticación y almacenamiento sin la sobrecarga de gestionar un servidor dedicado desde cero.

### Decisión

Utilizar **Supabase**.

### Consecuencias

- **Positivas**: Base de datos PostgreSQL real, APIs generadas automáticamente, sistema de Auth integrado y soporte nativo para Realtime.
