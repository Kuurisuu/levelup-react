import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock de react-router-dom para testing
const MockRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Función personalizada de render que incluye providers necesarios
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: MockRouter, ...options });

// Mock de datos de prueba
export const mockProducto = {
  id: "test-1",
  nombre: "PlayStation 5",
  descripcion: "Consola de videojuegos de última generación",
  precio: 500000,
  imagenUrl: "/img/ps5.jpg",
  disponible: true,
  categoria: {
    id: "consolas",
    nombre: "Consolas"
  },
  subcategoria: {
    id: "playstation",
    nombre: "PlayStation"
  },
  fabricante: "Sony",
  rating: [
    { usuario: "user1", calificacion: 5 },
    { usuario: "user2", calificacion: 4 }
  ]
};

export const mockProductoEnCarrito = {
  id: "test-1",
  nombre: "PlayStation 5",
  titulo: "PlayStation 5",
  precio: 500000,
  precioCLP: "$500,000",
  cantidad: 2,
  subtotalCLP: "$1,000,000",
  imagenUrl: "/img/ps5.jpg",
  imagen: "/img/ps5.jpg"
};

// Re-exportar todo desde testing-library
export * from '@testing-library/react';
export { customRender as render };
