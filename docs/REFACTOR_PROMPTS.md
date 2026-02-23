# 🛠️ Prompts de Refactorización — RYŪKAMI Store

> Basados en `docs/REFACTOR_AUDIT.md`. Ejecutar en orden de fase.
> Cada prompt es autónomo y puede pegarse directamente al agente.

---

## FASE 1 — Quick Wins

### Prompt 1: Extraer `getCartItemId` utility

```
Extrae la lógica de composite key del carrito `${item.id}-${item.size}-${item.color}` que se repite 6+ veces en `useCartStore.ts` y `CartDrawer.tsx`. Crea un helper en `src/features/cart/utils/cartItemId.ts` con la función `getCartItemId()`. Reemplaza todas las ocurrencias en `useCartStore.ts` y `CartDrawer.tsx` con el nuevo helper. Exporta también el tipo `CartItem` desde `src/features/cart/types/index.ts`. Asegúrate de que `bun run typecheck` pase.
```

### Prompt 2: Exportar interface `CartItem`

```
Mueve la interface `CartItem` de `src/features/cart/store/useCartStore.ts` (líneas 8-23) a un nuevo archivo `src/features/cart/types/index.ts`. Exporta la interface desde ahí. Actualiza el import en `useCartStore.ts` y cualquier otro archivo que use ese tipo. El store debe seguir funcionando igual. Corre `bun run typecheck` para verificar.
```

### Prompt 3: Unificar fallback `MOCK_PRODUCTS` en `useProducts`

```
El fallback a `MOCK_PRODUCTS` está duplicado en 4 archivos: `FeaturedProducts.tsx`, `CatalogPage.tsx`, `CartDrawer.tsx` y `Header.tsx`. Modifica `src/features/products/hooks/useProducts.ts` para incluir la lógica de fallback (`data.length > 0 ? data : MOCK_PRODUCTS`) dentro del `queryFn`. Luego actualiza `FeaturedProducts.tsx`, `CatalogPage.tsx`, `CartDrawer.tsx` y `Header.tsx` para usar `useProducts()` directamente sin repetir el fallback. Elimina los imports de `MOCK_PRODUCTS` y `ProductRepository` donde ya no sean necesarios. Verifica con `bun run typecheck`.
```

### Prompt 4: Crear componente `FieldError`

```
El bloque de `AnimatePresence > motion.p` para mostrar errores de campo se repite 3 veces en `CheckoutPage.tsx` (líneas 167-178, 199-210, 230-241). Crea un componente `src/shared/components/ui/FieldError.tsx` que reciba `message?: string` y renderice el bloque animado con `AlertCircle`. Reemplaza las 3 ocurrencias en `CheckoutPage.tsx` y también en `AdminDashboard.tsx` donde se muestran errores de forma similar. Corre `bun run typecheck`.
```

### Prompt 5: Unificar `queryKey` de productos

```
`CatalogPage.tsx` usa `queryKey: ['products', 'all']` mientras todos los demás archivos usan `queryKey: ['products']`. Esto rompe la invalidación de caché entre ellos. Cambia el `queryKey` en `CatalogPage.tsx` a `['products']` para que comparta caché con `FeaturedProducts`, `Header`, `CartDrawer` y `AdminDashboard`. Verifica que la invalidación de caché del admin siga funcionando. Ejecuta `bun run typecheck`.
```

### Prompt 6: Consolidar import duplicado en `App.tsx`

```
En `App.tsx` hay dos imports de react: `import { lazy, Suspense } from 'react'` (línea 2) y `import { useEffect } from 'react'` (línea 11). Consolídalos en un solo import: `import { lazy, Suspense, useEffect } from 'react'`. Ejecuta `bun run typecheck`.
```

### Prompt 7: Eliminar `disabled={false}` hardcodeado

```
En `ProductCard.tsx` línea 134, hay un `disabled={false}` que es redundante porque `false` es el valor por defecto de botones HTML. Elimina esa prop del `<Button>`. Verifica con `bun run typecheck`.
```

---

## FASE 2 — Extracciones Medianas

### Prompt 8: Crear `OrderRepository`

```
`CheckoutPage.tsx` (líneas 64-91) llama directamente a `supabase.from('orders')` y `supabase.from('order_items')`, violando el patrón Repository usado en el resto del proyecto. Crea `src/features/cart/services/order.repository.ts` con un método `create({ total, items })` que encapsule la lógica de inserción de orden e items. Actualiza `CheckoutPage.tsx` para usar `OrderRepository.create()` en vez de llamar a Supabase directamente. Mantén el manejo de errores y toasts existente. Ejecuta `bun run typecheck`.
```

### Prompt 9: Extraer `parseProducts` en el repository

```
En `src/features/products/services/product.repository.ts`, las funciones `getAll()` (líneas 46-50) y `getByCategory()` (líneas 87-91) repiten el mismo bloque de `.map(safeParse + mapToProduct).filter(not null)`. Extrae un helper privado `parseProducts(data: unknown[]): Product[]` dentro del mismo archivo y úsalo en ambas funciones. Verifica con `bun run typecheck` y `bun run test:run`.
```

### Prompt 10: Extraer schema de admin a módulo

```
El `productSchema` de Zod está definido inline dentro de `AdminDashboard.tsx` (líneas 86-95). Muévelo a `src/features/admin/schemas/adminProductSchema.ts` y expórtalo. Actualiza el import en `AdminDashboard.tsx`. Ejecuta `bun run typecheck`.
```

### Prompt 11: Centralizar `staleTime` en config

```
Los valores de `staleTime` están hardcodeados en 6+ archivos con valores inconsistentes (1min, 5min, 10min). Crea `src/shared/config/queryConfig.ts` con constantes `CACHE_TIMES` que definan `products.stale`, `products.gc`, `admin.stale`, y `related.stale`. Reemplaza todos los valores hardcodeados en `useProducts.ts`, `FeaturedProducts.tsx`, `ProductPage.tsx`, `RelatedProducts.tsx`, `AdminDashboard.tsx` y `App.tsx`. Ejecuta `bun run typecheck`.
```

### Prompt 12: Migrar `ProductCard` a `OptimizedImage`

```
`ProductCard.tsx` usa `<img>` directamente (línea 90) con su propia lógica de optimización de URL Pexels (líneas 58-63), mientras el resto del proyecto usa `OptimizedImage`. Reemplaza `<img>` por `<OptimizedImage>` y elimina el `useMemo` de `optimizedImage`. Asegúrate de mantener la clase `group-hover:scale-110`, el `loading="lazy"`, y el overlay de "Agotado". Verifica con `bun run typecheck`.
```

### Prompt 13: Conectar `handleFavorite` en `ProductCard`

```
En `ProductCard.tsx`, el `handleFavorite` (líneas 51-54) es un no-op vacío. Conéctalo con `useWishlistStore.toggleItem()`. Necesitarás importar `useWishlistStore` y pasar los datos del producto al método `toggleItem`. El icono `Heart` debería reflejar si el producto está en la wishlist (fill cuando está, outline cuando no). Ejecuta `bun run typecheck`.
```

### Prompt 14: Eliminar `validateState` no usado

```
La función `validateState` en `src/shared/utils/validation.ts` (líneas 36-48) no se usa en ningún archivo del proyecto. Elimínala. Si hay tests que la referencian en `validation.test.ts`, elimina esos tests también. Ejecuta `bun run typecheck` y `bun run test:run`.
```

---

## FASE 3 — God Component Splits

### Prompt 15: Extraer `useProductMutations` hook del AdminDashboard

```
Extrae las 3 mutations de TanStack Query (`createMutation`, `updateMutation`, `deleteMutation`) de `AdminDashboard.tsx` (líneas 46-84) a un nuevo hook `src/features/admin/hooks/useProductMutations.ts`. El hook debe recibir callbacks opcionales para acciones post-success (como `resetForm`, `setEditingId(null)`) y retornar las mutations + `isLoading`. Actualiza `AdminDashboard.tsx` para usar el hook. Ejecuta `bun run typecheck`.
```

### Prompt 16: Extraer `ProductForm` del AdminDashboard

```
Extrae el formulario de producto de `AdminDashboard.tsx` (líneas 235-390) a un componente `src/features/admin/components/ProductForm.tsx`. El componente debe recibir: `formData`, `setFormData`, `errors`, `onSubmit`, `editingId`, `onCancelEdit`, `isLoading`, `isUploading`. Usa el schema extraído en el prompt 10. Mantén el preview de imagen al final del form. Actualiza `AdminDashboard.tsx` para usar `<ProductForm />`. Verifica con `bun run typecheck`.
```

### Prompt 17: Extraer `ProductList` del AdminDashboard

```
Extrae la lista de productos con búsqueda de `AdminDashboard.tsx` (líneas 395-466) a un componente `src/features/admin/components/ProductList.tsx`. Debe recibir: `products`, `searchTerm`, `onSearchChange`, `editingId`, `onEdit`, `onDelete`, `isLoading`. Actualiza `AdminDashboard.tsx` para usar `<ProductList />`. El dashboard final debería quedar en ~80 líneas como orquestador. Ejecuta `bun run typecheck`.
```

### Prompt 18: Extraer steps de `CheckoutPage` a componentes separados

```
Descompón `CheckoutPage.tsx` en 3 componentes de step: `src/features/cart/components/checkout/StepData.tsx` (formulario datos, líneas 138-248), `src/features/cart/components/checkout/StepPayment.tsx` (métodos de pago, líneas 250-304), y `src/features/cart/components/checkout/StepSuccess.tsx` (confirmación, líneas 306-329). Cada step recibe las props necesarias del page padre. Crea también `src/features/cart/components/checkout/ProgressBar.tsx` para la barra de progreso (líneas 113-132). Actualiza `CheckoutPage.tsx` para usar los componentes extraídos. Ejecuta `bun run typecheck`.
```

### Prompt 19: Extraer `OrderSummary` del CheckoutPage

```
Extrae el sidebar de resumen de orden de `CheckoutPage.tsx` (líneas 334-379) a `src/features/cart/components/checkout/OrderSummary.tsx`. Debe recibir `items`, `subtotal`, `shipping` y `total` como props. Incluye los trust points (envío, pago seguro). Actualiza `CheckoutPage.tsx`. Ejecuta `bun run typecheck`.
```

### Prompt 20: Extraer `useCartSuggestions` hook del CartDrawer

```
`CartDrawer.tsx` importa `useProducts` y `MOCK_PRODUCTS` solo para calcular sugerencias de upselling (líneas 17-40). Extrae esta lógica a un hook `src/features/cart/hooks/useCartSuggestions.ts` que reciba los items del carrito y retorne las sugerencias. La lógica de priorizar por categoría del último item en carrito debe mantenerse. Actualiza `CartDrawer.tsx` para usar el hook. Elimina los imports innecesarios de `MOCK_PRODUCTS` y `useProducts` del drawer. Ejecuta `bun run typecheck`.
```

---

## ✅ Verificación Final

```
Ejecuta `bun run typecheck`, `bun run test:run` y `bun run lint` para confirmar que todo el refactoring de las 3 fases está correcto. Si hay errores, corrígelos. Muestra un resumen final de archivos creados, modificados y eliminados.
```
