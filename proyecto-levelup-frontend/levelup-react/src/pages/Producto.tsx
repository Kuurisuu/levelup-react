import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFiltros } from "../logic/useFiltros";
import Filtros from "../components/Filtros";
import ListaProductos from "../components/ProductoList";

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
  } = useFiltros();
  // Sincronizar filtro de texto con query param 'q'
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    if (q && filtros.texto !== q) {
      setFiltros((prev) => ({ ...prev, texto: q }));
    }
    if (!q && filtros.texto) {
      setFiltros((prev) => ({ ...prev, texto: "" }));
    }
  }, [location.search]);

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
    <main className="main-product">
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
        <button
          id="abrir-filtros"
          className="boton-menu boton-filtro-mobile"
          onClick={toggleAside}
        >
          <i className="bi bi-funnel"></i> Filtros
        </button>

        <ListaProductos productos={productosFiltrados} titulo={titulo} />
      </section>
    </main>
  );
}
