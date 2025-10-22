import React from "react";
import { Producto } from "../../data/catalogo";

interface ProductoDetalleVisualProps {
  galeriaImgs: string[];
  mainImg: string;
  setMainImg: (img: string) => void;
  producto: Producto;
}

const ProductoDetalleVisual: React.FC<ProductoDetalleVisualProps> = ({
  galeriaImgs,
  mainImg,
  setMainImg,
  producto,
}): React.JSX.Element => (
  <div className="producto-detalle-visual">
    {/* Miniaturas si hay varias imágenes */}
    {galeriaImgs.length > 1 && (
      <div className="producto-detalle-img-container">
        <ul className="producto-detalle-img-list">
          {galeriaImgs.map((img, i) => (
            <li
              className={`producto-detalle-img-item${
                mainImg === img ? " active" : ""
              }`}
              key={i}
              onClick={() => setMainImg(img)}
            >
              <img
                className="producto-detalle-img"
                src={
                  img.startsWith("./")
                    ? import.meta.env.BASE_URL + img.replace(/^\.\//, "")
                    : img
                }
                alt={producto.titulo + " miniatura " + (i + 1)}
              />
            </li>
          ))}
        </ul>
      </div>
    )}
    {/* Imagen principal */}
    <div className="producto-detalle-main-img-container">
      <img
        className="producto-detalle-main-img"
        src={
          mainImg && mainImg.startsWith("./")
            ? import.meta.env.BASE_URL + mainImg.replace(/^\.\//, "")
            : mainImg ||
              (producto.imagen &&
                (producto.imagen.startsWith("./")
                  ? import.meta.env.BASE_URL +
                    producto.imagen.replace(/^\.\//, "")
                  : producto.imagen))
        }
        alt={producto.titulo}
      />
    </div>
  </div>
);

export default ProductoDetalleVisual;
