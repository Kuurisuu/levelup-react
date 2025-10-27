import React from 'react';
import { Link } from 'react-router-dom';

const DashboardSidebar: React.FC = () => {
  return (
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
  );
};

export default DashboardSidebar;
