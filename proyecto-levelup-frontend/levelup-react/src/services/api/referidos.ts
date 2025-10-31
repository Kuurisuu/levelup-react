import axiosConfig from '../../config/axios';
import { Referido, ReferidoStats } from '../../types/api';

export const ReferidoService = {
  getMiCodigo: () => axiosConfig.get<string>('/referidos/codigo'),
  getReferidos: () => axiosConfig.get<Referido[]>('/referidos/lista'),
  registrarReferido: (codigo: string) =>
    axiosConfig.post('/referidos/registrar', { codigo }),
  getRecompensas: () =>
    axiosConfig.get<ReferidoStats>('/referidos/recompensas')
};
