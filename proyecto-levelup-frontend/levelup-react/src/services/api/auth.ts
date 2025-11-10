import axiosConfig from '../../config/axios';
import { TokenInfo } from '../../types/api';

export interface RegisterRequest {
  runUsuario: string;
  nombreUsuario: string;
  apellidosUsuario: string;
  correoUsuario: string;
  password: string;
  fechaNacimiento?: string;
  region: string;
  comuna: string;
  direccionUsuario: string;
}

export const AuthService = {
  login: (correoUsuario: string, password: string) =>
    axiosConfig.post<TokenInfo>("/auth/login", {
      correoUsuario,
      password,
    }),
  registro: (usuario: RegisterRequest) =>
    axiosConfig.post<TokenInfo>('/auth/registro', usuario),
  refreshToken: () => axiosConfig.post<TokenInfo>('/auth/refresh'),
  logout: () => axiosConfig.post('/auth/logout'),
  verificarEmail: (token: string) => 
    axiosConfig.get(`/auth/verificar-email/${token}`)
};
