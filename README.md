# Level-Up Gamer - Frontend

Frontend de la plataforma e-commerce Level-Up Gamer desarrollado con React 18.2.0 y TypeScript 5.0.0.

## Descripción

Aplicación web frontend para la tienda online Level-Up Gamer, especializada en productos gaming y tecnología. El frontend se comunica con un backend de microservicios mediante API REST a través de un API Gateway.

## Tecnologías

- **React** 18.2.0
- **TypeScript** 5.0.0
- **Vite** 7.2.2
- **React Router DOM** 6.x
- **Axios** - Cliente HTTP
- **Bootstrap Icons** - Iconografía
- **Vitest** - Testing
- **React Testing Library** - Testing de componentes

## 📦 Instalación

### Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Kuurisuu/levelup-react.git
cd levelup-react/proyecto-levelup-frontend/levelup-react
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con las siguientes variables:

```env
# API Gateway
VITE_GATEWAY_URL=http://localhost:8094/api/v1

# API Key (requerida para todas las peticiones)
VITE_API_KEY=levelup-2024-secret-api-key-change-in-production

# URLs de microservicios (opcionales, por defecto usan Gateway)
VITE_AUTH_URL=http://localhost:8094/api/v1
VITE_PRODUCTOS_URL=http://localhost:8094/api/v1
VITE_CARRITO_URL=http://localhost:8094/api/v1
VITE_PEDIDOS_URL=http://localhost:8094/api/v1
VITE_PAGOS_URL=http://localhost:8094/api/v1

# Imágenes
VITE_IMAGE_BASE_URL=https://levelup-gamer-products.s3.us-east-1.amazonaws.com/img

# Health checks
VITE_BYPASS_HEALTH=false
```

## Scripts Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar servidor de desarrollo con host público
npm run dev -- --host
```

### Producción

```bash
# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

### Testing

```bash
# Ejecutar tests en modo watch
npm test

# Ejecutar tests una sola vez
npm run test:run

# Ejecutar tests con cobertura
npm run test:coverage
```

### Linting

```bash
# Ejecutar ESLint
npm run lint

# Corregir errores de ESLint automáticamente
npm run lint:fix
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Admin/           # Componentes del panel administrativo
│   ├── Carrito/         # Componentes del carrito de compras
│   ├── Checkout/        # Componentes del proceso de checkout
│   ├── Form/            # Componentes de formularios
│   ├── Profile/         # Componentes del perfil de usuario
│   └── ...
├── config/              # Configuración (Axios, servicios)
├── data/                # Datos y servicios de catálogo
├── hooks/               # Custom hooks
├── logic/               # Lógica de negocio (filtros, auth, carrito)
├── pages/               # Páginas principales
├── services/            # Servicios de API
├── styles/              # Archivos CSS
├── types/               # Definiciones de tipos TypeScript
└── utils/               # Utilidades y helpers
```

## Configuración

### Variables de Entorno

El proyecto utiliza variables de entorno para configurar las URLs de los microservicios. Todas las variables deben comenzar con `VITE_` para que Vite las exponga al código del frontend.

**Variables principales:**

- `VITE_GATEWAY_URL`: URL base del API Gateway
- `VITE_API_KEY`: Clave API para autenticación de peticiones
- `VITE_IMAGE_BASE_URL`: URL base para imágenes en S3
- `VITE_BYPASS_HEALTH`: Deshabilitar health checks (desarrollo)

### Configuración de Axios

El cliente HTTP está configurado en `src/config/axios.ts` y maneja automáticamente:

- Enrutamiento a microservicios según la ruta
- Agregado de headers de autenticación (JWT, API Key)
- Manejo de errores (401, 403, 500)
- Retry automático en fallos temporales

## Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación:

1. **Login**: El usuario inicia sesión y recibe `accessToken` y `refreshToken`
2. **Almacenamiento**: Los tokens se guardan en `localStorage`
3. **Peticiones**: Axios agrega automáticamente el token en el header `Authorization`
4. **Renovación**: Si el token expira, se intenta renovar con `refreshToken`
5. **Sesión persistente**: La sesión se mantiene incluso después de recargar la página

### Roles de Usuario

- **CLIENTE**: Acceso básico a la tienda
- **ADMINISTRADOR**: Acceso total, incluyendo panel de administración
- **VENDEDOR**: Gestión de productos y pedidos
- **MODERADOR**: Moderación de contenido

## Características Principales

### Catálogo de Productos
- Visualización de productos con filtros avanzados
- Búsqueda por nombre
- Filtrado por categoría, precio, disponibilidad, rating
- Paginación
- Detalle de producto

### Carrito de Compras
- Agregar/eliminar productos
- Modificar cantidades
- Persistencia en localStorage
- Sincronización con backend

### Checkout
- Formulario de envío
- Procesamiento de pago (simulado)
- Checkout rápido para usuarios experimentados
- Persistencia de datos entre pasos

### Panel de Administración
- Gestión de productos (CRUD)
- Gestión de usuarios
- Acceso restringido por roles

### Perfil de Usuario
- Visualización y edición de datos personales
- Historial de pedidos
- Gestión de direcciones

## Testing

El proyecto incluye tests unitarios e integración usando Vitest y React Testing Library.

**Ejecutar tests:**
```bash
npm test
```

**Cobertura de tests:**
- Componentes principales
- Lógica de negocio
- Utilidades
- Hooks personalizados

## Responsive Design

La aplicación está diseñada para ser responsive y funcionar en:

- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## Despliegue

### Build de Producción

```bash
npm run build
```

El build se genera en la carpeta `dist/` y puede ser servido por cualquier servidor web estático.

### Despliegue en AWS

1. Construir el proyecto:
```bash
npm run build
```

2. Subir la carpeta `dist/` a S3 o servidor web
3. Configurar variables de entorno en el servidor
4. Configurar CORS en el backend para permitir el dominio de producción

### Docker

El proyecto incluye un `Dockerfile` para despliegue con Docker:

```bash
docker build -t levelup-frontend .
docker run -p 5173:5173 levelup-frontend
```

## Integración con Backend

El frontend se comunica con el backend mediante:

- **API Gateway**: Punto único de entrada (puerto 8094)
- **Microservicios**: 13 microservicios independientes
- **REST API**: 62 endpoints documentados
- **Swagger**: Documentación disponible en `/swagger-ui.html`

### Endpoints Principales

- `/api/v1/auth/**` - Autenticación
- `/api/productos/**` - Productos
- `/api/carrito/**` - Carrito de compras
- `/api/pedidos/**` - Pedidos
- `/api/pagos/**` - Pagos

## Documentación Adicional

- **Documentación de APIs**: Ver `Documentacion_API_LevelUp_Gamer_COMPLETA.xlsx`
- **Swagger**: http://localhost:8094/swagger-ui.html (desarrollo)

## Solución de Problemas

### Error: "Network error: timeout"
- Verificar que el backend esté corriendo
- Verificar la URL del Gateway en `.env`
- Verificar conectividad de red

### Error: "401 Unauthorized"
- Verificar que el token JWT sea válido
- Hacer login nuevamente
- Verificar que el token no haya expirado

### Error: "403 Forbidden"
- Verificar que el usuario tenga los permisos necesarios
- Verificar el rol del usuario en el backend

### La página se ve en negro
- Verificar la consola del navegador para errores
- Verificar que todas las dependencias estén instaladas
- Ejecutar `npm install` nuevamente

## Contribución

1. Crear una rama desde `dev`
2. Realizar los cambios
3. Crear un Pull Request a `dev`
4. Esperar revisión y aprobación

## Licencia

Este proyecto es privado y propiedad de Level-Up Gamer.

## Contacto

Para soporte técnico o consultas:
- Email: soporte@levelup.cl
- Teléfono: +56 9 1234 5678

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025

