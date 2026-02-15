# RYŪKAMI Data Layer: ProductRepository

El `ProductRepository` es la capa de abstracción encargada de interactuar con **Supabase**. Centraliza todas las operaciones de lectura y escritura para el catálogo de productos, asegurando el mapeo correcto de datos y la validación de tipos.

**Ubicación:** `src/features/products/services/product.repository.ts`

---

## 🛠️ Métodos Disponibles

### `getAll()`

Obtiene todos los productos activos en el catálogo, ordenados por fecha de creación (más recientes primero).

- **Retorno:** `Promise<Product[]>`
- **Uso:** Ideal para el catálogo general y panel administrativo.

### `getById(id: string)`

Busca un producto específico por su UUID.

- **Parámetros:** `id` (identificador único del producto).
- **Retorno:** `Promise<Product | null>`
- **Uso:** Pantalla de detalle del producto (`ProductPage`).

### `getByCategory(category: string)`

Obtiene productos que pertenecen a una categoría específica, limitado a 4 resultados.

- **Parámetros:** `category` (Nombre de la categoría).
- **Retorno:** `Promise<Product[]>`
- **Uso:** Sección de "Productos Relacionados".

### `create(product: Omit<Product, 'id'>)`

Crea un nuevo registro en la tabla `products`.

- **Parámetros:** Objeto con los datos del producto (sin el ID, el cual es generado por Supabase).
- **Retorno:** `Promise<Product | null>`
- **Seguridad:** Requiere ser administrador (RLS Policy: `@ryukami.store`).

### `update(id: string, updates: Partial<Omit<Product, 'id'>>)`

Actualiza campos específicos de un producto existente.

- **Parámetros:** `id` del producto y un objeto parcial con los cambios.
- **Retorno:** `Promise<Product | null>`

### `delete(id: string)`

Elimina (o desactiva) un producto de la base de datos.

- **Parámetros:** `id` del producto.
- **Retorno:** `Promise<void>`

---

## 📦 Tipos de Datos (Interface Product)

La entidad `Product` mantiene la siguiente estructura en el frontend:

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  stock?: number;
  colors?: string[];
  sizes?: string[];
  colorImages?: Record<string, string>;
}
```

---

## 🛰️ Manejo de Datos y Errores

- **Mapeo:** Los nombres de columnas en Postgres (ej. `image_url`) se transforman automáticamente a camelCase (`image`) mediante la función interna `mapToProduct`.
- **Validación:** Cada respuesta es validada por **Zod** (`dbProductSchema`) antes de entrar al estado de la aplicación.
- **Logging:** Los errores de conexión o integridad son capturados por el `logger` centralizado y reportados en producción.

---

## 💡 Ejemplo de Consumo con TanStack Query

```tsx
const { data: product } = useQuery({
  queryKey: ["product", id],
  queryFn: () => ProductRepository.getById(id),
});
```
