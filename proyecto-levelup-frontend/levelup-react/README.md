# LevelUp Frontend (React + Vite)

Este proyecto consume los microservicios del ecosistema LevelUp a través del API Gateway.  
La aplicación está pensada para ejecutarse contra el stack Docker (`http://localhost:8094`) y poder
moverse a un despliegue en la nube cambiando un único archivo.

## Configuración de entornos

Todas las rutas de microservicios se resuelven dinámicamente desde `VITE_GATEWAY_URL`.  
Para apuntar a Docker local o a producción solo debes modificar **un archivo**:

- `.env` (para desarrollo) o
- `docker.env` (cuando se usa `docker compose` con la app)

Contenido esperado:

```
VITE_GATEWAY_URL=http://localhost:8094
VITE_IMAGE_BASE_URL=https://levelup-gamer-products.s3.us-east-1.amazonaws.com/img
VITE_API_KEY=levelup-2024-secret-api-key-change-in-production
VITE_BYPASS_HEALTH=true
```

En producción basta con actualizar `VITE_GATEWAY_URL` al dominio/IP público del Gateway
(por ejemplo `https://api.levelup.duoc.cl`). El resto de microservicios se derivan automáticamente.

> Nota: si necesitas sobreescribir un microservicio puntual puedes definir
> `VITE_<SERVICIO>_URL` y el interceptor de Axios usará ese valor en lugar de la URL base.

## Scripts frecuentes

- `npm install`
- `npm run dev`
- `npm run build`

## Testing

Se recomienda ejecutar las suites de unit testing y e2e antes de cada despliegue (`npm run test`).  
Asegúrate de que el backend expone correctamente los endpoints `health` para evitar reintentos innecesarios.
