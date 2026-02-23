---
name: supabase-guardian
description: Auditoría de seguridad y políticas RLS para Supabase. Úsalo al crear tablas, modificar esquemas, configurar políticas de acceso o revisar la seguridad de la base de datos para asegurar un enfoque Zero Trust.
---

# 🛡️ Supabase Guardian

## Resumen

Este skill actúa como un auditor de seguridad persistente para la capa de datos. Su misión es garantizar que ninguna tabla quede expuesta sin protección y que las políticas RLS (Row Level Security) sigan el principio de mínimo privilegio.

## Workflow de Auditoría

### 1. Verificación de RLS

- Antes de dar por terminada una migración o cambio en la DB, comprueba que el Row Level Security esté habilitado.
- `ALTER TABLE "nombre_tabla" ENABLE ROW LEVEL SECURITY;` es obligatorio para toda tabla nueva.

### 2. Análisis de Políticas

- **Selective Access**: Evitar `USING (true)` a menos que la tabla sea puramente pública (ej: info de contacto pública).
- **Admin Roles**: Las políticas de escritura deben estar restringidas a roles `admin` o IDs específicos validados por `auth.uid()`.
- **Relaciones**: Validar que las políticas de tablas relacionadas (detalles de pedido, perfiles) protejan los datos basándose en la propiedad del registro principal.

### 3. Prevención de Fugas

- Comprobar que no se estén filtrando campos sensibles (emails, tokens) en vistas públicas.
- Validar el uso de `SECURITY DEFINER` en funciones de Postgres para evitar escalada de privilegios indeseada.

## Patrones de Políticas (Zero Trust)

| Acción                  | Patrón Recomendado                             | Razón                                     |
| :---------------------- | :--------------------------------------------- | :---------------------------------------- |
| **Lectura (Pública)**   | `FOR SELECT USING (true)`                      | Solo para catálogos de productos.         |
| **Escritura (Usuario)** | `FOR INSERT WITH CHECK (auth.uid() = user_id)` | Solo el dueño puede crear su registro.    |
| **Gestión (Admin)**     | `FOR ALL USING (is_admin())`                   | Función personalizada para validar roles. |

## Recursos

- `references/security-checklist.sql`: Queries para detectar tablas sin RLS o políticas inseguras.
- `scripts/audit_rls.ps1`: Script para ejecutar un escaneo rápido de las políticas actuales vía CLI si está disponible.
