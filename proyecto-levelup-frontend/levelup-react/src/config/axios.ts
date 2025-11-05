import axios, { AxiosError } from 'axios';
import { SecurityHeaders } from '../types/api';
import { healthMonitor } from './serviceHealth';
import { ServiceRegistry } from '../services/ServiceRegistry';

const MICROSERVICE_URLS = {
  auth: 'http://localhost:8001/api/v1',
  productos: 'http://localhost:8003/api/v1',
  carrito: 'http://localhost:8008/api/v1',
  pedidos: 'http://localhost:8085/api/v1',
  pagos: 'http://localhost:8011/api/v1',
  eventos: 'http://localhost:8092',
  contenido: 'http://localhost:8093',
  resenia: 'http://localhost:8010/api/v1',
  promociones: 'http://localhost:8091/api/v1',
  referidos: 'http://localhost:8005/api/v1',
  gateway: 'http://localhost:8094/api/v1',
  imageBaseUrl: 'http://localhost:8003/api/v1/img',
};

// Bypass de health por defecto si no está configurado
const BYPASS_HEALTH = (import.meta as any).env?.VITE_BYPASS_HEALTH !== 'false';

// Configuración base de axios
const axiosConfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL || MICROSERVICE_URLS.productos,
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
  const url = config.url || '';
  const pathParts = url.split('/').filter(p => p);
  const service = pathParts[0] || 'productos';
  
  // Mapeo de servicios
  const serviceMap: { [key: string]: string } = {
    'auth': MICROSERVICE_URLS.auth,
    'productos': MICROSERVICE_URLS.productos,
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