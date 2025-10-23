// Utilidades para persistencia de datos del checkout

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

export interface DatosTarjeta {
  numero: string;
  nombre: string;
  vencimiento: string;
  cvv: string;
}

export interface CheckoutMemory {
  datosEnvio?: DatosEnvio;
  datosTarjeta?: DatosTarjeta;
  ultimoPaso?: string;//ultimo paso que se realizo en el checkout formulario, resumen, pago, rapido, procesando, exitoso, fallido
  timestamp?: number;//timestamp es la fecha y hora en que se guardaron los datos
}

const STORAGE_KEY = 'lvup_checkout_memory'; //llave para guardar los datos en el localStorage
const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 horas en milisegundos para que se eliminen los datos si pasan 24 horas

/**
 * Guarda los datos del checkout en localStorage
 */
export function guardarDatosCheckout(datos: Partial<CheckoutMemory>): void { //Partial es para que se puedan guardar solo algunos datos
  try {
    const datosExistentes = obtenerDatosCheckout();//obtenemos los datos existentes en el localStorage
    const nuevosDatos: CheckoutMemory = {//creamos los nuevos datos
      ...datosExistentes,
      ...datos,//añadimos los nuevos datos a los datos existentes
      timestamp: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosDatos));
    console.log('Datos del checkout guardados:', nuevosDatos); // Debug
  } catch (error) {
    console.error('Error al guardar datos del checkout:', error);
  }
}

/**
 * Obtiene los datos del checkout desde localStorage
 */
export function obtenerDatosCheckout(): CheckoutMemory {
  try {
    const datos = localStorage.getItem(STORAGE_KEY); 
    if (!datos) return {};//si no hay datos, devolvemos un objeto vacío
    
    const parsed: CheckoutMemory = JSON.parse(datos);//parseamos los datos para que se conviertan en un objeto
    
    // Verificar si los datos han expirado
    if (parsed.timestamp && Date.now() - parsed.timestamp > EXPIRY_TIME) { //si los datos han expirado, limpiamos los datos
      limpiarDatosCheckout();//limpiamos los datos
      return {};//devolvemos un objeto vacío
    }
    
    return parsed;//devolvemos los datos parseados
  } catch (error) {
    console.error('Error al obtener datos del checkout:', error);//si hay un error, devolvemos un objeto vacío
    return {};//devolvemos un objeto vacío
  }
}

/**
 * Limpia los datos del checkout
 */
export function limpiarDatosCheckout(): void { 
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Datos del checkout limpiados'); // Debug
  } catch (error) {
    console.error('Error al limpiar datos del checkout:', error);
  }
}

/**
 * Verifica si los datos de envío están completos
 */
export function tieneDatosEnvioCompletos(datos?: DatosEnvio): boolean { //datos es opcional
  if (!datos) return false; //si no hay datos, devolvemos false
  
  return !!(
    datos.nombre?.trim() &&
    datos.apellido?.trim() &&
    datos.email?.trim() &&
    datos.telefono?.trim() &&
    datos.direccion?.trim() &&
    datos.region?.trim() &&
    datos.comuna?.trim()
  );
} //si todos los datos son true, devolvemos true

/**
 * Verifica si los datos de envío están completos incluyendo campos opcionales
 */
export function tieneDatosEnvioCompletosConOpcionales(datos?: DatosEnvio): boolean {
  if (!datos) return false;
  
  return !!(
    datos.nombre?.trim() &&
    datos.apellido?.trim() &&
    datos.email?.trim() &&
    datos.telefono?.trim() &&
    datos.direccion?.trim() &&
    datos.region?.trim() &&
    datos.comuna?.trim()
    // departamento e indicadoresEntrega son opcionales pero se guardan si están presentes
  );
}

/**
 * Verifica si los datos de envío están completos con todos los campos (incluyendo opcionales)
 */
export function tieneDatosEnvioCompletosConTodosCampos(datos?: DatosEnvio): boolean {
  if (!datos) return false;
  
  return !!(
    datos.nombre?.trim() &&
    datos.apellido?.trim() &&
    datos.email?.trim() &&
    datos.telefono?.trim() &&
    datos.direccion?.trim() &&
    datos.region?.trim() &&
    datos.comuna?.trim() &&
    // Incluir campos opcionales si están presentes
    (datos.departamento?.trim() || true) && // departamento es opcional
    (datos.indicadoresEntrega?.trim() || true) // indicadoresEntrega es opcional
  );
}

/**
 * Verifica si los datos de tarjeta están completos
 */
export function tieneDatosTarjetaCompletos(datos?: DatosTarjeta): boolean {
  if (!datos) return false;
  
  return !!(
    datos.numero?.trim() &&
    datos.nombre?.trim() &&
    datos.vencimiento?.trim() &&
    datos.cvv?.trim()
  );
}

/**
 * Verifica si el usuario ha comprado antes
 */
export function haCompradoAntes(): boolean {
  try {
    const ordenes = JSON.parse(localStorage.getItem('lvup_ordenes') || '[]');
    const tieneOrdenes = ordenes.length > 0;
    console.log('Verificando compras anteriores:', { ordenes: ordenes.length, tieneOrdenes }); // Debug
    return tieneOrdenes;
  } catch (error) {
    console.error('Error al verificar compras anteriores:', error);
    return false;
  }
}

/**
 * Determina el siguiente paso del checkout basado en los datos guardados
 */
export function determinarSiguientePaso(): 'formulario' | 'resumen' | 'pago' | 'rapido' | 'procesando' {
  const datos = obtenerDatosCheckout();
  const haComprado = haCompradoAntes();
  const tieneEnvio = tieneDatosEnvioCompletosConTodosCampos(datos.datosEnvio);
  const tieneTarjeta = tieneDatosTarjetaCompletos(datos.datosTarjeta);
  
  console.log('Determinando paso del checkout:', {
    haComprado,
    tieneEnvio,
    tieneTarjeta,
    datosEnvio: datos.datosEnvio,
    datosTarjeta: datos.datosTarjeta,
    departamento: datos.datosEnvio?.departamento,
    indicadoresEntrega: datos.datosEnvio?.indicadoresEntrega
  }); // Debug
  
  // Si ha comprado antes y tiene datos completos, ir a checkout rápido
  if (haComprado && tieneEnvio && tieneTarjeta) {
    console.log('✅ Usuario experimentado con datos completos, ir a checkout rápido'); // Debug
    return 'rapido';
  }
  
  // Si no hay datos de envío, empezar desde el formulario
  if (!tieneEnvio) {
    console.log('❌ No hay datos de envío completos, ir a formulario'); // Debug
    return 'formulario';
  }
  
  // Si hay datos de envío pero no de tarjeta, ir al resumen
  if (!tieneTarjeta) {
    console.log('⚠️ Hay datos de envío pero no de tarjeta, ir a resumen'); // Debug
    return 'resumen';
  }
  
  // Si hay ambos datos, ir directamente al pago
  console.log('✅ Hay datos de envío y tarjeta, ir a pago'); // Debug
  return 'pago';
}

/**
 * Guarda los datos de envío
 */
export function guardarDatosEnvio(datos: DatosEnvio): void {
  guardarDatosCheckout({ datosEnvio: datos, ultimoPaso: 'resumen' });
}

/**
 * Guarda los datos de tarjeta
 */
export function guardarDatosTarjeta(datos: DatosTarjeta): void {
  guardarDatosCheckout({ datosTarjeta: datos, ultimoPaso: 'pago' });
}

/**
 * Obtiene los datos de envío guardados
 */
export function obtenerDatosEnvio(): DatosEnvio | null {
  const datos = obtenerDatosCheckout();
  return datos.datosEnvio || null;
}

/**
 * Obtiene los datos de tarjeta guardados
 */
export function obtenerDatosTarjeta(): DatosTarjeta | null {
  const datos = obtenerDatosCheckout();
  return datos.datosTarjeta || null;
}
