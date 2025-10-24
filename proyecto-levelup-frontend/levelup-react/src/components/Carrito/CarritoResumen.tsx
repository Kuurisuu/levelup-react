import React from "react";

interface CarritoResumenProps {
  total: string;
  cantidadProductos: number;
  onPagar: () => void;
}

const CarritoResumen: React.FC<CarritoResumenProps> = ({
  total,
  cantidadProductos,
  onPagar,
}): React.JSX.Element => {
  return (
    <div className="carrito-resumen">
      <div className="resumen-header">
        <h3 className="resumen-titulo">Resumen de tu compra</h3>
        <span className="resumen-productos">Productos ({cantidadProductos})</span>
      </div>

      <div className="resumen-total">
        <span className="resumen-total-label">Total Transferencia / Débito</span>
        <span className="resumen-total-valor">{total}</span>
      </div>

      <div className="resumen-despacho">
        <i className="bi bi-truck"></i>
        <span>El valor del despacho se calculará cuando se seleccione el tipo de entrega.</span>
      </div>

      <button className="btn-pagar" onClick={onPagar}>
        Pagar
      </button>

      <div className="resumen-seguridad">
        <div className="seguridad-item">
          <i className="bi bi-lock-fill"></i>
          <span>Pago 100% seguro</span>
        </div>
        <div className="seguridad-item">
          <i className="bi bi-shield-check"></i>
          <span>Garantía en tus productos</span>
        </div>
      </div>
    </div>
  );
};

export default CarritoResumen;
