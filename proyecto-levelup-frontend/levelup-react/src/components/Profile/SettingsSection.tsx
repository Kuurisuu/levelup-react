import React from "react";

// Componente: SettingsSection
// Lista de opciones de configuración (Cambiar contraseña, Cerrar sesión, Eliminar cuenta)
// Incluye el panel de cambio de contraseña cuando `changingPassword` es true.

type Props = {
  setChangingPassword: (v: boolean) => void;
  changingPassword: boolean;
  pwdFields: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPwdFields: (s: any) => void;
  pwdErrors: Record<string, string>;
  labelClassPwd: (name: string) => string;
  validFields?: Record<string, boolean>;
  handlePwdChangeSubmit: () => void;
  handleLogout: () => void;
  handleDeleteAccount: () => void;
};

const SettingsSection: React.FC<Props> = ({
  setChangingPassword,
  changingPassword,
  pwdFields,
  setPwdFields,
  pwdErrors,
  labelClassPwd,
  validFields,
  handlePwdChangeSubmit,
  handleLogout,
  handleDeleteAccount,
}) => {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  return (
    <div className="settings-section">
      <h3>
        {changingPassword ? "Cambiar Contraseña" : "Configuración de Cuenta"}
      </h3>
      <div className="settings-options">
        {!changingPassword && (
          <ul className="settings-list">
            <li
              className="settings-item"
              role="button"
              tabIndex={0}
              onClick={() => setChangingPassword(true)}
              onKeyDown={(e) => {
                const ke = e as React.KeyboardEvent<HTMLLIElement>;
                if (ke.key === "Enter" || ke.key === " ") {
                  ke.preventDefault();
                  setChangingPassword(true);
                }
              }}
            >
              <span className="icon">
                <i className="bi bi-key" aria-hidden="true"></i>
              </span>
              <span className="label">Cambiar Contraseña</span>
            </li>

            <li className="settings-divider" aria-hidden="true"></li>

            <li
              className="settings-item"
              role="button"
              tabIndex={0}
              onClick={handleLogout}
              onKeyDown={(e) => {
                const ke = e as React.KeyboardEvent<HTMLLIElement>;
                if (ke.key === "Enter" || ke.key === " ") {
                  ke.preventDefault();
                  handleLogout();
                }
              }}
            >
              <span className="icon">
                <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
              </span>
              <span className="label">Cerrar Sesión</span>
            </li>

            <li className="settings-divider" aria-hidden="true"></li>

            <li
              className="settings-item danger-item"
              role="button"
              tabIndex={0}
              onClick={handleDeleteAccount}
              onKeyDown={(e) => {
                const ke = e as React.KeyboardEvent<HTMLLIElement>;
                if (ke.key === "Enter" || ke.key === " ") {
                  ke.preventDefault();
                  handleDeleteAccount();
                }
              }}
            >
              <span className="icon">
                <i className="bi bi-trash" aria-hidden="true"></i>
              </span>
              <span className="label">Eliminar Cuenta</span>
            </li>
          </ul>
        )}

        {changingPassword && (
          <div className="password-section expanded">
            <div className="form-group">
              <label className={labelClassPwd("currentPassword")}>
                Contraseña actual
              </label>
              <div className="pw-field-wrapper">
                <input
                  type={showCurrent ? "text" : "password"}
                  className={`perfil-input ${
                    changingPassword
                      ? pwdErrors.currentPassword
                        ? "invalid"
                        : validFields && validFields.currentPassword
                        ? "valid"
                        : ""
                      : ""
                  }`}
                  value={pwdFields.currentPassword}
                  onChange={(e) =>
                    setPwdFields({
                      ...pwdFields,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="pw-toggle-btn"
                  aria-label={
                    showCurrent ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowCurrent((s) => !s)}
                >
                  <i
                    className={`bi ${showCurrent ? "bi-eye" : "bi-eye-slash"}`}
                  ></i>
                </button>
              </div>
              {pwdErrors.currentPassword && (
                <div className="error-message">{pwdErrors.currentPassword}</div>
              )}
            </div>
            <div className="form-group">
              <label className={labelClassPwd("newPassword")}>
                Nueva contraseña
              </label>
              <div className="pw-field-wrapper">
                <input
                  type={showNew ? "text" : "password"}
                  className={`perfil-input ${
                    changingPassword
                      ? pwdErrors.newPassword
                        ? "invalid"
                        : validFields && validFields.newPassword
                        ? "valid"
                        : ""
                      : ""
                  }`}
                  value={pwdFields.newPassword}
                  onChange={(e) =>
                    setPwdFields({ ...pwdFields, newPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="pw-toggle-btn"
                  aria-label={
                    showNew ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowNew((s) => !s)}
                >
                  <i
                    className={`bi ${showNew ? "bi-eye" : "bi-eye-slash"}`}
                  ></i>
                </button>
              </div>
              {pwdErrors.newPassword && (
                <div className="error-message">{pwdErrors.newPassword}</div>
              )}
            </div>
            <div className="form-group">
              <label className={labelClassPwd("confirmPassword")}>
                Confirmar contraseña
              </label>
              <div className="pw-field-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  className={`perfil-input ${
                    changingPassword
                      ? pwdErrors.confirmPassword
                        ? "invalid"
                        : validFields && validFields.confirmPassword
                        ? "valid"
                        : ""
                      : ""
                  }`}
                  value={pwdFields.confirmPassword}
                  onChange={(e) =>
                    setPwdFields({
                      ...pwdFields,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="pw-toggle-btn"
                  aria-label={
                    showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowConfirm((s) => !s)}
                >
                  <i
                    className={`bi ${showConfirm ? "bi-eye" : "bi-eye-slash"}`}
                  ></i>
                </button>
              </div>
              {pwdErrors.confirmPassword && (
                <div className="error-message">{pwdErrors.confirmPassword}</div>
              )}
            </div>
            <div className="form-actions">
              <button
                className="boton-menu deco-levelup save-btn"
                onClick={handlePwdChangeSubmit}
              >
                Guardar
              </button>
              <button
                className="boton-menu border-levelup cancel-btn"
                onClick={() => {
                  setChangingPassword(false);
                  setPwdFields({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;
