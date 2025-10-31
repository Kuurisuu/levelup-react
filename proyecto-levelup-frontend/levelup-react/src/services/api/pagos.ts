import axiosConfig from '../../config/axios';
import { Pago } from '../../types/api';

export const PagoService = {
  procesarPago: (pedidoId: number, datosPago: any) => 
    axiosConfig.post<Pago>('/pagos/procesar', { pedidoId, ...datosPago }),
  verificarPago: (pagoId: number) => 
    axiosConfig.get<Pago>(`/pagos/${pagoId}/verificar`),
  getHistorialPagos: () => axiosConfig.get<Pago[]>('/pagos/historial'),
  solicitarReembolso: (pagoId: number, motivo: string) =>
    axiosConfig.post<Pago>(`/pagos/${pagoId}/reembolso`, { motivo })
};
