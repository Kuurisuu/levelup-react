import React from "react";

const CarritoVacio: React.FC = (): React.JSX.Element => (
  <p id="carrito-vacio" className="carrito-vacio">
    Tu carrito esta vacío.<i className="bi bi-emoji-frown"></i>
  </p>
);

export default CarritoVacio;
