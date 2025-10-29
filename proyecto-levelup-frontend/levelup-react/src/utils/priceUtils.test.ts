import { describe, expect, test } from 'vitest';
import { formatPriceCLP, formatPriceCLPCurrency } from './priceUtils';

/**
 * Tests para las utilidades de formateo de precios
 * Verifica el formateo correcto de precios en CLP
 */
describe('Price Utils', () => {
  describe('formatPriceCLP', () => {
    test('Debería formatear precio simple correctamente', () => {
      expect(formatPriceCLP(1000)).toBe('$1.000 CLP'); //deberia ser 1.000 porque es el precio simple
    });

    test('Debería formatear precio con miles correctamente', () => {
      expect(formatPriceCLP(50000)).toBe('$50.000 CLP'); //deberia ser 50.000 porque es el precio con miles
    });

    test('Debería formatear precio con millones correctamente', () => {
      expect(formatPriceCLP(1500000)).toBe('$1.500.000 CLP'); //deberia ser 1.500.000 porque es el precio con millones
    });

    test('Debería redondear a la decena más cercana', () => {
      expect(formatPriceCLP(1234)).toBe('$1.230 CLP'); //deberia ser 1.230 porque es el precio redondeado a la decena mas cercana
      expect(formatPriceCLP(1236)).toBe('$1.240 CLP'); //deberia ser 1.240 porque es el precio redondeado a la decena mas cercana
    });

    test('Debería manejar precios de un dígito', () => {
      expect(formatPriceCLP(5)).toBe('$10 CLP'); //deberia ser 10 porque es el precio de un dígito
    });

    test('Debería manejar precios cero', () => {
      expect(formatPriceCLP(0)).toBe('$0 CLP'); //deberia ser 0 porque es el precio cero
    });

    test('Debería manejar precios negativos', () => {
      expect(formatPriceCLP(-1000)).toBe('$-1.000 CLP'); //deberia ser -1.000 porque es el precio negativo
    });

    test('Debería manejar precios decimales', () => {
      expect(formatPriceCLP(1234.56)).toBe('$1.230 CLP'); //deberia ser 1.230 porque es el precio redondeado a la decena mas cercana
      expect(formatPriceCLP(1235.89)).toBe('$1.240 CLP'); //deberia ser 1.240 porque es el precio redondeado a la decena mas cercana
    });

    test('Debería manejar precios muy grandes', () => {
      expect(formatPriceCLP(999999999)).toBe('$1.000.000.000 CLP'); //deberia ser 1.000.000.000 porque es el precio muy grande
    });
  });

  describe('formatPriceCLPCurrency', () => {
    test('Debería formatear precio simple con estilo de moneda', () => {
      expect(formatPriceCLPCurrency(1000)).toBe('$1.000'); //deberia ser 1.000 porque es el precio simple
    });

    test('Debería formatear precio con miles con estilo de moneda', () => {
      expect(formatPriceCLPCurrency(50000)).toBe('$50.000'); //deberia ser 50.000 porque es el precio con miles
    }); 

    test('Debería formatear precio con millones con estilo de moneda', () => {
      expect(formatPriceCLPCurrency(1500000)).toBe('$1.500.000'); //deberia ser 1.500.000 porque es el precio con millones
    });

    test('Debería manejar precios de un dígito', () => {
      expect(formatPriceCLPCurrency(5)).toBe('$5'); //deberia ser 5 porque es el precio de un dígito
    });

    test('Debería manejar precios cero', () => {
      expect(formatPriceCLPCurrency(0)).toBe('$0'); //deberia ser 0 porque es el precio cero
    });

    test('Debería manejar precios negativos', () => {
      expect(formatPriceCLPCurrency(-1000)).toBe('$-1.000'); //deberia ser -1.000 porque es el precio negativo
    });

    test('Debería manejar precios decimales (sin decimales)', () => {
      expect(formatPriceCLPCurrency(1234.56)).toBe('$1.235'); //deberia ser 1.235 porque es el precio redondeado a la decena mas cercana
      expect(formatPriceCLPCurrency(1234.89)).toBe('$1.235'); //deberia ser 1.235 porque es el precio redondeado a la decena mas cercana
    });

    test('Debería manejar precios muy grandes', () => {
      expect(formatPriceCLPCurrency(999999999)).toBe('$999.999.999'); //deberia ser 999.999.999 porque es el precio muy grande
    });

    test('Debería usar el formato de moneda chilena', () => {
      // Verificar que usa el formato correcto para Chile
      const result = formatPriceCLPCurrency(1234567); //deberia ser 1.234.567 porque es el precio
      expect(result).toMatch(/^\$\d{1,3}(\.\d{3})*$/); //deberia ser 1.234.567 porque es el precio
    });
  });

  describe('Comparación entre funciones', () => {
    test('Debería mostrar diferencias en el redondeo', () => {
      const price = 1234;
      const clpResult = formatPriceCLP(price); //deberia ser 1.230 porque es el precio redondeado a la decena mas cercana
      const currencyResult = formatPriceCLPCurrency(price); //deberia ser 1.234 porque es el precio redondeado a la decena mas cercana
      
      expect(clpResult).toBe('$1.230 CLP'); //deberia ser 1.230 porque es el precio redondeado a la decena mas cercana
      expect(currencyResult).toBe('$1.234'); //deberia ser 1.234 porque es el precio redondeado a la decena mas cercana
    });

    test('Debería mostrar diferencias en precios con decimales', () => {
      const price = 1235.89;
      const clpResult = formatPriceCLP(price); //deberia ser 1.240 porque es el precio redondeado a la decena mas cercana
      const currencyResult = formatPriceCLPCurrency(price); //deberia ser 1.236 porque es el precio redondeado a la decena mas cercana
      
      expect(clpResult).toBe('$1.240 CLP'); //deberia ser 1.240 porque es el precio redondeado a la decena mas cercana
      expect(currencyResult).toBe('$1.236'); //deberia ser 1.236 porque es el precio redondeado a la decena mas cercana
    });
  });
});
