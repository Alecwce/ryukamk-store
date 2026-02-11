# Plan de Arquitectura: RYŪKAMI Modular Monolith 🐉

## Estado de la Migración

- **Estado**: ✅ Completado
- **Fecha**: 2026-02-10
- **Logros**: Migración total a Monolito Modular, implementación del Patrón Repository, configuración de alias '@' funcional y corrección de bugs de renderizado.

## 1. Visión General

Migrar de una estructura centrada en la tecnología (components/stores) a una estructura centrada en el **dominio (Features)**. Esto mejora la mantenibilidad, facilita las pruebas y permite que el equipo escale sin pisarse los pies.

## 2. Nueva Estructura de Carpetas

```text
src/
├── api/                # Cliente de Supabase y configuraciones de red
├── core/               # Tipos globales, constantes y config del sistema
├── features/           # El corazón del negocio
│   ├── cart/           # Lógica, UI y State del carrito
│   ├── products/       # Catálogo, filtros y detalle de productos
│   ├── home/           # Secciones específicas de la landing
│   └── checkout/       # Proceso de pago y validaciones
├── shared/             # Lo que se usa en múltiples features
│   ├── components/ui/  # Botones, Skeleton, Badge (Átomos)
│   ├── hooks/          # Hooks de utilidad (useLocalStorage, etc.)
│   └── utils/          # Funciones puras de ayuda
└── main.tsx            # Punto de entrada
```

## 3. Implementación del Patrón Repository (Services)

Cada feature tendrá una carpeta `services/` que encapsula las llamadas a la base de datos.
**Regla**: El componente UI nunca llama a `supabase.from()`. Siempre llama a un método del repositorio.

### Ejemplo: `src/features/products/services/product.repository.ts`

```typescript
import { supabase } from "@/api/supabase";
import { Product } from "../types";

export const ProductRepository = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<Product> {
    // ... lógica de obtención por ID
  },
};
```

## 4. Hoja de Ruta de Migración

### Paso 1: Infraestructura Compartida

- [ ] Crear `src/api/supabase.ts`.
- [ ] Mover `src/components/ui` -> `src/shared/components/ui`.
- [ ] Actualizar imports globales.

### Paso 2: Feature: Products

- [ ] Crear `src/features/products`.
- [ ] Definir interfaces en `src/features/products/types/index.ts`.
- [ ] Implementar `ProductRepository`.
- [ ] Mover componentes de `src/components/products` -> `src/features/products/components`.

### Paso 3: Feature: Cart (Persistencia y Lógica)

- [ ] Crear `src/features/cart`.
- [ ] Mover `src/store/cart.ts` -> `src/features/cart/store/useCartStore.ts`.
- [ ] Mover `src/components/cart` -> `src/features/cart/components`.

### Paso 4: Limpieza Final

- [ ] Eliminar carpetas obsoletas en `src/components`.
- [ ] Asegurar que `App.tsx` solo importe de `features` o `shared`.
