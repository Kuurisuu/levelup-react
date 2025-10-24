import React from "react";

// Componente: PointsSection
// Muestra el Código de Referido (arriba) y Puntos Actuales (abajo)
// con un divisor horizontal entre ambos.

type Props = {
  referralCode?: string;
  points?: number;
  copyMsgReferral?: string | null;
  onCopyReferral: () => void;
};

const PointsSection: React.FC<Props> = ({
  referralCode,
  points,
  copyMsgReferral,
  onCopyReferral,
}) => {
  return (
    <div className="points-section">
      <h3>Puntos Level-Up</h3>

      <div className="referral-section">
        <div className="referral-top">
          <div className="referral-code-row">
            <div className="label">Código de referido</div>
            <div className="referral-badge-row">
              <span className="user-id-badge referral-badge">
                {referralCode || "-"}
              </span>
              <button
                type="button"
                className="btn-icon copy-id-btn"
                onClick={onCopyReferral}
                aria-label="Copiar código referido"
              >
                <i className="bi bi-clipboard"></i>
              </button>
              {copyMsgReferral && (
                <span className="copy-msg">{copyMsgReferral}</span>
              )}
            </div>
          </div>
          <p className="help-text referral-help-text">
            Comparte este código con tus amigos para obtener 50 puntos cuando se
            registren
          </p>
        </div>

        <div className="referral-divider horizontal" aria-hidden="true"></div>

        <div className="referral-bottom">
          <div className="label">Puntos actuales</div>
          <div className="points-badge">
            {typeof points === "number" ? points : 0} pts
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsSection;
