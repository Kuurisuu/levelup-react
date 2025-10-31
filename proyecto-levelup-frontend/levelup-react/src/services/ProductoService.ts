import axiosConfig from '../config/axios';
import { Producto } from '../types/api';

export class ProductoService {
  private static readonly BASE_URL = '/productos';

  static async getAll(): Promise<Producto[]> {
    const response = await axiosConfig.get(this.BASE_URL);
    return response.data;
  }

  static async getById(id: number): Promise<Producto> {
    const response = await axiosConfig.get(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  static async create(producto: Omit<Producto, 'id'>): Promise<Producto> {
    const response = await axiosConfig.post(this.BASE_URL, producto);
    return response.data;
  }
}