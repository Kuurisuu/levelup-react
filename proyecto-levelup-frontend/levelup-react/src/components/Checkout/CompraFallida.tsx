import React from "react";

//este seria como un card de error de la compra q devuelve un html de error de la compra
interface CompraFallidaProps {
  error: string;
  codigoOrden?: string;
  onReintentar: () => void;
  onVolverCarrito: () => void;
  onContactarSoporte: () => void;
}

const CompraFallida: React.FC<CompraFallidaProps> = ({
  error,
  codigoOrden,
  onReintentar,
  onVolverCarrito,
  onContactarSoporte
}) => {
  return (
    <div className="compra-fallida">
      <div className="fallida-header">
        <div className="fallida-icono">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#F44336"/>
            <path d="M15 9L9 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>Error en la Compra</h2>
        <p className="fallida-mensaje">
          Lo sentimos, ha ocurrido un error al procesar tu compra. Por favor, intenta nuevamente.
        </p>
      </div>

      <div className="error-detalle">
        <div className="error-section">
          <h3>Detalles del Error</h3>
          <div className="error-mensaje-detalle">
            <p><strong>Error:</strong> {error}</p>
            {codigoOrden && (
              <p><strong>Código de referencia:</strong> #{codigoOrden}</p>
            )}
          </div>
        </div>

        <div className="error-section">
          <h3>Posibles Causas</h3>
          <div className="causas-lista">
            <p>• Problemas de conectividad</p>
            <p>• Error en el procesamiento del pago</p>
            <p>• Datos de tarjeta inválidos</p>
            <p>• Fondos insuficientes</p>
            <p>• Problemas temporales del sistema</p>
          </div>
        </div>

        <div className="error-section">
          <h3>¿Qué puedes hacer?</h3>
          <div className="soluciones-lista">
            <p>• Verifica tu conexión a internet</p>
            <p>• Revisa los datos de tu tarjeta</p>
            <p>• Intenta con otra tarjeta</p>
            <p>• Contacta a tu banco si el problema persiste</p>
            <p>• Si el problema continúa, contáctanos</p>
          </div>
        </div>

        <div className="error-section">
          <h3>Información de Contacto</h3>
          <div className="contacto-info">
            <p><strong>Email:</strong> soporte@levelup.cl</p>
            <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
            <p><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
          </div>
        </div>
      </div>

      <div className="fallida-actions">
        <button onClick={onReintentar} className="btn-reintentar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reintentar Compra
        </button>
        <button onClick={onVolverCarrito} className="btn-carrito">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
            <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
            <path d="M1 1H5L7.68 14.39C7.77 14.7 8.05 14.92 8.37 14.92H19.4C19.7 14.92 19.97 14.7 20.05 14.39L22 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver al Carrito
        </button>
        <button onClick={onContactarSoporte} className="btn-soporte">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 8H13.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 12H13.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 8H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Contactar Soporte
        </button>
      </div>

    </div>
  );
};

export default CompraFallida;
