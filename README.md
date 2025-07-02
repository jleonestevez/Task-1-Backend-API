# Task-1 Backend API (NestJS + SQLite)

## Objetivo

Este proyecto tiene como finalidad **evaluar las funcionalidades de _Cursor_** (extensión/IDE basada en IA)
y compararlas con las que ofrece **_Air_ de JetBrains**.  Para ello se construye una API REST sencilla de
comercio electrónico que cubre las operaciones CRUD más habituales y genera documentación automática vía Swagger.

> La idea es clonar el repositorio en ambos entornos, realizar refactorizaciones, navegación entre símbolos,
autocompletado, generación de código, etc., y medir la productividad y experiencia de uso.

---

## Stack técnico

| Herramienta                | Versión | Uso principal                                |
|----------------------------|---------|----------------------------------------------|
| Node.js                    | >= 18   | Runtime                                      |
| NestJS                     | 10.x    | Framework HTTP                               |
| TypeORM                    | 0.3.x   | ORM y migraciones                            |
| SQLite                     | 3       | Base de datos embebida                       |
| class-validator / transformer | 0.14  | Validación y transformación DTOs             |
| @nestjs/swagger + swagger-ui | 7.x   | Generación de documentación OpenAPI          |

---

## Puesta en marcha

```bash
# instalar dependencias
npm install

# arrancar la API en modo dev
npm run start:dev

# la API estará disponible en http://localhost:3000
# la documentación Swagger en http://localhost:3000/api
```

---

## Catálogo de APIs

Las rutas siguen convención REST.  Todas las respuestas y cuerpos de petición están documentados en **Swagger**.
A continuación se listan los endpoints principales.

### Customers

| Método | Endpoint                 | Descripción                  |
|--------|--------------------------|------------------------------|
| GET    | /customers               | Listar clientes              |
| GET    | /customers/{id}          | Obtener cliente concreto     |
| POST   | /customers               | Crear nuevo cliente          |
| PATCH  | /customers/{id}          | Actualizar cliente           |
| DELETE | /customers/{id}          | Eliminar cliente             |

Ejemplo de _payload_ `POST /customers`:
```json
{
  "name": "Ada",
  "surname": "Lovelace",
  "email": "ada@lovelace.dev"
}
```

### Shop-Item-Categories

| Método | Endpoint                              | Descripción                        |
|--------|---------------------------------------|------------------------------------|
| GET    | /shop-item-categories                 | Listar categorías                  |
| GET    | /shop-item-categories/{id}            | Obtener categoría                  |
| POST   | /shop-item-categories                 | Crear categoría                    |
| PATCH  | /shop-item-categories/{id}            | Actualizar categoría               |
| DELETE | /shop-item-categories/{id}            | Eliminar categoría                 |

### Shop-Items

| Método | Endpoint                | Descripción                                        |
|--------|-------------------------|----------------------------------------------------|
| GET    | /shop-items             | Listar artículos                                   |
| GET    | /shop-items/{id}        | Obtener artículo                                   |
| POST   | /shop-items             | Crear artículo (opcional categoryIds)              |
| PATCH  | /shop-items/{id}        | Actualizar artículo                                |
| DELETE | /shop-items/{id}        | Eliminar artículo                                  |

### Orders

| Método | Endpoint       | Descripción                                     |
|--------|----------------|-------------------------------------------------|
| GET    | /orders        | Listar pedidos                                  |
| GET    | /orders/{id}   | Obtener pedido                                  |
| POST   | /orders        | Crear pedido (customerId + items)               |
| PATCH  | /orders/{id}   | Actualizar pedido (lista de items)              |
| DELETE | /orders/{id}   | Eliminar pedido                                 |

Ejemplo `POST /orders`:
```json
{
  "customerId": 1,
  "items": [
    { "shopItemId": 3, "quantity": 2 },
    { "shopItemId": 5, "quantity": 1 }
  ]
}
```

---

## Estructura de carpetas principal

```
src/
├── customers
│   ├── customer.entity.ts
│   └── ...
├── shop-item-categories
├── shop-items
├── orders
└── main.ts (bootstrap + Swagger)
```

---

## Próximos pasos (opcional)

- Añadir autenticación JWT.
- Implementar paginación y filtros avanzados.
- Configurar CI/CD para pruebas automáticas.

---

### Licencia

MIT © 2025

---

## Autenticación JWT y pruebas desde Swagger

Todas las rutas (excepto `POST /users` y `POST /auth/login`) requieren autenticación JWT mediante el header:

```
Authorization: Bearer <token>
```

### Prueba paso a paso desde Swagger

1. **Registrar usuario**
   - Ve a `/api` (Swagger UI).
   - Busca `POST /users` → "Try it out".
   - Payload de ejemplo:
     ```json
     {
       "username": "demo",
       "password": "secret123"
     }
     ```
   - Haz "Execute".

2. **Login y obtención de token**
   - Busca `POST /auth/login` → "Try it out".
   - Usa el mismo payload.
   - Haz "Execute" y copia SOLO el valor de `access_token` de la respuesta.

3. **Autorizar en Swagger**
   - Haz clic en el botón "Authorize" (candado arriba a la derecha).
   - Pega el token (sin "Bearer", solo el string).
   - Haz "Authorize" y "Close".

4. **Consumir endpoints protegidos**
   - Por ejemplo, `GET /customers` → "Try it out" → "Execute".
   - Si el token es válido, verás la respuesta (no un 401).

### Troubleshooting (si ves 401 Unauthorized)

- Asegúrate de pegar solo el token, sin espacios ni "Bearer".
- Verifica en la pestaña "Request" de Swagger que el header sea:
  ```
  Authorization: Bearer <tu-token>
  ```
- Si el token está expirado, repite el login.
- Si cambiaste el código, reinicia el backend y refresca Swagger (Ctrl+F5).
- Prueba también con curl:
  ```bash
  curl -H "Authorization: Bearer <tu-token>" http://localhost:3000/customers
  ```

Si el curl funciona pero Swagger no, el problema es de la UI Swagger (cache, token viejo, etc).

---

También puedes consultar y probar todos los endpoints desde la UI Swagger: abre `http://localhost:3000/api`, pulsa el botón **Authorize**, pega el token y prueba los endpoints protegidos.
