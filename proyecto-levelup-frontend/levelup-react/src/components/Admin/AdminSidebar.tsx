import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/admin-sidebar.css";

const AdminSidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    try {
      return window.innerWidth <= 1025;
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 1025);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  React.useEffect(() => {
    if (isMobile) setOpen(false);
  }, [isMobile]);

  return (
    <>
      {isMobile && !open && (
        <button
          className="boton-menu boton-filtro-mobile"
          aria-label="Abrir panel admin"
          onClick={() => setOpen(true)}
        >
          Panel Admin
        </button>
      )}

      <aside
        className={`product-aside-filter ${open && isMobile ? "abierto" : ""}`}
        aria-label="Barra lateral de administración"
      >
        <div className="product-aside-filter-header">
          <h2 className="product-aside-title">Panel Admin</h2>
          <button
            className="cerrar-filtros"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav id="admin-nav" className="admin-nav">
          <NavLink
            to="/admin/usuarios"
            className={({ isActive }) =>
              isActive ? "boton-categoria active" : "boton-categoria"
            }
            onClick={() => {
              if (isMobile) setOpen(false);
            }}
          >
            Usuarios
          </NavLink>
          <NavLink
            to="/admin/productos"
            className={({ isActive }) =>
              isActive ? "boton-categoria active" : "boton-categoria"
            }
            onClick={() => {
              if (isMobile) setOpen(false);
            }}
          >
            Productos
          </NavLink>
        </nav>
      </aside>

      <div id="overlay-filtros" onClick={() => setOpen(false)} />
    </>
  );
};

export default AdminSidebar;
