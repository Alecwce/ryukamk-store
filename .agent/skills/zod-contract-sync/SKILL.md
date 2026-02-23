---
name: zod-contract-sync
description: Sincronización de contratos de datos entre la DB/API y el Frontend. Asegura que los esquemas de Zod coincidan con los tipos de TypeScript y la estructura de la base de datos para evitar errores de runtime. Úsalo al modificar esquemas de tablas, crear nuevas APIs o actualizar validaciones de formularios.
---

# 🔗 Zod Contract Sync

## Resumen

Este skill es el pegamento que mantiene la integridad de los datos en RYŪKAMI. Siguiendo la regla de oro **Zero Trust**, garantiza que cualquier dato que entre o salga del sistema sea validado contra un esquema estricto de Zod que esté en sincronía total con TypeScript.

## Workflow de Sincronización

### 1. Definición del Esquema (Single Source of Truth)

- Al crear una nueva entidad (ej: `Product`, `Order`), define primero el esquema de Zod en la carpeta `schemas/` del feature correspondiente.
- Extrae el tipo de TypeScript automáticamente:
  ```typescript
  export const productSchema = z.object({ ... });
  export type Product = z.infer<typeof productSchema>;
  ```

### 2. Validación en Frontera

- **API/Supabase**: Valida la respuesta de cualquier query o fetch antes de pasarla al estado (Zustand) o componentes.
- **Formularios**: Usa el esquema de Zod con `react-hook-form` o similar para asegurar que el input del usuario cumple con el contrato antes de enviarlo.

### 3. Manejo de Errores de Contrato

- Si la validación de Zod falla, el error debe ser capturado y logueado con contexto (path del campo, valor recibido vs esperado).
- En UI, mostrar un estado de "Error de integridad" si los datos de la DB no coinciden con el esquema esperado (Graceful Degradation).

## Patrones de Código Recomendados

### Validación de Fetching Seguro

```typescript
async function getProduct(id: string) {
  const { data } = await supabase
    .from("products")
    .select()
    .eq("id", id)
    .single();
  const result = productSchema.safeParse(data);

  if (!result.success) {
    console.error(
      "❌ Error de contrato en tabla products:",
      result.error.format(),
    );
    throw new Error("Data Integrity Violation");
  }

  return result.data;
}
```

## Recursos

- `references/sync-patterns.md`: Guía sobre cómo manejar opcionales, transformaciones y enums entre Postgres y Zod.
- `scripts/check-contracts.ts`: Script (ejecutable con bun) para validar que los esquemas de Zod cubren todos los campos definidos en los tipos globales.
