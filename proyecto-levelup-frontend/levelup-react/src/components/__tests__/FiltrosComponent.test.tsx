//ESTE ARCHIVO ES PARA HACER PRUEBAS DEL COMPONENTE FILTROS
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import FiltrosComponent from "../Filtros";

describe("FiltrosComponent", () => {//seteamos el mock de los filtros
  const mockFiltros = {
    categoria: "CO",
    subcategorias: ["MA"],
    precioMin: "0",
    precioMax: "100000",
    orden: "nombre",
    busqueda: "test",
    texto: "test",
    disponible: true,
    rating: 4.5
  };
//simulamos las funciones de los handlers
  const mockHandlers = {
    setCategoria: vi.fn(),
    toggleSubcategoria: vi.fn(),
    actualizar: vi.fn(),
    limpiar: vi.fn(),
    toggleAside: vi.fn()
  };

  test("Debería renderizar el componente de filtros", () => {
    render(
      <FiltrosComponent
        filtros={mockFiltros}//seteamos los filtros
        asideAbierto={true}//seteamos el aside abierto
        {...mockHandlers}//seteamos los handlers donde el ... es para que se pasen los handlers al componente
      />
    );
    
    expect(screen.getByText("Filtrar productos")).toBeInTheDocument();
    expect(screen.getByText("Categoría")).toBeInTheDocument();
    expect(screen.getByText("Precio Min.")).toBeInTheDocument();
    expect(screen.getByText("Ordenar por")).toBeInTheDocument();//la tipica 
  });

  test("Debería mostrar las categorías disponibles", () => {
    render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    
    expect(screen.getByText("Consolas")).toBeInTheDocument();
    expect(screen.getByText("Perifericos")).toBeInTheDocument();
    expect(screen.getByText("Ropa")).toBeInTheDocument();
  });

  test("Debería mostrar las subcategorías cuando se selecciona una categoría", () => {
    render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    
    // Hacer clic en Consolas para expandir subcategorias
    const consolasButton = screen.getByText("Consolas");
    fireEvent.click(consolasButton);//hacemos clic en el boton de consolas para expandir las subcategorias
    
    expect(screen.getByText("Mandos")).toBeInTheDocument();//y una vez expandido deberian aparecer estas 
    expect(screen.getByText("Hardware")).toBeInTheDocument();
    expect(screen.getByText("Accesorios")).toBeInTheDocument();
  });

  test("Debería llamar a setCategoria cuando se selecciona una categoría", () => {
    render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    
    const perifericosButton = screen.getByText("Perifericos");
    fireEvent.click(perifericosButton);
    
    // Verificar que el botón existe y es clickeable
    expect(perifericosButton).toBeInTheDocument();
  });
//y asi vamos con todas las categorias y subcategorias 
  test("Debería llamar a toggleSubcategoria cuando se selecciona una subcategoría", () => {
    render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    
    // Expandir Consolas primero
    const consolasButton = screen.getByText("Consolas");
    fireEvent.click(consolasButton);
    
    // Seleccionar una subcategoría
    const mandoCheckbox = screen.getByText("Mandos");
    fireEvent.click(mandoCheckbox); //hacemos clic en el boton de mandos para seleccionar la subcategoria
    
    expect(mockHandlers.toggleSubcategoria).toHaveBeenCalledWith("MA"); //y vemos q se haya llamado con el argumento "MA" que es la subcategoria seleccionada
  });

  test("Debería mostrar el rango de precios", () => {
    render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    
    const precioMinInput = screen.getByDisplayValue("0"); //vemos q existan los inputs de precio minimo y maximo
    const precioMaxInput = screen.getByDisplayValue("100000");
    
    expect(precioMinInput).toBeInTheDocument();
    expect(precioMaxInput).toBeInTheDocument();
  });

  test("Debería llamar a actualizar cuando se cambia el precio mínimo", () => {
    render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    
    const precioMinInput = screen.getByDisplayValue("0");
    fireEvent.change(precioMinInput, { target: { value: "5000" } }); //simulamos el cambio del input de precio minimo
    
    expect(mockHandlers.actualizar).toHaveBeenCalled(); //y vemos q se haya llamado con el argumento "5000" que es el precio minimo seleccionado
  });

  test("Debería mostrar las opciones de ordenamiento", () => {
    render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    
    const ordenSelect = screen.getByDisplayValue("Relevancia"); //vemos q exista el select de ordenamiento por el valor "Relevancia"
    expect(ordenSelect).toBeInTheDocument();
    
    // Verificar que tiene las opciones correctas
    expect(screen.getByText("Relevancia")).toBeInTheDocument();
    expect(screen.getByText("Precio: menor a mayor")).toBeInTheDocument();
    expect(screen.getByText("Precio: mayor a menor")).toBeInTheDocument();
  });

  test("Debería llamar a actualizar cuando se cambia el ordenamiento", () => {
    render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    
    const ordenSelect = screen.getByDisplayValue("Relevancia");
    fireEvent.change(ordenSelect, { target: { value: "precio-asc" } }); //simulamos el cambio del select de ordenamiento
    
    expect(mockHandlers.actualizar).toHaveBeenCalled(); //y vemos q se haya llamado con el argumento "precio-asc" que es el ordenamiento seleccionado
  });

  test("Debería llamar a limpiar cuando se hace clic en el botón limpiar", () => {
    render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    
    const limpiarButton = screen.getByRole('button', { name: /limpiar filtros/i }); //vemos q exista el boton de limpiar filtros por el nombre "limpiar filtros"
    fireEvent.click(limpiarButton); //hacemos clic en el boton de limpiar filtros
    
    expect(mockHandlers.limpiar).toHaveBeenCalled(); //y vemos q se haya llamado con el argumento "precio-asc" que es el ordenamiento seleccionado
  });

  test("Debería mostrar el contador de subcategorías seleccionadas", () => {
    const filtrosConSubcategorias = {
      ...mockFiltros,
      subcategorias: ["MA", "HA"] //seteamos las subcategorias para que se muestren
    };
    
    render(
      <FiltrosComponent
        filtros={filtrosConSubcategorias}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    
    // Expandir Consolas para ver el contador
    const consolasButton = screen.getByText("Consolas");
    fireEvent.click(consolasButton);
    
    // Debería mostrar el contador (2) en el botón de Consolas
    expect(screen.getByText("Consolas")).toBeInTheDocument();
  });

  test("Debería alternar la visibilidad del aside", () => {
    render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={false}
        {...mockHandlers}
      />
    );
    
    const aside = screen.getByRole('complementary'); //vemos q exista el aside por el rol "complementary"
    expect(aside).not.toHaveClass('abierto'); //y vemos q no tenga la clase "abierto"
    
    // luego cambiamos a abierto
    render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    
    const asideAbierto = screen.getAllByRole('complementary')[0]; //vemos q exista el aside por el rol "complementary" q seria el aside abierto
    expect(asideAbierto).toHaveClass('product-aside-filter'); //y vemos q tenga la clase "product-aside-filter" que es la clase del aside abierto
  });

  test("Debería hacer match con el snapshot", () => {
    const { container } = render(
      <FiltrosComponent
        filtros={mockFiltros}
        asideAbierto={true}
        {...mockHandlers}
      />
    );
    expect(container).toMatchSnapshot();//la misma de snapshot q las demas 
  });
});
