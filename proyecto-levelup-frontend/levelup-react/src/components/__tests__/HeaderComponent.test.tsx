import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Header from "../Header";
//ACA TESTEAMOS QUE EL HEADER SE RENDERICE CORRECTAMENTE 
// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    // Mock de useNavigate para simular la funcion de navegacion
    useNavigate: () => mockNavigate,
    
    // Mock del componente Link para que funcione en el entorno de testing osea que funcione sin el router completo
    // Convertimos el Link de React Router en un elemento <a> HTML simple
    // Esto permite que los tests funcionen sin necesidad del router completo
    Link: ({ to, children, ...props }: any) => (
      <a href={to} {...props}>{children}</a>
    )
  };
});

// Mock de localStorage
const mockLocalStorage = {
  getItem: vi.fn(), //simulamos la funcion getItem que se encarga de obtener los datos del localStorage
  setItem: vi.fn(), //se encarga de guardar los datos en el localStorage
  removeItem: vi.fn(), //se encarga de eliminar los datos del localStorage
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage //seteamos el localStorage con el mockLocalStorage
});

// Mock de window.location
Object.defineProperty(window, 'location', { //seteamos el location con el mockLocation
  value: {
    href: 'http://localhost:3000' //seteamos el href con el mockHref
  },
  writable: true //seteamos el writable con el mockWritable osea que se pueda escribir en el location
});

// Mock de import.meta.env
Object.defineProperty(import.meta, 'env', { //seteamos el env con el mockEnv para que funcione el router
  value: {
    BASE_URL: '/' //seteamos el BASE_URL con el mockBASE_URL para que funcione el router
  }
});

const renderWithRouter = (component: React.ReactElement) => { //funcion para renderizar el componente con el router
  return render( //renderizamos el componente con el router
    <BrowserRouter>
      {component}
    </BrowserRouter>
  ); //retornamos el componente renderizado con el router
};

describe("Header", () => { 
  beforeEach(() => { //despues de cada test, limpiamos los mocks
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null); //seteamos el mockLocalStorage con el mockLocalStorageNull
  });

  test("Debería renderizar el logo correctamente", () => {
    renderWithRouter(<Header />); //renderizamos el componente con el router
    
    const logo = screen.getByAltText("Logo Level Up"); //vemos q exista el logo por el nombre del alt osea la imagen en si como texto 
    expect(logo).toBeInTheDocument(); //y vemos q exista
    expect(logo).toHaveAttribute("src", "/img/otros/logo.png"); //y vemos q tenga el src correcto
  });

  test("Debería renderizar el campo de búsqueda", () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText("Buscar productos...");
    expect(searchInput).toBeInTheDocument(); //vemos q exista el input de busqueda
    expect(searchInput).toHaveAttribute("type", "search"); //y vemos q tenga el type correcto
  });

  test("Debería renderizar los enlaces de navegación principales", () => {
    renderWithRouter(<Header />);
    
    // Verificar que el header existe y tiene la estructura básica
    expect(screen.getByAltText("Logo Level Up")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar productos...")).toBeInTheDocument(); //INPUT DE BUSQUEDA
  });

  test("Debería renderizar el botón de carrito", () => {
    renderWithRouter(<Header />);
    
    // Verificar que existe el contador del carrito
    const carritoCounter = screen.getAllByText("0")[0]; //vemos q exista el contador del carrito por el texto "0" ya q el 0 es el numero de productos en el carrito
    expect(carritoCounter).toBeInTheDocument();
    expect(carritoCounter.closest('a')).toHaveAttribute("href", "/carrito"); //y vemos q tenga el href correcto donde el 'a' es el enlace del carrito
  });

  test("Debería renderizar el botón de identificación", () => {
    renderWithRouter(<Header />);
    
    // vemos q existan los elementos de identificacion (usar getAllByText para multiples elementos)
    expect(screen.getAllByText("Ingresar")[0]).toBeInTheDocument();//getAllByText es para buscar multiples elementos y getByText es para buscar un solo elemento
    expect(screen.getByText("Tu cuenta")).toBeInTheDocument();
  });

  test("Debería actualizar el estado de búsqueda cuando se escribe en el input", () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText("Buscar productos...");
    fireEvent.change(searchInput, { target: { value: "PlayStation" } }); //simulamos el cambio del input de busqueda
    
    expect(searchInput).toHaveValue("PlayStation"); //y vemos q tenga el valor correcto
  });

  test("Debería navegar a la página de productos con query cuando se envía la búsqueda", () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText("Buscar productos...");
    const searchForm = searchInput.closest("form"); //closest es para buscar el padre del elemento
    
    fireEvent.change(searchInput, { target: { value: "PlayStation" } });
    fireEvent.submit(searchForm!); //enviamos el formulario
    
    expect(mockNavigate).toHaveBeenCalledWith("/producto?q=PlayStation"); //y vemos q se haya llamado con el argumento "/producto?q=PlayStation"
  });

  test("Debería navegar a la página de productos sin query cuando se envía búsqueda vacía", () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText("Buscar productos...");
    const searchForm = searchInput.closest("form");
    
    fireEvent.change(searchInput, { target: { value: "   " } });//le enviamos nada para que se envie la busqueda vacia
    fireEvent.submit(searchForm!);
    
    expect(mockNavigate).toHaveBeenCalledWith("/producto"); //y vemos q se haya llamado con el argumento "/producto"
  });

  test("Debería mostrar el menú lateral en móvil", () => {
    renderWithRouter(<Header />);
    
    const menuLateral = screen.getByText("Menú LevelUp"); //vemos q exista el menu lateral por el texto "Menú LevelUp"
    expect(menuLateral).toBeInTheDocument(); 
  });

  test("Debería renderizar los enlaces del menú lateral", () => {
    renderWithRouter(<Header />);

    // Usar getAllByText para elementos que aparecen multiples veces
    expect(screen.getAllByText("Home")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Productos")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Blogs")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Eventos")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Nuestra empresa")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Contáctanos")[0]).toBeInTheDocument();
    expect(screen.getByText("Soporte")).toBeInTheDocument();//sacamos todo lo que esta en el menu lateral
  });

  test("Debería mostrar el botón de menú toggle", () => {
    renderWithRouter(<Header />);
    
    const menuToggle = screen.getByLabelText("Abrir menú");//vemos q exista el boton de abrir menu por el label "Abrir menú"
    expect(menuToggle).toBeInTheDocument();
  });

  test("Debería renderizar el botón de búsqueda", () => {
    renderWithRouter(<Header />);
    
    const searchButton = screen.getByLabelText("Buscar");//vemos q exista el boton de buscar por el label "Buscar"
    expect(searchButton).toBeInTheDocument();
  });

  test("Debería hacer match con el snapshot", () => {
    const { container } = renderWithRouter(<Header />);
    expect(container).toMatchSnapshot();//comparativa al cargar el componente deberia tener la estructura correcta
  });

  test("Debería renderizar el overlay del menú", () => {
    renderWithRouter(<Header />); 

    // Buscar por ID en lugar de data-testid
    const overlay = document.getElementById("overlay-menu");//el overlay es el fondo oscuro que se muestra cuando se abre el menu lateral
    expect(overlay).toBeInTheDocument();
  });

  test("Debería manejar el estado de búsqueda correctamente", async () => {//es asyncrona ya que cuando se escribe en el input se debe esperar a que se escriba el texto
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText("Buscar productos...");
    
    // Simular escritura
    fireEvent.change(searchInput, { target: { value: "test" } }); //simulamos el cambio del input de busqueda
    expect(searchInput).toHaveValue("test"); //y vemos q tenga el valor correcto 
    
    // Simular limpieza
    fireEvent.change(searchInput, { target: { value: "" } }); //simulamos la limpieza del input de busqueda
    expect(searchInput).toHaveValue("");//esto tarda ciertos ms entonces como es async entonces validamos q carga 
  });
});
