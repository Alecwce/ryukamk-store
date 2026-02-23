# 🛠️ Patrones de Sincronización Zod-TS-DB

Guía técnica para evitar discrepancias en los contratos de datos.

## 1. Mapeo de Tipos Postgres a Zod

| Tipo DB         | Esquema Zod             | Nota                                     |
| :-------------- | :---------------------- | :--------------------------------------- |
| `uuid`          | `z.string().uuid()`     | Validación estricta de formato.          |
| `timestamp`     | `z.string().datetime()` | Maneja ISO strings de Supabase.          |
| `jsonb`         | `z.record(z.unknown())` | O usar un esquema anidado específico.    |
| `numeric/float` | `z.number().positive()` | Zod previene NaN o negativos indeseados. |
| `text[]`        | `z.array(z.string())`   | Array nativo de Postgres.                |

## 2. Manejo de Opcionales y Nulls

En RYŪKAMI, preferimos ser explícitos para evitar errores de red renderizado.

- **DB Nullable** → `.nullable()` (El campo existe pero puede ser null).
- **Frontend Optional** → `.optional()` (El campo puede no estar presente en el objeto).
- **Default** → `.default(value)` (Asegura un valor si la DB devuelve null).

Ejemplo:

```typescript
const profileSchema = z.object({
  avatar_url: z
    .string()
    .url()
    .nullable()
    .default("https://default.com/avatar.png"),
});
```

## 3. Transformaciones

Usa `.transform()` para adaptar datos de la DB a formatos de UI (ej: formatear moneda o convertir snake_case a camelCase si el proyecto lo requiere, aunque en este proyecto mantenemos snake_case por consistencia con Supabase).

## 4. Enums

No dupliques enums. Si el enum existe en TS, úsalo en Zod:

```typescript
enum OrderStatus {
  PENDING,
  SHIPPED,
  DELIVERED,
}
const schema = z.nativeEnum(OrderStatus);
```
