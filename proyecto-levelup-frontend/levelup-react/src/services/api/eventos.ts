import axiosConfig from '../../config/axios';
import { Evento, RegistroEvento } from '../../types/api';

export const EventoService = {
  getProximosEventos: () => 
    axiosConfig.get<Evento[]>('/eventos/proximos'),
    
  getDestacados: () => 
    axiosConfig.get<Evento[]>('/eventos/destacados'),
    
  registrarParticipacion: (eventoId: number) =>
    axiosConfig.post<RegistroEvento>(`/eventos/${eventoId}/registrar`),
    
  getMisEventos: () =>
    axiosConfig.get<Evento[]>('/eventos/mis-eventos')
};
