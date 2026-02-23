---
name: git-humanizer
description: Genera mensajes de commit en español natural (humano) y realiza el commit/push. Evita patrones típicos de IA y traduce tecnicismos a un lenguaje profesional pero cercano. Úsalo cuando el usuario pida guardar cambios, hacer commit o subir código.
---

# 🤖 Git Humanizer

## Resumen

Este skill transforma la interacción con Git para que el historial sea indistinguible del trabajo de un senior engineer humano local. Elimina los "AI-isms" y unifica el idioma al español.

## Workflow

### 1. Análisis de cambios

- Revisa el `git diff` para entender la intención real, no solo los archivos cambiados.
- Categoriza el cambio: Correctivo, Evolutivo, Refactorización, Documentación.

### 2. Generación del Mensaje

- **Idioma**: Español técnico natural.
- **Tono**: Profesional, pero evita redundancias tipo "Refactorizado para mejorar..." (obvio).
- **Formato**:
  - Título: Máximo 50 caracteres, imperativo (ej: "Añade", "Corrige", "Actualiza").
  - (Opcional) Cuerpo: Explica el "por qué", no el "qué" (el qué está en el diff).

## Guía de Estilo Humano vs IA

| Contexto | Mensaje Típico IA (Evitar)                  | Mensaje Humano RYŪKAMI                   |
| :------- | :------------------------------------------ | :--------------------------------------- |
| Bugfix   | "Fixed bug in cart logic to prevent crash"  | "Evita crash en el carrito al vaciarlo"  |
| Refactor | "Refactored checkout component for SOLID"   | "Limpieza de props en CheckoutPage"      |
| Feature  | "Implemented new product filtering feature" | "Filtros por categoría en catálogo"      |
| Docs     | "Updated documentation for clarity"         | "Detalla flujo de pago en requisitos.md" |

## Scripts Disponibles

- `scripts/git-humanize.ps1`: Script de PowerShell para automatizar el ciclo de `add .`, `commit` con mensaje humanizado y `push`.

## Referencias

- `references/commit-patterns.md`: Listado extendido de patrones de mensajes.
