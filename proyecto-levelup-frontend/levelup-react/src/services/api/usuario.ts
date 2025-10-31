import axiosConfig from '../../config/axios';
import { Usuario, DireccionEnvio } from '../../types/api';

export const UsuarioService = {
  getPerfil: () => axiosConfig.get<Usuario>('/usuarios/perfil'),
  updatePerfil: (datos: Partial<Usuario>) => 
    axiosConfig.put<Usuario>('/usuarios/perfil', datos),
  getDirecciones: () => axiosConfig.get<DireccionEnvio[]>('/usuarios/direcciones'),
  addDireccion: (direccion: Omit<DireccionEnvio, 'id'>) =>
    axiosConfig.post<DireccionEnvio>('/usuarios/direcciones', direccion),
  deleteDireccion: (id: number) =>
    axiosConfig.delete(`/usuarios/direcciones/${id}`)
};
