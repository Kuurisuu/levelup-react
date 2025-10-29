import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import CarritoProducto from "../CarritoProducto";
import { ProductoEnCarrito } from "../../../utils/orden.helper";

describe("CarritoProducto", () => {
  const mockProducto: ProductoEnCarrito = {
    id: "test-1",
    nombre: "PlayStation 5",
    titulo: "PlayStation 5",
    precio: 500000,
    precioCLP: "$500,000",
    cantidad: 2,
    subtotalCLP: "$1,000,000",
    imagenUrl: "/img/ps5.jpg",
    imagen: "/img/ps5.jpg",
    categoria: "CO",
    subcategoria: "MA"
  }; //seteamos el mock del producto

  const mockOnEliminar = vi.fn();//seteamos el mock de las funciones de eliminacion, aumento y disminucion
  const mockOnAumentar = vi.fn();
  const mockOnDisminuir = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Debería renderizar correctamente un producto en el carrito", () => {
    render(
      <CarritoProducto
        producto={mockProducto}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    expect(screen.getByText("PlayStation 5")).toBeInTheDocument();//vemos q exista el texto en todas 
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("$500,000")).toBeInTheDocument();
    expect(screen.getByText("$1,000,000")).toBeInTheDocument();
  });

  test("Debería mostrar la imagen del producto", () => {
    render(
      <CarritoProducto
        producto={mockProducto}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    const imagen = screen.getByAltText("PlayStation 5");//vemos q exista la imagen por el alt text
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute("src", "/img/ps5.jpg"); //vemos q exista la imagen por el src
  });

  test("Debería llamar onEliminar cuando se hace clic en el botón eliminar", () => {
    render(
      <CarritoProducto
        producto={mockProducto}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    const eliminarButton = screen.getByText("Eliminar"); //vemos q exista el boton de eliminar
    fireEvent.click(eliminarButton); //hacemos click en el boton de eliminar
    
    expect(mockOnEliminar).toHaveBeenCalledWith("test-1"); //vemos q se haya llamado la funcion de eliminacion
  });

  test("Debería llamar onAumentar cuando se hace clic en el botón +", () => {
    render(
      <CarritoProducto
        producto={mockProducto}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    const aumentarButton = screen.getByLabelText("Aumentar"); //vemos q exista el boton de aumentar
    fireEvent.click(aumentarButton); //hacemos click en el boton de aumentar
    
    expect(mockOnAumentar).toHaveBeenCalledWith("test-1"); //vemos q se haya llamado la funcion de aumento
  });

  test("Debería llamar onDisminuir cuando se hace clic en el botón -", () => {
    render(
      <CarritoProducto
        producto={mockProducto}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    const disminuirButton = screen.getByLabelText("Disminuir"); //vemos q exista el boton de disminuir
    fireEvent.click(disminuirButton);
    
    expect(mockOnDisminuir).toHaveBeenCalledWith("test-1");
  });

  test("Debería mostrar el subtotal cuando la cantidad es mayor a 1", () => {
    render(
      <CarritoProducto
        producto={mockProducto}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    expect(screen.getByText("Subtotal")).toBeInTheDocument(); //vemos q exista el texto de subtotal
    expect(screen.getByText("$1,000,000")).toBeInTheDocument(); //vemos q exista el texto del subtotal
  });

  test("Debería no mostrar el subtotal cuando la cantidad es 1", () => {
    const productoConCantidad1 = { ...mockProducto, cantidad: 1 }; //seteamos el mock del producto con cantidad 1
    
    render(
      <CarritoProducto
        producto={productoConCantidad1}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    expect(screen.queryByText("Subtotal")).not.toBeInTheDocument(); //vemos q no exista el texto de subtotal
  });

  test("Debería usar el nombre del producto como alt text de la imagen", () => {
    render(
      <CarritoProducto
        producto={mockProducto}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    const imagen = screen.getByAltText("PlayStation 5"); //vemos q exista la imagen por el alt text
    expect(imagen).toBeInTheDocument();
  });

  test("Debería usar titulo como fallback cuando no hay nombre", () => {
    const productoSinNombre = { ...mockProducto, nombre: "" }; //seteamos el mock del producto sin nombre
    
    render(
      <CarritoProducto
        producto={productoSinNombre}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    expect(screen.getByText("PlayStation 5")).toBeInTheDocument();
  });

  test("Debería usar 'Producto' como fallback cuando no hay nombre ni título", () => {
    const productoFallback = { //seteamos el mock del producto con nombre y titulo vacio
      ...mockProducto, 
      nombre: "", 
      titulo: "" 
    };
    
    render(
      <CarritoProducto
        producto={productoFallback}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    expect(screen.getByText("Producto")).toBeInTheDocument(); //vemos q exista el texto de producto
  });

  test("Debería mostrar el precio formateado correctamente", () => {
    render(
      <CarritoProducto
        producto={mockProducto}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    expect(screen.getByText("$500,000")).toBeInTheDocument(); //vemos q exista el texto del precio formateado
  });

  test("Debería hacer match con el snapshot", () => {
    const { container } = render( //renderizamos el componente
      <CarritoProducto
        producto={mockProducto}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    expect(container).toMatchSnapshot(); //vemos q el snapshot coincida
  });

  test("Debería mostrar todos los botones de control", () => {
    render(
      <CarritoProducto
        producto={mockProducto}
        onEliminar={mockOnEliminar}
        onAumentar={mockOnAumentar}
        onDisminuir={mockOnDisminuir}
      />
    );
    
    expect(screen.getByText("Eliminar")).toBeInTheDocument();//la misma de arriba
    expect(screen.getByLabelText("Aumentar")).toBeInTheDocument();
    expect(screen.getByLabelText("Disminuir")).toBeInTheDocument();
  });
});
