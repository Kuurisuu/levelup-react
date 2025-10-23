import React, { useState } from "react";

//este seria el componente de pago de la compra q devuelve un html de pago de la compra
interface CheckoutPagoProps {
  total: number;
  datosTarjetaIniciales?: DatosTarjeta | null;
  onPagar: (datosTarjeta: DatosTarjeta) => void;
  onVolver: () => void;
}

interface DatosTarjeta {
  numero: string;
  nombre: string;
  vencimiento: string;
  cvv: string;
}

const CheckoutPago: React.FC<CheckoutPagoProps> = ({ //props para el componente de pago con total, datos tarjeta iniciales, onPagar y onVolver
  total,
  datosTarjetaIniciales,
  onPagar,
  onVolver
}) => {
  const [formData, setFormData] = useState<DatosTarjeta>(
    datosTarjetaIniciales || {
      numero: "",
      nombre: "",
      vencimiento: "",
      cvv: ""
    }
  );

  const [errores, setErrores] = useState<Partial<DatosTarjeta>>({}); // errores para el formulario de pago

  const formatCLP = (num: number): string => { //funcion para formatear el total a pesos chilenos
    return num?.toLocaleString("es-CL", { //formatear el total a pesos chilenos
      style: "currency", //style para el formato de moneda
      currency: "CLP", //currency para el formato de moneda
      maximumFractionDigits: 0, //maximumFractionDigits para el formato de moneda
    }) || "$0"; //si no hay total se retorna $0
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { //funcion para manejar el cambio de input
    const { name, value } = e.target; //name y value para el input
    let processedValue = value;

    // Formatear número de tarjeta (agregar espacios cada 4 dígitos)
    if (name === "numero") {
      processedValue = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      if (processedValue.length > 19) processedValue = processedValue.slice(0, 19);
    }
    
    // Formatear fecha de vencimiento (MM/YY)
    if (name === "vencimiento") { //si el name es vencimiento se formatea la fecha de vencimiento
      processedValue = value.replace(/\D/g, "");
      if (processedValue.length >= 2) { //si la fecha de vencimiento tiene 2 digitos o mas se formatea
        processedValue = processedValue.slice(0, 2) + "/" + processedValue.slice(2, 4); //se formatea la fecha de vencimiento
      }
    }
    
    // Limitar CVV a 3 dígitos
    if (name === "cvv") { //si el name es cvv se limita a 3 digitos
      processedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setFormData(prev => ({ //se actualiza el estado del formulario con el nuevo valor
      ...prev, //los primeros 3 puntos son para mantener los datos anteriores y no se pierdan
      [name]: processedValue //se actualiza el estado del formulario con el nuevo valor
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name as keyof DatosTarjeta]) {
      setErrores(prev => ({ //se actualiza el estado de los errores con el nuevo valor
        ...prev,
        [name]: undefined //se limpia el error del campo cuando el usuario empiece a escribir
      }));
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<DatosTarjeta> = {}; //el partial es para que se pueda pasar un objeto parcial de datos tarjeta

    if (!formData.numero.trim()) nuevosErrores.numero = "El número de tarjeta es requerido";
    else if (formData.numero.replace(/\s/g, "").length < 16) nuevosErrores.numero = "El número de tarjeta debe tener 16 dígitos";
    
    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre en la tarjeta es requerido";
    
    if (!formData.vencimiento.trim()) nuevosErrores.vencimiento = "La fecha de vencimiento es requerida";
    else if (!/^\d{2}\/\d{2}$/.test(formData.vencimiento)) nuevosErrores.vencimiento = "Formato: MM/YY";
    
    if (!formData.cvv.trim()) nuevosErrores.cvv = "El CVV es requerido";
    else if (formData.cvv.length < 3) nuevosErrores.cvv = "El CVV debe tener 3 dígitos";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => { //funcion para manejar el submit del formulario
    e.preventDefault();
    if (validarFormulario()) {
      onPagar(formData); //se pasa el formulario de pago a la funcion onPagar
    }
  };

  return (
    <div className="checkout-pago">
      <h2>Datos de Pago</h2>
      
      <div className="pago-resumen">
        <h3>Total a Pagar</h3>
        <div className="total-pago">
          <span className="total-cantidad">{formatCLP(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="formulario-pago">
        <div className="form-group">
          <label htmlFor="numero">Número de Tarjeta *</label>
          <input
            type="text"
            id="numero"
            name="numero"
            value={formData.numero}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            className={errores.numero ? "error" : ""}
            maxLength={19}
          />
          {errores.numero && <span className="error-message">{errores.numero}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Nombre en la Tarjeta *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="JUAN PEREZ"
            className={errores.nombre ? "error" : ""}
            style={{ textTransform: 'uppercase' }}
          />
          {errores.nombre && <span className="error-message">{errores.nombre}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="vencimiento">Vencimiento *</label>
            <input
              type="text"
              id="vencimiento"
              name="vencimiento"
              value={formData.vencimiento}
              onChange={handleInputChange}
              placeholder="MM/YY"
              className={errores.vencimiento ? "error" : ""}
              maxLength={5}
            />
            {errores.vencimiento && <span className="error-message">{errores.vencimiento}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV *</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              className={errores.cvv ? "error" : ""}
              maxLength={3}
            />
            {errores.cvv && <span className="error-message">{errores.cvv}</span>}
          </div>
        </div>

        <div className="pago-info">
          <div className="info-seguridad">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Tu información está protegida con encriptación SSL</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onVolver} className="btn-volver">
            Volver
          </button>
          <button type="submit" className="btn-pagar">
            Pagar {formatCLP(total)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPago;
