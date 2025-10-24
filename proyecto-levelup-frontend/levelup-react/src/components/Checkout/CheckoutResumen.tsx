import React from "react";
import { ProductoEnCarrito } from "../../logic/storage";

//este seria el componente de resumen de la compra q devuelve un html de resumen de la compra
interface CheckoutResumenProps {
  productos: ProductoEnCarrito[];
  datosEnvio: DatosEnvio;
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  codigoOrden: string;
  onConfirmarCompra: () => void;
  onVolver: () => void;
}

interface DatosEnvio {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  departamento: string;
  region: string;
  comuna: string;
  indicadoresEntrega: string;
}

const CheckoutResumen: React.FC<CheckoutResumenProps> = ({
  productos,
  datosEnvio,
  subtotal,
  descuento,
  iva,
  total,
  codigoOrden,
  onConfirmarCompra,
  onVolver
}) => {
  const formatCLP = (num: number): string => {
    return num?.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }) || "$0";
  };

  return (
    <div className="checkout-resumen">
      <div className="resumen-header">
        <h2>Resumen de Compra</h2>
        <div className="codigo-orden">
          <span>Orden #{codigoOrden}</span>
        </div>
      </div>

      <div className="resumen-content">
        {/* Información de envío */}
        <div className="resumen-section">
          <h3>Información de Envío</h3>
          <div className="datos-envio">
            <p><strong>Nombre:</strong> {datosEnvio.nombre} {datosEnvio.apellido}</p>
            <p><strong>Email:</strong> {datosEnvio.email}</p>
            <p><strong>Teléfono:</strong> {datosEnvio.telefono}</p>
            <p><strong>Dirección:</strong> {datosEnvio.direccion}</p>
            {datosEnvio.departamento && (
              <p><strong>Departamento:</strong> {datosEnvio.departamento}</p>
            )}
            <p><strong>Región:</strong> {datosEnvio.region}</p>
            <p><strong>Comuna:</strong> {datosEnvio.comuna}</p>
            {datosEnvio.indicadoresEntrega && (
              <p><strong>Indicadores de entrega:</strong> {datosEnvio.indicadoresEntrega}</p>
            )}
          </div>
        </div>

        {/* Productos */}
        <div className="resumen-section">
          <h3>Productos</h3>
          <div className="productos-lista">
            {productos.map((producto) => (
              <div key={producto.id} className="producto-resumen">
                <div className="producto-imagen">
                  <img 
                    src={
                      producto.imagenUrl && producto.imagenUrl.startsWith("./")
                        ? import.meta.env.BASE_URL + producto.imagenUrl.replace(/^\.\//, "")
                        : producto.imagenUrl || '/img/otros/placeholder.png'
                    }
                    alt={producto.nombre}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/img/otros/placeholder.png';
                    }}
                  />
                </div>
                <div className="producto-info">
                  <h4>{producto.nombre}</h4>
                  <p className="producto-precio">{formatCLP(producto.precio)}</p>
                  <p className="producto-cantidad">Cantidad: {producto.cantidad}</p>
                  <p className="producto-subtotal">
                    Subtotal: {formatCLP(producto.precio * producto.cantidad)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de precios */}
        <div className="resumen-section">
          <h3>Resumen de Precios</h3>
          <div className="precios-resumen">
            <div className="precio-linea">
              <span>Subtotal:</span>
              <span>{formatCLP(subtotal)}</span>
            </div>
            {descuento > 0 && (
              <div className="precio-linea descuento">
                <span>Descuento (20% Duoc):</span>
                <span>-{formatCLP(descuento)}</span>
              </div>
            )}
            <div className="precio-linea">
              <span>IVA (19%):</span>
              <span>{formatCLP(iva)}</span>
            </div>
            <div className="precio-linea total">
              <span><strong>Total:</strong></span>
              <span><strong>{formatCLP(total)}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="resumen-actions">
        <button onClick={onVolver} className="btn-volver">
          Volver a Editar
        </button>
        <button onClick={onConfirmarCompra} className="btn-confirmar">
          Confirmar Compra
        </button>
      </div>
    </div>
  );
};

export default CheckoutResumen;
