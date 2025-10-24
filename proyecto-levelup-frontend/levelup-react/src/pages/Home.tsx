import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carrusel from "../components/Carrusel";
import ProductoCard from "../components/ProductoCard";
import { productosArray, Producto } from "../data/catalogo";

export default function Home(): React.JSX.Element {
  const PAGE_HOME = 12;
  const [pageHome, setPageHome] = useState<number>(1);
  const [productos, setProductos] = useState<Producto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const end = Math.min(pageHome * PAGE_HOME, productosArray.length);
    setProductos(productosArray.slice(0, end));
  }, [pageHome]);

  const handleRedirect = (id: string): void => {
    navigate(`/producto/${id}`);
  };

  return (
    <main className="main-home">
      {/* Carrusel */}
      <Carrusel />

      {/* Destacados */}
      <section className="seccion-destacados">
        <h2>Productos destacados</h2>
        <div id="destacados" className="productos">
          {productos.map((p) => (
            <ProductoCard key={p.id} producto={p} onClick={handleRedirect} />
          ))}
        </div>
      </section>

      {/* Botones mostrar más/menos */}
      <div
        className=""
        style={{ display: "flex", justifyContent: "center", margin: "1rem 0", gap: "1rem" }}
      >
        {productos.length < productosArray.length && (
          <button
            id="btn-mostrar-mas-home"
            className="boton-menu boton-mostrar-mas"
            onClick={() => setPageHome((prev) => prev + 1)}
          >
            Mostrar más
          </button>
        )}
        
        {pageHome > 1 && ( //si la pagina es mayor a 1, se muestra el boton de mostrar menos
          <button
            id="btn-mostrar-menos-home"
            className="boton-menu boton-mostrar-menos"
            onClick={() => setPageHome((prev) => Math.max(1, prev - 1))}
          >
            Mostrar menos
          </button>
        )}
      </div>
    </main>
  );
}
