import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFiltros } from "../logic/useFiltros";
import Filtros from "../components/Filtros";
import ListaProductos from "../components/ProductoList";
import type { Producto, Review } from "../data/catalogo";

// Funciones auxiliares para manejar los nuevos campos
const calcularPrecioConDescuento = (precio: number, descuento?: number): number | null => {
  return descuento ? precio * (1 - descuento / 100.0) : null;
};

const calcularRatingPromedio = (producto: Producto): number => {
  if (!producto.reviews || producto.reviews.length === 0) {
    return producto.rating;
  }
  const sumaRatings = producto.reviews.reduce((sum, review) => sum + review.rating, 0);
  return sumaRatings / producto.reviews.length;
};

const obtenerProductosDestacados = (productos: Producto[]): Producto[] => {
  return productos.filter(producto => producto.destacado === true);
};

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
  const [mostrarDestacados, setMostrarDestacados] = useState<boolean>(false);
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

  // Determinar qué productos mostrar
  const productosAMostrar = mostrarDestacados ? obtenerProductosDestacados(productosFiltrados) : productosFiltrados;
  
  let titulo = "Todos los productos";
  const tieneBusqueda = filtros.texto && filtros.texto.trim() !== "";
  
  if (mostrarDestacados) {
    titulo = "Productos Destacados";
  } else if (tieneBusqueda) {
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
        <div className="controles-productos">
          <button
            id="abrir-filtros"
            className="boton-menu boton-filtro-mobile"
            onClick={toggleAside}
          >
            <i className="bi bi-funnel"></i> Filtros
          </button>
          
          <button
            className={`boton-menu ${mostrarDestacados ? 'activo' : ''}`}
            onClick={() => setMostrarDestacados(!mostrarDestacados)}
          >
            <i className="bi bi-star"></i> {mostrarDestacados ? 'Todos' : 'Destacados'}
          </button>
        </div>

        <ListaProductos productos={productosAMostrar} titulo={titulo} />
      </section>
    </main>
  );
}
