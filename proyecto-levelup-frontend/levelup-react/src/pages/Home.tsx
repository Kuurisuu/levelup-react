import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carrusel from "../components/Carrusel";
import ProductoCard from "../components/ProductoCard";
import { Producto, obtenerProductos } from "../data/catalogo";

export default function Home(): React.JSX.Element {
  const PAGE_HOME = 12;
  const [pageHome, setPageHome] = useState<number>(1);
  const [catalog, setCatalog] = useState<Producto[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const navigate = useNavigate();

  // cargar catalogo desde API con fallback a persisted/local
  useEffect(() => {
    const computeCatalog = async () => {
      try {
        const api = await obtenerProductos();
        if (Array.isArray(api) && api.length > 0) {
          setCatalog(api);
          return;
        }
      } catch (_) {}
      try {
        const raw = localStorage.getItem("lvup_products") || "[]";
        const persisted: Producto[] = JSON.parse(raw);
        if (Array.isArray(persisted) && persisted.length > 0) {
          setCatalog(persisted);
        }
      } catch (e) {
        setCatalog([]);
      }
    };
    void computeCatalog();
    const handler = () => void computeCatalog();
    window.addEventListener("lvup:products", handler as EventListener);
    return () =>
      window.removeEventListener("lvup:products", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derive paginated products from catalog and pageHome
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(catalog.length / PAGE_HOME) || 1);
    if (pageHome > maxPage) setPageHome(maxPage);
    const end = Math.min(pageHome * PAGE_HOME, catalog.length);
    setProductos(catalog.slice(0, end));
  }, [pageHome, catalog]);

  const handleRedirect = (id: string): void => {
    void navigate(`/producto/${id}`);
  };

  return (
    <section className="main-home">
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
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "1rem 0",
          gap: "1rem",
        }}
      >
        {productos.length < catalog.length && (
          <button
            id="btn-mostrar-mas-home"
            className="boton-menu boton-mostrar-mas"
            onClick={() => setPageHome((prev) => prev + 1)}
          >
            Mostrar más
          </button>
        )}

        {pageHome > 1 && (
          <button
            id="btn-mostrar-menos-home"
            className="boton-menu boton-mostrar-menos"
            onClick={() => setPageHome((prev) => Math.max(1, prev - 1))}
          >
            Mostrar menos
          </button>
        )}
      </div>
    </section>
  );
}
