import axiosConfig from '../config/axios';
import { ApiResponse, Carrito, ItemCarrito } from '../types/api';

export class CarritoService {
  private static readonly BASE_URL = '/carrito';

  static async getItems(): Promise<CarritoItem[]> {
    const response = await axiosConfig.get(this.BASE_URL);
    return response.data;
  }

  static async addItem(productoId: number, cantidad: number): Promise<CarritoItem> {
    const response = await axiosConfig.post(this.BASE_URL, { productoId, cantidad });
    return response.data;
  }

  static async removeItem(itemId: number): Promise<void> {
    await axiosConfig.delete(`${this.BASE_URL}/${itemId}`);
  }

  static async obtenerCarritoActual(idUsuario: number): Promise<ApiResponse<Carrito>> {
    const response = await axiosConfig.get(`/carritos/usuario/${idUsuario}/actual`);
    return response.data;
  }

  static async agregarItem(idUsuario: number, item: Omit<ItemCarrito, 'idItem'>): Promise<ApiResponse<Carrito>> {
    const response = await axiosConfig.post(`/carritos/usuario/${idUsuario}/items`, item);
    return response.data;
  }

  static async actualizarCantidad(idCarrito: number, idItem: number, cantidad: number): Promise<ApiResponse<Carrito>> {
    const response = await axiosConfig.patch(`/carritos/${idCarrito}/items/${idItem}/cantidad`, { cantidad });
    return response.data;
  }

  static async eliminarItem(idCarrito: number, idItem: number): Promise<ApiResponse<void>> {
    const response = await axiosConfig.delete(`/carritos/${idCarrito}/items/${idItem}`);
    return response.data;
  }

  static async aplicarCupon(idCarrito: number, codigoCupon: string): Promise<ApiResponse<Carrito>> {
    const response = await axiosConfig.post(`/carritos/${idCarrito}/cupon`, { codigo: codigoCupon });
    return response.data;
  }

  static async finalizarCarrito(idCarrito: number): Promise<ApiResponse<void>> {
    const response = await axiosConfig.post(`/carritos/${idCarrito}/finalizar`);
    return response.data;
  }
};