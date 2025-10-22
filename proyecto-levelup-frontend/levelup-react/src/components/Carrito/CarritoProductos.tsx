import React from "react";
import CarritoProducto from "./CarritoProducto";
import { ProductoEnCarrito } from "../../logic/storage";

interface CarritoProductosProps {
  productos: ProductoEnCarrito[];
  descripciones: string[];
  onEliminar: (id: string) => void;
  onAumentar: (id: string) => void;
  onDisminuir: (id: string) => void;
}

const CarritoProductos: React.FC<CarritoProductosProps> = ({
  productos,
  descripciones,
  onEliminar,
  onAumentar,
  onDisminuir,
}): React.JSX.Element => (
  <div id="carrito-productos" className="carrito-productos">
    {productos.map((producto, idx) => (
      <CarritoProducto
        key={producto.id}
        producto={producto}
        descripcion={descripciones[idx]}
        onEliminar={onEliminar}
        onAumentar={onAumentar}
        onDisminuir={onDisminuir}
      />
    ))}
  </div>
);

export default CarritoProductos;
