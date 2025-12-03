# Configuración para PC de la Escuela

Esta guía explica cómo configurar el frontend y la app Kotlin para que funcionen con una IP diferente del backend.

## Frontend React

### Paso 1: Crear archivo `.env.local`

En la raíz del proyecto frontend (`proyecto-levelup-frontend/levelup-react/`), crea un archivo `.env.local` con el siguiente contenido:

```env
# IP del backend en la escuela (reemplaza con la IP real)
VITE_GATEWAY_URL=http://IP_DE_LA_ESCUELA:8094

# API Key (debe ser la misma que usa el backend)
VITE_API_KEY=levelup-2024-secret-api-key-change-in-production

# URL base para imágenes (S3)
VITE_IMAGE_BASE_URL=https://levelup-gamer-products.s3.us-east-1.amazonaws.com/

# Bypass health check (opcional, para desarrollo)
VITE_BYPASS_HEALTH=true
```

**Ejemplo:**
```env
VITE_GATEWAY_URL=http://192.168.1.50:8094
VITE_API_KEY=levelup-2024-secret-api-key-change-in-production
VITE_IMAGE_BASE_URL=https://levelup-gamer-products.s3.us-east-1.amazonaws.com/
VITE_BYPASS_HEALTH=true
```

### Paso 2: Reiniciar el servidor de desarrollo

Después de crear el archivo `.env.local`, reinicia el servidor de desarrollo:

```bash
# Detener el servidor actual (Ctrl+C)
# Luego iniciar de nuevo
npm run dev
```

### Nota importante

- El archivo `.env.local` tiene prioridad sobre `.env`
- No subas `.env.local` al repositorio (ya está en `.gitignore`)
- Si cambias de red, solo necesitas actualizar la IP en `.env.local`

---

## App Kotlin (Android)

### Paso 1: Editar `api-config.properties`

En la carpeta `Kotlin_app/levelup-backend/config/`, edita el archivo `api-config.properties` (o créalo si no existe, copiando desde `api-config.sample.properties`):

```properties
# URL del API Gateway para producción/escuela
gateway.url.release=http://IP_DE_LA_ESCUELA:8094/

# URL para dispositivo físico en la misma red
gateway.url.device=http://IP_DE_LA_ESCUELA:8094/

# URL para emulador (10.0.2.2 apunta al host desde el emulador)
gateway.url.debug=http://10.0.2.2:8094/

# API Key
gateway.api.key=levelup-2024-secret-api-key-change-in-production

# URL base para recursos multimedia (S3)
media.base.url=https://levelup-gamer-products.s3.us-east-1.amazonaws.com/
```

**Ejemplo:**
```properties
gateway.url.release=http://192.168.1.50:8094/
gateway.url.device=http://192.168.1.50:8094/
gateway.url.debug=http://10.0.2.2:8094/
gateway.api.key=levelup-2024-secret-api-key-change-in-production
media.base.url=https://levelup-gamer-products.s3.us-east-1.amazonaws.com/
```

### Paso 2: Recompilar la app

Después de editar `api-config.properties`, recompila la app:

```bash
# En Android Studio: Build > Rebuild Project
# O desde la terminal:
./gradlew clean assembleRelease
```

### Paso 3: Verificar `network_security_config.xml`

Si la IP de la escuela usa HTTP (no HTTPS), verifica `app/src/main/res/xml/network_security_config.xml`:

**Si la IP de la escuela está en un rango privado (192.168.x.x o 10.x.x.x):**
- Ya debería funcionar porque el archivo permite rangos privados
- Si no funciona, agrega la IP específica:

```xml
<domain-config cleartextTrafficPermitted="true">
    <!-- ... otras IPs ... -->
    <domain includeSubdomains="true">192.168.1.50</domain> <!-- IP de la escuela -->
</domain-config>
```

**Si la IP es pública o diferente:**
- Agrega la IP específica al archivo `network_security_config.xml`

---

## Cómo encontrar la IP del backend

### Si el backend está en la misma red local:

1. **En Windows:**
   ```powershell
   ipconfig
   ```
   Busca la IP en "IPv4 Address" (ej: 192.168.1.50)

2. **En Linux/Mac:**
   ```bash
   ifconfig
   # o
   ip addr
   ```

### Si el backend está en un servidor remoto:

- Usa la IP pública del servidor (ej: `98.83.239.227:8094`)
- O el dominio si tiene uno configurado

---

## Verificación

### Frontend:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Haz una petición (ej: cargar productos)
4. Verifica que la URL sea `http://IP_DE_LA_ESCUELA:8094/...`

### Kotlin:
1. Abre Logcat en Android Studio
2. Filtra por "OkHttp" o "ApiConfig"
3. Verifica que las peticiones vayan a `http://IP_DE_LA_ESCUELA:8094/...`

---

## Troubleshooting

### Error: "Network error" o "Connection refused"

- Verifica que la IP sea correcta
- Verifica que el puerto sea 8094
- Asegúrate de que el backend esté corriendo
- Verifica el firewall de Windows/Linux

### Error: "Cleartext traffic not permitted" (Kotlin)

- Agrega la IP a `network_security_config.xml`
- Verifica que `cleartextTrafficPermitted="true"` esté configurado

### Error: CORS (Frontend)

- Verifica que el backend tenga configurado CORS para permitir tu IP
- Revisa `application-prod.properties` del gateway

---

## Cambiar entre diferentes redes

Puedes tener múltiples archivos de configuración:

- `.env.local` - Para desarrollo local
- `.env.escuela` - Para la escuela (cópialo como `.env.local` cuando vayas)
- `api-config.properties` - Para Kotlin (edítalo según la red)

