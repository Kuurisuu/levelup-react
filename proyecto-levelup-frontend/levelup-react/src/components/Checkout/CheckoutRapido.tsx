import React, { useState } from "react";
import { ProductoEnCarrito } from "../../logic/storage";

import { DatosEnvio, formatCLP } from "../../utils/orden.helper";
import { DatosTarjeta } from "../../utils/checkout.helper";

//este seria el componente de rapido de la compra q devuelve un html de rapido de la compra
interface CheckoutRapidoProps {
  productos: ProductoEnCarrito[];
  datosEnvio: DatosEnvio;
  datosTarjeta: DatosTarjeta; //datos de tarjeta solo se guarda de referencia los datos con ** de referencia de id 
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  onConfirmarCompra: () => void;
  onEditarDatos: () => void;
  onEditarTarjeta: () => void;
}

const CheckoutRapido: React.FC<CheckoutRapidoProps> = ({
  productos,
  datosEnvio,
  datosTarjeta,
  subtotal,
  descuento,
  iva,
  total,
  onConfirmarCompra,
  onEditarDatos,
  onEditarTarjeta
}) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  
  // Debug: verificar datos de productos
  console.log('CheckoutRapido - productos:', productos);
  console.log('CheckoutRapido - primer producto:', productos[0]);
  console.log('CheckoutRapido - imagenUrl del primer producto:', productos[0]?.imagenUrl);
  console.log('CheckoutRapido - todas las propiedades del primer producto:', Object.keys(productos[0] || {}));

  const enmascararTarjeta = (numero: string): string => { //funcion para enmascarar el numero de tarjeta
    const numeroLimpio = numero.replace(/\s/g, ''); //elimina los espacios del numero de tarjeta
    if (numeroLimpio.length >= 4) { //si el numero de tarjeta tiene 4 digitos o mas se enmascara
      return '**** **** **** ' + numeroLimpio.slice(-4); //se enmascara el numero de tarjeta
    }
    return numero;
  };

  const enmascararCVV = (cvv: string): string => { //funcion para enmascarar el cvv de la tarjeta
    return '***'; //se enmascara el cvv de la tarjeta
  };

  return (
    <div className="checkout-rapido">
      <div className="rapido-header">
        <h2>Confirmación Rápida</h2>
        <p className="rapido-subtitle">
          Tus datos están guardados. Revisa y confirma tu compra.
        </p>
      </div>

      <div className="rapido-content">
        {/* Resumen de productos */}
        <div className="rapido-section">
          <div className="section-header">
            <h3>Productos</h3>
            <button 
              className="btn-toggle"
              onClick={() => setMostrarDetalles(!mostrarDetalles)}
            >
              {mostrarDetalles ? 'Ocultar' : 'Ver'} detalles
            </button>
          </div>
          
          <div className="productos-resumen">
            {productos.slice(0, 2).map((producto) => (
              <div key={producto.id} className="producto-rapido">
                <img 
                  src={
                    producto.imagenUrl 
                      ? (producto.imagenUrl.startsWith("./")
                          ? import.meta.env.BASE_URL + producto.imagenUrl.replace(/^\.\//, "")
                          : producto.imagenUrl)
                      : 'https://via.placeholder.com/100x100?text=No+Image'
                  }
                  alt={producto.nombre}
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/100x100?text=Error';
                  }}
                />
                <div className="producto-info">
                  <h4>{producto.nombre}</h4>
                  <p>{producto.cantidad} x {formatCLP(producto.precio)}</p>
                </div>
              </div>
            ))}
            {productos.length > 2 && (
              <div className="mas-productos">
                +{productos.length - 2} producto{productos.length - 2 > 1 ? 's' : ''} más
              </div>
            )}
          </div>

          {mostrarDetalles && (
            <div className="productos-detalle">
              {productos.slice(2).map((producto) => (
                <div key={producto.id} className="producto-rapido">
                  <img 
                    src={
                      producto.imagenUrl 
                        ? (producto.imagenUrl.startsWith("./")
                            ? import.meta.env.BASE_URL + producto.imagenUrl.replace(/^\.\//, "")
                            : producto.imagenUrl)
                        : 'https://via.placeholder.com/100x100?text=No+Image'
                    }
                    alt={producto.nombre}
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/100x100?text=Error';
                    }}
                  />
                  <div className="producto-info">
                    <h4>{producto.nombre}</h4>
                    <p>{producto.cantidad} x {formatCLP(producto.precio)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Datos de envío */}
        <div className="rapido-section">
          <div className="section-header">
            <h3>Dirección de Envío</h3>
            <button className="btn-editar" onClick={onEditarDatos}>
              Editar
            </button>
          </div>
          <div className="datos-rapidos">
            <p><strong>{datosEnvio.nombre} {datosEnvio.apellido}</strong></p>
            <p>{datosEnvio.direccion}</p>
            {datosEnvio.departamento && <p>Depto: {datosEnvio.departamento}</p>}
            <p>{datosEnvio.comuna}, {datosEnvio.region}</p>
            <p>{datosEnvio.telefono}</p>
          </div>
        </div>

        {/* Datos de tarjeta */}
        <div className="rapido-section">
          <div className="section-header">
            <h3>Método de Pago</h3>
            <button className="btn-editar" onClick={onEditarTarjeta}>
              Editar
            </button>
          </div>
          <div className="datos-rapidos">
            <p><strong>{datosTarjeta.nombre}</strong></p>
            <p>{enmascararTarjeta(datosTarjeta.numero)}</p>
            <p>Vence: {datosTarjeta.vencimiento}</p>
          </div>
        </div>

        {/* Resumen de precios */}
        <div className="rapido-section">
          <h3>Resumen de Pago</h3>
          <div className="precios-rapidos">
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

      <div className="rapido-actions">
        <button className="btn-confirmar-rapido" onClick={onConfirmarCompra}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Confirmar Compra - {formatCLP(total)}
        </button>
      </div>
    </div>
  );
};

export default CheckoutRapido;
