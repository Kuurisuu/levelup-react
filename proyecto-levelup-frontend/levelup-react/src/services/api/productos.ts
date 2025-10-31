import axiosConfig from '../../config/axios';
import { Producto } from '../../types/api';

export interface ProductoFiltroParams {
  categoria?: string;
  subcategorias?: string[];
  texto?: string;
  precioMin?: number;
  precioMax?: number;
  disponible?: boolean;
  rating?: number;
  orden?: string;
  pagina?: number;
  tamano?: number;
}

export interface ProductoPaginadoResponse {
  productos: any[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
  primeraPagina: boolean;
  ultimaPagina: boolean;
}

export const ProductoService = {
  getAll: () => axiosConfig.get<Producto[]>('/productos'),
  getById: (id: number) => axiosConfig.get<Producto>(`/productos/${id}`),
  create: (producto: Omit<Producto, 'id'>) => axiosConfig.post<Producto>('/productos', producto),
  update: (id: number, producto: Partial<Producto>) => axiosConfig.put<Producto>(`/productos/${id}`, producto),
  delete: (id: number) => axiosConfig.delete(`/productos/${id}`),
  searchByCategory: (categoria: string) => axiosConfig.get<Producto[]>(`/productos/categoria/${categoria}`),
  filtrar: (filtros: ProductoFiltroParams) => 
    axiosConfig.post<ProductoPaginadoResponse>('/productos/filtrar', filtros),
  filtrarGet: (filtros: ProductoFiltroParams) => 
    axiosConfig.get<ProductoPaginadoResponse>('/productos/filtrar', { params: filtros })
};
