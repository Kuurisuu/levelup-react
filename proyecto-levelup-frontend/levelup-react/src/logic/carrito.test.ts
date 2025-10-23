import { describe, expect, test, beforeEach, vi } from "vitest";
import {
  getCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  vaciarCarrito,
  calcularTotal,
} from "./carrito";
import type { Producto } from "../data/catalogo";

// Mock de actualizarNumerito para evitar errores de DOM
vi.mock("./carrito", async () => {
  const actual = (await vi.importActual("./carrito")) as any;
  return {
    ...actual,
    actualizarNumerito: vi.fn(),
  };
});

describe("Carrito - Obtener productos", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Debe retornar un array vacio cuando el carrito esta vacio", () => {
    //! 1 - Arrange & Act
    const carrito = getCarrito();

    //! 2 - Assert
    expect(carrito).toEqual([]);
    expect(carrito).toHaveLength(0);
  });
});

describe("Carrito - Agregar productos", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Debe agregar un producto nuevo al carrito", () => {
    //! 1 - Arrange
    const producto = {
      id: "test-001",
      titulo: "PlayStation 5",
      precio: 499990,
      imagen: "ps5.png",
      categoriaId: "CO",
    } as Producto;

    //! 2 - Act
    agregarAlCarrito(producto);
    const carrito = getCarrito();

    //! 3 - Assert
    expect(carrito).toHaveLength(1);
    expect(carrito[0].id).toBe("test-001");
    expect(carrito[0].cantidad).toBe(1);
  });

  test("Debe incrementar la cantidad si el producto ya existe", () => {
    //! 1 - Arrange
    const producto = {
      id: "test-002",
      titulo: "Xbox Series X",
      precio: 449990,
      imagen: "xbox.png",
      categoriaId: "CO",
    } as Producto;

    //! 2 - Act
    agregarAlCarrito(producto);
    agregarAlCarrito(producto);
    const carrito = getCarrito();

    //! 3 - Assert
    expect(carrito).toHaveLength(1);
    expect(carrito[0].cantidad).toBe(2);
  });

  test("Debe agregar múltiples productos diferentes", () => {
    //! 1 - Arrange
    const producto1 = {
      id: "test-003",
      titulo: "Nintendo Switch",
      precio: 299990,
      imagen: "switch.png",
      categoriaId: "CO",
    } as Producto;

    const producto2 = {
      id: "test-004",
      titulo: "Steam Deck",
      precio: 399990,
      imagen: "steam.png",
      categoriaId: "CO",
    } as Producto;

    //! 2 - Act
    agregarAlCarrito(producto1);
    agregarAlCarrito(producto2);
    const carrito = getCarrito();

    //! 3 - Assert
    expect(carrito).toHaveLength(2);
    expect(carrito[0].id).toBe("test-003");
    expect(carrito[1].id).toBe("test-004");
  });
});

describe("Carrito - Eliminar productos", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Debe eliminar un producto del carrito por su id", () => {
    //! 1 - Arrange
    const producto = {
      id: "test-005",
      titulo: "Control PS5",
      precio: 59990,
      imagen: "control-ps5.png",
      categoriaId: "PE",
    } as Producto;

    agregarAlCarrito(producto);

    //! 2 - Act
    eliminarDelCarrito("test-005");
    const carrito = getCarrito();

    //! 3 - Assert
    expect(carrito).toHaveLength(0);
  });

  test("No debe afectar otros productos al eliminar uno", () => {
    //! 1 - Arrange
    const producto1 = {
      id: "test-006",
      titulo: "Teclado Mecánico",
      precio: 79990,
      imagen: "teclado.png",
      categoriaId: "PE",
    } as Producto;

    const producto2 = {
      id: "test-007",
      titulo: "Mouse Gaming",
      precio: 49990,
      imagen: "mouse.png",
      categoriaId: "PE",
    } as Producto;

    agregarAlCarrito(producto1);
    agregarAlCarrito(producto2);

    //! 2 - Act
    eliminarDelCarrito("test-006");
    const carrito = getCarrito();

    //! 3 - Assert
    expect(carrito).toHaveLength(1);
    expect(carrito[0].id).toBe("test-007");
  });
});

describe("Carrito - Vaciar carrito", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Debe vaciar completamente el carrito", () => {
    //! 1 - Arrange
    const producto1 = {
      id: "test-008",
      titulo: "Audífonos",
      precio: 89990,
      imagen: "audifonos.png",
      categoriaId: "PE",
    } as Producto;

    const producto2 = {
      id: "test-009",
      titulo: "Webcam",
      precio: 69990,
      imagen: "webcam.png",
      categoriaId: "PE",
    } as Producto;

    agregarAlCarrito(producto1);
    agregarAlCarrito(producto2);

    //! 2 - Act
    vaciarCarrito();
    const carrito = getCarrito();

    //! 3 - Assert
    expect(carrito).toEqual([]);
    expect(carrito).toHaveLength(0);
  });
});

describe("Carrito - Calcular total", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Debe retornar 0 cuando el carrito esta vacio", () => {
    //! 1 - Arrange & Act
    const total = calcularTotal();

    //! 2 - Assert
    expect(total).toBe(0);
  });

  test("Debe calcular el total de un producto", () => {
    //! 1 - Arrange
    const producto = {
      id: "test-010",
      titulo: 'Monitor 27"',
      precio: 199990,
      imagen: "monitor.png",
      categoriaId: "PE",
    } as any;

    //! 2 - Act
    agregarAlCarrito(producto);
    const total = calcularTotal();

    //! 3 - Assert
    expect(total).toBe(199990);
  });

  test("Debe calcular el total considerando las cantidades", () => {
    //! 1 - Arrange
    const producto = {
      id: "test-011",
      titulo: "Cable HDMI",
      precio: 9990,
      imagen: "hdmi.png",
      categoriaId: "PE",
    } as any;

    //! 2 - Act
    agregarAlCarrito(producto);
    agregarAlCarrito(producto);
    agregarAlCarrito(producto);
    const total = calcularTotal();

    //! 3 - Assert
    expect(total).toBe(29970);
  });

  test("Debe calcular el total de múltiples productos", () => {
    //! 1 - Arrange
    const producto1 = {
      id: "test-012",
      titulo: "Producto A",
      precio: 10000,
      imagen: "a.png",
      categoriaId: "TEST",
    } as any;

    const producto2 = {
      id: "test-013",
      titulo: "Producto B",
      precio: 20000,
      imagen: "b.png",
      categoriaId: "TEST",
    } as any;

    //! 2 - Act
    agregarAlCarrito(producto1);
    agregarAlCarrito(producto1);
    agregarAlCarrito(producto2);
    const total = calcularTotal();

    //! 3 - Assert
    // (10000 * 2) + (20000 * 1) = 40000
    expect(total).toBe(40000);
  });
});
