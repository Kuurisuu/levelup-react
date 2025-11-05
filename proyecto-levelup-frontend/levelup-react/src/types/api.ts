// Tipos base para respuestas API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
  path: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
  path: string;
}

// Tipos para el carrito
export interface Carrito {
  idCarrito: number;
  idUsuario: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  totalCarrito: number;
  totalDescuentos: number;
  totalImpuestos: number;
  totalFinal: number;
  moneda: string;
  estadoCarrito: 'ACTIVO' | 'CONVERTIDO' | 'ABANDONADO' | 'EXPIRADO';
  fechaExpiracion: string;
  codigoPromocional?: string;
  idPromocionAplicada?: number;
  notasCarrito?: string;
  items: ItemCarrito[];
}

export interface ItemCarrito {
  idItem: number;
  idProducto: number;
  nombreProducto: string;
  descripcionProducto: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  descuentoAplicado: number;
  impuestoAplicado: number;
  totalItem: number;
  fechaAgregado: string;
  fechaActualizado: string;
  estadoItem: 'ACTIVO' | 'ELIMINADO' | 'NO_DISPONIBLE';
  notasItem?: string;
}

// Tipos para pagos
export interface Transaccion {
  idTransaccion: number;
  idPago: number;
  tipoTransaccion: 'PAGO' | 'REEMBOLSO' | 'REVERSO' | 'CONSULTA';
  montoTransaccion: number;
  monedaTransaccion: string;
  numeroTransaccionExterna?: string;
  fechaTransaccion: string;
  estadoTransaccion: 'INICIADA' | 'PROCESANDO' | 'COMPLETADA' | 'FALLIDA' | 'CANCELADA';
  codigoRespuestaExterna?: string;
  mensajeRespuestaExterna?: string;
  datosRespuesta?: string;
  tiempoProcesamiento?: number;
  proveedorPago?: string;
  ipCliente?: string;
  userAgent?: string;
}

// Tipos para productos
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOferta?: number;
  stock: number;
  categoria: string;
  imagenUrl?: string;
  sku: string;
  enOferta: boolean;
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Subcategoria {
  id: string;
  nombre: string;
  categoria: Categoria;
}

export interface Review {
  id: string;
  productoId: string;
  usuarioNombre: string;
  rating: number;
  comentario: string;
  fecha: string;
}

export interface Resenia {
  id?: number;
  idProducto: number;
  idUsuario: number;
  usuarioNombre: string;
  rating: number;
  comentario: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  activo?: boolean;
}

// Tipos para pedidos
export interface Pedido {
  id: number;
  numeroPedido: string;
  usuarioId: number;
  items: PedidoItem[];
  subtotal: number;
  impuestos: number;
  total: number;
  estado: EstadoPedido;
  direccionEnvio: DireccionEnvio;
  createdAt: string;
}

export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  EN_PROCESO = 'EN_PROCESO',
  ENVIADO = 'ENVIADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

// Tipos para seguridad
export interface SecurityHeaders {
  Authorization?: string;
  'X-CSRF-Token'?: string;
}

// Tipos para referidos
export interface Referido {
  id: number;
  usuarioReferenteId: number;
  usuarioReferidoId: number;
  codigoUsado: string;
  estado: 'PENDIENTE' | 'COMPLETADO' | 'RECOMPENSADO' | 'CANCELADO';
  fechaReferido: string;
  recompensaEntregada: boolean;
}

export interface ReferidoStats {
  totalReferidos: number;
  recompensasPendientes: number;
  puntosAcumulados: number;
}

// Tipos para autenticación
export interface UsuarioInfo {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  tipoUsuario: string;
  descuentoDuoc?: boolean;
  region?: string;
  comuna?: string;
}

export interface TokenInfo {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  usuario: UsuarioInfo;
}

export interface Usuario {
  id?: number;
  nombre: string;
  apellidos: string;
  correo: string;
  password?: string;
  telefono?: string;
  fechaNacimiento?: string;
  region?: string;
  comuna?: string;
  direccion?: string;
  codigoReferido?: string;
  tipoUsuario?: string;
  descuentoDuoc?: boolean;
}