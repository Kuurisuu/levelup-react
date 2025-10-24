import React from "react";
import ProductoCard from "../ProductoCard";
import { Producto } from "../../data/catalogo";
import { useNavigate } from "react-router-dom";

interface CarritoSugerenciasProps {
  productos: Producto[];
}

const CarritoSugerencias: React.FC<CarritoSugerenciasProps> = ({
  productos,
}): React.JSX.Element => {
  const navigate = useNavigate();

  const handleRedirect = (id: string) => {
    navigate(`/producto/${id}`);
  };
  return (
    <div className="carrito-sugerencias">
      <h3 className="sugerencias-titulo">Podrían interesarte</h3>
      <div className="sugerencias-productos">
        {productos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} onClick={handleRedirect} />
        ))}
      </div>
    </div>
  );
};

export default CarritoSugerencias;
