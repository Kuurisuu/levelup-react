import { describe, expect, test } from 'vitest';
import { calcularRatingPromedio, obtenerEstadisticasRating } from './ratingUtils';
import { Producto, Categoria, Subcategoria, Review } from '../data/catalogo';

/**
 * Tests para las utilidades de rating
 * Verifica el cálculo de ratings promedio y estadisticas de productos
 */

const mockCategoria: Categoria = {
  id: "CO",
  nombre: "Consolas"
};

const mockSubcategoria: Subcategoria = {
  id: "MA",
  nombre: "Mandos",
  categoria: mockCategoria
};

const createMockProducto = (reviews: Review[] = []): Producto => ({
  id: '1',
  nombre: 'Test Product',
  descripcion: 'Test Description',
  precio: 100000,
  imagenUrl: '/img/test.jpg',
  categoria: mockCategoria,
  subcategoria: mockSubcategoria,
  rating: 4.0,
  disponible: true,
  destacado: false,
  stock: 10,
  imagenesUrls: ['/img/test.jpg'],
  reviews,
  productosRelacionados: [],
  ratingPromedio: 4.0
});

const createMockReview = (usuarioNombre: string, rating: number): Review => ({
  id: `review-${usuarioNombre}-${rating}`,
  usuarioNombre,
  rating,
  comentario: `Comentario de ${usuarioNombre}`,
  fecha: new Date().toISOString(),
  productoId: '1'
});

describe('Rating Utils', () => { 
  describe('calcularRatingPromedio', () => {
    test('Debería retornar el rating del producto cuando no hay reviews', () => {
      const producto = createMockProducto();
      expect(calcularRatingPromedio(producto)).toBe(4.0); //deberia ser 4.0 porque es el rating por defecto del producto
    });

    test('Debería calcular el promedio correctamente con una review', () => {
      const reviews = [createMockReview('Usuario1', 5)];
      const producto = createMockProducto(reviews);
      
      expect(calcularRatingPromedio(producto)).toBe(5); //deberia ser 5 porque es el rating de la review
    });

    test('Debería calcular el promedio correctamente con múltiples reviews del mismo usuario', () => {
      const reviews = [
        createMockReview('Usuario1', 4),
        createMockReview('Usuario1', 5),
        createMockReview('Usuario1', 3)
      ];
      const producto = createMockProducto(reviews);
      
      // Promedio del usuario: (4 + 5 + 3) / 3 = 4
      expect(calcularRatingPromedio(producto)).toBe(4);
    });

    test('Debería calcular el promedio correctamente con múltiples usuarios', () => {
      const reviews = [
        createMockReview('Usuario1', 5),
        createMockReview('Usuario2', 3),
        createMockReview('Usuario3', 4)
      ];
      const producto = createMockProducto(reviews);
      
      // Promedio: (5 + 3 + 4) / 3 = 4
      expect(calcularRatingPromedio(producto)).toBe(4);
    });

    test('Debería manejar usuarios con múltiples reviews correctamente', () => {
      const reviews = [
        createMockReview('Usuario1', 5),
        createMockReview('Usuario1', 3),
        createMockReview('Usuario2', 4),
        createMockReview('Usuario2', 2)
      ];
      const producto = createMockProducto(reviews);
      
      // Usuario1 promedio: (5 + 3) / 2 = 4
      // Usuario2 promedio: (4 + 2) / 2 = 3
      // Promedio final: (4 + 3) / 2 = 3.5
      expect(calcularRatingPromedio(producto)).toBe(3.5);
    });

    test('Debería manejar reviews anónimas', () => {
      const reviews = [
        { ...createMockReview('Usuario1', 5), usuarioNombre: '' },
        { ...createMockReview('Usuario2', 3), usuarioNombre: '' }
      ];
      const producto = createMockProducto(reviews);
      
      // Ambas se consideran anónimas, se promedian juntas
      expect(calcularRatingPromedio(producto)).toBe(4);
    });

    test('Debería manejar reviews con usuarioNombre vacío', () => {
      const reviews = [ 
        { ...createMockReview('Usuario1', 5), usuarioNombre: '' }, //deberia ser anónimo porque es un usuario que no tiene nombre
        { ...createMockReview('Usuario2', 3), usuarioNombre: '' }
      ]; 
      const producto = createMockProducto(reviews);
      
      // Ambas se consideran anónimas
      expect(calcularRatingPromedio(producto)).toBe(4);
    });

    test('Debería manejar reviews vacías', () => {
      const producto = createMockProducto([]);  //create mock producto con reviews vacías
      expect(calcularRatingPromedio(producto)).toBe(4.0); //deberia ser 4.0 porque es el rating por defecto del producto
    });
  });

  describe('obtenerEstadisticasRating', () => {
    test('Debería retornar estadísticas básicas cuando no hay reviews', () => {
      const producto = createMockProducto(); //create mock producto con reviews vacías
      const stats = obtenerEstadisticasRating(producto); //obtener estadisticas de la review
      
      expect(stats).toEqual({  //deberia ser 4.0 porque es el rating por defecto del producto
        promedio: 4.0,
        totalReseñas: 0, //deberia ser 0 porque no hay reviews
        usuariosUnicos: 0, //deberia ser 0 porque no hay reviews
        distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } //deberia ser 0 porque no hay reviews
      });
    });

    test('Debería calcular estadísticas correctamente con una review', () => {
      const reviews = [createMockReview('Usuario1', 5)];
      const producto = createMockProducto(reviews);
      const stats = obtenerEstadisticasRating(producto);
      
      expect(stats.promedio).toBe(5); //deberia ser 5 porque es el rating de la review
      expect(stats.totalReseñas).toBe(1); //deberia ser 1 porque hay una review
      expect(stats.usuariosUnicos).toBe(1); //deberia ser 1 porque hay un usuario
      expect(stats.distribucion).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }); //deberia ser 1 porque hay una review
    });

    test('Debería calcular estadísticas correctamente con múltiples usuarios', () => {
      const reviews = [
        createMockReview('Usuario1', 5), //create mock review con rating 5
        createMockReview('Usuario2', 3),
        createMockReview('Usuario3', 4)
      ];
      const producto = createMockProducto(reviews);
      const stats = obtenerEstadisticasRating(producto);
      
      expect(stats.promedio).toBe(4);
      expect(stats.totalReseñas).toBe(3);
      expect(stats.usuariosUnicos).toBe(3);
      expect(stats.distribucion).toEqual({ 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 });
    });

    test('Debería calcular distribución correctamente con múltiples reviews del mismo usuario', () => {
      const reviews = [
        createMockReview('Usuario1', 4),
        createMockReview('Usuario1', 5)
      ];
      const producto = createMockProducto(reviews);
      const stats = obtenerEstadisticasRating(producto);
      
      // Promedio del usuario: (4 + 5) / 2 = 4.5, redondeado = 5
      expect(stats.promedio).toBe(4.5);
      expect(stats.totalReseñas).toBe(2);
      expect(stats.usuariosUnicos).toBe(1);
      expect(stats.distribucion).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 });
    });

    test('Debería manejar ratings decimales en la distribución', () => {
      const reviews = [
        createMockReview('Usuario1', 2),
        createMockReview('Usuario1', 3)
      ];
      const producto = createMockProducto(reviews);
      const stats = obtenerEstadisticasRating(producto);
      
      // Promedio del usuario: (2 + 3) / 2 = 2.5, redondeado = 3
      expect(stats.distribucion[3]).toBe(1);
    });

    test('Debería manejar ratings fuera del rango 1-5', () => {
      const reviews = [
        createMockReview('Usuario1', 0),
        createMockReview('Usuario2', 6)
      ];
      const producto = createMockProducto(reviews);
      const stats = obtenerEstadisticasRating(producto);
      
      // Los ratings fuera del rango no se cuentan en la distribución
      expect(stats.distribucion).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    });

    test('Debería calcular correctamente con usuarios anónimos', () => {
      const reviews = [
        { ...createMockReview('Usuario1', 5), usuarioNombre: '' },
        { ...createMockReview('Usuario2', 3), usuarioNombre: '' }
      ];
      const producto = createMockProducto(reviews);
      const stats = obtenerEstadisticasRating(producto);
      
      expect(stats.promedio).toBe(4);
      expect(stats.totalReseñas).toBe(2);
      expect(stats.usuariosUnicos).toBe(1); // Se agrupan como anónimos
    });
  });
});
