import React from "react";
import { ProductoEnCarrito } from "../../logic/storage";

//este seria como un card de exito de la compra q devuelve un html de exito de la compra
interface CompraExitosaProps {
  productos: ProductoEnCarrito[];
  datosEnvio: DatosEnvio;
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  codigoOrden: string;
  onImprimirPDF: () => void;
  onEnviarEmail: () => void;
  onVolverInicio: () => void;
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

const CompraExitosa: React.FC<CompraExitosaProps> = ({
  productos,
  datosEnvio,
  subtotal,
  descuento,
  iva,
  total,
  codigoOrden,
  onImprimirPDF,
  onEnviarEmail,
  onVolverInicio
}) => {
  const formatCLP = (num: number): string => {
    return num?.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }) || "$0";
  };

  return (
    <div className="compra-exitosa">
      <div className="exito-header">
        <div className="exito-icono">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
            <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>¡Compra Realizada con Éxito!</h2>
        <p className="exito-mensaje">
          Tu orden ha sido procesada correctamente. Recibirás un email de confirmación en breve.
        </p>
      </div>

      <div className="orden-detalle">
        <div className="orden-header">
          <h3>Detalle de la Orden</h3>
          <div className="codigo-orden">
            <span>Orden #{codigoOrden}</span>
          </div>
        </div>

        {/* Información del cliente */}
        <div className="orden-section">
          <h4>Información del Cliente</h4>
          <div className="cliente-info">
            <p><strong>Nombre:</strong> {datosEnvio.nombre} {datosEnvio.apellido}</p>
            <p><strong>Email:</strong> {datosEnvio.email}</p>
            <p><strong>Teléfono:</strong> {datosEnvio.telefono}</p>
          </div>
        </div>

        {/* Dirección de envío */}
        <div className="orden-section">
          <h4>Dirección de Envío</h4>
          <div className="direccion-info">
            <p>{datosEnvio.direccion}</p>
            {datosEnvio.departamento && <p>Depto: {datosEnvio.departamento}</p>}
            <p>{datosEnvio.comuna}, {datosEnvio.region}</p>
            {datosEnvio.indicadoresEntrega && (
              <p><strong>Indicadores:</strong> {datosEnvio.indicadoresEntrega}</p>
            )}
          </div>
        </div>

        {/* Productos comprados */}
        <div className="orden-section">
          <h4>Productos Comprados</h4>
          <div className="productos-comprados">
            {productos.map((producto) => (
              <div key={producto.id} className="producto-comprado">
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
                <div className="producto-detalle">
                  <h5>{producto.nombre}</h5>
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

        {/* Resumen financiero */}
        <div className="orden-section">
          <h4>Resumen de Pago</h4>
          <div className="resumen-pago">
            <div className="pago-linea">
              <span>Subtotal:</span>
              <span>{formatCLP(subtotal)}</span>
            </div>
            {descuento > 0 && (
              <div className="pago-linea descuento">
                <span>Descuento (20% Duoc):</span>
                <span>-{formatCLP(descuento)}</span>
              </div>
            )}
            <div className="pago-linea">
              <span>IVA (19%):</span>
              <span>{formatCLP(iva)}</span>
            </div>
            <div className="pago-linea total">
              <span><strong>Total Pagado:</strong></span>
              <span><strong>{formatCLP(total)}</strong></span>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="orden-section">
          <h4>Información Adicional</h4>
          <div className="info-adicional">
            <p>• Recibirás un email de confirmación en {datosEnvio.email}</p>
            <p>• El tiempo de entrega estimado es de 3-5 días hábiles</p>
            <p>• Te contactaremos por teléfono para coordinar la entrega</p>
            <p>• Puedes imprimir esta boleta como comprobante</p>
          </div>
        </div>
      </div>

      <div className="exito-actions">
        <button onClick={onImprimirPDF} className="btn-pdf">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Imprimir PDF
        </button>
        <button onClick={onEnviarEmail} className="btn-email">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Enviar por Email
        </button>
        <button onClick={onVolverInicio} className="btn-inicio">
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default CompraExitosa;
