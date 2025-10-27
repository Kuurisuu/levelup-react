import { Link } from 'react-router-dom';
import '../styles/admin.css';

const AdminOrdenes = () => {
  return (
    <div className="wrapper">
      <main>
        <div className="admin-layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <h2>Admin</h2>
            <ul>
              <li>
                <Link to="/admin/dashboard">
                  <i className="bi bi-speedometer2"></i> Dashboard
                </Link>
              </li>
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
              <li>
                <Link to="/admin/ordenes">
                  <i className="bi bi-cart-check"></i> Órdenes
                </Link>
              </li>
              <li>
                <Link to="/admin/categorias">
                  <i className="bi bi-tags"></i> Categorías
                </Link>
              </li>
              <li>
                <Link to="/admin/reportes">
                  <i className="bi bi-graph-up"></i> Reportes
                </Link>
              </li>
            </ul>
          </aside>

          {/* CONTENIDO */}
          <main className="admin-content">
            <h1>Órdenes</h1>
            <div>
              <p>Aquí se gestionarán las órdenes de compra. Se podrán ver, editar, cambiar estados, procesar pagos, etc.</p>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
};

export default AdminOrdenes;
