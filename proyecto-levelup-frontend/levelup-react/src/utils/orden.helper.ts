// Utilidades para manejo de órdenes de compra
import { PedidoService, PedidoCreationDTO, PedidoResponseDTO } from '../services/api/pedidos';
import { PagoService } from '../services/api/pagos';
import axiosConfig from '../config/axios';

// esta interfaz es para los datos de envío y son los que se guardan en el localStorage
//seria hacia donde voy a enviar el pedido
export interface DatosEnvio {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  departamento: string;
  region: string;
  comuna: string;
  indicadoresEntrega: string;
}

//seria que datos se llevan el pedido
export interface OrdenCompra {
  codigo: string;
  fecha: string;
  datosEnvio: DatosEnvio;
  productos: ProductoEnCarrito[];
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  estado: 'pendiente' | 'procesando' | 'completada' | 'fallida';
}

//esta interface seria el carrito que esta en la parte de la pasarela de pago 
export interface ProductoEnCarrito {
  id: string;
  nombre: string;
  titulo?: string;
  precio: number;
  imagenUrl: string;
  imagen?: string;
  cantidad: number;
  categoria: any;
  subcategoria?: any;
  precioCLP?: string;
  subtotalCLP?: string;
}

/**
 * Genera un código único para la orden de compra
 * Formato: YYYYMMDD-HHMMSS-XXXX
 */
export function generarCodigoOrden(): string {
  const ahora = new Date();
  const fecha = ahora.toISOString().slice(0, 10).replace(/-/g, '');
  const hora = ahora.toTimeString().slice(0, 8).replace(/:/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${fecha}-${hora}-${random}`;
}

/**
 * Calcula los valores de la orden considerando descuentos y iva.
 * Si aplicaDescuentoDuoc es true (usuario tiene correo @duoc.cl)
 * se aplica un descuento del 20% al subtotal de productos.
 * Luego se aplica 19% de IVA sobre el subtotal con el descuento.
 * Devuelve el resumen de subtotal, descuento, iva y total.
 */
export function calcularValoresOrden(
  productos: ProductoEnCarrito[],
  aplicaDescuentoDuoc: boolean = false
): {
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
} {
  // Calcular subtotal base sumando precio * cantidad de cada producto
  const subtotal = productos.reduce((acc, producto) => 
    acc + (producto.precio * producto.cantidad), 0
  );

  // Descuento 20% solo si aplica por correo duoc (@duoc.cl)
  const descuento = aplicaDescuentoDuoc ? Math.round(subtotal * 0.2) : 0;

  // Subtotal menos descuento
  const subtotalConDescuento = subtotal - descuento;

  // IVA se calcula sobre el subtotal con descuento (19%)
  const iva = Math.round(subtotalConDescuento * 0.19);

  // Total final (subtotal con descuento + IVA)
  const total = subtotalConDescuento + iva;

  return {
    subtotal,
    descuento,
    iva,
    total
  };
}

/**
 * Crea una nueva orden de compra
 */
export function crearOrdenCompra(
  datosEnvio: DatosEnvio,
  productos: ProductoEnCarrito[],
  aplicaDescuentoDuoc: boolean = false
): OrdenCompra {
  const codigo = generarCodigoOrden();
  const valores = calcularValoresOrden(productos, aplicaDescuentoDuoc);

  // Mapear productos del carrito a la estructura esperada por el PDF
  const productosMapeados = productos.map(producto => ({
    id: producto.id,
    nombre: producto.nombre || producto.titulo || 'Producto',
    titulo: producto.titulo,
    precio: producto.precio,
    imagenUrl: producto.imagenUrl || producto.imagen || '/img/otros/placeholder.png',
    imagen: producto.imagen,
    cantidad: producto.cantidad,
    categoria: producto.categoria,
    subcategoria: producto.subcategoria
  }));

  return {
    codigo,
    fecha: new Date().toISOString(),
    datosEnvio,
    productos: productosMapeados,
    subtotal: valores.subtotal,
    descuento: valores.descuento,
    iva: valores.iva,
    total: valores.total,
    estado: 'pendiente'
  };
}

/**
 * Procesa el pago usando el backend
 */
export async function procesarPago(orden: OrdenCompra): Promise<{
  exito: boolean;
  error?: string;
  codigoTransaccion?: string;
}> {
  try {
    // Obtener idUsuario del localStorage
    const session = JSON.parse(localStorage.getItem('lvup_user_session') || '{}');
    const idUsuario = session.userId || session.id || 0;
    
    // Crear pago en el backend
    const pagoData = {
      idPedido: 0, // Se actualizará si se creó el pedido antes
      idUsuario: Number(idUsuario) || 0,
      montoPago: orden.total,
      metodoPago: 'TARJETA',
      monedaPago: 'CLP'
    };
    
    const response = await axiosConfig.post('/pagos/procesar', pagoData);
    
    if (response.data && response.data.estadoPago === 'APROBADO') {
      return {
        exito: true,
        codigoTransaccion: response.data.numeroTransaccion || `TXN-${Date.now()}`
      };
    } else {
      return {
        exito: false,
        error: response.data?.mensajeRespuesta || 'Error en el procesamiento del pago'
      };
    }
  } catch (error: any) {
    console.error('Error al procesar pago:', error);
    
    // Fallback: simular procesamiento local
    await new Promise(resolve => setTimeout(resolve, 2000));
    const exito = Math.random() > 0.1;
    
    if (exito) {
      return {
        exito: true,
        codigoTransaccion: `TXN-${Date.now()}`
      };
    } else {
      return {
        exito: false,
        error: error?.response?.data?.message || error?.message || 'Error en el procesamiento del pago'
      };
    }
  }
}

/**
 * Guarda la orden en el backend
 */
export async function guardarOrden(orden: OrdenCompra): Promise<void> {
  try {
    // Obtener idUsuario del localStorage
    const session = JSON.parse(localStorage.getItem('lvup_user_session') || '{}');
    const idUsuario = session.userId || session.id || 0;
    
    // Mapear OrdenCompra a PedidoCreationDTO
    const pedidoDTO: PedidoCreationDTO = {
      idUsuario: Number(idUsuario) || 0,
      nombreEnvio: orden.datosEnvio.nombre,
      apellidoEnvio: orden.datosEnvio.apellido,
      emailEnvio: orden.datosEnvio.email,
      telefonoEnvio: orden.datosEnvio.telefono,
      direccionEnvio: orden.datosEnvio.direccion,
      departamentoEnvio: orden.datosEnvio.departamento,
      regionEnvio: orden.datosEnvio.region,
      comunaEnvio: orden.datosEnvio.comuna,
      indicadoresEntrega: orden.datosEnvio.indicadoresEntrega,
      subtotal: orden.subtotal,
      descuento: orden.descuento,
      iva: orden.iva,
      total: orden.total,
      items: orden.productos.map(p => ({
        idProducto: Number(p.id) || 0,
        nombreProducto: p.nombre || p.titulo || 'Producto',
        precio: p.precio,
        cantidad: p.cantidad,
        subtotal: p.precio * p.cantidad,
        imagenUrl: p.imagenUrl || p.imagen
      }))
    };
    
    const response = await PedidoService.crearPedido(pedidoDTO);
    
    // También guardar en localStorage como fallback
    try {
      const ordenes = obtenerOrdenes();
      ordenes.push(orden);
      localStorage.setItem('lvup_ordenes', JSON.stringify(ordenes));
    } catch (e) {
      // Silenciar errores de localStorage
    }
  } catch (error) {
    console.error('Error al guardar la orden:', error);
    // Fallback a localStorage si falla el backend
    try {
      const ordenes = obtenerOrdenes();
      ordenes.push(orden);
      localStorage.setItem('lvup_ordenes', JSON.stringify(ordenes));
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
    }
  }
}

/**
 * Obtiene todas las órdenes guardadas
 */
export function obtenerOrdenes(): OrdenCompra[] {
  try {
    const item = localStorage.getItem('lvup_ordenes');
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    return [];
  }
}

/**
 * Obtiene una orden específica por código
 */
export function obtenerOrdenPorCodigo(codigo: string): OrdenCompra | null {
  const ordenes = obtenerOrdenes();
  return ordenes.find(orden => orden.codigo === codigo) || null;
}

/**
 * Actualiza el estado de una orden en el backend
 */
export async function actualizarEstadoOrden(codigo: string, nuevoEstado: OrdenCompra['estado']): Promise<void> {
  try {
    // Buscar pedido por código en el backend
    const response = await PedidoService.obtenerPedidoPorCodigo(codigo);
    
    if (response.data && response.data.id) {
      await PedidoService.actualizarEstadoPedido(response.data.id, nuevoEstado);
    }
  } catch (error) {
    console.error('Error al actualizar el estado de la orden en el backend:', error);
  }
  
  // También actualizar en localStorage como fallback
  try {
    const ordenes = obtenerOrdenes();
    const ordenIndex = ordenes.findIndex(orden => orden.codigo === codigo);
    
    if (ordenIndex !== -1) {
      ordenes[ordenIndex].estado = nuevoEstado;
      localStorage.setItem('lvup_ordenes', JSON.stringify(ordenes));
    }
  } catch (error) {
    console.error('Error al actualizar el estado en localStorage:', error);
  }
}

/**
 * Formatea un número como moneda chilena
 */
export function formatCLP(num: number): string {
  return num?.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }) || "$0";
}

/**
 * Valida si un email es de Duoc UC
 */
export function isDuocEmail(email: string): boolean {
  if (!email) return false;
  const e = String(email).toLowerCase();
  return e.endsWith("@duoc.cl") || e.endsWith("@profesor.duoc.cl");
}
