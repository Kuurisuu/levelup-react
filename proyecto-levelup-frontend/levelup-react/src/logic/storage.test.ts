import { describe, expect, test, beforeEach } from "vitest";
import { getCarritoLS, setCarritoLS, ProductoEnCarrito } from "./storage";

describe("Storage - LocalStorage del Carrito", () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  test("Debe retornar un array vacio cuando no hay productos en localStorage", () => {
    //! 1 - Arrange & Act
    const carrito = getCarritoLS();

    //! 2 - Assert
    expect(carrito).toEqual([]);
    expect(carrito).toHaveLength(0);
  });

  test("Debe guardar productos en localStorage", () => {
    //! 1 - Arrange
    const productos: ProductoEnCarrito[] = [
      {
        id: "test-1",
        titulo: "Producto Test",
        precio: 10000,
        imagen: "test.png",
        categoriaId: "TEST",
        cantidad: 1,
      } as any,
    ];

    //! 2 - Act
    setCarritoLS(productos);
    const carritoGuardado = getCarritoLS();

    //! 3 - Assert
    expect(carritoGuardado).toEqual(productos);
    expect(carritoGuardado).toHaveLength(1);
    expect(carritoGuardado[0].id).toBe("test-1");
  });

  test("Debe guardar múltiples productos en localStorage", () => {
    //! 1 - Arrange
    const productos: ProductoEnCarrito[] = [
      {
        id: "test-1",
        titulo: "Producto 1",
        precio: 10000,
        imagen: "test1.png",
        categoriaId: "TEST",
        cantidad: 1,
      } as any,
      {
        id: "test-2",
        titulo: "Producto 2",
        precio: 20000,
        imagen: "test2.png",
        categoriaId: "TEST",
        cantidad: 2,
      } as any,
    ];

    //! 2 - Act
    setCarritoLS(productos);
    const carritoGuardado = getCarritoLS();

    //! 3 - Assert
    expect(carritoGuardado).toHaveLength(2);
    expect(carritoGuardado[0].cantidad).toBe(1);
    expect(carritoGuardado[1].cantidad).toBe(2);
  });

  test("Debe sobrescribir productos existentes en localStorage", () => {
    //! 1 - Arrange
    const productosIniciales: ProductoEnCarrito[] = [
      {
        id: "test-1",
        titulo: "Producto Inicial",
        precio: 10000,
        imagen: "test1.png",
        categoriaId: "TEST",
        cantidad: 1,
      } as any,
    ];

    const productosNuevos: ProductoEnCarrito[] = [
      {
        id: "test-2",
        titulo: "Producto Nuevo",
        precio: 15000,
        imagen: "test2.png",
        categoriaId: "TEST",
        cantidad: 3,
      } as any,
    ];

    //! 2 - Act
    setCarritoLS(productosIniciales);
    setCarritoLS(productosNuevos);
    const carritoFinal = getCarritoLS();

    //! 3 - Assert
    expect(carritoFinal).toHaveLength(1);
    expect(carritoFinal[0].id).toBe("test-2");
    expect(carritoFinal[0].titulo).toBe("Producto Nuevo");
  });

  test("Debe mantener la estructura correcta de ProductoEnCarrito", () => {
    //! 1 - Arrange
    const producto = {
      id: "ps5-001",
      titulo: "PlayStation 5",
      precio: 499990,
      imagen: "ps5.png",
      categoriaId: "CO",
      cantidad: 2,
      precioCLP: "$499.990 CLP",
      subtotalCLP: "$999.980 CLP",
    } as any;

    //! 2 - Act
    setCarritoLS([producto]);
    const carritoGuardado = getCarritoLS();

    //! 3 - Assert
    expect(carritoGuardado[0]).toHaveProperty("id");
    expect(carritoGuardado[0]).toHaveProperty("titulo");
    expect(carritoGuardado[0]).toHaveProperty("precio");
    expect(carritoGuardado[0]).toHaveProperty("imagen");
    expect(carritoGuardado[0]).toHaveProperty("categoriaId");
    expect(carritoGuardado[0]).toHaveProperty("cantidad");
    expect(carritoGuardado[0].precioCLP).toBe("$499.990 CLP");
  });
});
