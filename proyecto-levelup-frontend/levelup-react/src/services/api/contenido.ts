import axiosConfig from '../../config/axios';
import { Contenido } from '../../types/api';

export const ContenidoService = {
  getCursos: () => axiosConfig.get<Contenido[]>('/contenido/cursos'),
  getTutoriales: () => axiosConfig.get<Contenido[]>('/contenido/tutoriales'),
  marcarCompletado: (contenidoId: number) =>
    axiosConfig.post<void>(`/contenido/${contenidoId}/completar`),
  getProgreso: (contenidoId: number) =>
    axiosConfig.get<number>(`/contenido/${contenidoId}/progreso`)
};
