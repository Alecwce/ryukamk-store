# Patrones de Mensajes de Commit (Humanos)

Este documento sirve como referencia para que la IA elija el lenguaje más natural posible en español.

## Verbos Recomendados

| Verbo         | Uso                                                    | Ejemplo                                          |
| :------------ | :----------------------------------------------------- | :----------------------------------------------- |
| **Añade**     | Nuevas funcionalidades o archivos.                     | "Añade componente de calificación por estrellas" |
| **Corrige**   | Arreglo de bugs o errores visuales.                    | "Corrige desalineación en el botón Comprar"      |
| **Limpia**    | Refactorización pequeña, eliminación de código muerto. | "Limpia variables no usadas en el checkout"      |
| **Actualiza** | Cambios en dependencias o documentación.               | "Actualiza precios en el catálogo de temporada"  |
| **Ajusta**    | Cambios menores en estilos o configuraciones.          | "Ajusta sombreado de las tarjetas de producto"   |

## Qué evitar (IA-isms)

- **Prefijos innecesarios**: [FEAT], [FIX], [DOCS] (a menos que el proyecto lo exija explícitamente).
- **Gerundios**: "Adding feature", "Fixing bug" → Usar Imperativo: "Añade", "Corrige".
- **Chatter**: "I have updated the files because...", "The following changes were made..."
- **Descripciones obvias**: "Modified index.css" (ya se ve en el diff).

## Ejemplos de Oro por Módulo

### UI/UX

- "Efecto hover suave en el menú lateral"
- "Botón de login ahora brilla al pasar el ratón"
- "Z-index corregido para el modal del carrito"

### Lógica/State

- "Persistencia del carrito mejorada en localStorage"
- "Filtro de tallas ya no devuelve duplicados"
- "Zustand: sincroniza stock en tiempo real"

### Backend/Supabase

- "RLS: Solo admins pueden editar precios"
- "Optimiza query de productos destacados"
- "Trigger para logs de auditoría en pedidos"
