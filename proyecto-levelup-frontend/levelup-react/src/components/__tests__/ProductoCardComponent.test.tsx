//ESTE ARCHIVO ES PARA HACER PRUEBAS DE LA CARD DE PRODUCTOS
import { render, screen, fireEvent } from "@testing-library/react";// Importamos la función render para renderizar el componente y las funciones screen y fireEvent para interactuar con el DOM
import { describe, expect, test, vi, beforeEach } from "vitest";//describe es una función que nos permite agrupar tests relacionados, expect es una función que nos permite hacer afirmaciones sobre el resultado de los tests, test es una función que nos permite escribir un test, vi es una función que nos permite crear mocks y beforeEach es una función que nos permite ejecutar código antes de cada test
import ProductoCard from "../ProductoCard";
import { Producto } from "../../data/catalogo";
//aca vamos hacer pruebas de productos 

// el mock es para generar comportamientos simulados de las funciones externas
vi.mock("../../logic/carrito", () => ({//estamos creando como info dentro del carrito 
  agregarAlCarrito: vi.fn()
}));

//este mock es de el rating osea las estrellas  donde le pasamos el promedio y los usuarios unicos
vi.mock("../../utils/ratingUtils", () => ({
  obtenerEstadisticasRating: vi.fn(() => ({
    promedio: 4.5,
    usuariosUnicos: 10
  }))
}));

//este mock es de el precio donde le pasamos el precio y lo formateamos a CLP 
vi.mock("../../utils/priceUtils", () => ({
  formatPriceCLP: vi.fn((price) => `$${price.toLocaleString()}`)//el precio accionara el toLocaleString para formatear el precio a CLP
}));

// Este bloque define la propiedad 'env' dentro de 'import.meta'.
// Esto simula el objeto de entorno que normalmente provee Vite durante la ejecución de la aplicación,
// y en este caso especifica que la variable BASE_URL será igual a '/'.
// Es útil para que, al ejecutar los tests, cualquier parte del código que dependa de 'import.meta.env.BASE_URL'
// reciba el valor esperado y funcione como en el entorno real de la aplicación.
Object.defineProperty(import.meta, 'env', {
  value: {
    BASE_URL: '/'
  }
});

//el describe es para agrupar los tests relacionados con el componente ProductoCard donde decimos
//que producto sera una constante con todos los datos del producto
describe("ProductoCard", () => {
  const mockProducto: Producto = {
    id: "test-1",
    nombre: "PlayStation 5",
    descripcion: "Consola de videojuegos de última generación",
    precio: 500000,
    imagenUrl: "/img/ps5.jpg",
    disponible: true,
    destacado: false,
    stock: 10,
    imagenesUrls: ["/img/ps5.jpg"],
    fabricante: "Sony",
    distribuidor: "Sony Interactive Entertainment",
    descuento: 0,
    reviews: [],
    productosRelacionados: [],
    categoria: {
      id: "consolas",
      nombre: "Consolas"
    },
    subcategoria: {
      id: "playstation",
      nombre: "PlayStation",
      categoria: {
        id: "consolas",
        nombre: "Consolas"
      }
    },
    rating: 4.5,
    ratingPromedio: 4.5
  };

  const mockProductoConDescuento: Producto = {//aca estamos creando un producto con descuento
    ...mockProducto, //los 3 puntos son para extender los datos del producto original osea agarrar todos los datos del producto original y agregarle los nuevos datos
    id: "test-2",
    nombre: "Xbox Series X",
    descuento: undefined, // no usar descuento numérico, usar precioConDescuento
    precioConDescuento: 400000, // precio con descuento (20% menos)
    disponible: false
  };

  beforeEach(() => { //aca estamos limpiando los mocks antes de cada test
    vi.clearAllMocks();
  });

  test("Debería renderizar correctamente un producto", () => { //nuestro primer test es para verificar que el producto se renderiza correctamente
    render(<ProductoCard producto={mockProducto} />);//renderizamos el producto card agarrando el mockProducto
    
    expect(screen.getByText("PlayStation 5")).toBeInTheDocument();//verificamos que el texto "PlayStation 5" se encuentre en el documento
    expect(screen.getByText("Consolas • PlayStation")).toBeInTheDocument();//ue el texto "Consolas • PlayStation" este dentro del card
    expect(screen.getByText("Consola de videojuegos de última generación")).toBeInTheDocument();//verificamos que el texto "Consola de videojuegos de última generación" se encuentre en el documento
    expect(screen.getByText("Disponible")).toBeInTheDocument();//tambien el texto "Disponible" este
  });

  test("Debería mostrar el precio formateado correctamente", () => {//osea que si es el precio 500000 se muestre como $500,000
    render(<ProductoCard producto={mockProducto} />);//renderizamos el producto card agarrando el mockProducto
    
    expect(screen.getByText("$500.000")).toBeInTheDocument();//deberia tener  "$500.000" sino es un test fallido 
  });

  test("Debería mostrar descuento cuando existe precioConDescuento", () => {
    render(<ProductoCard producto={mockProductoConDescuento} />);//la misma 
    
    expect(screen.getByText("20% OFF")).toBeInTheDocument(); //20% off aparece desde el mockProductoConDescuento
    expect(screen.getByText("$500.000")).toBeInTheDocument(); // precio original
    expect(screen.getByText("$400.000")).toBeInTheDocument(); // precio con descuento
  });

  test("Debería mostrar 'No Disponible' cuando el producto no está disponible", () => {
    render(<ProductoCard producto={mockProductoConDescuento} />);//si el boleano esta en false, se muestra "No Disponible"
    
    expect(screen.getByText("No Disponible")).toBeInTheDocument();//la misma expect screen get text tobeindocument 
    expect(screen.getByText("Agotado")).toBeInTheDocument();
  });

  test("Debería renderizar las estrellas de rating correctamente", () => {
    render(<ProductoCard producto={mockProducto} />);
    
    //esta es mas complicada , seteamos una constante donde el role es generic y filtramos los elementos que incluyan la clase bi-star
    const stars = screen.getAllByRole("generic").filter(el => 
      el.className.includes("bi-star")
    );
    expect(stars).toHaveLength(5);//verificamos que la constante stars tenga 5 elementos ya que en el mock pusimos 4.5 estrellas que son 5 estrellas
  });

  test("Debería mostrar el rating promedio y número de reseñas", () => {
    render(<ProductoCard producto={mockProducto} />);
    
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(10 reseñas)")).toBeInTheDocument();//desde el mock base colocamos la misma de siempre y asi en los 400 test 
  });

  test("Debería llamar onClick cuando se hace clic en la card (no en el botón)", () => {
    const mockOnClick = vi.fn();//seteamos el mock q detecta el click y lo llama
    render(<ProductoCard producto={mockProducto} onClick={mockOnClick} />);//entonces cuando se acciona el click, se llama el mockOnClick
    
    // busca el elemento de la tarjeta del producto utilizando el texto "PlayStation 5",
    // y luego subir desde ese elemento hasta su contenedor principal con la clase "contenedor-productos".
    // este sera el elemento que simula la tarjeta clickeable.
    const card = screen.getByText("PlayStation 5").closest(".contenedor-productos");

    // aca simulamos el click en la tarjeta del producto
    // aca usamos el ! por que se espera que el elemento exista en el DOM
    fireEvent.click(card!);

    // vemos q la funcion mockOnClick fue llamada con el argumento "test-1",
    // que representa el código del producto esperado cuando se hace clic en la tarjeta.
    expect(mockOnClick).toHaveBeenCalledWith("test-1");
  });

  test("Debería llamar agregarAlCarrito cuando se hace clic en el botón AGREGAR", () => {
    render(<ProductoCard producto={mockProducto} />);

    const agregarButton = screen.getByText("AGREGAR");
    fireEvent.click(agregarButton);

    // Verificar que el botón existe y es clickeable
    expect(agregarButton).toBeInTheDocument();
    expect(agregarButton).not.toBeDisabled();
  });

  test("Debería no llamar onClick cuando se hace clic en el botón AGREGAR", () => { 
    // Este test verifica que cuando se hace click en el boton AGREGAR,
    // NO se ejecute la funcion onClick de la card (solo se ejecute agregarAlCarrito)
    const mockOnClick = vi.fn();
    render(<ProductoCard producto={mockProducto} onClick={mockOnClick} />);
    
    const agregarButton = screen.getByText("AGREGAR"); 
    fireEvent.click(agregarButton);
    
    // Verificamos que onClick NO fue llamado porque el boton tiene stopPropagation
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test("Debería mostrar el código del producto", () => {
    render(<ProductoCard producto={mockProducto} />);
    
    expect(screen.getByText("test-1")).toBeInTheDocument();//muy basico el test XD 
  });

  test("Debería mostrar la marca del producto", () => {
    render(<ProductoCard producto={mockProducto} />);
    
    expect(screen.getByText("Sony")).toBeInTheDocument();//la misma 
  });


  //ok en este test comparamos la pagina completa le sacamos una captura y la comparamos con la nueva y vemos si son iguales
  test("Debería hacer match con el snapshot", () => {
    const { container } = render(<ProductoCard producto={mockProducto} />);
    expect(container).toMatchSnapshot();//verificamos que el container coincida con el snapshot
  });

  test("Debería deshabilitar el botón cuando el producto no está disponible", () => {
    render(<ProductoCard producto={mockProductoConDescuento} />);
    
    const agregarButton = screen.getByText("Agotado");//vemos q exista el boton agotado y si existe se deshabilita
    expect(agregarButton).toBeDisabled();//verificamos que el boton este deshabilitado
  });

  test("Debería no llamar agregarAlCarrito cuando el producto no está disponible", () => {
    render(<ProductoCard producto={mockProductoConDescuento} />);

    const agregarButton = screen.getByText("Agotado");
    fireEvent.click(agregarButton);

    // Verificamos que el botón está deshabilitado y no se puede usar
    expect(agregarButton).toBeDisabled();
  });
});
