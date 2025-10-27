import React from "react";
import { REGIONES } from "../../utils/regiones";

// Componente: PersonalInfoForm
// Renderiza el formulario de Información Personal. Mantiene comentarios en Español con Mayúscula inicial.

type UserData = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  region: string;
  comuna: string;
  direccion: string;
};

type Props = {
  userData: UserData;
  isEditing: boolean;
  errors: Record<string, string>;
  validFields: Record<string, boolean>;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleFieldBlur: (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLSelectElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => void;
};

const PersonalInfoForm: React.FC<Props> = ({
  userData,
  isEditing,
  errors,
  validFields,
  handleInputChange,
  handleFieldBlur,
}) => {
  return (
    <div className="personal-info-section">
      <h3>{isEditing ? "Editar Perfil" : "Información Personal"}</h3>
      <div className="perfil-form">
        <div className="form-group">
          <label
            className={
              isEditing
                ? errors.nombre
                  ? "label invalid"
                  : validFields.nombre
                  ? "label valid"
                  : "label"
                : ""
            }
            htmlFor="nombre"
          >
            Nombre
            {isEditing && <span className="required-asterisk">*</span>}
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className={`perfil-input ${
              isEditing
                ? errors.nombre
                  ? "invalid"
                  : validFields.nombre
                  ? "valid"
                  : ""
                : ""
            }`}
            value={userData.nombre}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            readOnly={!isEditing}
            aria-label="Nombre"
            aria-required="true"
          />
          {errors.nombre && (
            <div className="error-message">{errors.nombre}</div>
          )}
        </div>

        <div className="form-group">
          <label
            className={
              isEditing
                ? errors.apellido
                  ? "label invalid"
                  : validFields.apellido
                  ? "label valid"
                  : "label"
                : ""
            }
            htmlFor="apellido"
          >
            Apellido
            {isEditing && <span className="required-asterisk">*</span>}
          </label>
          <input
            id="apellido"
            name="apellido"
            type="text"
            className={`perfil-input ${
              isEditing
                ? errors.apellido
                  ? "invalid"
                  : validFields.apellido
                  ? "valid"
                  : ""
                : ""
            }`}
            value={userData.apellido}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            readOnly={!isEditing}
            aria-label="Apellido"
          />
          {errors.apellido && (
            <div className="error-message">{errors.apellido}</div>
          )}
        </div>

        <div className="form-group">
          <label
            className={
              isEditing
                ? errors.email
                  ? "label invalid"
                  : validFields.email
                  ? "label valid"
                  : "label"
                : ""
            }
            htmlFor="email"
          >
            Email
            {isEditing && <span className="required-asterisk">*</span>}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`perfil-input ${
              isEditing
                ? errors.email
                  ? "invalid"
                  : validFields.email
                  ? "valid"
                  : ""
                : ""
            }`}
            value={userData.email}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            aria-label="Correo electrónico"
            readOnly={!isEditing}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label className={""} htmlFor="telefono">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            className={`perfil-input ${
              isEditing
                ? errors.telefono
                  ? "invalid"
                  : validFields.telefono
                  ? "valid"
                  : ""
                : ""
            }`}
            value={userData.telefono}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            readOnly={!isEditing}
            aria-label="Teléfono"
          />
          {errors.telefono && (
            <div className="error-message">{errors.telefono}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="fechaNacimiento">
            Fecha de Nacimiento
            {isEditing && <span className="required-asterisk">*</span>}
          </label>
          <input
            id="fechaNacimiento"
            name="fechaNacimiento"
            type="date"
            className={`perfil-input ${
              isEditing
                ? errors.fechaNacimiento
                  ? "invalid"
                  : validFields.fechaNacimiento
                  ? "valid"
                  : ""
                : ""
            }`}
            value={userData.fechaNacimiento}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            readOnly={!isEditing}
            aria-label="Fecha de nacimiento"
          />
          {errors.fechaNacimiento && (
            <div className="error-message">{errors.fechaNacimiento}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="region">
            Región{isEditing && <span className="required-asterisk">*</span>}
          </label>
          <select
            id="region"
            name="region"
            value={userData.region}
            onChange={handleInputChange}
            className={`perfil-input ${
              isEditing
                ? errors.region
                  ? "invalid"
                  : validFields.region
                  ? "valid"
                  : ""
                : ""
            }`}
            disabled={!isEditing}
            onBlur={handleFieldBlur}
            aria-label="Región"
          >
            <option value="">Selecciona una región</option>
            {REGIONES.map((r) => (
              <option key={r.nombre} value={r.nombre}>
                {r.nombre}
              </option>
            ))}
          </select>
          {errors.region && (
            <div className="error-message">{errors.region}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="comuna">
            Comuna{isEditing && <span className="required-asterisk">*</span>}
          </label>
          <select
            id="comuna"
            name="comuna"
            value={userData.comuna}
            onChange={handleInputChange}
            className={`perfil-input ${
              isEditing
                ? errors.comuna
                  ? "invalid"
                  : validFields.comuna
                  ? "valid"
                  : ""
                : ""
            }`}
            disabled={!isEditing}
            onBlur={handleFieldBlur}
            aria-label="Comuna"
          >
            <option value="">Selecciona una comuna</option>
            {(
              REGIONES.find((r) => r.nombre === userData.region)?.comunas || []
            ).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.comuna && (
            <div className="error-message">{errors.comuna}</div>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="direccion">Dirección</label>
          <textarea
            id="direccion"
            name="direccion"
            className={`perfil-input no-resize ${
              isEditing
                ? errors.direccion
                  ? "invalid"
                  : validFields.direccion
                  ? "valid"
                  : ""
                : ""
            }`}
            value={userData.direccion}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            readOnly={!isEditing}
            rows={2}
            aria-label="Dirección"
          />
          {errors.direccion && (
            <div className="error-message">{errors.direccion}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
