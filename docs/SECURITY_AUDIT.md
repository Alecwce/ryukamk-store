# 🛡️ Auditoría de Seguridad, Estabilidad y Deuda Técnica — RYŪKAMI Store

> **Fecha:** 2026-02-11  
> **Auditor:** Staff Engineer  
> **Scope:** Full-stack audit (Frontend React + Supabase Backend)  
> **Versión del Proyecto:** 1.0.0

---

## 📊 Resumen Ejecutivo

| Dimensión         | Score |              Estado               |
| ----------------- | :---: | :-------------------------------: |
| **Seguridad**     | 5/10  |   🔴 Requiere acción inmediata    |
| **Estabilidad**   | 7/10  | 🟡 Buena base, mejoras necesarias |
| **Deuda Técnica** | 6/10  |    🟡 Manejable pero creciente    |

---

## 🔴 CRÍTICOS — Acción Inmediata (Impacto directo en confianza y conversión)

### SEC-001: `console.error` directo en producción — `ImageUpload.tsx:42`

- **Severidad:** 🔴 ALTA
- **Impacto:** Fuga de información técnica al usuario. Stack traces visibles en DevTools en producción.
- **Ubicación:** `src/shared/components/ui/ImageUpload.tsx:42`
- **Detalle:** `console.error('Error uploading image:', error)` se ejecuta en producción, exponiendo mensajes de error de Supabase Storage al inspector del navegador.
- **Fix:** Reemplazar por `logger.error()` que ya existe y filtra por `import.meta.env.DEV`.

### SEC-002: `console.error` directo en producción — `useCartStore.ts:97`

- **Severidad:** 🔴 ALTA
- **Impacto:** Mismo patrón. Fuga de datos de validación Zod al inspector.
- **Ubicación:** `src/features/cart/store/useCartStore.ts:97`
- **Fix:** Reemplazar por `logger.error()`.

### SEC-003: RLS Policy `newsletter_subscribers` — INSERT sin restricción

- **Severidad:** 🔴 ALTA
- **Impacto:** `WITH CHECK (true)` en INSERT permite a cualquier anónimo insertar filas sin límite. **Vector de spam/DDoS** a la tabla `newsletter_subscribers`. Un bot puede llenar la DB con millones de filas.
- **Fuente:** Supabase Security Advisor
- **Fix:** Agregar rate limiting via Edge Function o agregar una policy con restricción temporal (`now() - subscribed_at > interval '1 minute'`).

### SEC-004: Leaked Password Protection deshabilitado en Supabase Auth

- **Severidad:** 🔴 ALTA
- **Impacto:** Las contraseñas de admin pueden ser contraseñas ya filtradas en brechas de datos conocidas (HaveIBeenPwned). Si un atacante obtiene credenciales filtradas, accede al panel admin.
- **Fix:** Habilitar en Supabase Dashboard → Auth → Password & Security → "Enable leaked password protection".
- **Referencia:** [Supabase Docs](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

### SEC-005: Autorización admin basada solo en dominio de email (client-side)

- **Severidad:** 🔴 ALTA
- **Impacto:** `ProtectedRoute.tsx` valida que el email termine en `@ryukami.store`, pero esta validación es **puramente frontend**. Cualquier usuario autenticado con otro email puede hacer queries directas a la API de Supabase (ej: `INSERT`, `UPDATE`, `DELETE` en `products`) si las RLS policies del backend no replican esta restricción de dominio.
- **Detalle:** La policy `Allow admin to manage products` en Supabase probablemente usa `auth.uid()` pero no verifica el dominio del email. Necesita verificarse la policy exacta.
- **Fix:** La RLS policy de `products` para operaciones CUD debe usar: `(select auth.jwt() ->> 'email') LIKE '%@ryukami.store'` o un sistema de roles/claims en Supabase.

---

## 🟠 IMPORTANTES — Prioridad Alta (Impacto en estabilidad y rendimiento)

### STAB-001: Memory leak en `useAuthStore.initialize()`

- **Severidad:** 🟠 MEDIA-ALTA
- **Impacto:** La suscripción `onAuthStateChange()` nunca se desuscribe. Cada vez que se llama `initialize()`, se apila un nuevo listener. Si por algún edge case el componente se remonta, los listeners se acumulan.
- **Ubicación:** `src/shared/stores/useAuthStore.ts:32`
- **Fix:** Guardar el `subscription` y retornar cleanup:

```ts
const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
// Almacenar para poder unsubscribe si se re-inicializa
```

### STAB-002: `ImageUpload.tsx` — Sin validación de tamaño/tipo de archivo

- **Severidad:** 🟠 MEDIA-ALTA
- **Impacto:** Acepta `image/*` sin límite de tamaño. Un archivo de 500MB crashea la experiencia del admin, consume ancho de banda y llena el bucket de Storage rápidamente.
- **Ubicación:** `src/shared/components/ui/ImageUpload.tsx:55-60`
- **Fix:** Agregar `maxSize: 5 * 1024 * 1024` (5MB) y `accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] }` en `useDropzone()`.

### STAB-003: `ImageUpload.tsx` — Nombre de archivo inseguro

- **Severidad:** 🟠 MEDIA
- **Impacto:** El nombre del archivo se genera con `Math.random().toString(36).substring(7)`. Esto genera colisiones probables (solo ~6 caracteres alfanuméricos). Además, la extensión se extrae con `.split('.').pop()` que puede ser manipulada.
- **Ubicación:** `src/shared/components/ui/ImageUpload.tsx:24-26`
- **Fix:** Usar `crypto.randomUUID()` para el nombre y validar la extensión contra una whitelist.

### PERF-001: RLS policies con `auth.<function>()` sin `(select ...)` wrapper

- **Severidad:** 🟠 MEDIA
- **Impacto:** Las policies de `products`, `orders` y `order_items` re-evalúan `auth.uid()` o `auth.jwt()` **por cada fila**. Esto degrada rendimiento significativamente a escala.
- **Fuente:** Supabase Performance Advisor (4 warnings)
- **Fix:** Reemplazar `auth.uid()` con `(select auth.uid())` en todas las RLS policies.
- **Referencia:** [Supabase RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select)

### PERF-002: Foreign keys sin índice en `order_items`

- **Severidad:** 🟠 MEDIA
- **Impacto:** `order_items.order_id` y `order_items.product_id` no tienen índices. Cuando crezcan los pedidos, los JOINs serán lentos.
- **Fuente:** Supabase Performance Advisor (3 warnings)
- **Fix:** Crear índices:

```sql
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
```

### PERF-003: Extensión `vector` instalada en schema `public`

- **Severidad:** 🟡 BAJA-MEDIA
- **Impacto:** Tabla `documents` con pgvector está en `public`, exponiendo la extensión. Si no se usa activamente, también agrega peso innecesario.
- **Fix:** Mover a un schema dedicado (`extensions`) o eliminar si no se usa.

---

## 🟡 DEUDA TÉCNICA — Prioridad Media

### DEBT-001: Datos personales del checkout persistidos en `localStorage` sin cifrar

- **Severidad:** 🟡 MEDIA
- **Impacto en conversión:** Si un usuario comparte dispositivo, los datos de envío del cliente anterior son visibles. Violación de privacidad y potencial problema legal (LPDP Perú, Ley 29733).
- **Ubicación:** `src/features/cart/store/useCheckoutStore.ts` — usa `persist` middleware de Zustand que guarda `name`, `phone`, `address` en claro en `localStorage` bajo key `ryukami-checkout-storage`.
- **Fix:** Eliminar la persistencia de datos personales del checkout, o cifrarlos con una storage personalizada.

### DEBT-002: Doble definición del schema de validación `productSchema`

- **Severidad:** 🟡 BAJA-MEDIA
- **Impacto:** El schema Zod de producto está definido dos veces de forma diferente:
  1. `product.repository.ts:7-17` — para datos de Supabase
  2. `AdminDashboard.tsx:98-107` — para el formulario admin
- **Fix:** Crear un schema unificado en `src/features/products/types/schemas.ts` y derivar los otros con `.pick()`, `.omit()`, `.extend()`.

### DEBT-003: `PAYMENT_CONFIG` con datos placeholder en producción

- **Severidad:** 🟡 MEDIA
- **Impacto en conversión:** Las cuentas bancarias muestran `191-XXXXXXXX-X-XX` y `200-XXXXXXXXXX`. El QR de Yape apunta a un placeholder de `via.placeholder.com`. Si un cliente llega al checkout, verá datos falsos y perderá confianza. **Esto mata conversión directamente.**
- **Ubicación:** `src/shared/config/payment.ts:29-41` y línea 27.
- **Fix:** Reemplazar con datos reales antes de ir a producción. Considerar mover a variables de entorno.

### DEBT-004: Componente `AdminDashboard.tsx` — 483 líneas, God Component

- **Severidad:** 🟡 MEDIA
- **Impacto:** Mantenibilidad baja. Mezcla lógica de formulario, listado, mutaciones y UI en un solo archivo.
- **Fix:** Extraer en: `ProductForm.tsx`, `ProductList.tsx`, `useProductMutations.ts`.

### DEBT-005: `ProductPage.tsx` — SIZES y COLORS hardcodeados

- **Severidad:** 🟡 BAJA-MEDIA
- **Impacto:** `const SIZES = ['S', 'M', 'L', 'XL']` y `const COLORS = ['Negro', 'Blanco', 'Gris']` están hardcodeados. No son dinámicos según el producto real.
- **Fix:** Agregar `sizes: string[]` al tipo `Product` y traerlo de Supabase.

### DEBT-006: Error monitoring sin implementar (Sentry/equivalente)

- **Severidad:** 🟡 MEDIA
- **Impacto:** El `logger.ts` tiene un `// TODO: Integrate Sentry here`. En producción, los errores se tragan silenciosamente. Si un usuario tiene un error en el checkout, **no te enteras**.
- **Fix:** Integrar Sentry o LogRocket para capturar errores en producción.

### DEBT-007: Múltiples políticas permisivas para `products` tabla

- **Severidad:** 🟡 BAJA
- **Impacto:** `products` tiene `Allow admin to manage products` Y `Allow public read access to products` ambas permisivas para `authenticated` + `SELECT`. Supabase evalúa ambas innecesariamente.
- **Fix:** Consolidar en una sola policy o usar `restrictive` para la admin.

### DEBT-008: `queryKey` inconsistente entre catálogo y admin

- **Severidad:** 🟡 BAJA
- **Impacto:** `CatalogPage` usa `['products', 'all']` mientras `AdminDashboard` usa `['products']`. Esto puede causar que las invalidaciones del admin no refresquen el catálogo público y viceversa.
- **Fix:** Unificar queryKeys en un archivo central `src/shared/lib/queryKeys.ts`.

---

## ✅ LO QUE ESTÁ BIEN (Fortalezas)

| Área                       | Detalle                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Validación Zod**         | Input validation consistente en checkout, carrito y admin. El `cartItemSchema` previene datos corruptos en el store. |
| **RLS habilitado**         | Todas las tablas (`products`, `orders`, `order_items`, `newsletter_subscribers`, `documents`) tienen RLS activado.   |
| **ErrorBoundary**          | Las rutas críticas (`/producto/:id`, `/checkout`, `/admin-ryukami`) están envueltas en `<ErrorBoundary>`.            |
| **TanStack Query**         | Data fetching correctamente migrado a useQuery/useMutation. staleTime y gcTime configurados.                         |
| **Logger abstracto**       | Existe `logger.ts` que filtra logs por entorno. Falta integrarlo consistentemente.                                   |
| **Test coverage parcial**  | Tests unitarios para `useCartStore` (8 tests), `useWishlistStore` (4 tests), y `checkoutSchema` (6 tests).           |
| **SEO**                    | Meta tags, Open Graph, Twitter Cards, semántica HTML correcta.                                                       |
| **`.env` en `.gitignore`** | Las credenciales no se commitean al repositorio.                                                                     |
| **TypeScript strict**      | Sin `any` en todo el codebase ✅ (verificado con grep).                                                              |
| **Sin `console.log`**      | No hay `console.log` basura en el código fuente ✅.                                                                  |

---

## 🎯 Plan de Acción Priorizado (por impacto en confianza y conversión)

### 🔥 Sprint 1 — Esta semana (Crítico)

| #   | Acción                                                   | Impacto                                              | Esfuerzo |
| --- | -------------------------------------------------------- | ---------------------------------------------------- | -------- |
| 1   | **SEC-004**: Habilitar leaked password protection        | Previene acceso admin con contraseñas comprometidas  | 5 min    |
| 2   | **DEBT-003**: Reemplazar datos placeholder de pago       | Clientes ven datos reales en checkout → confianza 🚀 | 15 min   |
| 3   | **SEC-001/002**: Migrar `console.error` → `logger.error` | Evitar fuga de info técnica                          | 10 min   |
| 4   | **SEC-003**: Rate-limit newsletter INSERT policy         | Prevenir spam/DDoS a la tabla                        | 30 min   |
| 5   | **SEC-005**: Verificar/hardening RLS policy de admin     | Prevenir mutaciones no autorizadas a `products`      | 45 min   |

### ⚡ Sprint 2 — Próxima semana (Estabilidad)

| #   | Acción                                                          | Impacto                                | Esfuerzo |
| --- | --------------------------------------------------------------- | -------------------------------------- | -------- |
| 6   | **STAB-001**: Fix memory leak auth listener                     | Estabilidad del SPA a largo plazo      | 20 min   |
| 7   | **STAB-002/003**: Validación de imagen (tamaño + nombre seguro) | Prevenir abuso del storage             | 30 min   |
| 8   | **PERF-001**: Optimizar RLS con `(select auth.uid())`           | Performance a escala                   | 30 min   |
| 9   | **PERF-002**: Crear índices para foreign keys                   | Queries rápidas cuando crezcan pedidos | 10 min   |
| 10  | **DEBT-001**: Eliminar persistencia de datos personales         | Compliance legal (LPDP Perú)           | 15 min   |

### 🧹 Sprint 3 — Mejoras (Deuda técnica)

| #   | Acción                                        | Impacto                              | Esfuerzo |
| --- | --------------------------------------------- | ------------------------------------ | -------- |
| 11  | **DEBT-006**: Integrar Sentry                 | Visibilidad de errores en producción | 2h       |
| 12  | **DEBT-004**: Refactorizar AdminDashboard     | Mantenibilidad del código            | 2h       |
| 13  | **DEBT-002**: Unificar schemas Zod            | Consistencia de validación           | 1h       |
| 14  | **DEBT-008**: Centralizar queryKeys           | Cahcé consistente entre vistas       | 30 min   |
| 15  | **DEBT-005**: Sizes/Colors dinámicos desde DB | Feature completeness                 | 1h       |

---

> **Nota:** Los ítems del Sprint 1 son **bloqueantes para un lanzamiento público**. Los ítems 1 y 2 los puedes resolver literalmente en 20 minutos y tienen el mayor ROI posible.
