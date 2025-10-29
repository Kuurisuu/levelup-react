import { describe, expect, test, vi, beforeEach } from 'vitest';
import { 
  generarCodigoOrden, 
  calcularValoresOrden, 
  crearOrdenCompra, 
  procesarPago,
  DatosEnvio,
  ProductoEnCarrito,
  OrdenCompra
} from './orden.helper';

/**
 * Tests para las utilidades de órdenes de compra
 * Verifica la generación de códigos, cálculos de valores y procesamiento de pagos
 */
 //create mock datos de envio
const mockDatosEnvio: DatosEnvio = {
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan.perez@example.com',
  telefono: '+56912345678',
  direccion: 'Av. Principal 123',
  departamento: 'Depto 45',
  region: 'Región Metropolitana',
  comuna: 'Santiago',
  indicadoresEntrega: 'Casa con portón azul'
};
 //create mock productos con 2 productos
const mockProductos: ProductoEnCarrito[] = [
  {
    id: '1',
    nombre: 'PlayStation 5',
    precio: 500000,
    imagenUrl: '/img/ps5.jpg',
    cantidad: 1,
    categoria: 'Consolas',
    subcategoria: 'PlayStation'
  },
  {
    id: '2',
    nombre: 'Teclado Gaming',
    precio: 150000,
    imagenUrl: '/img/teclado.jpg',
    cantidad: 2,
    categoria: 'Periféricos',
    subcategoria: 'Teclados'
  }
];
 //describe orden helper
describe('Orden Helper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generarCodigoOrden', () => {
    test('Debería generar un código con el formato correcto', () => {
      const codigo = generarCodigoOrden();
      
      // Formato: YYYYMMDD-HHMMSS-XXXX
      expect(codigo).toMatch(/^\d{8}-\d{6}-\d{4}$/);
    });

    test('Debería generar códigos únicos en llamadas consecutivas', () => {
      const codigo1 = generarCodigoOrden();
      const codigo2 = generarCodigoOrden(); 
      
      expect(codigo1).not.toBe(codigo2); //deberia ser diferente porque es un codigo unico
    });

    test('Debería incluir la fecha actual en el código', () => {
      const ahora = new Date(); //deberia ser la fecha actual
      const codigo = generarCodigoOrden(); //deberia ser un codigo unico
      
      const fechaEsperada = ahora.toISOString().slice(0, 10).replace(/-/g, '');
      expect(codigo).toContain(fechaEsperada); //deberia ser la fecha actual porque es un codigo unico
    });

    test('Debería incluir la hora actual en el código', () => {
      const ahora = new Date();
      const codigo = generarCodigoOrden(); 
      
      const horaEsperada = ahora.toTimeString().slice(0, 8).replace(/:/g, '');
      expect(codigo).toContain(horaEsperada);
    });

    test('Debería incluir un número aleatorio de 4 dígitos', () => {
      const codigo = generarCodigoOrden(); //deberia ser un codigo unico
      const partes = codigo.split('-'); //deberia ser un codigo unico
      const random = partes[2]; //deberia ser un numero aleatorio de 4 digitos
      
      expect(random).toMatch(/^\d{4}$/);
      expect(parseInt(random)).toBeGreaterThanOrEqual(0); //deberia ser un numero aleatorio de 4 digitos
      expect(parseInt(random)).toBeLessThanOrEqual(9999);
    });
  });

  describe('calcularValoresOrden', () => {
    test('Debería calcular valores correctamente sin descuento DUOC', () => {
      const valores = calcularValoresOrden(mockProductos, false);
      
      // Subtotal: (500000 * 1) + (150000 * 2) = 800000
      expect(valores.subtotal).toBe(800000);
      expect(valores.descuento).toBe(0);
      // IVA: 800000 * 0.19 = 152000
      expect(valores.iva).toBe(152000);
      // Total: 800000 + 152000 = 952000
      expect(valores.total).toBe(952000);
    });

    test('Debería calcular valores correctamente con descuento DUOC', () => {
      const valores = calcularValoresOrden(mockProductos, true);
      
      // Subtotal: 800000
      expect(valores.subtotal).toBe(800000);
      // Descuento: 800000 * 0.2 = 160000
      expect(valores.descuento).toBe(160000);
      // Subtotal con descuento: 800000 - 160000 = 640000
      // IVA: 640000 * 0.19 = 121600
      expect(valores.iva).toBe(121600);
      // Total: 640000 + 121600 = 761600
      expect(valores.total).toBe(761600);
    });

    test('Debería manejar carrito vacío', () => {
      const valores = calcularValoresOrden([], false); //deberia ser 0 porque es un carrito vacio
      
      expect(valores.subtotal).toBe(0);
      expect(valores.descuento).toBe(0);
      expect(valores.iva).toBe(0);
      expect(valores.total).toBe(0);
    });

    test('Debería manejar carrito vacío con descuento DUOC', () => {
      const valores = calcularValoresOrden([], true);
      
      expect(valores.subtotal).toBe(0); 
      expect(valores.descuento).toBe(0);
      expect(valores.iva).toBe(0);
      expect(valores.total).toBe(0);
    });

    test('Debería redondear correctamente los valores', () => {
      const productosConDecimales = [
        {
          id: '1',
          nombre: 'Producto',
          precio: 100000.50,
          imagenUrl: '/img/test.jpg',
          cantidad: 1,
          categoria: 'Test'
        }
      ];
      
      const valores = calcularValoresOrden(productosConDecimales, true);
      
      // Descuento: 100000.50 * 0.2 = 20000.1 -> redondeado a 20000
      expect(valores.descuento).toBe(20000);
      // IVA: (100000.50 - 20000) * 0.19 = 15200.095 -> redondeado a 15200
      expect(valores.iva).toBe(15200);
    });
  });

  describe('crearOrdenCompra', () => {
    test('Debería crear una orden con todos los datos correctos', () => {
      const orden = crearOrdenCompra(mockDatosEnvio, mockProductos, false);
      
      expect(orden.codigo).toMatch(/^\d{8}-\d{6}-\d{4}$/); //deberia ser un codigo unico
      expect(orden.fecha).toBeDefined();
      expect(orden.datosEnvio).toEqual(mockDatosEnvio);
      expect(orden.productos).toHaveLength(2);
      expect(orden.subtotal).toBe(800000);
      expect(orden.descuento).toBe(0);
      expect(orden.iva).toBe(152000);
      expect(orden.total).toBe(952000);
      expect(orden.estado).toBe('pendiente');
    });

    test('Debería crear una orden con descuento DUOC', () => {
      const orden = crearOrdenCompra(mockDatosEnvio, mockProductos, true);
      
      expect(orden.descuento).toBe(160000); //deberia ser 160000 porque es el descuento DUOC
      expect(orden.total).toBe(761600);  
    });

    test('Debería mapear productos correctamente', () => {
      const orden = crearOrdenCompra(mockDatosEnvio, mockProductos, false);
       // gemeramos una orden con los productos correctos
      expect(orden.productos[0]).toEqual({ 
        id: '1',
        nombre: 'PlayStation 5',
        titulo: undefined,
        precio: 500000,
        imagenUrl: '/img/ps5.jpg',
        imagen: undefined,
        cantidad: 1,
        categoria: 'Consolas',
        subcategoria: 'PlayStation'
      });
    });

    test('Debería usar fallbacks para productos sin datos', () => { 
      const productosIncompletos: ProductoEnCarrito[] = [ //create mock productos incompletos
        {
          id: '1',
          nombre: '',
          titulo: 'Título del Producto',
          precio: 100000,
          imagenUrl: '',
          imagen: '/img/fallback.jpg',
          cantidad: 1,
          categoria: 'Test'
        }
      ];
      
      const orden = crearOrdenCompra(mockDatosEnvio, productosIncompletos, false);
       
      expect(orden.productos[0].nombre).toBe('Título del Producto');
      expect(orden.productos[0].imagenUrl).toBe('/img/fallback.jpg');
    });

    test('Debería usar placeholder para imagen faltante', () => {
      const productosSinImagen: ProductoEnCarrito[] = [
        {
          id: '1',
          nombre: 'Producto',
          precio: 100000,
          imagenUrl: '',
          cantidad: 1,
          categoria: 'Test'
        }
      ];
      
      const orden = crearOrdenCompra(mockDatosEnvio, productosSinImagen, false);
      
      expect(orden.productos[0].imagenUrl).toBe('/img/otros/placeholder.png');
    });
  });

  describe('procesarPago', () => {
    test('Debería procesar pago exitosamente', async () => {
      // Mock Math.random para simular éxito
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.5); // 50% de probabilidad de éxito
      
      const orden = crearOrdenCompra(mockDatosEnvio, mockProductos, false);
      
      const resultado = await procesarPago(orden);
      
      expect(resultado.exito).toBe(true);
      expect(resultado.codigoTransaccion).toMatch(/^TXN-\d+$/);
      expect(resultado.error).toBeUndefined();
      
      // Restaurar Math.random
      Math.random = originalRandom;
    });

    test('Debería simular fallo aleatorio ocasional', async () => {
      // Mock Math.random para simular fallo
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.05); // 5% de probabilidad de fallo
      
      const orden = crearOrdenCompra(mockDatosEnvio, mockProductos, false);
      const resultado = await procesarPago(orden);
      
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toBeDefined();
      expect(typeof resultado.error).toBe('string');
      expect(resultado.codigoTransaccion).toBeUndefined();
      
      // Restaurar Math.random
      Math.random = originalRandom;
    });

    test('Debería generar códigos de transacción únicos', async () => {
      // Mock Math.random para simular éxito
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.5); // 50% de probabilidad de éxito
      
      const orden = crearOrdenCompra(mockDatosEnvio, mockProductos, false);
      
      const resultado1 = await procesarPago(orden);
      const resultado2 = await procesarPago(orden);
      
      expect(resultado1.codigoTransaccion).not.toBe(resultado2.codigoTransaccion);
      
      // Restaurar Math.random
      Math.random = originalRandom;
    });

    test('Debería tener un delay de procesamiento', async () => {
      const orden = crearOrdenCompra(mockDatosEnvio, mockProductos, false);
      
      const startTime = Date.now();
      await procesarPago(orden);
      const endTime = Date.now();
      
      // Debería tomar al menos 2 segundos
      expect(endTime - startTime).toBeGreaterThanOrEqual(2000);
    });

    test('Debería retornar uno de los errores predefinidos en caso de fallo', async () => {
      // Mock Math.random para simular fallo
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.05); // 5% de probabilidad de fallo
      
      const orden = crearOrdenCompra(mockDatosEnvio, mockProductos, false);
      const resultado = await procesarPago(orden);
      
      const erroresEsperados = [
        'Error en el procesamiento del pago',
        'Tarjeta rechazada',
        'Fondos insuficientes',
        'Error de conectividad',
        'Datos de tarjeta inválidos',
        'BANCO ESTADO DEVUELVEME LA PLATAAAA '
      ]; //nos deberia dar un error porque es un error de pago
      
      expect(resultado.exito).toBe(false);
      expect(erroresEsperados).toContain(resultado.error);
      
      // Restaurar Math.random
      Math.random = originalRandom;
    });
  });
});
