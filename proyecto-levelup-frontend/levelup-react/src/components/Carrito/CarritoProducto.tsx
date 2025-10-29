import React from "react";
import { ProductoEnCarrito } from "../../utils/orden.helper";

interface CarritoProductoProps {
  producto: ProductoEnCarrito;
  descripcion?: string;
  onEliminar: (id: string) => void;
  onAumentar: (id: string) => void;
  onDisminuir: (id: string) => void;
}

const CarritoProducto: React.FC<CarritoProductoProps> = ({
  producto,
  descripcion,
  onEliminar,
  onAumentar,
  onDisminuir,
}): React.JSX.Element => (
  <div className="carrito-producto nuevo-layout">
    <div className="carrito-producto-imagen-box">
      <img
        className="carrito-producto-imagen"
        src={
          producto.imagenUrl || producto.imagen || "/img/otros/placeholder.png"
        }
        alt={producto.nombre || producto.titulo || "Producto"}
      />
    </div>

    <div className="carrito-producto-info">
      <h3 className="carrito-producto-marca">
        {producto.nombre || producto.titulo || "Producto"}
      </h3>
      <button
        className="carrito-producto-eliminar sutil"
        onClick={() => onEliminar(producto.id)}
        aria-label="Eliminar"
      >
        <i className="bi bi-trash"></i>
        <span className="eliminar-text">Eliminar</span>
      </button>
    </div>

    <div className="carrito-producto-right">
      <div className="carrito-producto-precio-box">
        <div className="carrito-cantidad">
          <button
            className="carrito-cantidad-disminuir"
            aria-label="Disminuir"
            onClick={() => onDisminuir(producto.id)}
          >
            -
          </button>
          <span className="carrito-cantidad-contador">{producto.cantidad}</span>
          <button
            className="carrito-cantidad-aumentar"
            aria-label="Aumentar"
            onClick={() => onAumentar(producto.id)}
          >
            +
          </button>
        </div>
        <div className="precios-container">
          {/* si el producto tiene precio anterior, osea descuento aplicado, mostramos antes y ahora */}
          {(() => {
            const precioAnteriorCLP = (producto as any).precioAnteriorCLP as
              | string
              | undefined;
            if (precioAnteriorCLP) {
              return (
                <>
                  <div className="precio-row">
                    <span className="label">Antes</span>
                    <span
                      className="value carrito-producto-precio anterior"
                      style={{ textDecoration: "line-through" }}
                    >
                      {precioAnteriorCLP}
                    </span>
                  </div>
                  <div className="precio-row">
                    <span className="label">Ahora</span>
                    <span className="value carrito-producto-precio">
                      {producto.precioCLP ||
                        `$${producto.precio.toLocaleString()}`}
                    </span>
                  </div>
                  {producto.cantidad > 1 && (
                    <div className="precio-row subtotal">
                      <span className="label">Subtotal</span>
                      <span className="value carrito-producto-subtotal">
                        {producto.subtotalCLP ||
                          `$${(
                            producto.precio * producto.cantidad
                          ).toLocaleString()}`}
                      </span>
                    </div>
                  )}
                </>
              );
            }
            return (
              <>
                <div className="precio-row">
                  <span className="label">Precio</span>
                  <span className="value carrito-producto-precio">
                    {producto.precioCLP ||
                      `$${producto.precio.toLocaleString()}`}
                  </span>
                </div>
                {producto.cantidad > 1 && (
                  <div className="precio-row subtotal">
                    <span className="label">Subtotal</span>
                    <span className="value carrito-producto-subtotal">
                      {producto.subtotalCLP ||
                        `$${(
                          producto.precio * producto.cantidad
                        ).toLocaleString()}`}
                    </span>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  </div>
);

export default CarritoProducto;
