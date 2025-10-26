import { useState } from "react";
import { categorias, subcategorias, Producto } from "../data/catalogo";
import { agregarAlCarrito } from "../logic/carrito";
import {
  calcularRatingPromedio,
  obtenerEstadisticasRating,
} from "../utils/ratingUtils"; //LO IMPORTAMOS PARA CALCULAR EL RATING
import { formatPriceCLP } from "../utils/priceUtils"; //LO IMPORTAMOS PARA FORMATEAR EL PRECIO EN CLP

interface ProductoCardProps {
  producto: Producto;
  onClick?: (id: string) => void;
}

export default function ProductoCard({
  producto,
  onClick,
}: ProductoCardProps): React.JSX.Element {
  const [agotado] = useState(!producto.disponible);

  const categoria = producto.categoria;
  const subcategoria = producto.subcategoria;

  // Calcular rating usando la nueva función
  const estadisticasRating = obtenerEstadisticasRating(producto);
  const rating = Math.max(0, Math.min(5, estadisticasRating.promedio)); //lo que hace es que el rating sea entre 0 y 5
  const usuariosUnicos = estadisticasRating.usuariosUnicos; //setea el numero de usuarios unicos

  const stars = Array.from(
    { length: 5 },
    (
      _,
      i //crea un array de 5 estrellas
    ) => (
      <i key={i} className={`bi ${i < rating ? "bi-star-fill" : "bi-star"}`} /> //si el rating es mayor a la estrella, se pone la estrella llena
    )
  );

  // Calcular descuento si existe, si existe, se calcula el descuento
  const tieneDescuento =
    producto.precioConDescuento &&
    producto.precioConDescuento < producto.precio; //si el precio con descuento es mayor al precio, se calcula el descuento
  const porcentajeDescuento = tieneDescuento
    ? Math.round(
        ((producto.precio - producto.precioConDescuento!) / producto.precio) *
          100
      ) //si el precio con descuento es mayor al precio, se calcula el descuento
    : 0; //si no existe, se setea a 0

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
          {/* Badge de descuento en la esquina superior izquierda */}
          {tieneDescuento && (
            <div className="producto-descuento-badge">
              {porcentajeDescuento}% OFF
            </div>
          )}

          {/* Badge de disponibilidad en la esquina superior derecha */}
          <div
            className={`producto-disponible-badge ${
              producto.disponible ? "disponible" : "no-disponible"
            }`}
          >
            {producto.disponible ? "Disponible" : "No Disponible"}
          </div>

          {/* Código del producto en la esquina inferior izquierda */}
          <div className="producto-codigo-badge">{producto.id}</div>

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
          {/* Información principal */}
          <div className="producto-info-principal">
            {/* Marca encima del título */}
            <div className="producto-marca">
              {producto.fabricante || "Sony"}
            </div>

            {/* Título del producto */}
            <h3 className="producto-titulo">{producto.nombre}</h3>

            {/* Categoría (se muestra debajo del título) */}
            <p className="producto-categoria">
              {categoria.nombre}{" "}
              {subcategoria ? `• ${subcategoria.nombre}` : ""}
            </p>

            {/* Descripción con scroll */}
            <div className="producto-descripcion-container">
              <p className="producto-descripcion">{producto.descripcion}</p>
            </div>
          </div>

          {/* Información secundaria */}
          <div className="producto-info-secundaria">
            {/* Rating con estrellas y promedio */}
            <div className="producto-rating-container">
              <div
                className="producto-rating"
                style={{ color: "#f1c40f", fontSize: "0.9rem" }}
              >
                {stars}
              </div>
              <span className="producto-rating-promedio">
                {rating.toFixed(1)}
              </span>
              {usuariosUnicos > 0 && (
                <span className="producto-reviews-count">
                  ({usuariosUnicos} reseña{usuariosUnicos !== 1 ? "s" : ""})
                </span>
              )}
            </div>

            {/* Precios en una línea */}
            <div className="producto-precio-container">
              <div className="precio-linea">
                <span className="precio-actual">
                  {tieneDescuento
                    ? formatPriceCLP(producto.precioConDescuento!)
                    : formatPriceCLP(producto.precio)}
                </span>
                {tieneDescuento && (
                  <span className="precio-anterior">
                    {formatPriceCLP(producto.precio)}
                  </span>
                )}
              </div>
            </div>

            {/* Botón de agregar con icono de carrito */}
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
              <i className="bi bi-cart-plus"></i>
              {producto.disponible ? "AGREGAR" : "Agotado"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
