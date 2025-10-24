import React from "react";

interface ModalConfirmacionProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  mensaje: string;
}

const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  mensaje,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-confirmacion">
        <div className="modal-icon">
          <i className="bi bi-exclamation-triangle"></i>
        </div>
        <p className="modal-mensaje">{mensaje}</p>
        <div className="modal-botones">
          <button className="btn-cancelar" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-eliminar" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
