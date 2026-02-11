# 🔌 Documentación de API - RYŪKAMI

Este documento describe la interfaz de comunicación con el backend (Supabase) y la estructura de datos para las futuras integraciones.

---

## 🛠️ Infraestructura de API

- **Tecnología**: [Supabase](https://supabase.com/) (PostgreSQL + PostgREST).
- **Base URL**: Definida en `.env` como `VITE_SUPABASE_URL`.
- **Protocolo**: RESTful vía `supabase-js`.

---

## 🔐 Autenticación

La API utiliza **Supabase Auth** basado en JWT.

### Headers requeridos:

- `apikey`: `VITE_SUPABASE_ANON_KEY`.
- `Authorization`: `Bearer <JWT_TOKEN>` (para rutas protegidas).

---

## 📦 Endpoints (Tablas & RPC)

### 1. Productos

Obtener el catálogo de streetwear.

- **URL**: `/rest/v1/products`
- **Método**: `GET`
- **Query Params**:
  - `select`: `*`
  - `category`: `eq.Polos` (opcional)

**Response Example (200 OK):**

```json
[
  {
    "id": "uuid-1234",
    "name": "Polo Dragon Basic",
    "price": 49.9,
    "image": "https://url.com/image.jpg",
    "category": "Polos",
    "stock": 15,
    "created_at": "2025-01-24T12:00:00Z"
  }
]
```

### 2. Órdenes (Checkout)

Crear una nueva orden de compra.

- **URL**: `/rest/v1/orders`
- **Método**: `POST`
- **Body Example**:

```json
{
  "customer_email": "cliente@email.com",
  "total": 129.8,
  "items": [
    {
      "product_id": "uuid-1234",
      "quantity": 2,
      "size": "L",
      "color": "Negro"
    }
  ],
  "status": "pending"
}
```

### 3. Newsletter (Suscripción)

Registrar correos para promociones.

- **URL**: `/rest/v1/newsletter_subs`
- **Método**: `POST`
- **Body**: `{ "email": "user@domain.com" }`

---

## 📊 Estructura de Datos (Schemas)

### Product Schema (Zod)

```typescript
const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  price: z.number().positive(),
  image: z.string().url(),
  category: z.enum(["Polos", "Poleras", "Shorts", "Pantalones"]),
  stock: z.number().int().nonnegative(),
});
```

---

## ⚠️ Manejo de Errores

La API devuelve códigos de estado HTTP estándar:

- `200/201`: Éxito.
- `400`: Solicitud incorrecta (validación fallida).
- `401`: No autorizado (falta token o es inválido).
- `404`: Recurso no encontrado.
- `500`: Error del servidor.
