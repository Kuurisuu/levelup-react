import { useState } from "react";
import { categorias, subcategorias, Producto } from "../data/catalogo";
import { agregarAlCarrito } from "../logic/carrito";

interface ProductoCardProps {
  producto: Producto;
  onClick?: (id: string) => void;
}

export default function ProductoCard({ producto, onClick }: ProductoCardProps): React.JSX.Element {
  const [agotado] = useState(!producto.disponible);

  const categoria = producto.categoria;
  const subcategoria = producto.subcategoria;

  const rating = Math.max(0, Math.min(5, producto.ratingPromedio || 0));
  const stars = Array.from({ length: 5 }, (_, i) => (
    <i key={i} className={`bi ${i < rating ? "bi-star-fill" : "bi-star"}`} />
  ));

  return (
    <div
      className="contenedor-productos"
      onClick={(e) => {
        const target = e.target as Element;
        if (!target.closest(".producto-agregar")) {
          onClick?.(producto.id);
        }
      }}
    >
      <div className="producto producto-card" data-id={producto.id}>
        <div className="producto-imagen-container">
          {producto.destacado && (
            <div className="producto-destacado-badge">
              <i className="bi bi-star-fill"></i> Destacado
            </div>
          )}
          <img
            className="producto-imagen"
            src={
              producto.imagenUrl && producto.imagenUrl.startsWith("./")
                ? import.meta.env.BASE_URL +
                  producto.imagenUrl.replace(/^\.\//, "")
                : producto.imagenUrl
            }
            alt={producto.nombre}
          />
        </div>
        <div className="producto-detalles">
          <span
            className={`producto-disponible ${
              producto.disponible ? "active" : ""
            }`}
          >
            {producto.disponible ? "Disponible" : "No Disponible"}
          </span>
          <h3 className="producto-titulo">{producto.nombre}</h3>
          <div
            className="producto-rating"
            style={{ color: "#f1c40f", fontSize: "0.9rem" }}
          >
            {stars}
          </div>
          <p className="producto-categoria">
            {categoria.nombre} • {subcategoria?.nombre || ""}
          </p>
          <p className="producto-precio">
            {producto.precioConDescuento ? (
              <>
                <span className="precio-descuento">
                  ${producto.precioConDescuento.toLocaleString("es-CL")} CLP
                </span>
                <span className="precio-original">
                  ${producto.precio.toLocaleString("es-CL")} CLP
                </span>
              </>
            ) : (
              `$${producto.precio.toLocaleString("es-CL")} CLP`
            )}
          </p>
          <button
            className={`producto-agregar ${
              producto.disponible ? "active" : ""
            }`}
            disabled={agotado}
            onClick={(e) => {
              e.stopPropagation();
              agregarAlCarrito({ ...producto });
            }}
          >
            {producto.disponible ? "AGREGAR" : "Agotado"}
          </button>
        </div>
      </div>
    </div>
  );
}
