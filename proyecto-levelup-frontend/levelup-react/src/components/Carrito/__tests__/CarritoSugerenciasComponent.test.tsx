import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi , beforeEach } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import CarritoSugerencias from '../CarritoSugerencias';
import { Producto, Categoria, Subcategoria } from '../../../data/catalogo';

/**
 * Tests para el componente CarritoSugerencias
 * Verifica el renderizado, props, interacciones y navegación
 */
const mockNavigate = vi.fn(); 

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CarritoSugerenciasComponent", () => { 
    //seteamos las categorias y subcategorias para los tests
  const categoriaConsolas: Categoria = {
    id: "CO",
    nombre: "Consola"
  };

  const categoriaPerifericos: Categoria = {
    id: "PE", 
    nombre: "Perifericos"
  };

  const subcategoriaMandos: Subcategoria = {
    id: "MA",
    nombre: "Mandos",
    categoria: categoriaConsolas
  };

  const subcategoriaTeclados: Subcategoria = {
    id: "TE",
    nombre: "Teclados", 
    categoria: categoriaPerifericos
  };

  const mockProductos: Producto[] = [ //seteamos los productos para los tests
    {
      id: '1',
      nombre: 'Producto 1',
      precio: 50000,
      imagenUrl: '/img/producto1.jpg',
      categoria: categoriaConsolas,
      subcategoria: subcategoriaMandos,
      descripcion: 'Descripción del producto 1',
      disponible: true,
      rating: 4.5,
      stock: 10,
      destacado: false,
      imagenesUrls: ['/img/producto1.jpg'],
      reviews: [],
      productosRelacionados: [],
      ratingPromedio: 4.5
    },
    {
      id: '2',
      nombre: 'Producto 2',
      precio: 75000,
      imagenUrl: '/img/producto2.jpg',
      categoria: categoriaPerifericos,
      subcategoria: subcategoriaTeclados,
      descripcion: 'Descripción del producto 2',
      disponible: true,
      rating: 4.0,
      stock: 5,
      destacado: false,
      imagenesUrls: ['/img/producto2.jpg'],
      reviews: [],
      productosRelacionados: [],
      ratingPromedio: 4.0
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();//limpiamos las llamadas mock para que no afecten a otros tests
    mockNavigate.mockClear();
  });

  test("Debería renderizar correctamente con productos", () => {
    render(
      <Router>
        <CarritoSugerencias productos={mockProductos} />
      </Router>
    );
    
    expect(screen.getByText('Podrían interesarte')).toBeInTheDocument(); //deberia tener el texto 'Podrían interesarte'
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
  });

  test("Debería renderizar correctamente con lista vacía", () => {
    render(
      <Router>
        <CarritoSugerencias productos={[]} /> 
      </Router> //renderizamos el carrito sugerencias con la lista vacia
    );
    
    expect(screen.getByText('Podrían interesarte')).toBeInTheDocument(); //deberia tener el texto 'Podrían interesarte'
    expect(screen.queryByText('Producto 1')).not.toBeInTheDocument();
  });

  test("Debería renderizar todos los productos proporcionados", () => {
    const muchosProductos = Array.from({ length: 5 }, (_, i) => ({ //seteamos los productos para los tests con 5 productos
      id: `${i + 1}`,
      nombre: `Producto ${i + 1}`,
      precio: 50000 + (i * 10000),
      imagenUrl: `/img/producto${i + 1}.jpg`,
      categoria: categoriaConsolas,
      subcategoria: subcategoriaMandos,
      descripcion: `Descripción del producto ${i + 1}`,
      disponible: true,
      rating: 4.0 + (i * 0.1),
      stock: 10 - i,
      destacado: false,
      imagenesUrls: [`/img/producto${i + 1}.jpg`],
      reviews: [],
      productosRelacionados: [],
      ratingPromedio: 4.0 + (i * 0.1)
    })); //le ponemos un indice para que no se repitan los nombres de los productos

    render(
      <Router>
        <CarritoSugerencias productos={muchosProductos} />
      </Router>
    );
    
    expect(screen.getByText('Podrían interesarte')).toBeInTheDocument();
    muchosProductos.forEach(producto => { //deberia tener el nombre de cada producto
      expect(screen.getByText(producto.nombre)).toBeInTheDocument(); //deberia tener el nombre de cada producto
    });
  });

  test("Debería llamar navigate con el ID correcto cuando se hace clic en un producto", () => {
    render(
      <Router>
        <CarritoSugerencias productos={mockProductos} />
      </Router>
    );
    
    const producto1 = screen.getByText('Producto 1'); //buscamos el producto 1
    fireEvent.click(producto1); //hacemos click en el producto 1
    
    expect(mockNavigate).toHaveBeenCalledWith('/producto/1'); //deberia haber sido llamado con el ID 1
  });

  test("Debería llamar navigate con diferentes IDs para diferentes productos", () => {
    render(
      <Router>
        <CarritoSugerencias productos={mockProductos} />
      </Router>
    );
    
    const producto2 = screen.getByText('Producto 2'); //buscamos el producto 2
    fireEvent.click(producto2);
    
    expect(mockNavigate).toHaveBeenCalledWith('/producto/2'); //deberia haber sido llamado con el ID 2
  });

  test("Debería tener la estructura HTML correcta", () => {
    const { container } = render(
      <Router>
        <CarritoSugerencias productos={mockProductos} />
      </Router>
    );
    
    expect(container.querySelector('.carrito-sugerencias')).toBeInTheDocument();
    expect(container.querySelector('.sugerencias-titulo')).toBeInTheDocument();
    expect(container.querySelector('.sugerencias-productos')).toBeInTheDocument();
  });

  test("Debería renderizar ProductoCard para cada producto", () => {
    const { container } = render(
      <Router>
        <CarritoSugerencias productos={mockProductos} />
      </Router>
    );
    
    // Verificar que se renderizan las ProductoCard
    const productoCards = container.querySelectorAll('.producto-card');
    expect(productoCards).toHaveLength(2); //deberia tener 2 producto cards
  });

  test("Debería pasar la función handleRedirect a ProductoCard", () => {
    render(
      <Router>
        <CarritoSugerencias productos={mockProductos} />
      </Router>
    );
    
    // Verificar que los productos son clickeables
    const producto1 = screen.getByText('Producto 1');
    expect(producto1).toBeInTheDocument();
    
    fireEvent.click(producto1); 
    expect(mockNavigate).toHaveBeenCalledTimes(1); 
  });

  test("Debería hacer match con el snapshot", () => {
    const { container } = render(
      <Router>
        <CarritoSugerencias productos={mockProductos} />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });

  test("Debería hacer match con el snapshot con lista vacía", () => {
    const { container } = render( //renderizamos el carrito sugerencias con la lista vacia
      <Router>
        <CarritoSugerencias productos={[]} /> 
      </Router>
    );
    expect(container).toMatchSnapshot();//y con la nueva snap deberia tener los valores diferentes
  });
});
