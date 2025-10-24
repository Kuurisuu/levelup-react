import React from "react";
import ProductoCard from "../ProductoCard";
import { Producto } from "../../data/catalogo";

interface CarritoSugerenciasProps {
  productos: Producto[];
}

const CarritoSugerencias: React.FC<CarritoSugerenciasProps> = ({
  productos,
}): React.JSX.Element => {
  return (
    <div className="carrito-sugerencias">
      <h3 className="sugerencias-titulo">Podrían interesarte</h3>
      <div className="sugerencias-productos">
        {productos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default CarritoSugerencias;
