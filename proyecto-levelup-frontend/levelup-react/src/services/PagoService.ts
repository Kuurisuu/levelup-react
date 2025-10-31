import axiosConfig from '../config/axios';
import { ApiResponse, Transaccion, Pago } from '../types/api';

export class PagoService {
  private static readonly BASE_URL = '/pagos';

  static async procesarPago(monto: number): Promise<Pago> {
    const response = await axiosConfig.post(this.BASE_URL, { monto });
    return response.data;
  }

  static async getPagoById(id: number): Promise<Pago> {
    const response = await axiosConfig.get(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  static async iniciarPago(idCarrito: number): Promise<ApiResponse<Transaccion>> {
    const response = await axiosConfig.post('/pagos/iniciar', { idCarrito });
    return response.data;
  }

  static async consultarEstado(idTransaccion: number): Promise<ApiResponse<Transaccion>> {
    const response = await axiosConfig.get(`/pagos/transacciones/${idTransaccion}`);
    return response.data;
  }

  static async confirmarPago(idTransaccion: number, token: string): Promise<ApiResponse<Transaccion>> {
    const response = await axiosConfig.post(`/pagos/transacciones/${idTransaccion}/confirmar`, { token });
    return response.data;
  }

  static async solicitarReembolso(idTransaccion: number, motivo: string): Promise<ApiResponse<Transaccion>> {
    const response = await axiosConfig.post(`/pagos/transacciones/${idTransaccion}/reembolso`, { motivo });
    return response.data;
  }
}