import { useState, useEffect } from "react";
import "../styles/profile.css";

const Profile = () => {
  // estado para los datos del usuario
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    region: "",
    comuna: "",
    direccion: "",
    avatar: null,
  });

  // estado para modo edicion
  const [isEditing, setIsEditing] = useState(false);

  // estado para loading
  const [isLoading, setIsLoading] = useState(true);

  // estado para errores
  const [errors, setErrors] = useState({});

  // estado para el historial de pedidos
  const [orderHistory, setOrderHistory] = useState([]);

  // cargar datos del usuario al montar componente
  useEffect(() => {
    // logica para cargar datos del usuario
  }, []);

  // manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // logica para manejar cambios en inputs
  };

  // manejar cambio de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // logica para cambiar avatar
  };

  // guardar cambios del perfil
  const handleSaveProfile = async () => {
    // logica para guardar cambios
  };

  // cancelar edicion
  const handleCancelEdit = () => {
    setIsEditing(false);
    // restaurar datos originales
  };

  // cerrar sesion
  const handleLogout = () => {
    // logica para cerrar sesion
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt="Avatar"
                  className="user-avatar"
                />
              ) : (
                <div className="default-avatar">
                  <i className="bi bi-person-circle"></i>
                </div>
              )}
              {isEditing && (
                <button className="change-avatar-btn">
                  <i className="bi bi-camera"></i>
                </button>
              )}
            </div>
            <div className="user-info">
              <h1>
                {userData.nombre} {userData.apellido}
              </h1>
              <p className="user-email">{userData.email}</p>
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil"></i>
                Editar Perfil
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSaveProfile}>
                  <i className="bi bi-check"></i>
                  Guardar
                </button>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  <i className="bi bi-x"></i>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            <button className="tab-btn active">Información Personal</button>
            <button className="tab-btn">Historial de Pedidos</button>
            <button className="tab-btn">Configuración</button>
          </div>

          <div className="tab-content">
            {/* seccion informacion personal */}
            <div className="personal-info-section">
              <h3>Información Personal</h3>
              <div className="form-grid">
                <div className="form-group">{/* input nombre */}</div>
                <div className="form-group">{/* input apellido */}</div>
                <div className="form-group">{/* input email */}</div>
                <div className="form-group">{/* input telefono */}</div>
                <div className="form-group">{/* input fecha nacimiento */}</div>
                <div className="form-group">{/* select region */}</div>
                <div className="form-group">{/* select comuna */}</div>
                <div className="form-group full-width">
                  {/* input direccion */}
                </div>
              </div>
            </div>

            {/* seccion historial de pedidos */}
            <div className="order-history-section">
              <h3>Historial de Pedidos</h3>
              <div className="orders-list">{/* lista de pedidos */}</div>
            </div>

            {/* seccion configuracion */}
            <div className="settings-section">
              <h3>Configuración de Cuenta</h3>
              <div className="settings-options">
                <button className="change-password-btn">
                  Cambiar Contraseña
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                  Cerrar Sesión
                </button>
                <button className="delete-account-btn">Eliminar Cuenta</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
