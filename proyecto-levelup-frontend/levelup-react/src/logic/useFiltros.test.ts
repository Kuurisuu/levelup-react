import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFiltros, Filtros } from './useFiltros';
import { Producto, Categoria, Subcategoria } from '../data/catalogo';

/**
 * Tests para el hook useFiltros
 * Verifica el filtrado de productos, manejo de estado y funciones de filtrado
 */

// Mock del catálogo
vi.mock('../data/catalogo', () => ({
  productosArray: [
    {
      id: '1',
      nombre: 'PlayStation 5',
      descripcion: 'Consola de videojuegos',
      precio: 500000,
      imagenUrl: '/img/ps5.jpg',
      categoria: { id: "CO", nombre: "Consolas" },
      subcategoria: { id: "MA", nombre: "Mandos", categoria: { id: "CO", nombre: "Consolas" } },
      rating: 4.5,
      disponible: true,
      destacado: true,
      stock: 10,
      imagenesUrls: ['/img/ps5.jpg'],
      reviews: [],
      productosRelacionados: [],
      ratingPromedio: 4.5
    },
    {
      id: '2',
      nombre: 'Teclado Gaming',
      descripcion: 'Teclado mecánico para gaming',
      precio: 150000,
      imagenUrl: '/img/teclado.jpg',
      categoria: { id: "PE", nombre: "Perifericos" },
      subcategoria: { id: "TE", nombre: "Teclados", categoria: { id: "PE", nombre: "Perifericos" } },
      rating: 4.0,
      disponible: true,
      destacado: false,
      stock: 5,
      imagenesUrls: ['/img/teclado.jpg'],
      reviews: [],
      productosRelacionados: [],
      ratingPromedio: 4.0
    },
    {
      id: '3',
      nombre: 'Xbox Series X',
      descripcion: 'Consola de Microsoft',
      precio: 450000,
      imagenUrl: '/img/xbox.jpg',
      categoria: { id: "CO", nombre: "Consolas" },
      subcategoria: { id: "MA", nombre: "Mandos", categoria: { id: "CO", nombre: "Consolas" } },
      rating: 4.2,
      disponible: false,
      destacado: false,
      stock: 0,
      imagenesUrls: ['/img/xbox.jpg'],
      reviews: [],
      productosRelacionados: [],
      ratingPromedio: 4.2
    }
  ]
}));

describe('useFiltros Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Debería inicializar con filtros por defecto', () => {
    const { result } = renderHook(() => useFiltros());
    
    expect(result.current.filtros).toEqual({
      categoria: "todos",
      subcategorias: [],
      texto: "",
      precioMin: "",
      precioMax: "",
      disponible: false,
      rating: 0,
      orden: "relevancia"
    });
  });

  test('Debería cambiar la categoría correctamente', () => {
    const { result } = renderHook(() => useFiltros());
    
    act(() => {
      result.current.setCategoria("CO");
    });
    
    expect(result.current.filtros.categoria).toBe("CO");
    expect(result.current.filtros.subcategorias).toEqual([]);
  });

  test('Debería toggle subcategorías correctamente', () => {
    const { result } = renderHook(() => useFiltros());
    
    act(() => {
      result.current.toggleSubcategoria("MA");
    });
    
    expect(result.current.filtros.subcategorias).toContain("MA");
    
    act(() => {
      result.current.toggleSubcategoria("MA");
    });
    
    expect(result.current.filtros.subcategorias).not.toContain("MA");
  });

    test('Debería seleccionar todas las subcategorías con ALL-', () => {
      const { result } = renderHook(() => useFiltros());
      
      act(() => {
        result.current.toggleSubcategoria("ALL-CO");
      });
      
      // La función ALL- agrega el prefijo ALL- a las subcategorías
      expect(result.current.filtros.subcategorias).toContain("ALL-CO");
    });

  test('Debería filtrar por texto correctamente', () => {
    const { result } = renderHook(() => useFiltros());
    
    act(() => {
      result.current.setTexto("PlayStation");
    });
    
    expect(result.current.filtros.texto).toBe("PlayStation");
    expect(result.current.productosFiltrados).toHaveLength(1);
    expect(result.current.productosFiltrados[0].nombre).toBe("PlayStation 5");
  });

  test('Debería filtrar por precio mínimo', () => {
    const { result } = renderHook(() => useFiltros());
    
    act(() => {
      result.current.setPrecioMin("200000");
    });
    
    expect(result.current.filtros.precioMin).toBe("200000");
    expect(result.current.productosFiltrados).toHaveLength(2); // PS5 y Xbox
  });

  test('Debería filtrar por precio máximo', () => {
    const { result } = renderHook(() => useFiltros());
    
    act(() => {
      result.current.setPrecioMax("200000");
    });
    
    expect(result.current.filtros.precioMax).toBe("200000");
    expect(result.current.productosFiltrados).toHaveLength(1); // Solo teclado
  });

  test('Debería filtrar por disponibilidad', () => {
    const { result } = renderHook(() => useFiltros());
    
    act(() => {
      result.current.setDisponible(true);
    });
    
    expect(result.current.filtros.disponible).toBe(true);
    expect(result.current.productosFiltrados).toHaveLength(2); // PS5 y teclado
  });

  test('Debería filtrar por rating', () => {
    const { result } = renderHook(() => useFiltros());
    
    act(() => {
      result.current.setRating(4.3);
    });
    
    expect(result.current.filtros.rating).toBe(4.3);
    expect(result.current.productosFiltrados).toHaveLength(1); // Solo PS5
  });

  test('Debería cambiar el orden correctamente', () => {
    const { result } = renderHook(() => useFiltros());
    
    act(() => {
      result.current.setOrden("precio-asc");
    });
    
    expect(result.current.filtros.orden).toBe("precio-asc");
  });

  test('Debería limpiar todos los filtros', () => {
    const { result } = renderHook(() => useFiltros());
    
    // Aplicar algunos filtros
    act(() => {
      result.current.setTexto("test");
      result.current.setCategoria("CO");
      result.current.setDisponible(true);
    });
    
    // Limpiar filtros
    act(() => {
      result.current.limpiarFiltros();
    });
    
    expect(result.current.filtros).toEqual({
      categoria: "todos",
      subcategorias: [],
      texto: "",
      precioMin: "",
      precioMax: "",
      disponible: false,
      rating: 0,
      orden: "relevancia"
    });
  });

    test('Debería actualizar filtros con evento de input', () => {
      const { result } = renderHook(() => useFiltros());
      
      const mockEvent = {
        target: {
          id: 'texto',
          value: 'test search',
          type: 'text'
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      act(() => {
        result.current.actualizar(mockEvent);
      });
      
      expect(result.current.filtros.texto).toBe('test search');
    });

  test('Debería filtrar productos por categoría', () => {
    const { result } = renderHook(() => useFiltros());
    
    act(() => {
      result.current.setCategoria("CO");
    });
    
    expect(result.current.productosFiltrados).toHaveLength(2); // PS5 y Xbox
    expect(result.current.productosFiltrados.every(p => p.categoria.id === "CO")).toBe(true);
  });

  test('Debería filtrar productos por subcategoría', () => {
    const { result } = renderHook(() => useFiltros());
    
    act(() => {
      result.current.toggleSubcategoria("MA");
    });
    
    expect(result.current.productosFiltrados).toHaveLength(2); // PS5 y Xbox
    expect(result.current.productosFiltrados.every(p => p.subcategoria?.id === "MA")).toBe(true);
  });

  test('Debería combinar múltiples filtros correctamente', () => {
    const { result } = renderHook(() => useFiltros());
    
    act(() => {
      result.current.setCategoria("CO");
      result.current.setDisponible(true);
      result.current.setPrecioMin("400000");
    });
    
    expect(result.current.productosFiltrados).toHaveLength(1); // Solo PS5
    expect(result.current.productosFiltrados[0].nombre).toBe("PlayStation 5");
  });

  test('Debería retornar todos los productos cuando no hay filtros', () => {
    const { result } = renderHook(() => useFiltros());
    
    expect(result.current.productosFiltrados).toHaveLength(3);
  });
});
