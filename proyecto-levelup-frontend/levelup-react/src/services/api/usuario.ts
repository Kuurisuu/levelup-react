import axiosConfig from '../../config/axios';
import { Usuario, DireccionEnvio } from '../../types/api';

interface UsuarioCreationDTO {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  codigoPostal?: string;
  region?: string;
  comuna?: string;
  runUsuario?: string;
  tipoUsuario?: string;
  codigoReferido?: string;
  referidoPor?: string;
  avatarUrl?: string;
  aceptaTerminos?: boolean;
  aceptaMarketing?: boolean;
}

export const UsuarioService = {
  getPerfil: () => axiosConfig.get<Usuario>('/usuarios/perfil'),
  updatePerfil: (datos: Partial<Usuario>) => 
    axiosConfig.put<Usuario>('/usuarios/perfil', datos),
  getDirecciones: () => axiosConfig.get<DireccionEnvio[]>('/usuarios/direcciones'),
  addDireccion: (direccion: Omit<DireccionEnvio, 'id'>) =>
    axiosConfig.post<DireccionEnvio>('/usuarios/direcciones', direccion),
  deleteDireccion: (id: number) =>
    axiosConfig.delete(`/usuarios/direcciones/${id}`),
  crearUsuario: (usuario: UsuarioCreationDTO, avatarFile?: File | null) => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      formData.append('usuario', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
      return axiosConfig.post<Usuario>('/usuarios', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return axiosConfig.post<Usuario>('/usuarios', usuario);
  },
  actualizarUsuario: (id: number, usuario: Partial<UsuarioCreationDTO>, avatarFile?: File | null) => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      formData.append('usuario', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
      return axiosConfig.put<Usuario>(`/usuarios/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return axiosConfig.put<Usuario>(`/usuarios/${id}`, usuario);
  },
  obtenerUsuarios: () => axiosConfig.get<{ content: Usuario[] }>('/usuarios'),
  eliminarUsuario: (id: number) => axiosConfig.delete(`/usuarios/${id}`)
};
