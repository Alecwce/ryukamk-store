# 🐉 RYŪKAMI — Auditoría Técnica Completa

> **Fecha**: 2026-02-22  
> **Auditor**: Antigravity Staff Engineer  
> **Alcance**: Estructura, arquitectura, dependencias, performance, seguridad y UX  
> **Proyecto**: RYŪKAMI Store (Vite 6 + React 18 + Supabase + TW4)

---

## 📊 Resumen Ejecutivo

| Área         | Score |                                 Estado                                 |
| :----------- | :---: | :--------------------------------------------------------------------: |
| Arquitectura | 7/10  |                 ✅ Sólida, feature-based bien aplicada                 |
| TypeScript   | 6/10  | ⚠️ Buen strict mode pero con fugas (`any`, `Record<string, unknown>`)  |
| Seguridad    | 5/10  |             🔴 RLS bien planteado pero con fugas críticas              |
| Performance  | 6/10  | ⚠️ React Query bien usado, pero hay work inútil y animaciones costosas |
| UX           | 7/10  |               ✅ Buena, con gaps en a11y y estados edge                |
| Testing      | 2/10  |                  🔴 Tests rotos, Vitest no instalado                   |
| DevOps       | 3/10  |                 🔴 Sin CI/CD, sin linting automatizado                 |

---

## 🔴 IMPACTO ALTO — Corregir inmediatamente

### 1. `FeaturedProducts` usa datos hardcodeados, no Supabase

**Archivo**: `src/features/products/components/FeaturedProducts.tsx`  
**Problema**: Tiene un array `products` local inline (IDs "1","2","3","4"). Ignora completamente la base de datos. Mientras que `CatalogPage` y `Header` sí usan `useQuery` + `ProductRepository`, esta sección muestra siempre los mismos 4 productos hardcodeados.

**Impacto**: El homepage muestra datos fake que no coinciden con el inventario real en Supabase.

```tsx
// ❌ Actual — hardcoded
const products = [
  { id: '1', name: 'Polo Dragon Basic', price: 49.90, ... },
  ...
];

// ✅ Fix — usar React Query como el resto del proyecto
const { data: products = [], isLoading } = useQuery({
  queryKey: ['products', 'featured'],
  queryFn: async () => {
    const data = await ProductRepository.getAll();
    return data.length > 0 ? data.slice(0, 4) : MOCK_PRODUCTS;
  },
  staleTime: 1000 * 60 * 5,
});
```

---

### 2. Newsletter no persiste en Supabase

**Archivo**: `src/features/home/components/Newsletter.tsx`  
**Problema**: El `handleSubmit` solo hace `setSubscribed(true)` local. Nunca llama a Supabase para insertar en la tabla `newsletter_subscribers` que sí existe en la DB.

**Impacto**: Se pierden todos los leads de marketing. La tabla existe pero nunca recibe datos.

```tsx
// ✅ Fix
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);
    if (error) throw error;
    setSubscribed(true);
    addToast("¡Bienvenido al clan! 🐉", "success");
  } catch (err) {
    addToast("Error al suscribirse. Intenta de nuevo.", "error");
  }
};
```

---

### 3. Seguridad Supabase — RLS `auth()` sin `(select ...)` wrapper

**Fuente**: Supabase Security/Performance Advisors  
**Problema**: **4 tablas** tienen policies que re-evalúan `auth.uid()` y `auth.jwt()` por cada fila en vez de una sola vez.

| Tabla                    | Policy                            |
| :----------------------- | :-------------------------------- |
| `newsletter_subscribers` | `Allow admin to view subscribers` |
| `orders`                 | `orders_select_policy`            |
| `order_items`            | `order_items_select_policy`       |
| `products`               | `products_admin_manage`           |

**Impacto**: Performance degradada en queries con muchas filas. El fix es trivial:

```sql
-- ❌ Actual
auth.jwt() ->> 'email' ~~ '%@ryukami.store'

-- ✅ Fix (evalúa una sola vez)
(select auth.jwt() ->> 'email') ~~ '%@ryukami.store'
```

---

### 4. Seguridad — Leaked Password Protection deshabilitada

**Fuente**: Supabase Security Advisor  
**Problema**: Supabase Auth no está verificando contraseñas contra HaveIBeenPwned.  
**Impacto**: Un admin podría usar una contraseña comprometida.  
**Fix**: Activar desde Dashboard → Authentication → Settings → Password Security.

---

### 5. Seguridad — `function_search_path_mutable` en `check_newsletter_rate`

**Fuente**: Supabase Security Advisor  
**Problema**: La función `public.check_newsletter_rate` no tiene `search_path` inmutable. Esto permite search_path injection.

```sql
-- ✅ Fix
ALTER FUNCTION public.check_newsletter_rate SET search_path = '';
```

---

### 6. Tests rotos — Vitest no instalado

**Archivos**: `src/features/cart/store/__tests__/useCartStore.test.ts`, etc.  
**Problema**: `typecheck` falla porque importan `vitest` pero no está en `devDependencies`. Los tests existen pero no se pueden ejecutar.

```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

### 7. `validation.ts` usa `any`

**Archivo**: `src/shared/utils/validation.ts:29`  
**Problema**: `(state: any)` viola la regla de TypeScript estricto del proyecto.

```tsx
// ❌
export const validateState = <T>(schema: z.ZodSchema<T>) => (state: any) => {

// ✅
export const validateState = <T>(schema: z.ZodSchema<T>) => (state: unknown) => {
```

---

## 🟡 IMPACTO MEDIO — Resolver esta semana

### 8. Query keys inconsistentes — Cache pollution

**Problema**: Múltiples componentes hacen `ProductRepository.getAll()` pero con keys diferentes:

- `Header.tsx` → `['products', 'featured']`
- `CatalogPage.tsx` → `['products', 'all']`
- `CartDrawer.tsx` → `['products', 'upselling']`
- `AdminDashboard.tsx` → `['products']`

**Impacto**: Cada componente hace su propio fetch al montar, **4 llamadas a Supabase** en vez de 1 compartida.

```tsx
// ✅ Fix — Centralizar en un custom hook
// src/features/products/hooks/useProducts.ts
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => ProductRepository.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}
```

---

### 9. `ProductCard` no es clickeable para navegar al detalle

**Archivo**: `src/features/products/components/ProductCard.tsx`  
**Problema**: El card solo tiene un botón "AÑADIR" y un corazón. No hay link al detalle del producto (`/producto/:id`). El usuario no puede ver la descripción, seleccionar talla/color, ni ver la galería.

**Impacto UX**: El funnel de compra está roto porque el usuario no accede al detalle de producto desde el grid.

```tsx
// ✅ Wrap con Link
import { Link } from 'react-router-dom';

// En el render, envolver la imagen y el nombre:
<Link to={`/producto/${id}`} className="block">
  <div className="relative aspect-square overflow-hidden ...">
    {/* imagen */}
  </div>
  <div className="p-4">
    <h3 ...>{name}</h3>
  </div>
</Link>
```

---

### 10. `CartDrawer` duplica lógica de cálculo de envío

**Archivo**: `src/features/cart/components/CartDrawer.tsx`  
**Problema**: Calcula envío inline (`getTotal() >= 99 ? 'GRATIS' : 'S/. 12.00'`) duplicando la lógica que ya existe en `getSummary()` del store.

```tsx
// ❌ Duplicado
S/. {(getTotal() + (getTotal() >= 99 ? 0 : 12)).toFixed(2)}

// ✅ Usar getSummary() que ya existe
const { subtotal, shipping, total } = getSummary();
```

---

### 11. Orders nunca se crean en Supabase

**Problema**: El flujo de checkout (`CheckoutPage.tsx`) solo abre WhatsApp y limpia el carrito. Nunca inserta un registro en la tabla `orders` ni `order_items`.

**Impacto**: No hay historial de pedidos, el admin no puede rastrear ventas, y la tabla `orders` está vacía.

```tsx
// ✅ Antes de abrir WhatsApp, persistir:
const { data: order, error } = await supabase
  .from("orders")
  .insert([{ total, status: "pending" }])
  .select()
  .single();

if (order) {
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
  }));
  await supabase.from("order_items").insert(orderItems);
}
```

---

### 12. `ScrollNeonBackground` — GPUcost innecesario

**Archivo**: `src/shared/components/ui/ScrollNeonBackground.tsx`  
**Problema**: 3 `motion.div` gigantes (600-800px) con `blur-[120px]` aplicados al scroll. Triggerean composite layers y GPU paint en cada frame.

**Impacto**: Jank notable en móviles de gama media/baja.

**Fix**: Agregar `will-change: transform` y considerar `@media (prefers-reduced-motion: reduce)` para desactivar en accesibilidad.

---

### 13. `ProductCard` — Animación infinita de `boxShadow` en CADA card

**Archivo**: `src/features/products/components/ProductCard.tsx:129-138`  
**Problema**: Cada `ProductCard` tiene un `motion.div` con animación `repeat: Infinity` de box-shadow. Con 20 productos, son 20 animaciones infinitas corriendo constantemente incluso fuera del viewport.

**Fix**: Activar solo en hover o usar CSS `animation-play-state: paused` por defecto y `running` en group-hover.

---

### 14. Datos de checkout persistidos en `localStorage` sin expiración

**Archivo**: `src/features/cart/store/useCheckoutStore.ts`  
**Problema**: Nombre, teléfono y dirección se persisten en `localStorage` via Zustand `persist`. Nunca expiran. Si otro usuario usa el mismo dispositivo, verá datos personales previos.

**Fix**: No persistir datos sensibles, o agregar un TTL de expiración.

---

## 🟢 IMPACTO BAJO — Backlog

### 15. `supabase.ts` — Fallback a placeholder credentials

**Archivo**: `src/api/supabase.ts:10-13`  
**Problema**: Si faltan env vars, crea un client con `'https://placeholder.supabase.co'`. Esto genera requests HTTP a un dominio inexistente en vez de fallar rápido.

```tsx
// ✅ Fail fast
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("RYŪKAMI: Supabase credentials missing.");
}
```

---

### 16. `ImageUpload` — File naming con `Math.random()`

**Archivo**: `src/shared/components/ui/ImageUpload.tsx:25`  
**Problema**: Los archivos se nombran con `Math.random().toString(36).substring(7)`. Riesgo mínimo de colisión y nombres no trazables.

```tsx
// ✅ Usar crypto
const fileName = `${crypto.randomUUID()}.${fileExt}`;
```

---

### 17. `ToastStore` — ID con `Math.random()`

**Archivo**: `src/shared/stores/useToastStore.ts:19`  
**Mismo problema** que arriba. Usar `crypto.randomUUID()`.

---

### 18. Products table — `multiple_permissive_policies`

**Fuente**: Supabase Performance Advisor  
**Problema**: La tabla `products` tiene 2 policies permissive para `authenticated` + `SELECT`: `products_admin_manage` (ALL) y `products_read_all` (public). Ambas se evalúan en cada SELECT de un usuario autenticado.

**Fix**: `products_read_all` debería excluir explícitamente a `authenticated` o refactorizar `products_admin_manage` para separar SELECT de INSERT/UPDATE/DELETE.

---

### 19. Sin Lazy Loading de rutas

**Archivo**: `src/App.tsx`  
**Problema**: Todas las páginas se importan sincrónicamente. `AdminDashboard`, `CheckoutPage`, `CatalogPage` se cargan en el bundle inicial aunque el usuario nunca las visite.

```tsx
// ✅ Fix
const AdminDashboard = lazy(
  () => import("@/features/admin/pages/AdminDashboard"),
);
const CheckoutPage = lazy(() => import("@/features/cart/pages/CheckoutPage"));
```

---

### 20. Sin `og-image.png` ni `favicon.png`

**Archivo**: `index.html` referencia `/og-image.png`, `/favicon.png`, `/apple-touch-icon.png`, `/manifest.json`  
**Pero**: No existen en `/public/`. Generan 404 en producción.

---

### 21. Sin manejo de stock en el carrito

**Problema**: Un usuario puede agregar 999 unidades de un producto con stock=5. No hay validación de stock al agregar al carrito ni al hacer checkout.

---

### 22. `eslint.config.js` sin regla de `no-console`

**Problema**: `console.error` y `console.warn` se usan directamente en producción en vez de pasar por el `logger`.

---

## 📋 Plan de Acción Priorizado

```
Semana 1 (Impacto Alto - Correctness)
├── [1] FeaturedProducts → usar useQuery + ProductRepository
├── [2] Newsletter → persistir en Supabase
├── [3] RLS policies → wrap con (select ...)
├── [4] Activar leaked password protection
├── [5] Fix search_path en check_newsletter_rate
├── [6] Instalar Vitest, arreglar tests
└── [7] Eliminar `any` de validation.ts

Semana 2 (Impacto Medio - Performance & UX)
├── [8]  Unificar query keys → custom hook useProducts
├── [9]  ProductCard → agregar Link al detalle
├── [10] CartDrawer → usar getSummary()
├── [11] Checkout → crear orders en Supabase
├── [12] ScrollNeonBackground → reduced-motion + will-change
├── [13] ProductCard → parar animación fuera de viewport
└── [14] CheckoutStore → no persistir datos sensibles

Semana 3 (Impacto Bajo - Polish)
├── [15] supabase.ts → fail fast sin placeholder
├── [16] ImageUpload → crypto.randomUUID()
├── [17] ToastStore → crypto.randomUUID()
├── [18] Products RLS → refactorizar permissive policies
├── [19] Lazy loading de rutas
├── [20] Assets faltantes (favicon, og-image, manifest)
├── [21] Validación de stock en carrito
└── [22] ESLint → agregar no-console
```

---

## 🏗️ Deuda Técnica Identificada

| ID    | Archivo                | Descripción                        |
| :---- | :--------------------- | :--------------------------------- |
| TD-01 | `FeaturedProducts.tsx` | Datos hardcodeados en vez de DB    |
| TD-02 | `Newsletter.tsx`       | No persiste subscribers            |
| TD-03 | `CartDrawer.tsx`       | Duplica lógica de envío            |
| TD-04 | `CheckoutPage.tsx`     | No crea orders en DB               |
| TD-05 | `validation.ts`        | Usa `any`                          |
| TD-06 | `supabase.ts`          | Placeholder fallback               |
| TD-07 | `App.tsx`              | Sin lazy loading                   |
| TD-08 | Tests                  | Vitest sin instalar, tests muertos |
| TD-09 | Query keys             | Inconsistentes entre componentes   |
| TD-10 | `ProductCard`          | Sin link al detalle                |

---

_Documento generado automáticamente. Revisar y priorizar con el equipo._
