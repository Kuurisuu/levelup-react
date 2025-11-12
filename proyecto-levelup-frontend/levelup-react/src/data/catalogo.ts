import axiosConfig from '../config/axios';

// Keep only the type definitions
export interface Categoria {
  id: string;
  nombre: string;
}

export interface Subcategoria {
  id: string;
  nombre: string;
  categoria: Categoria;
}

export interface Review {
  id: string;
  productoId: string;
  usuarioNombre: string;
  rating: number;
  comentario: string;
  fecha: string;
}

export interface ImagenCarrusel {
  id: number;
  imagenUrl: string;
  titulo: string;
  descripcion: string;
  enlace: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  categoria: Categoria;
  subcategoria?: Subcategoria;
  rating: number;
  disponible: boolean;
  destacado: boolean;
  stock: number;
  imagenesUrls: string[];
  fabricante?: string;
  distribuidor?: string;
  descuento?: number;
  reviews: Review[];
  productosRelacionados: Producto[];
  // Propiedades calculadas
  precioConDescuento?: number;
  ratingPromedio: number;
  codigo?: string;
  categoriaId?: string;
  categoriaNombre?: string;
  subcategoriaId?: string;
  subcategoriaNombre?: string;
}

// Mapeo desde DTO del backend al tipo local Producto
function mapCategoria(input?: string): Categoria {
  if (!input) return categorias[0];
  // Buscar por id o nombre
  const byId = categorias.find(c => c.id === input);
  if (byId) return byId;
  const byName = categorias.find(c => c.nombre.toLowerCase() === String(input).toLowerCase());
  return byName || categorias[0];
}

export function mapProductoDTO(dto: any): Producto {
  // Priorizar imagenUrl del backend (URL completa de S3 construida)
  // Si no existe, usar imagenS3Key (referencia S3) o imagen (compatibilidad Base64)
  const baseImg =
    ((import.meta as any).env?.VITE_IMAGE_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  '';
  // Priorizar imagenUrl (URL completa de S3 desde el backend)
  const rawImg = dto.imagenUrl || dto.imagenS3Key || dto.imagen || '';
  let imagenUrlResolved = '';
  
  if (rawImg) {
    // Si es URL completa (S3 o HTTP), usarla directamente
    if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
      imagenUrlResolved = rawImg;
    } 
    // Si es Base64 (data:image), usarlo directamente
    else if (rawImg.startsWith('data:image')) {
      imagenUrlResolved = rawImg;
    } 
    // Si es una referencia S3 (key) o ruta local, construir URL completa
    else {
      // Limpiar ruta: quitar ./, ./ iniciales y / inicial
      let clean = rawImg.replace(/^\./, '').replace(/^\/+/, '');
      // Si ya empieza con img/, quitarlo para evitar duplicación (el baseImg ya incluye /img)
      clean = clean.replace(/^img\//, '');
      // Construir URL completa: baseImg + / + ruta limpia
      imagenUrlResolved = baseImg ? `${baseImg}/${clean}` : `/img/${clean}`;
    }
  }
  
  const categoriaIdRaw = dto.categoriaId ?? dto.categoria?.id ?? dto.categoria ?? '';
  const categoriaId = String(categoriaIdRaw || '').trim();
  const categoriaBase = mapCategoria(categoriaId);
  const categoriaNombre = dto.categoriaNombre ?? dto.categoria?.nombre ?? categoriaBase.nombre;
  const categoria: Categoria = {
    id: categoriaId || categoriaBase.id,
    nombre: categoriaNombre,
  };

  // Mapear subcategoría - puede venir como objeto o como ID
  const subcategoriaIdRaw = dto.subcategoriaId ?? dto.subcategoria?.id ?? '';
  const subcategoriaId = String(subcategoriaIdRaw || '').trim();
  const subcategoriaNombre = dto.subcategoriaNombre ?? dto.subcategoria?.nombre ?? '';
  const subcategoria = subcategoriaId
    ? {
        id: subcategoriaId,
        nombre: subcategoriaNombre,
        categoria,
      }
    : undefined;
  
  return {
    id: String(dto.id ?? dto.idProducto ?? ''),
    nombre: dto.nombre ?? dto.nombreProducto ?? dto.titulo ?? (dto.titulo ?? ''),
    descripcion: dto.descripcion ?? dto.descripcionProducto ?? '',
    precio: Number(dto.precio ?? dto.precioProducto ?? 0),
    imagenUrl: imagenUrlResolved,
    categoria,
    subcategoria,
    rating: Number(dto.rating ?? dto.ratingPromedio ?? 0),
    disponible: dto.disponible ?? dto.activo ?? true,
    destacado: Boolean(dto.destacado ?? false),
    stock: Number(dto.stock ?? 0),
    imagenesUrls: (() => {
      let urls: string[] = [];
      
      // Priorizar imagenesUrls (URLs completas de S3 desde el backend)
      if (Array.isArray(dto.imagenesUrls)) {
        urls = dto.imagenesUrls;
      } 
      // Si no, intentar parsear imagenesUrls (JSON string de URLs completas de S3)
      else if (typeof dto.imagenesUrls === 'string' && dto.imagenesUrls.trim()) {
        try {
          urls = JSON.parse(dto.imagenesUrls);
        } catch (e) {
          urls = [];
        }
      }
      // Si no, intentar parsear imagenesS3Keys (JSON string de referencias S3)
      else if (typeof dto.imagenesS3Keys === 'string' && dto.imagenesS3Keys.trim()) {
        try {
          const keys = JSON.parse(dto.imagenesS3Keys);
          // Construir URLs de S3 desde las keys
          urls = keys.map((key: string) => {
            if (key.startsWith('http://') || key.startsWith('https://')) {
              return key; // Ya es URL completa
            }
            // Construir URL desde la key
            const clean = key.replace(/^\./, '').replace(/^\/+/, '').replace(/^img\//, '');
            return baseImg ? `${baseImg}/${clean}` : `/img/${clean}`;
          });
        } catch (e) {
          urls = [];
        }
      }
      // Si no, intentar parsear imagenes (JSON string legacy)
      else if (dto.imagenes) {
        try {
          urls = JSON.parse(dto.imagenes);
        } catch (e) {
          urls = [];
        }
      }
      
      // Si no hay URLs, usar solo la imagen principal
      return urls.length > 0 ? urls : [imagenUrlResolved];
    })(),
    fabricante: dto.fabricante,
    distribuidor: dto.distribuidor,
    descuento: typeof dto.enOferta === 'boolean' && dto.enOferta ? (dto.descuento ?? 10) : dto.descuento,
    reviews: Array.isArray(dto.reviews) ? dto.reviews : [],
    productosRelacionados: [],
    precioConDescuento: dto.precioOferta ?? dto.precioConDescuento ?? undefined,
    ratingPromedio: Number(dto.ratingPromedio ?? dto.rating ?? 0),
    codigo: dto.codigo ?? dto.codigoProducto ?? dto.codigo_producto ?? undefined,
    categoriaId,
    categoriaNombre,
    subcategoriaId,
    subcategoriaNombre,
  };
}

// Clave para almacenar productos en localStorage
const PRODUCTOS_STORAGE_KEY = 'levelup_productos_cache';
const PRODUCTOS_CACHE_TIMESTAMP_KEY = 'levelup_productos_cache_timestamp';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos

// Guardar productos en localStorage
export const guardarProductosEnCache = (productos: Producto[]): void => {
  try {
    localStorage.setItem(PRODUCTOS_STORAGE_KEY, JSON.stringify(productos));
    localStorage.setItem(PRODUCTOS_CACHE_TIMESTAMP_KEY, Date.now().toString());
    console.log('✅ Productos guardados en localStorage:', productos.length);
  } catch (error) {
    console.error('❌ Error al guardar productos en localStorage:', error);
  }
};

// Cargar productos desde localStorage
export const cargarProductosDesdeCache = (): Producto[] | null => {
  try {
    const cached = localStorage.getItem(PRODUCTOS_STORAGE_KEY);
    const timestamp = localStorage.getItem(PRODUCTOS_CACHE_TIMESTAMP_KEY);
    
    if (!cached || !timestamp) {
      return null;
    }
    
    const cacheAge = Date.now() - parseInt(timestamp, 10);
    if (cacheAge > CACHE_DURATION_MS) {
      console.log('⚠️ Cache expirado, se recargará desde el backend');
      localStorage.removeItem(PRODUCTOS_STORAGE_KEY);
      localStorage.removeItem(PRODUCTOS_CACHE_TIMESTAMP_KEY);
      return null;
    }
    
    const productos = JSON.parse(cached) as Producto[];
    console.log('✅ Productos cargados desde localStorage:', productos.length);
    return productos;
  } catch (error) {
    console.error('❌ Error al cargar productos desde localStorage:', error);
    return null;
  }
};

// Obtener todos los productos: primero desde cache, si no existe o expiró, desde el backend
export const obtenerProductos = async (): Promise<Producto[]> => {
  // Intentar cargar desde cache primero
  const cached = cargarProductosDesdeCache();
  if (cached && cached.length > 0) {
    return cached;
  }
  
  // Si no hay cache válido, cargar desde el backend
  console.log('📡 Cargando productos desde el backend...');
  const response = await axiosConfig.get('/productos');
  const list = Array.isArray(response.data) ? response.data : [];
  const productos = list.map(mapProductoDTO);
  
  // Guardar en cache para próximas cargas
  guardarProductosEnCache(productos);
  
  return productos;
};

// Forzar recarga desde el backend (ignorando cache)
export const recargarProductosDesdeBackend = async (): Promise<Producto[]> => {
  console.log('🔄 Forzando recarga de productos desde el backend...');
  const response = await axiosConfig.get('/productos');
  const list = Array.isArray(response.data) ? response.data : [];
  const productos = list.map(mapProductoDTO);
  
  // Actualizar cache
  guardarProductosEnCache(productos);
  
  return productos;
};

export const obtenerProductosDestacados = async (): Promise<Producto[]> => {
  const response = await axiosConfig.get<Producto[]>('/productos/destacados');
  return response.data;
};

export const obtenerProductoPorId = async (id: string): Promise<Producto> => {
  const response = await axiosConfig.get(`/productos/${id}`);
  return mapProductoDTO(response.data);
};

export const obtenerProductosRelacionados = async (producto: Producto): Promise<Producto[]> => {
  const response = await axiosConfig.get(`/productos/${producto.id}/relacionados`);
  const list = Array.isArray(response.data) ? response.data : [];
  return list.map(mapProductoDTO);
};

// Helpers Admin: crear/actualizar/eliminar en backend
function toBackendPayload(p: Partial<Producto>) {
  return {
    id: p.id ? Number(p.id) : undefined,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    imagenUrl: p.imagenUrl,
    stock: p.stock,
    disponible: p.disponible,
    destacado: p.destacado,
    descuento: p.descuento,
    categoria: p.categoria ? p.categoria.id : undefined,
    // subcategoria opcional
  } as any;
}

export const crearProductoApi = async (p: Partial<Producto>): Promise<Producto> => {
  const response = await axiosConfig.post('/productos', toBackendPayload(p));
  return mapProductoDTO(response.data);
};

export const actualizarProductoApi = async (id: string, p: Partial<Producto>): Promise<Producto> => {
  const response = await axiosConfig.put(`/productos/${id}`, toBackendPayload(p));
  return mapProductoDTO(response.data);
};

export const eliminarProductoApi = async (id: string): Promise<void> => {
  await axiosConfig.delete(`/productos/${id}`);
};

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  const response = await axiosConfig.get('/productos/categorias');
  // backend entrega { categorias: [{id,nombre}], subcategorias: [...] }
  const data = response.data || {};
  const cats = Array.isArray(data.categorias) ? data.categorias : [];
  return cats.map((c: any) => ({ id: c.id, nombre: c.nombre } as Categoria));
};

export const obtenerImagenesCarrusel = async (): Promise<ImagenCarrusel[]> => {
  const base =
    ((import.meta as any).env?.VITE_IMAGE_BASE_URL as string | undefined)?.replace(/\/$/, '') || '';
  const resolveImg = (path: string) => {
    const clean = path.replace(/^\/+/, '').replace(/^img\//, '');
    return base ? `${base}/${clean}` : `/img/${clean}`;
  };
  return [
    {
      id: 1,
      imagenUrl: resolveImg('/img/carrusel.png'),
      titulo: '!Bienvenido a Level-Up Gamer!',
      descripcion: 'La tienda gamer lider en todo Chile',
      enlace: '/',
    },
    {
      id: 2,
      imagenUrl: resolveImg('/img/play5white.png'),
      titulo: 'Explora nuestros productos gamer de alta calidad',
      descripcion: 'Una gama completa de productos para potenciar tu experiencia',
      enlace: '/producto',
    },
    {
      id: 3,
      imagenUrl: resolveImg('/img/monitorasus.png'),
      titulo: 'Noticias y guias del mundo gamer',
      descripcion: 'Mantente al dia con nuestro gaming hub',
      enlace: '/gaming-hub',
    },
  ];
};

// Backwards-compatible static exports expected by legacy components
// Categorías y subcategorías mínimas (coinciden con backend)
export const categorias: Categoria[] = [
  { id: 'CO', nombre: 'Consola' },
  { id: 'PE', nombre: 'Perifericos' },
  { id: 'RO', nombre: 'Ropa' },
  { id: 'EN', nombre: 'Entretenimiento' },
];

export const subcategorias: Subcategoria[] = [];

// Catálogo base vacío para que compile; la app usa localStorage o la API
export const productosArray: Producto[] = [];

export const obtenerCategoriasYSubcategorias = async (): Promise<{ categorias: Categoria[]; subcategorias: Subcategoria[] }> => {
  const response = await axiosConfig.get('/productos/categorias');
  const data = response.data || {};
  const cats = (Array.isArray(data.categorias) ? data.categorias : []).map((c: any) => ({ id: c.id, nombre: c.nombre } as Categoria));
  const subs = (Array.isArray(data.subcategorias) ? data.subcategorias : []).map((s: any) => ({ id: s.id, nombre: s.nombre, categoria: { id: s.categoriaId, nombre: (cats.find((c: any) => c.id === s.categoriaId)?.nombre) || s.categoriaId } as Categoria } as Subcategoria));
  return { categorias: cats, subcategorias: subs };
};
