import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFiltros } from "../logic/useFiltros";
import Filtros from "../components/Filtros";
import ListaProductos from "../components/ProductoList";
import Pagination from "../components/Pagination";
import type { Producto, Review } from "../data/catalogo";
import { calcularRatingPromedio } from "../utils/ratingUtils"; //nuevo import

// Funciones auxiliares para manejar los nuevos campos
const calcularPrecioConDescuento = (
  precio: number,
  descuento?: number
): number | null => {
  return descuento ? precio * (1 - descuento / 100.0) : null;
};

// La función calcularRatingPromedio ahora se importa desde utils/ratingUtils

export default function Producto(): React.JSX.Element {
  const location = useLocation();
  const {
    filtros,
    setCategoria,
    toggleSubcategoria,
    actualizar,
    limpiarFiltros,
    productosFiltrados,
    setFiltros,
    pagina,
    totalPaginas,
    totalElementos,
    cargando,
    siguientePagina,
    anteriorPagina,
    irAPagina,
  } = useFiltros();
  
  // Sincronizar filtro de texto con query param 'q'
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    // Solo actualizar si el query param es diferente al estado actual
    if (q !== filtros.texto) {
      setFiltros((prev) => ({ ...prev, texto: q }));
    }
    // Si no hay query param y el filtro tiene texto, limpiar solo si viene de navegación (sin q=)
    if (!q && filtros.texto && filtros.texto.trim() !== "") {
      // Limpiar solo si realmente no hay query param
      setFiltros((prev) => ({ ...prev, texto: "" }));
    }
  }, [location.search, filtros.texto]);

  const [asideAbierto, setAsideAbierto] = useState<boolean>(false);
  const toggleAside = (): void => setAsideAbierto(!asideAbierto);

  // Diccionario para mostrar nombres legibles
  const categorias: Record<string, string> = {
    todos: "Todos los productos",
    EN: "Entretenimiento",
    CO: "Consolas",
    PE: "Periféricos",
    RO: "Ropa",
  };
  const subcategorias: Record<string, string> = {
    JM: "Juegos de Mesa",
    MA: "Mandos",
    HA: "Hardware",
    AC: "Accesorios",
    MO: "Mouse",
    TE: "Teclado",
    AU: "Auriculares",
    MT: "Monitores",
    MI: "Microfonos",
    CW: "Camara web",
    PG: "Polerones Gamers Personalizados",
    PR: "Poleras Personalizadas",
  };

  // Usar productos filtrados del backend (ya paginados)
  const productosAMostrar = productosFiltrados;
  
  // Usar paginación del backend
  const page = pagina + 1; // Convertir de índice 0-based a 1-based para el componente
  const totalPages = totalPaginas;

  let titulo = "Todos los productos";
  const tieneBusqueda = filtros.texto && filtros.texto.trim() !== "";

  if (tieneBusqueda) {
    if (productosFiltrados.length === 0) {
      titulo = `No se encontraron resultados para "${filtros.texto}"`;
    } else {
      titulo = `Resultados para "${filtros.texto}"`;
    }
  } else if (filtros.subcategorias.length > 1) {
    titulo = "Filtrado por subcategorias";
  } else if (filtros.subcategorias.length === 1) {
    titulo = subcategorias[filtros.subcategorias[0]] || "Todos los productos";
  } else if (filtros.categoria && filtros.categoria !== "todos") {
    titulo = categorias[filtros.categoria] || "Todos los productos";
  } else if (filtros.categoria === "todos") {
    titulo = "Todos los productos";
  }

  return (
    <section className="main-product">
      <Filtros
        filtros={filtros}
        setCategoria={setCategoria}
        toggleSubcategoria={toggleSubcategoria}
        actualizar={actualizar}
        limpiar={limpiarFiltros}
        asideAbierto={asideAbierto}
        toggleAside={toggleAside}
      />

      <div
        id="overlay-filtros"
        onClick={asideAbierto ? toggleAside : undefined}
      ></div>

      <section className="seccion-productos">
        <div className="controles-productos">
          <button
            id="abrir-filtros"
            className="boton-menu boton-filtro-mobile"
            onClick={toggleAside}
          >
            <i className="bi bi-funnel"></i> Filtros
          </button>
        </div>

        {cargando ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando productos...</p>
          </div>
        ) : (
          <>
            <ListaProductos productos={productosAMostrar} titulo={titulo} />
            {totalPages > 1 && (
              <Pagination
                current={page}
                total={totalPages}
                onChange={(p) => irAPagina(p - 1)} // Convertir de 1-based a 0-based
              />
            )}
          </>
        )}
      </section>
    </section>
  );
}
