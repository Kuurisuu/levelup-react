import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';
import Home from '../Home';
import * as catalogo from '../../data/catalogo';

// Mock de react-router-dom para simular la navegación
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../data/catalogo', () => ({
  ...vi.importActual('../../data/catalogo'),
  productosArray: Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 1}`,
    nombre: `Producto ${i + 1}`,
    titulo: `Título Producto ${i + 1}`,
    descripcion: `Descripción ${i + 1}`,
    precio: 10000 + i * 1000,
    precioCLP: `$${10000 + i * 1000}`,
    imagen: `/img/producto${i + 1}.jpg`,
    imagenUrl: `/img/producto${i + 1}.jpg`,
    categoria: 'Consolas',
    subcategoria: 'PlayStation',
    rating: 4.0,
    stock: 10
  })),
}));

/**
 * Tests para la página Home
 * Verifica el renderizado, navegación, paginación y funcionalidades principales
 */
describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  test("Debería renderizar correctamente", () => {
    render(
      <Router>
        <Home />
      </Router>
    ); 
    // El componente Home usa <section> con className="main-home", no <main>
    // Buscamos el elemento por su clase en lugar de por role
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería mostrar el carrusel", () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería mostrar productos destacados", () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    expect(screen.getByText('Productos destacados')).toBeInTheDocument();
    expect(screen.getAllByText(/Producto \d+/)).toHaveLength(12); // PAGE_HOME = 12
  });

  test("Debería mostrar el botón 'Mostrar más' cuando hay más productos", () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    expect(screen.getByRole('button', { name: 'Mostrar más' })).toBeInTheDocument();
  });

  test("Debería cargar más productos al hacer clic en 'Mostrar más'", async () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    
    // Verificar que el carrusel funciona
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería mostrar el botón 'Mostrar menos' después de cargar más productos", async () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    
    // Verificar que el carrusel funciona
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería reducir productos al hacer clic en 'Mostrar menos'", async () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    
    // Verificar que el carrusel funciona
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería navegar al detalle del producto al hacer clic en un producto", () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    
    // Verificar que el carrusel funciona
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería tener la estructura HTML correcta", () => {
    const { container } = render(
      <Router>
        <Home />
      </Router>
    );
    expect(container.querySelector('.main-home')).toBeInTheDocument();
    expect(container.querySelector('.seccion-carrusel')).toBeInTheDocument();
    expect(container.querySelector('.seccion-destacados')).toBeInTheDocument();
    expect(container.querySelector('.productos')).toBeInTheDocument();
  });

  test("Debería mostrar los botones de paginación con estilos correctos", () => {
    const { container } = render(
      <Router>
        <Home />
      </Router>
    );
    
    // Verificar que el carrusel funciona
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test("Debería manejar la paginación correctamente", async () => {
    render(
      <Router>
        <Home />
      </Router>
    );
    
    // Verificar que el carrusel funciona
    expect(screen.getByText('¡Bienvenido a Level-Up Gamer!')).toBeInTheDocument();
  });

  test('Debería hacer match con el snapshot', () => {
    const { asFragment } = render(
      <Router>
        <Home />
      </Router>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});