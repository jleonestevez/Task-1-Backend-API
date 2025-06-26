# Task 1 Backend API

## 📋 Objetivo del Proyecto

Este proyecto tiene como objetivo principal **probar y evaluar el IDE "Air" de JetBrains** mediante el desarrollo de una API backend completa. La aplicación implementa un sistema de gestión comercial que incluye usuarios, clientes, productos y órdenes, utilizando tecnologías modernas y mejores prácticas de desarrollo.

## 🚀 Tecnologías Utilizadas

- **Framework**: NestJS (Node.js)
- **Base de Datos**: SQLite3 con TypeORM
- **Autenticación**: JWT + Passport (Local Strategy)
- **Validación**: class-validator & class-transformer
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest
- **Lenguaje**: TypeScript

## 📖 Descripción del Sistema

La API proporciona un sistema completo para la gestión de:

- **Usuarios**: Sistema de autenticación y gestión de usuarios
- **Clientes**: Registro y administración de clientes
- **Categorías de Productos**: Organización de productos por categorías
- **Productos (Shop Items)**: Catálogo de productos con precios y stock
- **Órdenes**: Sistema completo de gestión de pedidos con items múltiples

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- SQLite3

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd Task-1-Backend-API
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   El archivo `.env` ya está configurado con valores por defecto:
   ```env
   # Database
   DATABASE_PATH=./database.sqlite
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
   JWT_EXPIRES_IN=7d
   
   # Application
   PORT=3000
   NODE_ENV=development
   ```

4. **Ejecutar la aplicación**

   **Modo desarrollo (con hot reload):**
   ```bash
   npm run start:dev
   ```

   **Modo producción:**
   ```bash
   npm run build
   npm run start:prod
   ```

5. **Acceder a la aplicación**
   - API Base URL: `http://localhost:3000/api`
   - Documentación Swagger: `http://localhost:3000/api/docs`

## 📚 Documentación de la API

### Base URL
```
http://localhost:3000/api
```

### 🚀 Guía de Inicio Rápido

Para comenzar a usar la API, sigue estos pasos:

#### 1. Crear un Usuario
Primero, crea un usuario que utilizarás para autenticarte:

```bash
POST /api/users
Content-Type: application/json

{
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "password": "securePassword123"
}
```

#### 2. Obtener Token de Autenticación
Inicia sesión para obtener tu token JWT:

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin@example.com",
  "password": "securePassword123"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User"
  }
}
```

#### 3. Usar el Token para Acceder a Endpoints Protegidos
Incluye el token en el header Authorization de todas las peticiones posteriores:

```bash
GET /api/customers?page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Autenticación

La API utiliza JWT Bearer Token para la autenticación. Para acceder a endpoints protegidos, incluye el header:
```
Authorization: Bearer <your-jwt-token>
```

### Paginación

Todos los endpoints que retornan listas soportan paginación mediante query parameters:

- `page`: Número de página (empieza en 1, por defecto: 1)
- `limit`: Elementos por página (máximo 100, por defecto: 10)

**Ejemplo:**
```bash
GET /api/customers?page=2&limit=20
```

**Respuesta paginada:**
```json
{
  "data": [...],
  "total": 150,
  "page": 2,
  "limit": 20,
  "totalPages": 8,
  "hasNext": true,
  "hasPrev": true
}
```

### Endpoints Principales

#### 🔐 Autenticación (`/auth`)

| Método | Endpoint | Descripción | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/auth/login` | Iniciar sesión y obtener JWT token | No |

**Ejemplo de Login:**
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "password123"
}
```

#### 👥 Usuarios (`/users`)

| Método | Endpoint | Descripción | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/users` | Crear nuevo usuario | Sí |
| GET    | `/users?page=1&limit=10` | Obtener usuarios (paginado) | Sí |
| GET    | `/users/:id` | Obtener usuario por ID | Sí |
| PATCH  | `/users/:id` | Actualizar usuario | Sí |
| DELETE | `/users/:id` | Eliminar usuario | Sí |

#### 👤 Clientes (`/customers`)

| Método | Endpoint | Descripción | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/customers` | Crear nuevo cliente | No |
| GET    | `/customers?page=1&limit=10` | Obtener clientes (paginado) | Sí |
| GET    | `/customers/:id` | Obtener cliente por ID | Sí |
| PATCH  | `/customers/:id` | Actualizar cliente | Sí |
| DELETE | `/customers/:id` | Eliminar cliente | Sí |

**Ejemplo de creación de cliente:**
```json
POST /api/customers
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@email.com",
  "phone": "+1234567890",
  "address": "Calle Principal 123"
}
```

#### 🏷️ Categorías de Productos (`/shop-item-categories`)

| Método | Endpoint | Descripción | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/shop-item-categories` | Crear nueva categoría | Sí |
| GET    | `/shop-item-categories?page=1&limit=10` | Obtener categorías (paginado) | Sí |
| GET    | `/shop-item-categories/:id` | Obtener categoría por ID | Sí |
| PATCH  | `/shop-item-categories/:id` | Actualizar categoría | Sí |
| DELETE | `/shop-item-categories/:id` | Eliminar categoría | Sí |

#### 🛍️ Productos (`/shop-items`)

| Método | Endpoint | Descripción | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/shop-items` | Crear nuevo producto | Sí |
| GET    | `/shop-items?page=1&limit=10` | Obtener productos (paginado) | Sí |
| GET    | `/shop-items/:id` | Obtener producto por ID | Sí |
| PATCH  | `/shop-items/:id` | Actualizar producto | Sí |
| DELETE | `/shop-items/:id` | Eliminar producto | Sí |

**Ejemplo de creación de producto:**
```json
POST /api/shop-items
{
  "name": "Laptop Gaming",
  "description": "Laptop para gaming de alta gama",
  "price": 1299.99,
  "stock": 10,
  "categoryIds": [1, 2]
}
```

#### 📦 Órdenes (`/orders`)

| Método | Endpoint | Descripción | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/orders` | Crear nueva orden | Sí |
| GET    | `/orders?page=1&limit=10` | Obtener órdenes (paginado) | Sí |
| GET    | `/orders/:id` | Obtener orden por ID | Sí |
| PATCH  | `/orders/:id` | Actualizar orden | Sí |
| DELETE | `/orders/:id` | Eliminar orden | Sí |

**Ejemplo de creación de orden:**
```json
POST /api/orders
{
  "customerId": 1,
  "items": [
    {
      "shopItemId": 1,
      "quantity": 2,
      "unitPrice": 1299.99
    },
    {
      "shopItemId": 2,
      "quantity": 1,
      "unitPrice": 299.99
    }
  ]
}
```

## 🗂️ Estructura del Proyecto

```
src/
├── auth/                     # Módulo de autenticación
│   ├── dto/                  # DTOs para login
│   ├── guards/               # Guards JWT y Local
│   ├── strategies/           # Estrategias de Passport
│   ├── auth.controller.ts    # Controlador de autenticación
│   ├── auth.service.ts       # Lógica de autenticación
│   └── auth.module.ts        # Módulo de autenticación
├── customers/                # Módulo de clientes
│   ├── dto/                  # DTOs para clientes
│   ├── entities/             # Entidad Customer
│   ├── customers.controller.ts
│   ├── customers.service.ts
│   └── customers.module.ts
├── users/                    # Módulo de usuarios
│   ├── dto/                  # DTOs para usuarios
│   ├── entities/             # Entidad User
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── shop-item-categories/     # Módulo de categorías
│   ├── dto/
│   ├── entities/
│   ├── shop-item-categories.controller.ts
│   ├── shop-item-categories.service.ts
│   └── shop-item-categories.module.ts
├── shop-items/               # Módulo de productos
│   ├── dto/
│   ├── entities/
│   ├── shop-items.controller.ts
│   ├── shop-items.service.ts
│   └── shop-items.module.ts
├── orders/                   # Módulo de órdenes
│   ├── dto/
│   ├── entities/             # Order y OrderItem
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
├── app.module.ts             # Módulo principal
└── main.ts                   # Punto de entrada
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:cov

# Ejecutar tests e2e
npm run test:e2e
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Iniciar en modo desarrollo
npm run start:debug        # Iniciar en modo debug

# Producción
npm run build              # Compilar proyecto
npm run start:prod         # Iniciar en modo producción

# Calidad de código
npm run lint               # Ejecutar ESLint
npm run format             # Formatear código con Prettier
```

## 📋 Funcionalidades Implementadas

### ✅ Características Principales

- **Autenticación JWT**: Sistema completo de login con tokens seguros
- **Validación de Datos**: Validación automática con class-validator
- **Documentación Swagger**: API completamente documentada
- **Relaciones de Base de Datos**: Manejo de relaciones complejas con TypeORM
- **Manejo de Errores**: Respuestas de error consistentes
- **CORS Habilitado**: Configurado para desarrollo frontend
- **Transformación de Datos**: Serialización automática de respuestas

### 🔒 Seguridad

- Autenticación basada en JWT
- Hasheo de contraseñas con bcrypt
- Validación de entrada en todos los endpoints
- Guards para proteger rutas sensibles

## 🎯 Evaluación del IDE Air de JetBrains

Este proyecto fue desarrollado específicamente para evaluar las capacidades del IDE Air de JetBrains, incluyendo:

- **IntelliSense avanzado** para TypeScript y NestJS
- **Debugging integrado** para aplicaciones Node.js
- **Integración con Git** y control de versiones
- **Soporte para testing** con Jest
- **Autocompletado** para decoradores de NestJS
- **Refactoring automático** y sugerencias de código
- **Integración con terminal** y ejecución de scripts

## 🚀 Próximos Pasos

1. Implementar paginación en endpoints de listado
2. Agregar filtros y búsqueda avanzada  
3. Implementar subida de archivos para imágenes de productos
4. Agregar notificaciones por email
5. Implementar logs estructurados
6. Agregar rate limiting
7. Implementar cache con Redis

## 📝 Notas de Desarrollo

- La base de datos SQLite se crea automáticamente en la primera ejecución
- El modo `synchronize: true` está habilitado para desarrollo (desactivar en producción)
- Los logs están habilitados en modo desarrollo
- La documentación Swagger se actualiza automáticamente

## 🤝 Contribución

Este proyecto está diseñado para evaluar el IDE Air. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Desarrollado para evaluar JetBrains Air IDE** 🚀