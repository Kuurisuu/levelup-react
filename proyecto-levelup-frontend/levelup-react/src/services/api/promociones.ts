import axiosConfig from '../../config/axios';
import { Promocion } from '../../types/api';

export const PromocionService = {
  getActivas: () => axiosConfig.get<Promocion[]>('/promociones/activas'),
  aplicarCupon: (codigo: string) => 
    axiosConfig.post<Promocion>('/promociones/aplicar', { codigo }),
  getPromocionesUsuario: () => 
    axiosConfig.get<Promocion[]>('/promociones/usuario'),
  validarCupon: (codigo: string) =>
    axiosConfig.get<boolean>(`/promociones/validar/${codigo}`)
};
