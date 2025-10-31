import axiosConfig from '../../config/axios';
import { TokenInfo, Usuario } from '../../types/api';

export const AuthService = {
  login: (email: string, password: string) => 
    axiosConfig.post<TokenInfo>('/auth/login', { email, password }),
  registro: (usuario: Omit<Usuario, 'id'>) => 
    axiosConfig.post<TokenInfo>('/auth/registro', usuario),
  refreshToken: () => axiosConfig.post<TokenInfo>('/auth/refresh'),
  logout: () => axiosConfig.post('/auth/logout'),
  verificarEmail: (token: string) => 
    axiosConfig.get(`/auth/verificar-email/${token}`)
};
