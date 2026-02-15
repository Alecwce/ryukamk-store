# 🐉 RYŪKAMI — Diagnóstico CRO & UX Técnico

> **Fecha**: 2026-02-12
> **Versión analizada**: 1.0.0 (React + Vite + Supabase + TW4)
> **Objetivo**: Identificar fricciones que matan conversión y priorizar quick wins de alto impacto.

---

## 📊 Resumen Ejecutivo

El proyecto tiene una **base técnica sólida** (TanStack Query con cache unificado, Zod validation, lazy loading, skeleton states, Framer Motion). Sin embargo, hay **12 fricciones críticas** que están destruyendo conversiones silenciosamente.

| Severidad  | Cantidad | Descripción                                   |
| ---------- | -------- | --------------------------------------------- |
| 🔴 Crítico | 5        | Bloquean la compra directamente               |
| 🟡 Alto    | 4        | Generan abandono por desconfianza o confusión |
| 🟢 Medio   | 3        | Oportunidades perdidas de revenue             |

---

## 🔴 FRICCIONES CRÍTICAS (Bloquean Conversión)

### F-01: QR de Yape es un placeholder

**Archivo**: `src/shared/config/payment.ts` (línea 27)
**Impacto**: ⚡ FATAL — El usuario llega al checkout, ve un placeholder genérico "QR+YAPE+RYUKAMI" y pierde toda confianza. Abandono inmediato.

```ts
// ACTUAL — Placeholder que mata la venta
qrImageUrl: "https://via.placeholder.com/300x300.png?text=QR+YAPE+RYUKAMI",
bankAccounts: [] // Sin cuentas bancarias configuradas
```

**Quick Win**: Subir QR real a Supabase Storage y agregar al menos 1 cuenta bancaria.
**Esfuerzo**: 🟢 5 min | **Impacto**: 🔥🔥🔥🔥🔥

---

### F-02: CTA "EXPLORAR" en Hero abre WhatsApp genérico, no el catálogo

**Archivo**: `src/features/home/components/HeroSection.tsx` (línea 95-103)
**Impacto**: El segundo CTA del Hero lleva a WhatsApp con un número placeholder `51999999999` y un mensaje genérico. El usuario que quiere "explorar" espera ver productos, no WhatsApp.

```tsx
// ACTUAL — Abre un WhatsApp con número placeholder
<a href="https://wa.me/51999999999?text=..." target="_blank">
  <Button variant="outline">EXPLORAR</Button>
</a>
```

**Quick Win**: Cambiar a `<Link to="/productos">` para llevar al catálogo real.
**Esfuerzo**: 🟢 2 min | **Impacto**: 🔥🔥🔥🔥🔥

---

### F-03: Número de WhatsApp hardcodeado e inconsistente

**Archivos**: `HeroSection.tsx` (línea 96) y `Footer.tsx` (línea 65) usan `51999999999`, pero `payment.ts` usa `51981314450`.
**Impacto**: Si un user hace click en el WhatsApp del Hero o del Footer, cae a un número que no existe. Si logra llegar al checkout y usa WhatsApp desde ahí, va al número correcto. **Inconsistencia total en el canal de ventas.**

**Quick Win**: Centralizar el número de WhatsApp desde `PAYMENT_CONFIG.whatsappNumber` en todos los archivos.
**Esfuerzo**: 🟢 5 min | **Impacto**: 🔥🔥🔥🔥🔥

---

### F-04: Upselling en CartDrawer hardcodea talla "M" y color "Negro"

**Archivo**: `src/features/cart/components/CartDrawer.tsx` (línea 192-200)
**Impacto**: Al añadir un producto desde la sección de upselling "Completa tu look", se forza `size: 'M'` y `color: 'Negro'`. Si el usuario usa XL o quiere otro color, comprará algo incorrecto → **devoluciones y mal NPS**.

```tsx
// ACTUAL — Hardcoded
addItem({
  ...product,
  size: "M", // ← Asumido
  color: "Negro", // ← Asumido
  quantity: 1,
});
```

**Quick Win**: En lugar de agregar directo al carrito, navegar a `/producto/${product.id}` para que el usuario elija talla/color. O al menos usar el primer color/talla disponible del producto.
**Esfuerzo**: 🟡 15 min | **Impacto**: 🔥🔥🔥🔥

---

### F-05: ProductCard también hardcodea talla "M" y color "Negro"

**Archivo**: `src/features/products/components/ProductCard.tsx` (línea 58-66)
**Impacto**: Mismo problema que F-04 pero en TODOS los product cards del catálogo y productos destacados. **Cada "AÑADIR" rápido pone M/Negro sin opción.**

```tsx
addItem({
  id,
  name,
  price,
  image,
  size: "M", // ← Hardcoded
  color: "Negro", // ← Hardcoded
  quantity: 1,
});
```

**Quick Win**: Mostrar un mini-selector de talla/color en un popover al hacer click en "AÑADIR", o redirigir a la página de producto.
**Esfuerzo**: 🟡 30 min | **Impacto**: 🔥🔥🔥🔥

---

## 🟡 FRICCIONES DE CONFIANZA Y UX

### F-06: Footer tiene links rotos (`href="#"`)

**Archivo**: `src/shared/components/layout/Footer.tsx` (líneas 26-39, 82-84)
**Impacto**: 8 enlaces del footer apuntan a `#` (FAQ, Envíos, Cambios, Guía de Tallas, Productos, Novedades, Ofertas, Términos, Privacidad). Esto genera **desconfianza** — un e-commerce sin política de envíos ni FAQ parece poco serio.

**Quick Win**: Crear al menos páginas estáticas de FAQ y Política de Envíos con contenido real.
**Esfuerzo**: 🟡 1h | **Impacto**: 🔥🔥🔥

---

### F-07: Botón de Favoritos (Heart) en Header no abre nada

**Archivo**: `src/shared/components/layout/Header.tsx` (línea 201-218)
**Impacto**: El botón de favoritos muestra un badge con count, pero **no tiene `onClick`**. El usuario hace click y nada pasa. Feature muerta que genera frustración.

```tsx
// ACTUAL — Sin onClick
<motion.button
  className={`relative text-dragon-white...`}
  aria-label={`Ver favoritos, ${wishlistCount} items`}
>
  <Heart size={24} />
</motion.button>
// ← No hay onClick ni navegación
```

**Quick Win**: Agregar navegación a una vista de wishlist o como mínimo un dropdown/drawer con los favoritos.
**Esfuerzo**: 🟡 30 min | **Impacto**: 🔥🔥🔥

---

### F-08: El texto "**WhatsApp**" en Checkout se renderiza literalmente con asteriscos

**Archivo**: `src/features/cart/pages/CheckoutPage.tsx` (línea 259)
**Impacto**: El markdown `**WhatsApp**` dentro de un `<p>` tag no se renderiza como bold, se muestra como `**WhatsApp**` literalmente al usuario.

```tsx
// ACTUAL
<p className="text-xs text-dragon-white/70">
  Al hacer clic en el botón de abajo, se abrirá **WhatsApp** para que nos
  envíes...
</p>
```

**Quick Win**: Reemplazar con `<strong>WhatsApp</strong>`.
**Esfuerzo**: 🟢 1 min | **Impacto**: 🔥🔥

---

### F-09: Copyright dice "© 2025" en febrero 2026

**Archivo**: `src/shared/components/layout/Footer.tsx` (línea 80)
**Impacto**: Señal sutil de abandono del sitio. Parece que nadie lo mantiene.

**Quick Win**: Usar `new Date().getFullYear()` para que sea dinámico.
**Esfuerzo**: 🟢 1 min | **Impacto**: 🔥

---

## 🟢 OPORTUNIDADES DE REVENUE PERDIDAS

### F-10: FeaturedProducts muestra TODOS los productos, no una selección curada

**Archivo**: `src/features/products/components/FeaturedProducts.tsx` (línea 67)
**Impacto**: La home muestra los mismos 4 productos que el catálogo. No hay concepto de "destacado" o "bestseller". Pierde la oportunidad de promocionar los más rentables o de temporada.

**Quick Win**: Agregar campo `featured: boolean` a Product y filtrar con `select` en el query, o simplemente `.slice(0, 4)` si hay más productos.
**Esfuerzo**: 🟡 15 min | **Impacto**: 🔥🔥🔥

---

### F-11: Sin indicador de envío gratis en Product Cards

**Archivo**: `src/features/products/components/ProductCard.tsx`
**Impacto**: La lógica existe (`getTotal() >= 99 → GRATIS`) pero nunca se comunica en los cards individuales. El usuario no sabe que si compra S/. 99+ obtiene envío gratuito. Esto aumentaría ticket promedio fácilmente.

**Quick Win**: Agregar un badge "ENVÍO GRATIS" en productos ≥ S/. 99, o un banner sticky tipo "¡Te faltan S/. X para envío gratis!" en el CartDrawer.
**Esfuerzo**: 🟡 20 min | **Impacto**: 🔥🔥🔥🔥

---

### F-12: Sin social proof (testimonios / reviews reales)

**Archivos**: `ProductPage.tsx`, `Community.tsx`
**Impacto**: Los ratings y reviews existen en el type (`rating`, `reviewCount`) pero todos los mock products tienen `undefined`. La Community section usa fotos genéricas de Pexels. **Cero prueba social.**

**Quick Win**: Agregar ratings y reviews hardcodeados a los mock products como primer paso. Configurar el Instagram real de la marca.
**Esfuerzo**: 🟡 30 min | **Impacto**: 🔥🔥🔥

---

## 🏗️ ISSUES TÉCNICOS (No bloquean conversión pero afectan calidad)

### T-01: `optimizeDeps.exclude: ['lucide-react']` es innecesario y puede causar issues

**Archivo**: `vite.config.ts`
**Fix**: Remover la exclusión. Lucide-React funciona correctamente con la optimización de deps de Vite.

### T-02: `getTotal()` y `getItemCount()` son funciones derivadas que se recalculan en cada render

**Archivo**: `src/features/cart/store/useCartStore.ts`
**Fix**: Podrían ser getters computados o hooks derivados para evitar recálculos innecesarios.

### T-03: Emoji 🐉 como favicon/logo en producción

**Archivos**: `HeroSection.tsx`, `Header.tsx`, `Footer.tsx`
**Fix**: Usar un SVG/PNG real del logo de la marca para profesionalismo.

### T-04: Mobile UX — La búsqueda cubre el logo completamente

**Archivo**: `Header.tsx` (línea 83)
**Fix**: Mejorar la UX de búsqueda en mobile para que no oculte la identidad de marca.

---

## 📋 PRIORIZACIÓN (Quick Wins por Impacto → Esfuerzo)

| #   | Fricción                                         | Impacto    | Esfuerzo | ROI        |
| --- | ------------------------------------------------ | ---------- | -------- | ---------- |
| 1   | **F-01**: QR de Yape real + cuenta bancaria      | 🔴🔴🔴🔴🔴 | 5 min    | ⭐⭐⭐⭐⭐ |
| 2   | **F-02**: CTA "Explorar" → catálogo              | 🔴🔴🔴🔴🔴 | 2 min    | ⭐⭐⭐⭐⭐ |
| 3   | **F-03**: WhatsApp número unificado              | 🔴🔴🔴🔴🔴 | 5 min    | ⭐⭐⭐⭐⭐ |
| 4   | **F-08**: Markdown literal en checkout           | 🟡🟡       | 1 min    | ⭐⭐⭐⭐⭐ |
| 5   | **F-09**: Copyright dinámico                     | 🟡         | 1 min    | ⭐⭐⭐⭐   |
| 6   | **F-11**: Banner "envío gratis" en cart          | 🟢🟢🟢🟢   | 20 min   | ⭐⭐⭐⭐   |
| 7   | **F-07**: Wishlist botón funcional               | 🟡🟡🟡     | 30 min   | ⭐⭐⭐⭐   |
| 8   | **F-04/F-05**: Selector talla/color en quick-add | 🔴🔴🔴🔴   | 30 min   | ⭐⭐⭐     |
| 9   | **F-10**: Productos featured curados             | 🟢🟢🟢     | 15 min   | ⭐⭐⭐     |
| 10  | **F-12**: Social proof / reviews                 | 🟢🟢🟢     | 30 min   | ⭐⭐⭐     |
| 11  | **F-06**: Footer links reales                    | 🟡🟡🟡     | 1h       | ⭐⭐       |

---

## 🎯 PLAN DE ACCIÓN RECOMENDADO

### Fase 1: "Emergency Fixes" (< 30 min total)

> Impacto inmediato en ventas. Hacer HOY.

- [ ] F-01: Configurar QR real y número de cuenta
- [ ] F-02: CTA "Explorar" → Link al catálogo
- [ ] F-03: Centralizar WhatsApp desde `PAYMENT_CONFIG`
- [ ] F-08: Corregir markdown literal
- [ ] F-09: Copyright dinámico

### Fase 2: "Boost Revenue" (1-2 horas)

> Aumenta ticket promedio y engagement.

- [ ] F-11: Progress bar de envío gratis en CartDrawer
- [ ] F-07: Funcionalidad de wishlist
- [ ] F-04/F-05: Quick-add con selector de variantes

### Fase 3: "Trust Building" (3-4 horas)

> Construye confianza y reduce objeciones.

- [ ] F-06: Páginas reales de FAQ, Envíos, Cambios
- [ ] F-10: Sistema de productos destacados
- [ ] F-12: Reviews y social proof

---

> **Nota del diagnóstico**: La arquitectura técnica está bien diseñada. TanStack Query con cache unificado, validación Zod, lazy loading y skeleton states son prácticas modernas y correctas. El problema NO es técnico sino de **configuración de negocio** (datos placeholder, links muertos, features a medio implementar). La Fase 1 debería resolverse inmediatamente porque son ventas que se están perdiendo ahora mismo.
