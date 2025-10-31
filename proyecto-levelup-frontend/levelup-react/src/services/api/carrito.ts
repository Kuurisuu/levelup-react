import axiosConfig from '../../config/axios';
import { CarritoItem } from '../../types/api';

export const CarritoService = {
  getItems: () => axiosConfig.get<CarritoItem[]>('/carrito/items'),
  addItem: (productoId: number, cantidad: number) => 
    axiosConfig.post<CarritoItem>('/carrito/items', { productoId, cantidad }),
  updateCantidad: (itemId: number, cantidad: number) =>
    axiosConfig.put<CarritoItem>(`/carrito/items/${itemId}`, { cantidad }),
  removeItem: (itemId: number) =>
    axiosConfig.delete(`/carrito/items/${itemId}`),
  checkout: () => axiosConfig.post('/carrito/checkout')
};
