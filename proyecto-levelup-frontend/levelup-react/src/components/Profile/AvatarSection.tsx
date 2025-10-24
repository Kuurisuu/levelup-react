import React from "react";

// Componente: AvatarSection
// Muestra el avatar del usuario con overlay para cambiar la imagen.
// Comentarios en Español con Mayúscula al principio.

type Props = {
  avatar: string | null;
  nombre: string;
  apellido: string;
  email: string;
  userId: string | null;
  copyMsg: string | null;
  isEditing: boolean;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickChangeAvatar: () => void;
  onCopyId: () => void;
};

const AvatarSection: React.FC<Props> = ({
  avatar,
  nombre,
  apellido,
  email,
  userId,
  copyMsg,
  isEditing,
  avatarInputRef,
  onAvatarChange,
  onClickChangeAvatar,
  onCopyId,
}) => {
  return (
    <div className="profile-avatar-section">
      <div className="avatar-container">
        <div className="avatar-frame">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="user-avatar" />
          ) : (
            <div className="default-avatar">
              <i className="bi bi-person-circle"></i>
            </div>
          )}
        </div>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onAvatarChange}
          aria-hidden={!isEditing}
          aria-label="Subir avatar"
        />

        {isEditing && (
          <div className="avatar-actions">
            <button
              type="button"
              className="change-avatar-btn"
              onClick={onClickChangeAvatar}
              aria-label="Cambiar avatar"
            >
              <i className="bi bi-camera"></i>
            </button>
          </div>
        )}
      </div>

      <div className="user-info">
        <h1>
          {nombre} {apellido}
        </h1>
        <p className="user-email">{email}</p>
        <div className="user-id-row">
          <span className="status-badge user-id-badge">
            ID No: {userId || "-"}
          </span>
          <button
            type="button"
            className="btn-icon copy-id-btn"
            onClick={onCopyId}
            aria-label="Copiar ID"
          >
            <i className="bi bi-clipboard"></i>
          </button>
          {copyMsg && <span className="copy-msg">{copyMsg}</span>}
        </div>
      </div>
    </div>
  );
};

export default AvatarSection;
