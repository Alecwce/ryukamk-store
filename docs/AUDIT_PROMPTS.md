# 🐉 RYŪKAMI — Prompts de Corrección (AUDIT.md)

> **Instrucciones**: Copia y pega cada prompt en tu agente de IA para ejecutar la corrección correspondiente. Están ordenados por prioridad (alto → medio → bajo). Cada prompt es autocontenido y da contexto suficiente para la corrección.

---

## 🔴 IMPACTO ALTO — Semana 1

---

### Prompt #1 — FeaturedProducts: Reemplazar datos hardcodeados por Supabase

```
En `src/features/products/components/FeaturedProducts.tsx` hay un array `products` hardcodeado con 4 productos fake (IDs "1","2","3","4"). Esto hace que el home siempre muestre datos estáticos ignorando la base de datos.

Refactoriza el componente para que use `useQuery` de TanStack React Query + `ProductRepository.getAll()` (de `src/features/products/services/product.repository.ts`) para traer los productos reales de Supabase. Limita a los primeros 4 resultados con `.slice(0, 4)`. Si la DB no devuelve datos, usa `MOCK_PRODUCTS` de `src/features/products/data/mockProducts.ts` como fallback.

Mantén el `memo()`, el `displayName`, las animaciones de framer-motion y toda la estructura visual actual del componente. Solo cambia el origen de datos.

Usa la query key `['products']` para compartir caché con el resto del proyecto. Agrega un skeleton loader mientras carga.
```

---

### Prompt #2 — Newsletter: Persistir suscripciones en Supabase

```
En `src/features/home/components/Newsletter.tsx` el `handleSubmit` solo hace `setSubscribed(true)` localmente sin persistir el email en Supabase. La tabla `newsletter_subscribers` ya existe en la DB con columnas (id uuid, email text UNIQUE, subscribed_at timestamptz).

Modifica `handleSubmit` para:
1. Importar `supabase` de `@/api/supabase` y `useToastStore` de `@/shared/stores/useToastStore`.
2. Hacer un `supabase.from('newsletter_subscribers').insert([{ email }])` dentro de un try/catch.
3. Si hay error (incluyendo duplicado), mostrar un toast de error apropiado.
4. Si tiene éxito, mostrar el toast de éxito y el estado `subscribed`.
5. Manejar el estado de loading con un estado `isSubmitting` para deshabilitar el botón durante la petición.

No modifiques la estructura visual ni las animaciones existentes. Solo agrega la lógica de persistencia.
```

---

### Prompt #3 — RLS Policies: Optimizar con `(select ...)`

```
Necesito optimizar las RLS policies de mi proyecto Supabase (project_id: suygiakmwizhyjcrsqpg). El Supabase Performance Advisor reporta que `auth.jwt()` y `auth.uid()` se re-evalúan por cada fila en las siguientes policies:

1. `newsletter_subscribers` → policy `Allow admin to view subscribers`
2. `orders` → policy `orders_select_policy`
3. `order_items` → policy `order_items_select_policy`
4. `products` → policy `products_admin_manage`

Para cada una, necesito hacer DROP de la policy actual y recrearla envolviendo las llamadas a `auth.jwt()` y `auth.uid()` con `(select ...)`. Por ejemplo:
- `auth.jwt() ->> 'email'` → `(select auth.jwt() ->> 'email')`
- `auth.uid()` → `(select auth.uid())`

Aplica esto como una migración SQL usando el MCP de Supabase. Preserva exactamente la misma lógica de cada policy, solo agrega los wrappers `(select ...)`.
```

---

### Prompt #4 — Activar Leaked Password Protection

```
En mi proyecto Supabase (project_id: suygiakmwizhyjcrsqpg), el Security Advisor reporta que "Leaked Password Protection" está deshabilitada.

Busca en la documentación de Supabase cómo activar la protección contra contraseñas filtradas (HaveIBeenPwned integration) y dame las instrucciones paso a paso para activarla desde el Dashboard de Supabase. Ruta esperada: Authentication → Settings → Password Security.
```

---

### Prompt #5 — Fix search_path en función `check_newsletter_rate`

````
En mi proyecto Supabase (project_id: suygiakmwizhyjcrsqpg), el Security Advisor reporta que la función `public.check_newsletter_rate` tiene un search_path mutable, lo cual es un riesgo de seguridad.

Aplica una migración SQL que haga:
```sql
ALTER FUNCTION public.check_newsletter_rate() SET search_path = '';
````

Usa el MCP de Supabase para aplicar la migración con nombre `fix_newsletter_rate_search_path`.

```

---

### Prompt #6 — Instalar Vitest y arreglar tests

```

El proyecto RYŪKAMI tiene 3 archivos de test que importan `vitest` pero el paquete no está instalado:

- `src/features/cart/store/__tests__/useCartStore.test.ts`
- `src/features/products/store/__tests__/useWishlistStore.test.ts`
- `src/shared/utils/__tests__/validation.test.ts`

Esto causa que `bun run typecheck` falle.

1. Instala las dependencias de testing: `bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom`
2. Verifica que `vite.config.ts` ya tiene la configuración de test (globals: true, environment: 'jsdom') — ya la tiene.
3. Agrega el script `"test": "vitest"` y `"test:run": "vitest run"` en `package.json`.
4. Revisa cada test file, asegúrate de que compilen correctamente y que los imports sean válidos.
5. Ejecuta `bun run typecheck` para confirmar que pasa.

```

---

### Prompt #7 — Eliminar `any` de `validation.ts`

```

En `src/shared/utils/validation.ts` línea 29, la función `validateState` usa `(state: any)` lo cual viola la regla de TypeScript estricto del proyecto (`any` prohibido).

Cambia el parámetro de `any` a `unknown`. La función solo hace `schema.safeParse(state)`, y Zod acepta `unknown` como input para `safeParse`, así que el cambio es directo y no rompe nada.

Solo modifica esa línea, no toques nada más del archivo.

```

---

## 🟡 IMPACTO MEDIO — Semana 2

---

### Prompt #8 — Unificar query keys con custom hook

```

En el proyecto RYŪKAMI hay 4 componentes que hacen `ProductRepository.getAll()` pero con query keys diferentes, causando 4 fetches redundantes:

- `Header.tsx` → `['products', 'featured']`
- `CatalogPage.tsx` → `['products', 'all']`
- `CartDrawer.tsx` → `['products', 'upselling']`
- `AdminDashboard.tsx` → `['products']`

Crea un custom hook en `src/features/products/hooks/useProducts.ts`:

```tsx
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => ProductRepository.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}
```

Luego refactoriza los 4 componentes para usar `useProducts()` en vez de su useQuery inline. Mantén el fallback a `MOCK_PRODUCTS` donde sea necesario pero a nivel de componente, no del hook. Para `AdminDashboard` mantén el `staleTime` de 1 minuto overrideando con `useProducts()` como base conceptual pero ajustando el staleTime.

No modifiques la UI de ningún componente, solo el origen de datos.

```

---

### Prompt #9 — ProductCard: Agregar link al detalle

```

En `src/features/products/components/ProductCard.tsx`, el card no tiene un link al detalle del producto (`/producto/:id`). El usuario solo puede "AÑADIR" al carrito con talla/color por defecto, pero no puede ver la descripción completa ni seleccionar variantes.

Modifica el componente para que la imagen y el nombre del producto sean clickeables y naveguen a `/producto/${id}` usando `<Link>` de react-router-dom.

Requisitos:

- La imagen y el nombre deben estar envueltos en un `<Link to={`/producto/${id}`}>`.
- El botón "AÑADIR" y el botón de favoritos deben quedar FUERA del link para evitar conflictos de click.
- Agrega `e.stopPropagation()` si es necesario para evitar que clicks en botones propaguen al link.
- Mantén todas las animaciones de framer-motion, el memo(), displayName y estilos existentes.

```

---

### Prompt #10 — CartDrawer: Usar `getSummary()` en vez de duplicar lógica

```

En `src/features/cart/components/CartDrawer.tsx`, la lógica de cálculo de envío está duplicada inline:

- Línea ~224: `getTotal() >= 99 ? 'GRATIS' : 'S/. 12.00'`
- Línea ~231: `(getTotal() + (getTotal() >= 99 ? 0 : 12)).toFixed(2)`

El store `useCartStore` ya tiene `getSummary()` que retorna `{ subtotal, shipping, total }` con la misma lógica.

Refactoriza el componente para:

1. Destructurar `getSummary` del store (ya se importa `getTotal`).
2. Llamar `const { subtotal, shipping, total } = getSummary()` dentro del render.
3. Reemplazar todas las instancias de cálculo inline por los valores de `getSummary()`.
4. Eliminar `getTotal` del destructuring si ya no se usa directamente.

No modifiques la UI visual, solo el origen de los valores numéricos.

```

---

### Prompt #11 — Checkout: Crear orders en Supabase

```

En `src/features/cart/pages/CheckoutPage.tsx`, la función `handleFinish` solo abre WhatsApp y limpia el carrito, pero nunca crea un registro en las tablas `orders` ni `order_items` de Supabase. La tabla `orders` tiene columnas (id uuid, user_id uuid nullable, total numeric, status text default 'pending', created_at, updated_at). La tabla `order_items` tiene (id uuid, order_id uuid, product_id uuid, quantity int, price numeric).

Modifica `handleFinish` para:

1. Importar `supabase` de `@/api/supabase`.
2. Antes de abrir WhatsApp, insertar un registro en `orders` con el total y status 'pending'. El `user_id` puede ser null ya que el checkout es público.
3. Después, insertar los `order_items` correspondientes mapeando el array `items` del carrito.
4. Si la inserción falla, mostrar un toast de error pero NO bloquear el flujo de WhatsApp (el negocio depende de eso).
5. Usar try/catch con logger.error para errores.

No modifiques la UI ni el flujo de pasos. Solo agrega la persistencia antes del `window.open`.

```

---

### Prompt #12 — ScrollNeonBackground: Optimizar para accesibilidad y performance

```

En `src/shared/components/ui/ScrollNeonBackground.tsx`, hay 3 `motion.div` gigantes (600-800px) con `blur-[120px]` que se animan con el scroll. Esto causa jank en móviles de gama media/baja y no respeta `prefers-reduced-motion`.

Modifica el componente para:

1. Agregar `will-change: transform` a los motion.div para optimizar compositing.
2. Detectar `prefers-reduced-motion: reduce` con un media query (usa `window.matchMedia` o un hook). Si el usuario prefiere movimiento reducido, renderizar los blobs estáticos sin animación de scroll.
3. Opcionalmente, agregar un `useMotionValueEvent` o similar para throttlear las actualizaciones.

Mantén el mismo look visual en condiciones normales. Solo agrega las optimizaciones.

```

---

### Prompt #13 — ProductCard: Detener animación infinita fuera del viewport

```

En `src/features/products/components/ProductCard.tsx` líneas 129-138, cada card tiene un `motion.div` con `repeat: Infinity` animando `boxShadow`. Con 20+ productos en el grid, son 20+ animaciones loop corriendo constantemente incluso cuando el card no es visible.

Modifica para que:

1. La animación de boxShadow solo se ejecute cuando el card está en el viewport, usando `whileInView` de framer-motion.
2. O alternativamente, conviértelo a CSS puro con `@keyframes` y contrólalo con `animation-play-state: paused` por defecto, activándolo solo con `.group-hover` del card.

Mantén el efecto hover glow visual, solo optimiza cuándo se ejecuta.

```

---

### Prompt #14 — CheckoutStore: No persistir datos sensibles

```

En `src/features/cart/store/useCheckoutStore.ts`, los datos del checkout (name, phone, address) se persisten en localStorage via Zustand `persist` con key `ryukami-checkout-storage`. Esto es un riesgo de privacidad: si otro usuario usa el mismo dispositivo, verá datos personales del cliente anterior.

Modifica el store para una de estas opciones:

- **Opción A (recomendada)**: Remover el middleware `persist` completamente. Los datos solo vivirán en memoria durante la sesión.
- **Opción B**: Mantener `persist` pero agregar un TTL de 30 minutos después del cual los datos se borran automáticamente.

Elige la opción A por simplicidad. No modifiques la interfaz `CheckoutState` ni las funciones `setField` y `clearCheckout`.

```

---

## 🟢 IMPACTO BAJO — Semana 3

---

### Prompt #15 — supabase.ts: Fail fast sin placeholder

```

En `src/api/supabase.ts`, si faltan las env vars `VITE_SUPABASE_URL` o `VITE_SUPABASE_ANON_KEY`, el código crea un client con `'https://placeholder.supabase.co'`. Esto genera requests HTTP silenciosos a un dominio inexistente.

Modifica para que lance un error explícito si faltan las credenciales:

```tsx
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "⚠️ RYŪKAMI: Supabase credentials missing. Check your .env file.",
  );
}
```

Elimina los fallbacks `|| 'https://placeholder.supabase.co'` y `|| 'placeholder'` del `createClient`. Las variables ya están validadas arriba.

```

---

### Prompt #16 — ImageUpload: Usar crypto.randomUUID()

```

En `src/shared/components/ui/ImageUpload.tsx` línea 25, el nombre del archivo se genera con `Math.random().toString(36).substring(7)`. Esto tiene riesgo de colisión y genera nombres cortos no trazables.

Cambia esa línea para usar `crypto.randomUUID()`:

```tsx
const fileName = `${crypto.randomUUID()}.${fileExt}`;
```

Solo cambia esa línea, no toques nada más del componente.

```

---

### Prompt #17 — ToastStore: Usar crypto.randomUUID()

```

En `src/shared/stores/useToastStore.ts` línea 19, el ID del toast se genera con `Math.random().toString(36).substring(2, 9)`.

Cambia a `crypto.randomUUID()`:

```tsx
const id = crypto.randomUUID();
```

Solo cambia esa línea, no toques nada más del store.

```

---

### Prompt #18 — Products RLS: Refactorizar permissive policies duplicadas

```

En Supabase (project_id: suygiakmwizhyjcrsqpg), la tabla `products` tiene 2 permissive policies para `authenticated` + `SELECT`:

- `products_read_all` (role: public, cmd: SELECT, qual: true)
- `products_admin_manage` (role: authenticated, cmd: ALL, qual: email ~~ '%@ryukami.store')

El Supabase Performance Advisor reporta que ambas se evalúan en cada SELECT de un usuario autenticado, lo cual es subóptimo.

Aplica una migración SQL que:

1. Haga DROP de `products_admin_manage`.
2. Cree policies separadas para cada operación admin:
   - `products_admin_insert` (INSERT, para authenticated con email @ryukami.store)
   - `products_admin_update` (UPDATE, para authenticated con email @ryukami.store)
   - `products_admin_delete` (DELETE, para authenticated con email @ryukami.store)
3. Mantenga `products_read_all` tal cual (SELECT para public).

Así los SELECT de usuarios autenticados solo evalúan 1 policy en vez de 2. Usa `(select auth.jwt() ->> 'email')` con el wrapper de optimización.

```

---

### Prompt #19 — Lazy Loading de rutas

```

En `src/App.tsx`, todas las páginas se importan sincrónicamente en el bundle inicial:

```tsx
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import LoginPage from "@/features/admin/pages/LoginPage";
import CheckoutPage from "@/features/cart/pages/CheckoutPage";
import CatalogPage from "@/features/products/pages/CatalogPage";
import ProductPage from "@/features/products/pages/ProductPage";
```

Refactoriza para usar `React.lazy()` + `<Suspense>` en las rutas que no son la landing:

- `AdminDashboard` → lazy (solo admins)
- `LoginPage` → lazy (solo admins)
- `CheckoutPage` → lazy (solo en checkout)
- `CatalogPage` → lazy (ruta secundaria)
- `ProductPage` → lazy (ruta secundaria)

Mantén `HomePage` como import síncrono (es la landing, critical path).

Agrega un `<Suspense fallback={<LoadingSpinner />}>` wrapping las Routes. Crea un componente `LoadingSpinner` simple con el Loader2 de lucide-react y las clases de animación del proyecto (dragon-fire, animate-spin).

No modifiques las rutas ni la estructura de providers.

```

---

### Prompt #20 — Assets faltantes: favicon, og-image, manifest

```

En `index.html` se referencian los siguientes archivos que no existen en `/public/`:

- `/og-image.png` (Open Graph image para redes sociales)
- `/favicon.png` (ícono del tab del navegador)
- `/apple-touch-icon.png` (ícono para iOS)
- `/manifest.json` (PWA manifest)

Necesito:

1. Generar una imagen de 1200x630px para `og-image.png` con el logo RYŪKAMI (dragón 🐉), el texto "RYŪKAMI — Streetwear Japonés de Alta Gama", fondo oscuro (#0A0A0B) con detalles en rojo (#DC2626) y dorado (#F59E0B).
2. Generar un favicon de 32x32 y 192x192 con el emoji 🐉 o un diseño minimalista del dragón.
3. Crear un `manifest.json` básico con name "RYŪKAMI", short_name "RYŪKAMI", theme_color "#0A0A0B", background_color "#0A0A0B" y los icons correspondientes.
4. Colocar todos los archivos en `/public/`.

```

---

### Prompt #21 — Validación de stock en el carrito

```

Actualmente en `src/features/cart/store/useCartStore.ts`, la función `addItem` no valida el stock disponible. Un usuario puede agregar 999 unidades de un producto que tiene stock=5 sin ninguna restricción.

También en `updateQuantity`, se puede establecer cualquier cantidad sin límite.

Modifica ambas funciones para:

1. Aceptar un parámetro opcional `maxStock?: number` en `addItem` y validar que `existingItem.quantity + 1 <= maxStock` si se proporciona.
2. En `updateQuantity`, aceptar un `maxStock?: number` opcional y validar `quantity <= maxStock`.
3. Si se excede el stock, retornar el state sin cambios y mostrar un warning con `console.warn` (o integrar con el toast store si es viable sin crear dependencias circulares).
4. Actualizar los call sites en `ProductCard.tsx` y `ProductPage.tsx` para pasar el stock del producto.

Mantén retrocompatibilidad: si `maxStock` no se pasa, el comportamiento actual se mantiene.

```

---

### Prompt #22 — ESLint: Agregar regla no-console

```

En `eslint.config.js`, agrega la regla `no-console` configurada para que:

- `console.log` sea un warning (para evitar logs olvidados en producción).
- `console.warn` y `console.error` estén permitidos (el proyecto los usa en el logger y en fallbacks).

La configuración debería verse así:

```js
rules: {
  'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
}
```

Agrega esta regla al bloque de rules existente en la configuración de ESLint. No modifiques las demás reglas.

```

---

## ✅ Verificación Final

Después de aplicar todos los prompts, ejecuta estos comandos para validar:

```

# Prompt de verificación final

Ejecuta los siguientes comandos en el proyecto RYŪKAMI y reporta los resultados:

1. `bun run typecheck` — debe pasar sin errores
2. `bun run lint` — debe pasar sin errores críticos
3. `bun run build` — debe compilar exitosamente
4. `bun run test:run` — debe ejecutar los tests

Si alguno falla, identifica el error y corrígelo. Luego dame un resumen de qué pasó y qué se corrigió.

```

```
