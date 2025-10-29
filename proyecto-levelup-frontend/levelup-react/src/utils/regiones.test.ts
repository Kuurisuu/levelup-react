import { describe, expect, test } from 'vitest';
import { REGIONES, Region } from './regiones';

/**
 * Tests para las utilidades de regiones
 * Verifica la estructura y contenido de los datos de regiones chilenas
 */
describe('Regiones Utils', () => {
  describe('REGIONES array', () => {
    test('Debería tener al menos 7 regiones', () => {
      expect(REGIONES.length).toBeGreaterThanOrEqual(7);
    });

    test('Debería contener la Región Metropolitana', () => {
      const regionMetropolitana = REGIONES.find(r => r.nombre === 'Región Metropolitana');
      expect(regionMetropolitana).toBeDefined();
    });

    test('Debería contener Valparaíso', () => {
      const valparaiso = REGIONES.find(r => r.nombre === 'Valparaíso');
      expect(valparaiso).toBeDefined();
    });

    test('Debería contener Biobío', () => {
      const biobio = REGIONES.find(r => r.nombre === 'Biobío');
      expect(biobio).toBeDefined();
    });

    test('Debería contener Coquimbo', () => {
      const coquimbo = REGIONES.find(r => r.nombre === 'Coquimbo');
      expect(coquimbo).toBeDefined();
    });

    test('Debería contener Antofagasta', () => {
      const antofagasta = REGIONES.find(r => r.nombre === 'Antofagasta');
      expect(antofagasta).toBeDefined();
    });

    test('Debería contener Tarapacá', () => {
      const tarapaca = REGIONES.find(r => r.nombre === 'Tarapacá');
      expect(tarapaca).toBeDefined();
    });

    test('Debería contener Arica y Parinacota', () => {
      const arica = REGIONES.find(r => r.nombre === 'Arica y Parinacota');
      expect(arica).toBeDefined();
    });
  });

  describe('Estructura de Region', () => {
    test('Cada región debería tener nombre y comunas', () => {
      REGIONES.forEach(region => {
        expect(region).toHaveProperty('nombre');
        expect(region).toHaveProperty('comunas');
        expect(typeof region.nombre).toBe('string');
        expect(Array.isArray(region.comunas)).toBe(true);
      });
    });

    test('Cada región debería tener al menos una comuna', () => {
      REGIONES.forEach(region => {
        expect(region.comunas.length).toBeGreaterThan(0);
      });
    });

    test('Los nombres de regiones no deberían estar vacíos', () => {
      REGIONES.forEach(region => {
        expect(region.nombre.trim()).not.toBe('');
      });
    });

    test('Las comunas no deberían estar vacías', () => {
      REGIONES.forEach(region => {
        region.comunas.forEach(comuna => {
          expect(comuna.trim()).not.toBe('');
        });
      });
    });
  });

  describe('Comunas específicas', () => {
    test('Región Metropolitana debería contener Santiago', () => {
      const regionMetropolitana = REGIONES.find(r => r.nombre === 'Región Metropolitana');
      expect(regionMetropolitana?.comunas).toContain('Santiago');
    });

    test('Región Metropolitana debería contener Las Condes', () => {
      const regionMetropolitana = REGIONES.find(r => r.nombre === 'Región Metropolitana');
      expect(regionMetropolitana?.comunas).toContain('Las Condes');
    });

    test('Valparaíso debería contener Valparaíso', () => {
      const valparaiso = REGIONES.find(r => r.nombre === 'Valparaíso');
      expect(valparaiso?.comunas).toContain('Valparaíso');
    });

    test('Valparaíso debería contener Viña del Mar', () => {
      const valparaiso = REGIONES.find(r => r.nombre === 'Valparaíso');
      expect(valparaiso?.comunas).toContain('Viña del Mar');
    });

    test('Biobío debería contener Concepción', () => {
      const biobio = REGIONES.find(r => r.nombre === 'Biobío');
      expect(biobio?.comunas).toContain('Concepción');
    });

    test('Coquimbo debería contener La Serena', () => {
      const coquimbo = REGIONES.find(r => r.nombre === 'Coquimbo');
      expect(coquimbo?.comunas).toContain('La Serena');
    });

    test('Antofagasta debería contener Antofagasta', () => {
      const antofagasta = REGIONES.find(r => r.nombre === 'Antofagasta');
      expect(antofagasta?.comunas).toContain('Antofagasta');
    });

    test('Tarapacá debería contener Iquique', () => {
      const tarapaca = REGIONES.find(r => r.nombre === 'Tarapacá');
      expect(tarapaca?.comunas).toContain('Iquique');
    });

    test('Arica y Parinacota debería contener Arica', () => {
      const arica = REGIONES.find(r => r.nombre === 'Arica y Parinacota');
      expect(arica?.comunas).toContain('Arica');
    });
  });

  describe('Integridad de datos', () => {
    test('No debería haber regiones duplicadas', () => {
      const nombres = REGIONES.map(r => r.nombre);
      const nombresUnicos = [...new Set(nombres)];
      expect(nombres.length).toBe(nombresUnicos.length);
    });

    test('No debería haber comunas duplicadas dentro de una región', () => {
      REGIONES.forEach(region => {
        const comunasUnicas = [...new Set(region.comunas)];
        expect(region.comunas.length).toBe(comunasUnicas.length);
      });
    });

    test('Todas las regiones deberían tener nombres únicos', () => {
      const nombres = REGIONES.map(r => r.nombre);
      const nombresUnicos = [...new Set(nombres)];
      expect(nombres.length).toBe(nombresUnicos.length);
    });
  });

  describe('Tipos TypeScript', () => {
    test('Cada región debería cumplir con la interfaz Region', () => {
      REGIONES.forEach(region => {
        // Verificar que tiene las propiedades requeridas
        expect(region).toHaveProperty('nombre');
        expect(region).toHaveProperty('comunas');
        
        // Verificar tipos
        expect(typeof region.nombre).toBe('string');
        expect(Array.isArray(region.comunas)).toBe(true);
        
        // Verificar que todas las comunas son strings
        region.comunas.forEach(comuna => {
          expect(typeof comuna).toBe('string');
        });
      });
    });
  });
});
