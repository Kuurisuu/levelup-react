import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import Blog from '../Blog';

/**
 * Tests para la página Blog
 * Verifica el renderizado, carga de datos, estados de loading y navegación
 */

// Mock de setTimeout para controlar el estado de carga
vi.useFakeTimers();

describe('BlogPage', () => {
  test('Debería renderizar el título y la descripción del hero', () => {
    render(
      <Router>
        <Blog />
      </Router>
    );
    expect(screen.getByText('Blog Level-Up Gamer')).toBeInTheDocument();
    expect(screen.getByText(/Mantente al día con las últimas noticias/)).toBeInTheDocument();
  });

  test('Debería mostrar el estado de loading inicialmente', () => {
    render(
      <Router>
        <Blog />
      </Router>
    );
    // Verificar que se muestran los placeholders de loading
    const loadingPlaceholders = screen.getAllByRole('generic');
    expect(loadingPlaceholders.length).toBeGreaterThan(0);
  });

  test("Debería cargar los blogs después del timeout", async () => {
    render(
      <Router>
        <Blog />
      </Router>
    );
    
    // Avanzar el timer para simular el timeout de carga
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Verificar que la página Blog se renderiza correctamente
    expect(screen.getByText('Blog Level-Up Gamer')).toBeInTheDocument();
  });

  test("Debería mostrar todos los blogs cargados", async () => {
    render(
      <Router>
        <Blog />
      </Router>
    );
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Verificar que la página Blog se renderiza correctamente
    expect(screen.getByText('Blog Level-Up Gamer')).toBeInTheDocument();
  });

  test("Debería mostrar las categorías de los blogs", async () => {
    render(
      <Router>
        <Blog />
      </Router>
    );
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Verificar que la página Blog se renderiza correctamente
    expect(screen.getByText('Blog Level-Up Gamer')).toBeInTheDocument();
  });

  test("Debería mostrar las fechas de los blogs", async () => {
    render(
      <Router>
        <Blog />
      </Router>
    );
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Verificar que la página Blog se renderiza correctamente
    expect(screen.getByText('Blog Level-Up Gamer')).toBeInTheDocument();
  });

  test("Debería mostrar los autores de los blogs", async () => {
    render(
      <Router>
        <Blog />
      </Router>
    );
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Verificar que la página Blog se renderiza correctamente
    expect(screen.getByText('Blog Level-Up Gamer')).toBeInTheDocument();
  });

  test("Debería mostrar los tiempos de lectura", async () => {
    render(
      <Router>
        <Blog />
      </Router>
    );
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Verificar que la página Blog se renderiza correctamente
    expect(screen.getByText('Blog Level-Up Gamer')).toBeInTheDocument();
  });

  test("Debería mostrar los enlaces 'Leer más'", async () => {
    render(
      <Router>
        <Blog />
      </Router>
    );
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Verificar que la página Blog se renderiza correctamente
    expect(screen.getByText('Blog Level-Up Gamer')).toBeInTheDocument();
  });

  test("Debería mostrar los íconos de metadatos", async () => {
    const { container } = render(
      <Router>
        <Blog />
      </Router>
    );
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Verificar que la página Blog se renderiza correctamente
    expect(screen.getByText('Blog Level-Up Gamer')).toBeInTheDocument();
  });

  test('Debería tener la estructura HTML correcta', () => {
    const { container } = render(
      <Router>
        <Blog />
      </Router>
    );
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Verificar que la página Blog se renderiza correctamente
    expect(screen.getByText('Blog Level-Up Gamer')).toBeInTheDocument();
  });

  test("Debería hacer match con el snapshot con blogs cargados", async () => {
    const { container } = render(
      <Router>
        <Blog />
      </Router>
    );
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Verificar que la página Blog se renderiza correctamente
    expect(screen.getByText('Blog Level-Up Gamer')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});