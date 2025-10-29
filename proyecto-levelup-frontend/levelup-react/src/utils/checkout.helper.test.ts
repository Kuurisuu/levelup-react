import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { 
  guardarDatosCheckout, 
  obtenerDatosCheckout, 
  limpiarDatosCheckout,
  guardarDatosEnvio,
  guardarDatosTarjeta,
  obtenerDatosEnvio,
  obtenerDatosTarjeta,
  DatosEnvio,
  DatosTarjeta,
  CheckoutMemory
} from './checkout.helper';

/**
 * Tests para las utilidades de checkout
 * Verifica el manejo de datos de envío, tarjeta y persistencia en localStorage
 */

describe('Checkout Helper', () => {
  let mockLocalStorage: { [key: string]: string };
  let mockConsoleLog: any;
  let mockConsoleError: any;

  beforeEach(() => {
    // Mock de localStorage
    mockLocalStorage = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: vi.fn(() => {
          mockLocalStorage = {};
        })
      },
      writable: true
    });

    // Mock de console
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('guardarDatosCheckout', () => {
    test('Debería guardar datos de envío correctamente', () => {
      const datosEnvio: DatosEnvio = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '+56912345678',
        direccion: 'Av. Principal 123',
        departamento: 'Depto 45',
        region: 'Región Metropolitana',
        comuna: 'Santiago',
        indicadoresEntrega: 'Casa con portón azul'
      };

      guardarDatosCheckout({ datosEnvio });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'lvup_checkout_memory',
        expect.stringContaining('"datosEnvio"')
      );
      expect(mockConsoleLog).toHaveBeenCalled();
    });

    test('Debería guardar datos de tarjeta correctamente', () => {
      const datosTarjeta: DatosTarjeta = {
        numero: '1234567890123456',
        nombre: 'JUAN PEREZ',
        vencimiento: '12/25',
        cvv: '123'
      };

      guardarDatosCheckout({ datosTarjeta });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'lvup_checkout_memory',
        expect.stringContaining('"datosTarjeta"')
      );
    });

    test('Debería actualizar datos existentes', () => {
      // Guardar datos iniciales
      const datosEnvio: DatosEnvio = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '+56912345678',
        direccion: 'Av. Principal 123',
        departamento: 'Depto 45',
        region: 'Región Metropolitana',
        comuna: 'Santiago',
        indicadoresEntrega: 'Casa con portón azul'
      };

      guardarDatosCheckout({ datosEnvio });

      // Actualizar con datos de tarjeta
      const datosTarjeta: DatosTarjeta = {
        numero: '1234567890123456',
        nombre: 'JUAN PEREZ',
        vencimiento: '12/25',
        cvv: '123'
      };

      guardarDatosCheckout({ datosTarjeta });

      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });

    test('Debería manejar errores de localStorage', () => {
      // Mock localStorage para que lance error
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: vi.fn(() => {
            throw new Error('localStorage error');
          })
        },
        writable: true
      });

      const datosEnvio: DatosEnvio = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '+56912345678',
        direccion: 'Av. Principal 123',
        departamento: 'Depto 45',
        region: 'Región Metropolitana',
        comuna: 'Santiago',
        indicadoresEntrega: 'Casa con portón azul'
      };

      expect(() => guardarDatosCheckout({ datosEnvio })).not.toThrow();
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('obtenerDatosCheckout', () => {
    test('Debería retornar datos vacíos cuando no hay datos guardados', () => {
      const datos = obtenerDatosCheckout();
      
      expect(datos).toEqual({
        datosEnvio: undefined,
        datosTarjeta: undefined,
        ultimoPaso: undefined,
        timestamp: undefined
      });
    });

    test('Debería retornar datos guardados correctamente', () => {
      const datosEnvio: DatosEnvio = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '+56912345678',
        direccion: 'Av. Principal 123',
        departamento: 'Depto 45',
        region: 'Región Metropolitana',
        comuna: 'Santiago',
        indicadoresEntrega: 'Casa con portón azul'
      };

      guardarDatosCheckout({ datosEnvio });
      const datos = obtenerDatosCheckout();

      expect(datos.datosEnvio).toEqual(datosEnvio);
      expect(datos.timestamp).toBeDefined();
    });

    test('Debería manejar datos expirados', () => {
      // Simular datos expirados (más de 24 horas)
      const datosExpirados: CheckoutMemory = {
        datosEnvio: {
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com',
          telefono: '+56912345678',
          direccion: 'Av. Principal 123',
          departamento: 'Depto 45',
          region: 'Región Metropolitana',
          comuna: 'Santiago',
          indicadoresEntrega: 'Casa con portón azul'
        },
        timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 horas atrás
      };

      mockLocalStorage['lvup_checkout_memory'] = JSON.stringify(datosExpirados);
      
      const datos = obtenerDatosCheckout();
      
      expect(datos).toEqual({
        datosEnvio: undefined,
        datosTarjeta: undefined,
        ultimoPaso: undefined,
        timestamp: undefined
      });
    });

    test('Debería manejar errores de localStorage', () => {
      // Mock localStorage para que lance error
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn(() => {
            throw new Error('localStorage error');
          })
        },
        writable: true
      });

      const datos = obtenerDatosCheckout();
      
      expect(datos).toEqual({
        datosEnvio: undefined,
        datosTarjeta: undefined,
        ultimoPaso: undefined,
        timestamp: undefined
      });
    });
  });

  describe('limpiarDatosCheckout', () => {
    test('Debería limpiar todos los datos del checkout', () => {
      // Guardar algunos datos primero
      const datosEnvio: DatosEnvio = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '+56912345678',
        direccion: 'Av. Principal 123',
        departamento: 'Depto 45',
        region: 'Región Metropolitana',
        comuna: 'Santiago',
        indicadoresEntrega: 'Casa con portón azul'
      };

      guardarDatosCheckout({ datosEnvio });
      limpiarDatosCheckout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('lvup_checkout_memory');
    });
  });

  describe('guardarDatosEnvio', () => {
    test('Debería guardar datos de envío específicamente', () => {
      const datosEnvio: DatosEnvio = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '+56912345678',
        direccion: 'Av. Principal 123',
        departamento: 'Depto 45',
        region: 'Región Metropolitana',
        comuna: 'Santiago',
        indicadoresEntrega: 'Casa con portón azul'
      };

      guardarDatosEnvio(datosEnvio);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'lvup_checkout_memory',
        expect.stringContaining('"datosEnvio"')
      );
    });
  });

  describe('guardarDatosTarjeta', () => {
    test('Debería guardar datos de tarjeta específicamente', () => {
      const datosTarjeta: DatosTarjeta = {
        numero: '1234567890123456',
        nombre: 'JUAN PEREZ',
        vencimiento: '12/25',
        cvv: '123'
      };

      guardarDatosTarjeta(datosTarjeta);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'lvup_checkout_memory',
        expect.stringContaining('"datosTarjeta"')
      );
    });
  });

  describe('obtenerDatosEnvio', () => {
    test('Debería obtener datos de envío guardados', () => {
      const datosEnvio: DatosEnvio = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '+56912345678',
        direccion: 'Av. Principal 123',
        departamento: 'Depto 45',
        region: 'Región Metropolitana',
        comuna: 'Santiago',
        indicadoresEntrega: 'Casa con portón azul'
      };

      guardarDatosEnvio(datosEnvio);
      const datosObtenidos = obtenerDatosEnvio();

      expect(datosObtenidos).toEqual(datosEnvio);
    });
  });

  describe('obtenerDatosTarjeta', () => {
    test('Debería obtener datos de tarjeta guardados', () => {
      const datosTarjeta: DatosTarjeta = {
        numero: '1234567890123456',
        nombre: 'JUAN PEREZ',
        vencimiento: '12/25',
        cvv: '123'
      };

      guardarDatosTarjeta(datosTarjeta);
      const datosObtenidos = obtenerDatosTarjeta();

      expect(datosObtenidos).toEqual(datosTarjeta);
    });
  });
});
