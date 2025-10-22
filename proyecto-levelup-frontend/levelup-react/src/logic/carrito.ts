// carrito.ts
import { getCarritoLS, setCarritoLS, ProductoEnCarrito } from "./storage";
import { Producto } from "../data/catalogo";

//Espera a que un elemento exista en el DOM
function esperarElemento(selector: string): Promise<Element> {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

// Obtener carrito
export function getCarrito(): ProductoEnCarrito[] {
  return getCarritoLS();
}

// Agregar producto
export function agregarAlCarrito(producto: Producto): void {
  const carrito = getCarritoLS();
  const existe = carrito.find((p) => p.id === producto.id);

  if (existe) {
    existe.cantidad++;
  } else {
    const nuevoProducto: ProductoEnCarrito = { ...producto, cantidad: 1 };
    carrito.push(nuevoProducto);
  }

  setCarritoLS(carrito);
  actualizarNumerito();
}

// Eliminar producto por id
export function eliminarDelCarrito(id: string): void {
  let carrito = getCarritoLS();
  carrito = carrito.filter((p) => p.id !== id);
  setCarritoLS(carrito);
  actualizarNumerito();
}

// Vaciar carrito
export function vaciarCarrito(): void {
  setCarritoLS([]);
  actualizarNumerito();
}

// Calcular total
export function calcularTotal(): number {
  const carrito = getCarritoLS();
  return carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
}

// Actualizar numerito del carrito (desktop + mobile)
export async function actualizarNumerito(): Promise<void> {
  const carrito = getCarritoLS();
  const totalCant = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  await esperarElemento(".contador-carrito");

  document.querySelectorAll(".contador-carrito").forEach((contador) => {
    if (contador instanceof HTMLElement) {
      contador.innerText = totalCant.toString();
    }
  });
}

// Refrescar numerito al cargar la página
document.addEventListener("DOMContentLoaded", actualizarNumerito);
