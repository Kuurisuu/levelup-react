//ESTE ARCHIVO ES PARA HACER PRUEBAS DEL COMPONENTE PRODUCTO LIST
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import ProductoList from "../ProductoList";
import { Producto } from "../../data/catalogo";

//COMPONENTES DE TESTING

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => { //importamos el original de react-router-dom osea la funcion useNavigate
  const actual = await importOriginal(); //y lo guardamos en la constante actual
  return { //retornamos el actual y le agregamos el mockNavigate
    ...actual as Record<string, unknown>, //le agregamos el Record<string, unknown> para que typescript sepa que es un objeto y no un array
    useNavigate: () => mockNavigate, //useNavigate es la funcion que usamos para navegar entre las paginas
  };
});

//bueno seteamos los mock productos para que se muestren en la lista
describe("ProductoList", () => { 
  const mockProductos: Producto[] = [
    {
      id: "prod-1",
      nombre: "Producto Test 1",
      descripcion: "Descripción del producto 1",
      precio: 10000,
      imagenUrl: "/img/test1.jpg",
      disponible: true,
      destacado: false,
      stock: 5,
      imagenesUrls: ["/img/test1.jpg"],
      fabricante: "Test Manufacturer",
      distribuidor: "Test Distributor",
      descuento: 0,
      reviews: [],
      productosRelacionados: [],
      categoria: {
        id: "test-cat",
        nombre: "Categoría Test"
      },
      subcategoria: {
        id: "test-sub",
        nombre: "Subcategoría Test",
        categoria: {
          id: "test-cat",
          nombre: "Categoría Test"
        }
      },
      rating: 4.5,
      ratingPromedio: 4.5
    },
    {
      id: "prod-2",
      nombre: "Producto Test 2",
      descripcion: "Descripción del producto 2",
      precio: 20000,
      imagenUrl: "/img/test2.jpg",
      disponible: true,
      destacado: true,
      stock: 3,
      imagenesUrls: ["/img/test2.jpg"],
      fabricante: "Test Manufacturer 2",
      distribuidor: "Test Distributor 2",
      descuento: 10,
      reviews: [],
      productosRelacionados: [],
      categoria: {
        id: "test-cat-2",
        nombre: "Categoría Test 2"
      },
      subcategoria: {
        id: "test-sub-2",
        nombre: "Subcategoría Test 2",
        categoria: {
          id: "test-cat-2",
          nombre: "Categoría Test 2"
        }
      },
      rating: 4.0,
      ratingPromedio: 4.0
    }
  ];

  beforeEach(() => { //despues de cada test, limpiamos el mockNavigate
    mockNavigate.mockClear();
  });

  test("Debería renderizar la lista de productos con título por defecto", () => {
    render(<Router><ProductoList productos={mockProductos} /></Router>);//desde el router que es el componente padre, le pasamos los mockProductos
    
    expect(screen.getByText("Todos los productos")).toBeInTheDocument();//vemos q exista el texto "Todos los productos"
    expect(screen.getByText("Producto Test 1")).toBeInTheDocument();
    expect(screen.getByText("Producto Test 2")).toBeInTheDocument();//y el producto 1 y 2 
  });

  test("Debería renderizar la lista de productos con título personalizado", () => {
    render(<Router><ProductoList productos={mockProductos} titulo="Productos Destacados" /></Router>);
    
    expect(screen.getByText("Productos Destacados")).toBeInTheDocument();
    expect(screen.getByText("Producto Test 1")).toBeInTheDocument();
    expect(screen.getByText("Producto Test 2")).toBeInTheDocument();
  });

  test("Debería mostrar mensaje cuando no hay productos", () => {
    render(<Router><ProductoList productos={[]} /></Router>);
    
    expect(screen.getByText("No se encontraron productos.")).toBeInTheDocument();//se explica solo mejor ni lo comento 
    expect(screen.queryByText("Producto Test 1")).not.toBeInTheDocument();
  });

  test("Debería navegar al detalle del producto cuando se hace clic en una tarjeta", () => {
    render(<Router><ProductoList productos={mockProductos} /></Router>);
    
    const productoCard = screen.getByText("Producto Test 1");
    fireEvent.click(productoCard);
    
    expect(mockNavigate).toHaveBeenCalledWith("/producto/prod-1");//verificamos que el mockNavigate se haya llamado con el argumento "/producto/prod-1"
  });

  test("Debería renderizar todos los productos proporcionados", () => {
    render(<Router><ProductoList productos={mockProductos} /></Router>);
    
    // vemos q ambos productos estan presentes
    expect(screen.getByText("Producto Test 1")).toBeInTheDocument();
    expect(screen.getByText("Producto Test 2")).toBeInTheDocument();
    
    // ver q se renderizan las tarjetas de producto
    const productoCards = screen.getAllByRole('article'); //vemos q segun el rol article, hay 2 tarjetas
    expect(productoCards).toHaveLength(2); //y vemos q hay 2 tarjetas
  });

  //recuerda el patron de testing es:AAA (Arrange, Act, Assert) OSea armar el escenario, actuar y verificar el resultado
  test("Debería mostrar la información correcta de cada producto", () => {
    render(<Router><ProductoList productos={mockProductos} /></Router>);
    
    // vemos la informacion del primer producto
    expect(screen.getByText("Producto Test 1")).toBeInTheDocument();
    expect(screen.getByText("$10.000 CLP")).toBeInTheDocument();
    
    // la info del segundo producto
    expect(screen.getByText("Producto Test 2")).toBeInTheDocument();
    expect(screen.getByText("$20.000 CLP")).toBeInTheDocument();
  });

  test("Debería manejar productos con descuento", () => {
    render(<Router><ProductoList productos={mockProductos} /></Router>);
    
    // El segundo producto tiene descuento del 10% pero no se muestra en ProductoList
    // ya que ProductoList solo renderiza ProductoCard, el descuento se maneja en ProductoCard
    expect(screen.getByText("Producto Test 2")).toBeInTheDocument();
  });

  test("Debería renderizar productos destacados", () => {
    render(<Router><ProductoList productos={mockProductos} /></Router>);
    
    // El segundo producto está marcado como destacado pero no se muestra en ProductoList
    // ya que ProductoList solo renderiza ProductoCard, el badge se maneja en ProductoCard
    expect(screen.getByText("Producto Test 2")).toBeInTheDocument();
  });

  test("Debería tener la estructura HTML correcta", () => {
    const { container } = render(<Router><ProductoList productos={mockProductos} /></Router>);//seteamos el container para que se pueda renderizar el componente
    
    const section = container.querySelector('.seccion-productos'); //vemos q exista la seccion productos
    expect(section).toBeInTheDocument(); //y vemos q exista
    
    const titulo = container.querySelector('.titulo-principal');
    expect(titulo).toBeInTheDocument();
    
    const productosContainer = container.querySelector('.productos');
    expect(productosContainer).toBeInTheDocument(); //todos estos deberian estar en orden y en el html correcto
  });

  test("Debería hacer match con el snapshot cuando tiene productos", () => {
    const { container } = render(<Router><ProductoList productos={mockProductos} /></Router>);
    expect(container).toMatchSnapshot(); //verificamos q el container coincida con el snapshot osea ya cargado deberia tener los productos y la estructura correcta
  });

  test("Debería hacer match con el snapshot cuando está vacío", () => {
    const { container } = render(<Router><ProductoList productos={[]} /></Router>);//deberia ser lo mismo con el array vacio al snapshot
    expect(container).toMatchSnapshot(); 
  });
});
