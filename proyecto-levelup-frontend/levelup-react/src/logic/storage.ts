// storage.ts
import { Producto } from "../data/catalogo";

export interface ProductoEnCarrito extends Producto {
  cantidad: number;
  precioCLP?: string;
  subtotalCLP?: string;
}

const STORAGE_KEY = "productos-en-carrito";

export function getCarritoLS(): ProductoEnCarrito[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function setCarritoLS(productos: ProductoEnCarrito[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
}
