import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { logoutAndNotify, saveSession } from './auth';

/**
 * Tests para las funciones de autenticación
 * Verifica el manejo de sesiones, logout y eventos personalizados
 * 
 * Este archivo testea las funciones principales de autenticación:
 * - logoutAndNotify: Cierra sesión y notifica a otros componentes
 * - saveSession: Guarda la sesión del usuario y notifica el login
 * 
 * Se utilizan mocks para simular localStorage y window.dispatchEvent
 * para aislar las pruebas del entorno del navegador
 */
describe('Auth Logic', () => {
  // Variable para simular el almacenamiento local del navegador
  let mockLocalStorage: { [key: string]: string };
  // Mock para simular la función dispatchEvent de window
  let mockDispatchEvent: any;

  /**
   * Configuración antes de cada test
   * Crea mocks limpios para localStorage y dispatchEvent
   */
  beforeEach(() => {
    // Mock de localStorage - simula el almacenamiento local del navegador
    // Permite guardar, obtener y eliminar datos como en el navegador real
    mockLocalStorage = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] || null), // Obtiene valor por clave
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value; // Guarda valor con clave
        }),
        removeItem: vi.fn((key: string) => {
          delete mockLocalStorage[key]; // Elimina valor por clave
        }),
        clear: vi.fn(() => {
          mockLocalStorage = {}; // Limpia todo el almacenamiento
        })
      },
      writable: true // Permite modificar la propiedad
    });

    // Mock de window.dispatchEvent - simula el disparo de eventos personalizados
    // Permite verificar que se disparan los eventos correctos
    mockDispatchEvent = vi.fn(); 
    Object.defineProperty(window, 'dispatchEvent', {
      value: mockDispatchEvent,
      writable: true
    });
  });

  /**
   * Limpieza después de cada test
   * Resetea todos los mocks para evitar interferencias entre tests
   */
  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Tests para la función logoutAndNotify
   * Verifica que se elimine la sesión y se dispare el evento de logout
   */
  describe('logoutAndNotify', () => {
    /**
     * Test: Verificar que se elimina la sesión del localStorage
     * Simula una sesión existente y verifica que se llame removeItem
     */
    test('Debería remover la sesión del localStorage', () => {
      // Simular que hay una sesión guardada previamente
      mockLocalStorage['lvup_user_session'] = '{"user": "test"}';
      
      // Ejecutar la función de logout
      logoutAndNotify();
      
      // Verificar que se llamó removeItem con la clave correcta
      expect(localStorage.removeItem).toHaveBeenCalledWith('lvup_user_session');
    });

    /**
     * Test: Verificar que se dispara el evento personalizado de logout
     * Permite que otros componentes se enteren del logout del usuario
     */
    test('Debería disparar evento de logout', () => {
      // Ejecutar la función de logout
      logoutAndNotify();
      
      // Verificar que se disparó el evento personalizado 'lvup:logout'
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'lvup:logout' // Evento personalizado para notificar logout
        })
      );
    });

    /**
     * Test: Verificar manejo de errores en localStorage
     * La función debe ser robusta y no fallar si localStorage tiene problemas
     */
    test('Debería manejar errores de localStorage sin fallar', () => {
      // Mock localStorage para que lance error al intentar eliminar
      Object.defineProperty(window, 'localStorage', {
        value: {
          removeItem: vi.fn(() => {
            throw new Error('localStorage error'); // Simular error de localStorage
          })
        },
        writable: true
      });

      // Verificar que la función no lance excepción a pesar del error
      expect(() => logoutAndNotify()).not.toThrow();
    });

    /**
     * Test: Verificar manejo de errores en dispatchEvent
     * La función debe ser robusta y no fallar si dispatchEvent tiene problemas
     */
    test('Debería manejar errores de dispatchEvent sin fallar', () => {
      // Mock dispatchEvent para que lance error al intentar disparar evento
      Object.defineProperty(window, 'dispatchEvent', {
        value: vi.fn(() => {
          throw new Error('dispatchEvent error'); // Simular error de dispatchEvent
        }),
        writable: true
      });

      // Verificar que la función no lance excepción a pesar del error
      expect(() => logoutAndNotify()).not.toThrow();
    });
  });

  /**
   * Tests para la función saveSession
   * Verifica que se guarde la sesión y se dispare el evento de login
   */
  describe('saveSession', () => {
    /**
     * Test: Verificar que se guarda la sesión en localStorage
     * Simula el guardado de datos de sesión del usuario
     */
    test('Debería guardar la sesión en localStorage', () => {
      // Crear datos de sesión de prueba
      const session = { user: 'test', token: 'abc123' };
      
      // Ejecutar la función de guardado
      saveSession(session);
      
      // Verificar que se guardó con la clave correcta y se serializó a JSON
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'lvup_user_session', // Clave estándar para sesiones
        JSON.stringify(session) // Datos serializados como JSON
      );
    });

    /**
     * Test: Verificar que se dispara el evento personalizado de login
     * Permite que otros componentes se enteren del login del usuario
     */
    test('Debería disparar evento de login con la sesión', () => {
      // Crear datos de sesión de prueba
      const session = { user: 'test', token: 'abc123' };
      
      // Ejecutar la función de guardado
      saveSession(session);
      
      // Verificar que se disparó el evento personalizado 'lvup:login' con los datos
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'lvup:login', // Evento personalizado para notificar login
          detail: session // Datos de la sesión en el evento
        })
      );
    });

    /**
     * Test: Verificar manejo de errores en localStorage al guardar
     * La función debe ser robusta y no fallar si localStorage tiene problemas
     */
    test('Debería manejar errores de localStorage sin fallar', () => {
      // Mock localStorage para que lance error al intentar guardar
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: vi.fn(() => {
            throw new Error('localStorage error'); // Simular error de localStorage
          })
        },
        writable: true
      });

      // Crear datos de sesión de prueba
      const session = { user: 'test' };
      
      // Verificar que la función no lance excepción a pesar del error
      expect(() => saveSession(session)).not.toThrow();
    });

    /**
     * Test: Verificar manejo de errores en dispatchEvent al guardar
     * La función debe ser robusta y no fallar si dispatchEvent tiene problemas
     */
    test('Debería manejar errores de dispatchEvent sin fallar', () => {
      // Mock dispatchEvent para que lance error al intentar disparar evento
      Object.defineProperty(window, 'dispatchEvent', {
        value: vi.fn(() => {
          throw new Error('dispatchEvent error'); // Simular error de dispatchEvent
        }),
        writable: true
      });

      // Crear datos de sesión de prueba
      const session = { user: 'test' };
      
      // Verificar que la función no lance excepción a pesar del error
      expect(() => saveSession(session)).not.toThrow();
    });

    /**
     * Test: Verificar serialización de objetos complejos
     * Asegura que la función puede manejar estructuras de datos complejas
     */
    test('Debería serializar correctamente objetos complejos', () => {
      // Crear sesión con estructura compleja (objetos anidados, arrays)
      const complexSession = {
        user: { id: 1, name: 'Test' }, // Objeto anidado
        permissions: ['read', 'write'], // Array de strings
        settings: { theme: 'dark' } // Objeto anidado
      };
      
      // Ejecutar la función de guardado
      saveSession(complexSession);
      
      // Verificar que se serializó correctamente el objeto complejo
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'lvup_user_session', // Clave estándar
        JSON.stringify(complexSession) // Objeto complejo serializado como JSON
      );
    });
  });
});
