import axiosConfig from '../../config/axios';
import { Resenia } from '../../types/api';

export const ReseniaService = {
  getByProducto: (productoId: number) => 
    axiosConfig.get<Resenia[]>(`/resenias/producto/${productoId}`),
  crear: (productoId: number, resenia: Omit<Resenia, 'id'>) =>
    axiosConfig.post<Resenia>(`/resenias/producto/${productoId}`, resenia),
  actualizar: (id: number, resenia: Partial<Resenia>) =>
    axiosConfig.put<Resenia>(`/resenias/${id}`, resenia),
  eliminar: (id: number) => axiosConfig.delete(`/resenias/${id}`)
};
