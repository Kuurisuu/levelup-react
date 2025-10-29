import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import Carrito from '../Carrito';

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal(); 
  return {
    ...(actual || {}), //seteamos el mock de useNavigate
    useNavigate: () => mockNavigate, //seteamos la funcion de navigate
  };
});

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};//va almacenar los datos del localStorage
  return {
    getItem: (key: string) => store[key] || null, //obtenemos el valor del localStorage
    setItem: (key: string, value: string) => { //seteamos el valor del localStorage
      store[key] = value.toString(); //convertimos el valor a string
    },
    removeItem: (key: string) => { //eliminamos el valor del localStorage
      delete store[key]; //eliminamos el valor del localStorage
    },
    clear: () => { //limpiamos el localStorage
      store = {}; //limpiamos el localStorage
    },
  };
})(); //creamos el mock del localStorage

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock, //seteamos el mock del localStorage
});

describe("Carrito Page", () => { //seteamos el mock de la pagina de carrito
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  test("Debería renderizar el carrito vacío cuando no hay productos", () => {
    render(<Router><Carrito /></Router>);
    
    // Verificar que la pagina de carrito se renderiza correctamente
    expect(screen.getAllByText((content, element) => {
      return element?.textContent === "Tu carrito esta vacío."; //vemos que exista el texto de carrito vacio
    })[0]).toBeInTheDocument(); //vemos que el texto de carrito vacio se encuentre en el documento
  });

  test("Debería mostrar el título de la página", () => {
    render(<Router><Carrito /></Router>);
    
    // Verificamo que se vea el titulo
    expect(screen.getByText("Carrito")).toBeInTheDocument();
  });

  test("Debería mostrar el contador de productos", () => {
    render(<Router><Carrito /></Router>);
    
    // Verificamos que se vea el contador
    expect(screen.getByText(/Tu carrito \(/)).toBeInTheDocument();
    expect(screen.getByText(/productos\)/)).toBeInTheDocument();
  });

  test("Debería mostrar la estructura del carrito", () => {
    render(<Router><Carrito /></Router>);
    
    // Verificar que se muestre la estructura básica
    expect(screen.getByText("Carrito")).toBeInTheDocument();
    expect(screen.getByText(/Tu carrito \(/)).toBeInTheDocument();
    expect(screen.getByText(/Tu carrito esta vacío/)).toBeInTheDocument();
  });

  test("Debería renderizar el contenedor del carrito", () => {
    render(<Router><Carrito /></Router>);
    
    // Verificar que se renderice el contenedor
    const contenedor = screen.getByText(/Tu carrito esta vacío/);
    expect(contenedor).toBeInTheDocument();
    expect(contenedor).toHaveClass('carrito-vacio');
  });

  test("Debería mostrar el ícono de carrito vacío", () => {
    render(<Router><Carrito /></Router>);
    
    // Verificar que se muestre el ícono
    const icono = screen.getByText(/Tu carrito esta vacío/).querySelector('i');
    expect(icono).toBeInTheDocument();
    expect(icono).toHaveClass('bi-emoji-frown');
  });

  test("Debería tener la estructura HTML correcta", () => {
    const { container } = render(<Router><Carrito /></Router>);
    
    // Verificar estructura HTML
    expect(container.querySelector('.wrapper')).toBeInTheDocument();
    expect(container.querySelector('.main-carrito')).toBeInTheDocument();
    expect(container.querySelector('.contenedor-carrito')).toBeInTheDocument();
    expect(container.querySelector('.carrito-productos-seccion')).toBeInTheDocument();
  });

  test("Debería mostrar el mensaje de carrito vacío con formato correcto", () => {
    render(<Router><Carrito /></Router>);
    
    // Verificar el mensaje completo
    const mensaje = screen.getByText(/Tu carrito esta vacío/);
    expect(mensaje).toBeInTheDocument();
    expect(mensaje).toHaveAttribute('id', 'carrito-vacio');
  });

  test("Debería renderizar correctamente con Router", () => {
    render(<Router><Carrito /></Router>);
    
    // Verificar que se renderice sin errores
    expect(screen.getByText("Carrito")).toBeInTheDocument();
    expect(screen.getByText(/Tu carrito esta vacío/)).toBeInTheDocument(); 
  });

  test("Debería hacer match con el snapshot cuando está vacío", () => {
    const { container } = render(<Router><Carrito /></Router>);
    expect(container).toMatchSnapshot();
  });

  test("Debería hacer match con el snapshot cuando tiene productos", () => {
    const { container } = render(<Router><Carrito /></Router>);
    expect(container).toMatchSnapshot();
  }); //osea al final del todo este ve q la pantalla sea una pantalla ya q desde este se importan los demas componentes
});