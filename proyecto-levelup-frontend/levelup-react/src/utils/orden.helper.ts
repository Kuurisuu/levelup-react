// Utilidades para manejo de órdenes de compra

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
  titulo: string;
  precio: number;
  imagen: string;
  cantidad: number;
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

  return {
    codigo,
    fecha: new Date().toISOString(),
    datosEnvio,
    productos,
    subtotal: valores.subtotal,
    descuento: valores.descuento,
    iva: valores.iva,
    total: valores.total,
    estado: 'pendiente'
  };
}

/**
 * Simula el procesamiento de pago
 * En una implementación real, aquí se conectaría con el proveedor de pagos pero nica lo vamos a hacer
 */
export async function procesarPago(orden: OrdenCompra): Promise<{//el promise es cmo decir despues de todo eso te prometo que te devuelvo un booleano y un string
  exito: boolean;
  error?: string;
  codigoTransaccion?: string;
}> {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simular éxito/fallo aleatorio (90% éxito)
  const exito = Math.random() > 0.1;//

  if (exito) {
    return {
      exito: true,
      codigoTransaccion: `TXN-${Date.now()}`
    };
  } else {
    const errores = [
      'Error en el procesamiento del pago',
      'Tarjeta rechazada',
      'Fondos insuficientes',
      'Error de conectividad',
      'Datos de tarjeta inválidos',
      'BANCO ESTADO DEVUELVEME LA PLATAAAA '
    ];
    
    return {
      exito: false,
      error: errores[Math.floor(Math.random() * errores.length)]
    };
  }
}

/**
 * Guarda la orden en localStorage
 */
export function guardarOrden(orden: OrdenCompra): void {
  try {
    const ordenes = obtenerOrdenes();
    ordenes.push(orden);
    localStorage.setItem('lvup_ordenes', JSON.stringify(ordenes));
  } catch (error) {
    console.error('Error al guardar la orden:', error);
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
 * Actualiza el estado de una orden
 */
export function actualizarEstadoOrden(codigo: string, nuevoEstado: OrdenCompra['estado']): void {
  try {
    const ordenes = obtenerOrdenes();
    const ordenIndex = ordenes.findIndex(orden => orden.codigo === codigo);
    
    if (ordenIndex !== -1) {
      ordenes[ordenIndex].estado = nuevoEstado;
      localStorage.setItem('lvup_ordenes', JSON.stringify(ordenes));
    }
  } catch (error) {
    console.error('Error al actualizar el estado de la orden:', error);
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
