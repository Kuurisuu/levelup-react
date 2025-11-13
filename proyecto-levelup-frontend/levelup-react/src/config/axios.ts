import axios, { AxiosError } from 'axios';
import { SecurityHeaders } from '../types/api';
import { healthMonitor } from './serviceHealth';
import { ServiceRegistry } from '../services/ServiceRegistry';

const env = import.meta.env;
const DEFAULT_GATEWAY = 'http://localhost:8094';

const normalize = (value?: string): string =>
  value && value.trim().length > 0
    ? value.trim().replace(/\/+$/, '')
    : '';

const buildUrl = (base: string, suffix: string): string =>
  base ? `${base}${suffix.startsWith('/') ? suffix : `/${suffix}`}` : '';

const GATEWAY =
  normalize(env.VITE_GATEWAY_URL) ||
  normalize(env.VITE_API_URL) ||
  normalize(DEFAULT_GATEWAY);

const MICROSERVICE_URLS = {
  gateway: GATEWAY,
  auth: normalize(env.VITE_AUTH_URL) || buildUrl(GATEWAY, '/auth'),
  productos: normalize(env.VITE_PRODUCTOS_URL) || buildUrl(GATEWAY, '/productos'),
  usuarios: normalize((env as any).VITE_USUARIOS_URL) || buildUrl(GATEWAY, '/usuarios'),
  carrito: normalize(env.VITE_CARRITO_URL) || buildUrl(GATEWAY, '/carrito'),
  pedidos: normalize(env.VITE_PEDIDOS_URL) || buildUrl(GATEWAY, '/pedidos'),
  pagos: normalize(env.VITE_PAGOS_URL) || buildUrl(GATEWAY, '/pagos'),
  eventos: normalize(env.VITE_EVENTOS_URL) || buildUrl(GATEWAY, '/eventos'),
  contenido: normalize(env.VITE_CONTENIDO_URL) || buildUrl(GATEWAY, '/contenido'),
  resenia: normalize(env.VITE_RESENIA_URL) || buildUrl(GATEWAY, '/resenias'),
  promociones: normalize(env.VITE_PROMOCIONES_URL) || buildUrl(GATEWAY, '/promociones'),
  referidos: normalize(env.VITE_REFERIDOS_URL) || buildUrl(GATEWAY, '/referidos'),
  imageBaseUrl:
    normalize(env.VITE_IMAGE_BASE_URL) ||
    buildUrl(normalize(env.VITE_PRODUCTOS_URL) || buildUrl(GATEWAY, '/productos'), '/img'),
};

// Bypass de health por defecto si no está configurado
const BYPASS_HEALTH = (env as any)?.VITE_BYPASS_HEALTH !== 'false';

// Configuración base de axios
const axiosConfig = axios.create({
  baseURL:
    MICROSERVICE_URLS.gateway ||
    MICROSERVICE_URLS.productos ||
    normalize(DEFAULT_GATEWAY),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: status => status >= 200 && status < 300,
  maxRetries: 3,
  retryDelay: 1000
});

// Interceptor para enrutar a diferentes microservicios
axiosConfig.interceptors.request.use(async config => {
  const originalUrl = config.url || '';
  const queryIndex = originalUrl.indexOf('?');
  const pathPart = queryIndex >= 0 ? originalUrl.slice(0, queryIndex) : originalUrl;
  const queryPart = queryIndex >= 0 ? originalUrl.slice(queryIndex) : '';

  const segments = pathPart.replace(/^\/+/, '').split('/').filter(Boolean);
  const service = segments[0] || 'productos';
  const remainingSegments = segments.slice(1);
  
  // Mapeo de servicios
  const serviceMap: { [key: string]: string } = {
    'auth': MICROSERVICE_URLS.auth,
    'productos': MICROSERVICE_URLS.productos,
    'usuarios': MICROSERVICE_URLS.usuarios,
    'carrito': MICROSERVICE_URLS.carrito,
    'pedidos': MICROSERVICE_URLS.pedidos,
    'pagos': MICROSERVICE_URLS.pagos,
    'resenias': MICROSERVICE_URLS.resenia,
    'promociones': MICROSERVICE_URLS.promociones,
    'referidos': MICROSERVICE_URLS.referidos,
    'puntos': MICROSERVICE_URLS.referidos,
    'gateway': MICROSERVICE_URLS.gateway,
    'eventos': MICROSERVICE_URLS.eventos,
    'contenido': MICROSERVICE_URLS.contenido,
  };
  
  const targetUrl = serviceMap[service] || MICROSERVICE_URLS.productos;
  let cleanedPath = remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/';
  if (!cleanedPath.startsWith('/')) {
    cleanedPath = `/${cleanedPath}`;
  }
  let finalUrl = cleanedPath;
  if (cleanedPath === '/') {
    finalUrl = queryPart ? queryPart : '';
  } else if (queryPart) {
    finalUrl += queryPart;
  }
  if (finalUrl === '//') {
    finalUrl = '/';
  }
  config.url = finalUrl;
  
  // Bypass health por defecto en desarrollo a menos que se fuerce false
  if (BYPASS_HEALTH) {
    config.baseURL = targetUrl;
  } else {
    const isHealthy = await ServiceRegistry.checkServiceHealth(service, targetUrl);
    config.baseURL = isHealthy ? targetUrl : ServiceRegistry.getFallbackService(service);
  }
  
  return config;
});

// Interceptor para agregar headers de autenticación
axiosConfig.interceptors.request.use(
  (config) => {
    // Agregar API Key (requerido para todas las peticiones)
    const apiKey = import.meta.env.VITE_API_KEY || 'levelup-2024-secret-api-key-change-in-production';
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }
    
    // Agregar JWT Token (si existe, para autenticación de usuario)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Agregar identificador de usuario (X-User-Id) para endpoints que lo requieren
    try {
      const rawSession = localStorage.getItem('lvup_user_session');
      if (rawSession) {
        const session = JSON.parse(rawSession);
        const userId = session?.userId ?? session?.id;
        if (userId) {
          (config.headers as any)['X-User-Id'] = String(userId);
        }
      }
    } catch (err) {
      console.warn('No se pudo leer lvup_user_session para X-User-Id', err);
    }
    
    // Add referral code if available
    const referralCode = localStorage.getItem('referral_code');
    if (referralCode) {
      (config.headers as any)['X-Referral-Code'] = referralCode;
    }
    
    // Agregar CSRF token si está disponible
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      (config.headers as any)['X-CSRF-Token'] = csrfToken;
    }

    // Add cart session ID if available
    const cartSessionId = localStorage.getItem('cart_session_id');
    if (cartSessionId) {
      (config.headers as any)['X-Cart-Session'] = cartSessionId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
axiosConfig.interceptors.response.use(
  response => {
    // Save cart session ID from response headers
    const cartSessionId = (response.headers as any)['x-cart-session'];
    if (cartSessionId) {
      localStorage.setItem('cart_session_id', cartSessionId);
    }

    // Handle cart merge response
    if ((response.headers as any)['x-cart-merged'] === 'true') {
      // Trigger cart refresh in the app
      window.dispatchEvent(new CustomEvent('cartMerged'));
    }

    // Transformar datos de respuesta si es necesario
    if ((response as any).data?.data) {
      return { ...response, data: (response as any).data.data } as any;
    }
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      // Error de red o timeout
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Error de conexión. Por favor, verifica tu conexión a internet.'));
    }

    if (error.response.status === 401) {
      try {
        const attemptedUrl = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`;
        console.warn('[Axios] 401 no autorizado en:', attemptedUrl);
      } catch (logErr) {
        console.warn('[Axios] 401 no autorizado (sin URL)', logErr);
      }
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    if (error.response.status >= 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject(new Error('Error del servidor. Por favor, intenta más tarde.'));
    }

    if (error.response?.status === 409) {
      // Handle cart conflicts
      console.error('Cart sync error:', (error.response as any).data);
      window.dispatchEvent(new CustomEvent('cartSyncError'));
    }

    // Reintentar solicitud en caso de error (excepto 401, 403, 404)
    const status = error.response.status;
    const config: any = error.config || {};
    
    if (![401, 403, 404].includes(status) && (config as any).retryCount < (config as any).maxRetries) {
      (config as any).retryCount = ((config as any).retryCount || 0) + 1;
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(axiosConfig(config));
        }, (config as any).retryDelay * (config as any).retryCount);
      });
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;