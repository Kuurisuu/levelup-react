import React from "react";
import { ProductoEnCarrito } from "../../logic/storage";

interface CarritoProductoProps {
  producto: ProductoEnCarrito;
  descripcion?: string;
  onEliminar: (id: string) => void;
  onAumentar: (id: string) => void;
  onDisminuir: (id: string) => void;
}

const CarritoProducto: React.FC<CarritoProductoProps> = ({
  producto,
  descripcion,
  onEliminar,
  onAumentar,
  onDisminuir,
}): React.JSX.Element => (
  <div className="carrito-producto">
    <img
      className="carrito-producto-imagen"
      src={producto.imagenUrl} //antes era imagen
      alt={producto.nombre} //antes era titulo 
    />
    <div className="carrito-producto-titulo">
      <small>Titulo</small>
      <h3>{producto.nombre}</h3> //antes era titulo 
    </div>
    <div className="carrito-producto-descripcion">
      <small>Descripción</small>
      <p>{descripcion || ""}</p>
    </div>
    <div className="carrito-producto-cantidad">
      <small>Cantidad</small>
      <div className="carrito-cantidad">
        <button
          className="carrito-cantidad-disminuir"
          aria-label="Disminuir"
          onClick={() => onDisminuir(producto.id)}
        >
          -
        </button>
        <span className="carrito-cantidad-contador">{producto.cantidad}</span>
        <button
          className="carrito-cantidad-aumentar"
          aria-label="Aumentar"
          onClick={() => onAumentar(producto.id)}
        >
          +
        </button>
      </div>
    </div>
    <div className="carrito-producto-precio">
      <small>Precio</small>
      <p>{producto.precioCLP}</p>
    </div>
    <div className="carrito-producto-subtotal">
      <small>Subtotal</small>
      <p>{producto.subtotalCLP}</p>
    </div>
    <button
      className="carrito-producto-eliminar"
      onClick={() => onEliminar(producto.id)}
    >
      <i className="bi bi-trash-fill"></i>
    </button>
  </div>
);

export default CarritoProducto;
