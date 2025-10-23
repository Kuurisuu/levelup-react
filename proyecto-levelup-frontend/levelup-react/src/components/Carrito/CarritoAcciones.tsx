import React from "react";

interface CarritoAccionesProps {
  onVaciar: () => void;
  onCheckout: () => void;
  total: string;
  aplicaDuoc: boolean;
  onVolver: () => void;
}

const CarritoAcciones = ({
  onVaciar,
  onCheckout,
  total,
  aplicaDuoc,
  onVolver,
}: CarritoAccionesProps): React.JSX.Element => (
  <div id="carrito-acciones" className="carrito-acciones">
    <div className="carrito-acciones-izquierda">
      <button
        id="carrito-acciones-vaciar"
        className="boton-menu carrito-acciones-vaciar"
        onClick={onVaciar}
      >
        Vaciar carrito
      </button>
      <button
        id="carrito-acciones-volver"
        className="boton-menu boton-volver-carrito"
        onClick={onVolver}
      >
        Seguir comprando
      </button>
    </div>
    <div className="carrito-acciones-derecha">
      <div className="carrito-acciones-total">
        <p>Total:</p>
        <p
          id="total"
          title={aplicaDuoc ? "Descuento DUOC -20% aplicado" : undefined}
        >
          {total}
        </p>
      </div>
      <button
        id="carrito-acciones-comprar"
        className="carrito-acciones-comprar"
        onClick={onCheckout}//llama a la funcion onCheckout del componente CarritoAcciones
      >
        PROCEDER AL PAGO
      </button>
    </div>
  </div>
);

export default CarritoAcciones;
