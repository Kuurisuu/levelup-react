import React from "react";
import { Producto } from "../../data/catalogo";

interface ProductoDetalleRelacionadosProps {
  productos: Producto[];
  onCardClick: (id: string) => void;
  ProductoCard: React.ComponentType<{
    producto: Producto;
    onClick: (id: string) => void;
  }>;
}

const ProductoDetalleRelacionados: React.FC<ProductoDetalleRelacionadosProps> = ({
  productos,
  onCardClick,
  ProductoCard,
}): React.JSX.Element => (
  <section className="seccion-relacionados">
    <div className="producto-detalle-relacionados-container">
      <div className="producto-detalle-relacionados-header">
        <div className="producto-detalle-titulo-con-barra">
          <h1 className="producto-detalle-comentarios-titulo">
            Productos relacionados
          </h1>
        </div>
      </div>
      <div id="relacionados" className="productos">
        {productos.map((p) => (
          <div key={p.id}>
            <ProductoCard producto={p} onClick={onCardClick} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductoDetalleRelacionados;
