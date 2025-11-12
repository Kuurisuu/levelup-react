import { useState } from "react";
import { Producto } from "../data/catalogo";
import { agregarAlCarrito } from "../logic/carrito";
import {
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
  const rating = Math.max(0, Math.min(5, estadisticasRating.promedio));
  const usuariosUnicos = estadisticasRating.usuariosUnicos;

  const stars = Array.from({ length: 5 }, (_, i) => (
    <i key={i} className={`bi ${i < rating ? "bi-star-fill" : "bi-star"}`} />
  ));

  const precioBase = Math.max(0, Math.round(Number(producto.precio ?? 0)));
  const descuentoBackend = (() => {
    if (producto.descuento != null) {
      return Number(producto.descuento);
    }
    if (
      producto.precioConDescuento != null &&
      precioBase > 0 &&
      Number(producto.precioConDescuento) < precioBase
    ) {
      const diff = precioBase - Number(producto.precioConDescuento);
      return (diff / precioBase) * 100;
    }
    return 0;
  })();

  let precioCalculado = producto.precioConDescuento ??
    (descuentoBackend > 0
      ? precioBase * (1 - descuentoBackend / 100)
      : precioBase);

  // detectar si el usuario es de Duoc
  let duocMember = false;
  try {
    const raw = localStorage.getItem("lvup_user_session");
    if (raw) {
      const s = JSON.parse(raw) as { duocMember?: boolean };
      duocMember = !!s.duocMember;
    }
  } catch (e) {
    duocMember = false;
  }

  if (duocMember && precioBase > 0) {
    const extra = precioCalculado * 0.20;
    precioCalculado = precioCalculado - extra;
  }

  const precioAhora = Math.max(0, Math.round(precioCalculado));
  const precioAntes = precioBase;
  const tieneDescuento = precioAhora < precioAntes;
  const porcentajeDescuentoFinal = tieneDescuento && precioAntes > 0
    ? Math.max(0, Math.round(((precioAntes - precioAhora) / precioAntes) * 10000) / 100)
    : 0;

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
      <article className="producto producto-card" data-id={producto.id}>
        <div className="producto-imagen-container">
          {tieneDescuento && (
            <div className="producto-descuento-badge">
              {porcentajeDescuentoFinal}% OFF
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
          {(producto.codigo || (producto as any).codigoProducto) && (
            <div className="producto-codigo-badge">
              {producto.codigo}
            </div>
          )}

          {(() => {
            const raw = producto.imagenUrl || "";
            let resolved: string | null = null;
            
            if (raw && typeof raw === "string") {
              // Si es URL completa (S3 o HTTP), usarla directamente
              if (raw.startsWith("http://") || raw.startsWith("https://")) {
                resolved = raw;
              } 
              // Si es Base64 (data:image), usarlo directamente
              else if (raw.startsWith("data:image")) {
                resolved = raw;
              } 
              // Si es ruta local, construir URL completa (fallback para compatibilidad)
              else {
                const base =
                  ((import.meta as any).env?.VITE_IMAGE_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
                  "";
                if (raw.startsWith("./")) {
                  resolved = import.meta.env.BASE_URL + raw.replace(/^\.\//, "");
                } else if (raw.startsWith("/img") || raw.startsWith("img")) {
                  const clean = raw.replace(/^\./, "").replace(/^\/+/, "").replace(/^img\//, "");
                  resolved = base ? `${base}/${clean}` : `/img/${clean}`;
                } else {
                  resolved = base ? `${base}/${raw}` : `/${raw.replace(/^\/+/, '')}`;
                }
              }
            }
            
            return (
              resolved ? (
                <img className="producto-imagen" src={resolved} alt={producto.nombre} />
              ) : (
                <div className="producto-imagen-placeholder">
                  <span>Sin imagen</span>
                </div>
              )
            );
          })()}
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
              {categoria?.nombre || producto.categoriaNombre || "Consola"}
              {subcategoria?.nombre || producto.subcategoriaNombre ? (
                <>
                  {" • "}
                  {subcategoria?.nombre || producto.subcategoriaNombre}
                </>
              ) : null}
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
                  {formatPriceCLP(precioAhora)}
                </span>
                {tieneDescuento && (
                  <span className="precio-anterior">
                    {formatPriceCLP(precioAntes)}
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
      </article>
    </div>
  );
}
