import { Link } from 'react-router-dom';
import '../styles/admin.css';

const Admin = () => {
  return (
    <div className="wrapper">
      <main>
        <div className="admin-layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <h2>Admin</h2>
            <ul>
              <li>
                <Link to="/admin/usuarios">
                  <i className="bi bi-people-fill"></i> Usuarios
                </Link>
              </li>
              <li>
                <Link to="/admin/productos">
                  <i className="bi bi-controller"></i> Productos
                </Link>
              </li>
            </ul>
          </aside>

          {/* CONTENIDO */}
          <main className="admin-content">
            <h1>Panel de Administración</h1>
            <p>Selecciona una opción en el menú lateral.</p>
          </main>
        </div>
      </main>
    </div>
  );
};

export default Admin;