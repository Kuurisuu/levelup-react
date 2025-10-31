import axiosConfig from '../../config/axios';

export interface PedidoCreationDTO {
  idUsuario: number;
  nombreEnvio: string;
  apellidoEnvio: string;
  emailEnvio: string;
  telefonoEnvio: string;
  direccionEnvio: string;
  departamentoEnvio?: string;
  regionEnvio: string;
  comunaEnvio: string;
  indicadoresEntrega?: string;
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  idCarrito?: number;
  items: PedidoItemCreationDTO[];
}

export interface PedidoItemCreationDTO {
  idProducto: number;
  nombreProducto: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  imagenUrl?: string;
}

export interface PedidoResponseDTO {
  id: number;
  codigo: string;
  idUsuario: number;
  nombreEnvio: string;
  apellidoEnvio: string;
  emailEnvio: string;
  telefonoEnvio: string;
  direccionEnvio: string;
  departamentoEnvio?: string;
  regionEnvio: string;
  comunaEnvio: string;
  indicadoresEntrega?: string;
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  estado: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  idCarrito?: number;
  idPago?: number;
  items?: PedidoItemResponseDTO[];
}

export interface PedidoItemResponseDTO {
  id: number;
  idPedido: number;
  idProducto: number;
  nombreProducto: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  imagenUrl?: string;
}

export const PedidoService = {
  crearPedido: (pedido: PedidoCreationDTO) =>
    axiosConfig.post<PedidoResponseDTO>('/pedidos', pedido),
  obtenerPedidoPorId: (id: number) =>
    axiosConfig.get<PedidoResponseDTO>(`/pedidos/${id}`),
  obtenerPedidoPorCodigo: (codigo: string) =>
    axiosConfig.get<PedidoResponseDTO>(`/pedidos/codigo/${codigo}`),
  obtenerPedidosPorUsuario: (idUsuario: number) =>
    axiosConfig.get<PedidoResponseDTO[]>(`/pedidos/usuario/${idUsuario}`),
  actualizarEstadoPedido: (id: number, estado: string) =>
    axiosConfig.put<PedidoResponseDTO>(`/pedidos/${id}/estado`, { estado }),
};
