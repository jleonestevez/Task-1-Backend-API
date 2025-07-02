# 🔒 Guía: Cómo usar autenticación JWT en Swagger UI

## ✅ Problema resuelto

Ahora **TODOS** los controladores tienen el decorador `@ApiBearerAuth()` y deberías ver el **candado 🔒** en cada endpoint protegido en Swagger UI.

## 📋 Pasos para autenticarte en Swagger

### 1. Abre Swagger UI
Ve a: http://localhost:3000/api

### 2. Crear un usuario (si no tienes uno)
- Ve a la sección **users**
- Usa `POST /users` (este endpoint es público)
- Datos de ejemplo:
```json
{
  "username": "testuser",
  "password": "password123"
}
```

### 3. Hacer login
- Ve a la sección **auth**
- Usa `POST /auth/login`
- Usa las mismas credenciales del paso anterior
- **Copia el `access_token` de la respuesta**

### 4. Configurar autenticación global en Swagger
- En la parte superior derecha de Swagger UI verás un botón **"Authorize" 🔓**
- Haz clic en **"Authorize"**
- En el campo **"Value"** pega SOLO el token (sin "Bearer")
  ```
  Correcto: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ❌ Incorrecto: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- Haz clic en **"Authorize"**
- Luego **"Close"**

### 5. ¡Usar cualquier endpoint protegido!
Ahora verás que:
- ✅ Todos los endpoints tienen un **candado cerrado 🔒**
- ✅ Las requests incluyen automáticamente `Authorization: Bearer <token>`
- ✅ Ya no recibirás error 401

## 🎯 Endpoints que ahora funcionan automáticamente

### Users
- `GET /users` - Obtener todos los usuarios
- `GET /users/{id}` - Obtener usuario por ID

### Customers  
- `GET /customers` - Obtener todos los customers
- `POST /customers` - Crear customer
- `GET /customers/{id}` - Obtener customer por ID
- `PATCH /customers/{id}` - Actualizar customer
- `DELETE /customers/{id}` - Eliminar customer

### Shop Items
- `GET /shop-items` - Obtener todos los productos
- `POST /shop-items` - Crear producto
- etc.

### Orders
- `GET /orders` - Obtener todas las órdenes
- `POST /orders` - Crear orden
- etc.

### Shop Item Categories
- `GET /shop-item-categories` - Obtener todas las categorías
- `POST /shop-item-categories` - Crear categoría
- etc.

## 🔧 Solución de problemas

### ❌ Si aún ves error 401:
1. **Verifica que hayas configurado la autorización** (paso 4)
2. **Revisa que el token no haya expirado** (expira en 1 hora)
3. **Refresca la página de Swagger** si acabas de configurar la auth
4. **Verifica que copiaste el token completo** sin espacios extra

### ✅ Cómo verificar que funciona:
1. Ve a `GET /auth/profile` y ejecuta - debe funcionar
2. Ve a `GET /users` y ejecuta - ahora también debe funcionar
3. Ve a `GET /customers` y ejecuta - ahora también debe funcionar

## 🎉 ¡Ya está!

Una vez configurada la autenticación en Swagger UI, **todas** las APIs protegidas funcionarán automáticamente sin tener que configurar headers manualmente para cada request. 

El token se envía automáticamente con cada request que hagas desde Swagger UI. 