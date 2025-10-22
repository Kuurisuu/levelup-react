import ProductoCard from "./ProductoCard";
import { useNavigate } from "react-router-dom";
import { Producto } from "../data/catalogo";

interface ProductoListProps {
  productos: Producto[];
  titulo?: string;
}

export default function ProductoList({ productos, titulo }: ProductoListProps): React.JSX.Element {
  const navigate = useNavigate();
  const handleRedirect = (id: string): void => {
    navigate(`/producto/${id}`);
  };
  return (
    <section className="seccion-productos">
      <h2 className="titulo-principal">{titulo || "Todos los productos"}</h2>
      <div className="productos">
        {productos.length > 0 ? (
          productos.map((p) => (
            <ProductoCard key={p.id} producto={p} onClick={handleRedirect} />
          ))
        ) : (
          <p className="sin-resultados">No se encontraron productos.</p>
        )}
      </div>
    </section>
  );
}
