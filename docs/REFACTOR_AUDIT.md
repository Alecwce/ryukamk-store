# 🔍 Auditoría de Código — RYŪKAMI Store

**Fecha:** 2026-02-23  
**Scope:** `src/` completo (46 archivos TS/TSX)

---

## Resumen Ejecutivo

| Categoría                         | Hallazgos | Severidad |
| --------------------------------- | --------- | --------- |
| Duplicación de código             | 6         | 🟡 Media  |
| Funciones largas (God Components) | 2         | 🔴 Alta   |
| Nombres poco claros               | 4         | 🟢 Baja   |
| Violaciones SOLID                 | 5         | 🟡 Media  |
| Inconsistencias de patrones       | 3         | 🟡 Media  |

---

## 1. 🔴 DUPLICACIONES DE CÓDIGO

### 1.1 UniqueId del carrito: lógica de composite key repetida 6 veces

**Archivos:** `useCartStore.ts`, `CartDrawer.tsx`

La expresión `` `${item.id}-${item.size}-${item.color}` `` se repite **6 veces** en `useCartStore` (líneas 103, 105, 115, 131, 141) y **3 veces** en `CartDrawer` (líneas 97, 126, 136, 145).

**Antes (disperso en el store):**

```ts
// useCartStore.ts — la misma concatenación aparece en addItem, removeItem, updateQuantity
const uniqueId = `${item.id}-${item.size}-${item.color}`;
const existingItem = state.items.find(
  (i) => `${i.id}-${i.size}-${i.color}` === uniqueId,
);
```

**Después (extraer helper):**

```ts
// src/features/cart/utils/cartItemId.ts
import type { CartItem } from "../store/useCartStore";

/** Genera el ID compuesto de un item del carrito */
export function getCartItemId(
  item: Pick<CartItem, "id" | "size" | "color">,
): string {
  return `${item.id}-${item.size}-${item.color}`;
}
```

```ts
// En el store y en los componentes:
import { getCartItemId } from "../utils/cartItemId";

const existingItem = state.items.find(
  (i) => getCartItemId(i) === getCartItemId(item),
);
```

**Por qué es mejor:** Si la lógica del composite key cambia (ej: agregar `quantity`), se modifica en **un solo lugar**. Elimina 6 copias del mismo string template.

---

### 1.2 Patrón de fallback a MOCK_PRODUCTS duplicado 4 veces

**Archivos:** `FeaturedProducts.tsx:13`, `CatalogPage.tsx:24`, `CartDrawer.tsx:18`, `Header.tsx:27`

Todas hacen exactamente lo mismo:

```ts
const data = await ProductRepository.getAll();
return data.length > 0 ? data : MOCK_PRODUCTS;
```

**Después:** El hook `useProducts` ya existe pero NO incluye el fallback. Unificarlo ahí:

```ts
// src/features/products/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { ProductRepository } from "../services/product.repository";
import { MOCK_PRODUCTS } from "../data/mockProducts";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await ProductRepository.getAll();
      return data.length > 0 ? data : MOCK_PRODUCTS;
    },
    staleTime: 1000 * 60 * 5,
  });
}
```

Luego `FeaturedProducts`, `CatalogPage`, `CartDrawer` y `Header` simplemente hacen:

```ts
const { data: products = [], isLoading } = useProducts();
```

Sin repetir el fallback manualmente.

**Por qué es mejor:** Single source of truth para la lógica de fetching + fallback. Hoy `Header` y `CartDrawer` hacen fallback; `useProducts` no. Inconsistencia que genera bugs silenciosos.

---

### 1.3 Mapeo/validación de productos duplicado en `product.repository.ts`

Las funciones `getAll()` y `getByCategory()` repiten exactamente el mismo bloque de validación + mapeo:

```ts
// Aparece en getAll() (L46-50) y getByCategory() (L87-91)
return (data || [])
  .map((p) => {
    const result = productSchema.safeParse(p);
    if (!result.success) return null;
    return mapToProduct(p);
  })
  .filter((p): p is Product => p !== null);
```

**Después:** Extraer un helper privado:

```ts
// Dentro de product.repository.ts
function parseProducts(data: unknown[]): Product[] {
  return data
    .map(p => {
      const result = productSchema.safeParse(p);
      return result.success ? mapToProduct(p as Record<string, unknown>) : null;
    })
    .filter((p): p is Product => p !== null);
}

// Uso:
async getAll(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) { logger.error('Error fetching products:', error); return []; }
  return parseProducts(data || []);
},
```

---

### 1.4 Patrón de error field display duplicado en CheckoutPage

El bloque `AnimatePresence > motion.p` para mostrar errores de campo se repite **3 veces idéntico** (líneas 167-178, 199-210, 230-241):

```tsx
<AnimatePresence>
  {errors.fieldName && (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="text-dragon-fire text-[10px] font-bold mt-1 flex items-center gap-1"
    >
      <AlertCircle size={10} /> {errors.fieldName}
    </motion.p>
  )}
</AnimatePresence>
```

**Después:** Componente reutilizable:

```tsx
// src/shared/components/ui/FieldError.tsx
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-dragon-fire text-[10px] font-bold mt-1 flex items-center gap-1"
        >
          <AlertCircle size={10} /> {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
```

```tsx
// En CheckoutPage:
<FieldError message={errors.name} />
<FieldError message={errors.phone} />
<FieldError message={errors.address} />
```

---

### 1.5 Optimización de URL Pexels duplicada

`ProductCard.tsx:58-63` y `OptimizedImage.tsx:27-32` implementan lógica similar de imagen Pexels:

```ts
// ProductCard — agrega fm=webp
if (image.includes("pexels.com")) {
  return `${image}${image.includes("?") ? "&" : "?"}fm=webp`;
}

// OptimizedImage — agrega auto=compress&cs=tinysrgb&w=800&fm=webp
if (src.includes("pexels.com") && !src.includes("fm=webp")) {
  return `${src}${src.includes("?") ? "&" : "?"}auto=compress&cs=tinysrgb&w=800&fm=webp`;
}
```

`ProductCard` no debería hacer esto; ya usa `<img>` directamente en vez de `OptimizedImage`. Si más adelante se migra, la optimización se aplica dos veces.

**Después:** Eliminar la lógica duplicada de `ProductCard` y usar `OptimizedImage` en su lugar, o extraer un `optimizePexelsUrl()` utility.

---

## 2. 🔴 FUNCIONES/COMPONENTES DEMASIADO LARGOS

### 2.1 `AdminDashboard.tsx` — 471 líneas (God Component)

Este componente viola **SRP** masivamente. Contiene:

- Form state management (L22-36)
- Zod schema definition (L86-95)
- 3 mutations de TanStack Query (L46-84)
- Búsqueda/filtrado (L183-186)
- Formulario completo con 8+ campos (L235-375)
- Lista de productos con acciones CRUD (L395-466)

**Plan de extracción:**

```
features/admin/
├── components/
│   ├── ProductForm.tsx          ← Formulario + validación Zod
│   ├── ProductList.tsx          ← Lista con search + acciones
│   └── ProductListItem.tsx      ← Cada item individual
├── hooks/
│   └── useProductMutations.ts   ← Mutations create/update/delete
├── schemas/
│   └── adminProductSchema.ts    ← Schema Zod
└── pages/
    └── AdminDashboard.tsx       ← Orquestador (~60 líneas)
```

**Ejemplo del hook extraído:**

```ts
// src/features/admin/hooks/useProductMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductRepository } from "@/features/products/services/product.repository";
import { Product } from "@/features/products/types";
import { useToastStore } from "@/shared/stores/useToastStore";

export function useProductMutations() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const invalidateProducts = (productId?: string) => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    if (productId) {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    }
  };

  const createMutation = useMutation({
    mutationFn: (newProduct: Omit<Product, "id">) =>
      ProductRepository.create(newProduct),
    onSuccess: (data) => {
      invalidateProducts(data?.id);
      addToast("Producto creado", "success");
    },
    onError: (err: Error) => addToast(err.message, "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<Product, "id">>;
    }) => ProductRepository.update(id, updates),
    onSuccess: (_, variables) => {
      invalidateProducts(variables.id);
      addToast("Producto actualizado", "success");
    },
    onError: (err: Error) => addToast(err.message, "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductRepository.delete(id),
    onSuccess: (_, id) => {
      invalidateProducts(id);
    },
    onError: (err: Error) => addToast(err.message, "error"),
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    isLoading: createMutation.isPending || updateMutation.isPending,
  };
}
```

---

### 2.2 `CheckoutPage.tsx` — 384 líneas

Mezcla:

- Form state (checkout store)
- Order persistence (Supabase insert)
- WhatsApp link generation
- 3 step views (DATA, PAYMENT, SUCCESS) inline
- Order summary sidebar

**Plan de extracción:**

```
features/cart/
├── components/
│   ├── checkout/
│   │   ├── StepData.tsx          ← Formulario de datos
│   │   ├── StepPayment.tsx       ← Métodos de pago
│   │   ├── StepSuccess.tsx       ← Confirmación
│   │   ├── OrderSummary.tsx      ← Sidebar resumen
│   │   └── ProgressBar.tsx       ← Barra de pasos
├── hooks/
│   └── useCheckoutFlow.ts        ← Lógica de steps + WhatsApp + order persistence
└── pages/
    └── CheckoutPage.tsx          ← Orquestador (~80 líneas)
```

---

## 3. 🟡 NOMBRES POCO CLAROS

| Archivo                    | Nombre Actual                              | Problema                                                    | Sugerencia                    |
| -------------------------- | ------------------------------------------ | ----------------------------------------------------------- | ----------------------------- |
| `useCartStore.ts:103`      | `uniqueId`                                 | Variable local genérica                                     | `cartItemKey` o `compositeId` |
| `AdminDashboard.tsx:181`   | `loading`                                  | Ambiguo — ¿carga inicial o mutation?                        | `isMutating`                  |
| `AdminDashboard.tsx:39`    | `fetching`                                 | Inconsistente con el resto del proyecto que usa `isLoading` | `isLoading`                   |
| `product.repository.ts:19` | `mapToProduct(p: Record<string, unknown>)` | `p` es demasiado corto                                      | `rawProduct` o `dbRow`        |

---

## 4. 🟡 VIOLACIONES SOLID

### 4.1 SRP — `CartItem` interface definida solo en `useCartStore`

`CartItem` está definido internamente en el store (L8-23) y no se exporta. Otros archivos (`CartDrawer`, `CheckoutPage`) deberían poder importar este tipo.

**Fix:** Mover a `features/cart/types/index.ts` y exportar.

---

### 4.2 SRP — Schema Zod dentro del componente AdminDashboard

`productSchema` (L86-95) está definido inline dentro del componente. Debería vivir en un módulo separado para ser testeable y reutilizable.

**Fix:** `features/admin/schemas/adminProductSchema.ts`

---

### 4.3 OCP (Open/Closed) — ProductCard hardcodea defaults `size: 'M'` y `color: 'Negro'`

```ts
// ProductCard.tsx:44, CartDrawer.tsx:191
addItem({
  ...
  size: 'M',       // ← hardcoded
  color: 'Negro',  // ← hardcoded
  quantity: 1,
});
```

Si mañana se agregan nuevas tallas o colores, hay que buscar todos los hardcodes. Debería venir de la configuración del producto o del primer valor disponible.

---

### 4.4 DIP (Dependency Inversion) — `CheckoutPage` llama directamente a Supabase

```ts
// CheckoutPage.tsx:64-86
const { data: order, error: orderError } = await supabase
  .from('orders')
  .insert([{ total, status: 'pending' }])
  ...
```

El resto del proyecto usa el patrón `Repository` (`ProductRepository`). Checkout debería tener su propio `OrderRepository` para mantener consistencia e invertir la dependencia.

**Fix:**

```ts
// src/features/cart/services/order.repository.ts
import { supabase } from "@/api/supabase";
import { logger } from "@/shared/lib/logger";

interface CreateOrderInput {
  total: number;
  items: Array<{ product_id: string; quantity: number; price: number }>;
}

export const OrderRepository = {
  async create({ total, items }: CreateOrderInput): Promise<string | null> {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{ total, status: "pending" }])
      .select("id")
      .single();

    if (orderError) {
      logger.error("Error creating order:", orderError);
      throw orderError;
    }

    if (order) {
      const orderItems = items.map((item) => ({ order_id: order.id, ...item }));
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      if (itemsError) logger.error("Error inserting order_items:", itemsError);
    }

    return order?.id ?? null;
  },
};
```

---

### 4.5 ISP — `CartDrawer` depende de `useProducts` y `MOCK_PRODUCTS`

`CartDrawer` importa y ejecuta el hook `useProducts()` solo para obtener sugerencias de upselling. Esto acopla el drawer a la lógica de productos.

**Fix:** Extraer las sugerencias a un hook dedicado:

```ts
// src/features/cart/hooks/useCartSuggestions.ts
import { useMemo } from "react";
import { useProducts } from "@/features/products/hooks/useProducts";

export function useCartSuggestions(cartItemIds: string[]) {
  const { data: products = [] } = useProducts();

  return useMemo(() => {
    const cartIds = new Set(cartItemIds);
    return products
      .filter((p) => !cartIds.has(p.id) && (p.stock ?? 0) > 0)
      .slice(0, 3);
  }, [cartItemIds, products]);
}
```

---

## 5. 🟡 INCONSISTENCIAS DE PATRONES

### 5.1 `queryKey` inconsistente

| Archivo                | queryKey                                |
| ---------------------- | --------------------------------------- |
| `useProducts.ts`       | `['products']`                          |
| `FeaturedProducts.tsx` | `['products']` ← OK, misma key          |
| `CatalogPage.tsx`      | `['products', 'all']` ← **Diferente!**  |
| `AdminDashboard.tsx`   | `['products']`                          |
| `RelatedProducts.tsx`  | `['products', 'related', category, id]` |

`CatalogPage` usa `['products', 'all']` que **no comparte caché** con `['products']`. Si el admin crea un producto, el catálogo no se invalida porque la key es diferente.

**Fix:** Unificar todas las listas a `['products']` o usar `['products', 'list']` consistentemente.

---

### 5.2 `staleTime` inconsistente

| Archivo              | staleTime                |
| -------------------- | ------------------------ |
| App.tsx (global)     | 5 min                    |
| useProducts.ts       | 5 min                    |
| FeaturedProducts.tsx | 5 min                    |
| CatalogPage.tsx      | no definido (usa global) |
| AdminDashboard.tsx   | 1 min                    |
| RelatedProducts.tsx  | 10 min                   |
| ProductPage.tsx      | 5 min                    |

No hay constantes compartidas. Si cambia la política de caché, hay que editar 5+ archivos.

**Fix:** Centralizar en constantes:

```ts
// src/shared/config/queryConfig.ts
export const CACHE_TIMES = {
  products: {
    stale: 1000 * 60 * 5,
    gc: 1000 * 60 * 30,
  },
  admin: {
    stale: 1000 * 60, // admin necesita datos más frescos
  },
} as const;
```

---

### 5.3 `ProductCard` no usa `OptimizedImage`

`ProductCard.tsx` usa `<img>` directamente (L90) con su propia lógica de optimización, mientras que el resto del proyecto usa el componente `OptimizedImage`. Esto rompe la consistencia y pierde el shimmer loading/error handling.

**Fix:** Reemplazar `<img>` por `<OptimizedImage>` y eliminar `optimizedImage` local.

---

## 6. 🟢 ISSUES MENORES

| #   | Issue                                                     | Archivo                 | Fix                                                     |
| --- | --------------------------------------------------------- | ----------------------- | ------------------------------------------------------- |
| 6.1 | `handleFavorite` es un handler vacío (no-op)              | `ProductCard.tsx:51-54` | Conectar con `useWishlistStore.toggleItem()` o eliminar |
| 6.2 | `disabled={false}` hardcodeado                            | `ProductCard.tsx:134`   | Eliminar prop — `false` es el default                   |
| 6.3 | `CartItem` no se exporta                                  | `useCartStore.ts:8`     | Exportar el interface                                   |
| 6.4 | `validateState` helper en `validation.ts:36` nunca se usa | `validation.ts`         | Eliminar o implementar                                  |
| 6.5 | `import { useEffect } from 'react'` duplicado             | `App.tsx:2,11`          | Consolidar con el import de L2                          |

---

## 📋 Priorización de Refactoring

### Fase 1 — Quick Wins (bajo riesgo, alto impacto)

1. Extraer `getCartItemId()` utility
2. Unificar fallback de `MOCK_PRODUCTS` en `useProducts`
3. Crear `FieldError` componente
4. Exportar `CartItem` interface
5. Unificar `queryKey` de productos

### Fase 2 — Extracciones Medianas

6. Crear `OrderRepository`
7. Extraer `parseProducts()` en el repo
8. Extraer `adminProductSchema` a módulo
9. Centralizar `staleTime` en config
10. Migrar `ProductCard` a usar `OptimizedImage`

### Fase 3 — God Component Split

11. Descomponer `AdminDashboard` (hook + 3 componentes)
12. Descomponer `CheckoutPage` (hook + 5 componentes)
13. Extraer `useCartSuggestions` hook

---

> **Nota:** Ninguno de estos cambios altera funcionalidad existente. Son refactors puros que mejoran mantenibilidad y testeabilidad. Se recomienda ejecutar `bun run typecheck` y `bun run test:run` después de cada fase.
