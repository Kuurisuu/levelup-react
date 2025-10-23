import React from "react";
import { Producto } from "../../data/catalogo";
import { ProductoEnCarrito } from "../../logic/storage";

interface ProductoDetalleInfoProps {
  producto: Producto;
  stars: React.ReactNode;
  notaRatingRef: React.RefObject<HTMLParagraphElement>;
  cat: string;
  sub?: string;
  handleAgregar: () => void;
  handleDisminuir: () => void;
  handleAumentar: () => void;
  itemEnCarrito?: ProductoEnCarrito;
  contadorRef: React.RefObject<HTMLSpanElement>;
  disponible: boolean;
  handleShare: (platform: string) => void;
}

const ProductoDetalleInfo: React.FC<ProductoDetalleInfoProps> = ({
  producto,
  stars,
  notaRatingRef,
  cat,
  sub,
  handleAgregar,
  handleDisminuir,
  handleAumentar,
  itemEnCarrito,
  contadorRef,
  disponible,
  handleShare,
}): React.JSX.Element => (
  <div className="producto-detalle-info">
    <header>
      <h2 className="producto-detalle-titulo">{producto.titulo}</h2>
      <small className="producto-detalle-codigo">Código: {producto.id}</small>
    </header>
    <div className="producto-detalle-estrellas-container estrellas-small">
      <div className="producto-detalle-estrellas">{stars}</div>
      <p className="producto-detalle-estrellas-valor" ref={notaRatingRef}></p>
    </div>
    <div className="producto-detalle-precio-container">
      <span className="producto-detalle-precio">
        ${producto.precio.toLocaleString("es-CL")} CLP
      </span>
      <span className="producto-detalle-descuento disabled"></span>
    </div>
    <div className="producto-detalle-descripcion">{producto.descripcion}</div>
    <div className="producto-origen">
      <h4>Origen del producto</h4>
      <p>
        <strong>Fabricante:</strong>
        <span id="origen-fabricante">
          {cat.includes("Consola")
            ? "Sony / Microsoft / Nintendo"
            : cat.includes("Perifer")
            ? "Logitech / HyperX / Razer"
            : "LevelUp Partners"}
        </span>
      </p>
      <p>
        <strong>Distribuidor:</strong>
        <span id="origen-distribuidor">
          {sub ? `${sub} LATAM Distribución` : "Distribuidor autorizado LATAM"}
        </span>
      </p>
    </div>
    <div className="producto-detalle-acciones">
      {!itemEnCarrito && (
        <button
          className={`boton-menu deco-levelup producto-detalle-agregar ${
            !disponible ? "deactivate" : "active"
          }`}
          disabled={!disponible}
          onClick={handleAgregar}
        >
          {disponible ? "Agregar al carrito" : "AGOTADO"}
        </button>
      )}
      {itemEnCarrito && (
        <div className="producto-detalle-cantidad">
          <button
            className="boton-menu deco-levelup producto-detalle-cantidad-disminuir"
            onClick={handleDisminuir}
          >
            -
          </button>
          <span
            className="producto-detalle-cantidad-contador"
            ref={contadorRef}
          >
            {itemEnCarrito.cantidad}
          </span>
          <button
            className="boton-menu deco-levelup producto-detalle-cantidad-aumentar"
            onClick={handleAumentar}
          >
            +
          </button>
        </div>
      )}
    </div>
    <div className="producto-detalle-compartir">
      <span>Compartir:</span>
      <button
        className="boton-menu share-btn"
        data-share="native"
        title="Compartir"
        onClick={() => handleShare("native")}
      >
        {" "}
        <i className="bi bi-share-fill"></i>{" "}
      </button>
      <button
        className="boton-menu share-btn"
        data-share="whatsapp"
        title="WhatsApp"
        onClick={() => handleShare("whatsapp")}
      >
        {" "}
        <i className="bi bi-whatsapp"></i>{" "}
      </button>
      <button
        className="boton-menu share-btn"
        data-share="facebook"
        title="Facebook"
        onClick={() => handleShare("facebook")}
      >
        {" "}
        <i className="bi bi-facebook"></i>{" "}
      </button>
      <button
        className="boton-menu share-btn"
        data-share="twitter"
        title="Twitter/X"
        onClick={() => handleShare("twitter")}
      >
        {" "}
        <i className="bi bi-twitter-x"></i>{" "}
      </button>
      <button
        className="boton-menu share-btn"
        data-share="telegram"
        title="Telegram"
        onClick={() => handleShare("telegram")}
      >
        {" "}
        <i className="bi bi-telegram"></i>{" "}
      </button>
      <button
        className="boton-menu share-btn"
        data-share="copy"
        title="Copiar enlace"
        onClick={() => handleShare("copy")}
      >
        {" "}
        <i className="bi bi-link-45deg"></i>{" "}
      </button>
    </div>
  </div>
);

export default ProductoDetalleInfo;
