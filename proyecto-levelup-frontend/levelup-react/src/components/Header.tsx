import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface UserSession {
  id: string;
  nombre: string;
  email: string;
  tipo: string;
  userId?: string;
  role?: string;
  displayName?: string;
}

interface User {
  id: string;
  name?: string;
  displayName?: string;
  role?: string;
}

export default function Header(): React.JSX.Element {
  const [busqueda, setBusqueda] = useState<string>("");
  const navigate = useNavigate();

  // Manejar submit de búsqueda
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`/producto?q=${encodeURIComponent(busqueda.trim())}`);
    } else {
      navigate("/producto");
    }
  }

  useEffect(() => {
    // ====== Funciones de sesión ======
    function getUserSession(): UserSession | null {
      try {
        const raw = localStorage.getItem("lvup_user_session");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }

    function readUsers(): User[] {
      try {
        const data = localStorage.getItem("lvup_users");
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    }

    function getCurrentUser(): User | null {
      const s = getUserSession();
      if (!s || !s.userId) return null;
      const users = readUsers();
      return users.find((u) => u.id === s.userId) || null;
    }

    function getRole(): string {
      const s = getUserSession();
      const u = getCurrentUser();
      return (s && s.role) || (u && u.role) || "cliente";
    }

    function handleLogout(): void {
      try {
        localStorage.removeItem("lvup_user_session");
      } catch {}
      window.location.href = "index.html";
    }

    // ====== Setup Auth UI ======
    (function setupAuthUI(): void {
      const session = getUserSession();
      const role = getRole();
      const identBtn = document.querySelector(".boton-identificate");
      const detailsName = document.querySelector(
        ".detalles-identificate span:first-child"
      ) as HTMLSpanElement | null;
      const detailsSub = document.querySelector(
        ".detalles-identificate span:last-child"
      ) as HTMLSpanElement | null;
      const submenu = identBtn?.parentElement?.querySelector(
        ".despliegue-submenu"
      ) as HTMLElement | null;

      if (session) {
        if (detailsName)
          detailsName.textContent = `Hola, ${session.displayName || "Usuario"}`;
        if (detailsSub) detailsSub.textContent = "Tu cuenta";

        if (submenu) {
          submenu.innerHTML = `
            <li>
              <button type="button" id="lvup-logout" class="despliegue-submenu-boton">
                Cerrar Sesión
              </button>
            </li>
          `;
          const logoutBtn = submenu.querySelector("#lvup-logout");
          if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
        }
      }

      // ocultar link admin si no corresponde
      const adminLink = document.querySelector(".admin-home-link");
      if (adminLink && role !== "admin") {
        adminLink.parentElement?.remove();
      }

      // acceso vendedor
      const menu = document.querySelector("nav ul.menu") as HTMLElement | null;
      if (menu && role === "vendedor") {
        if (!document.querySelector(".vendedor-productos-link")) {
          const li = document.createElement("li");
          li.innerHTML = `
            <a href="./admin/productos.html"
               className="boton-submenu vendedor-productos-link">
               Gestionar Productos
            </a>`;
          menu.appendChild(li);
        }
      }
    })();

    // ====== Menu Lateral ======
    (function setupMenuLateral(): void {
      const toggleBtn = document.querySelector(".menu-toggle") as HTMLButtonElement | null;
      const menuLateral = document.querySelector("#menu-lateral") as HTMLElement | null;
      const cerrarBtn = document.querySelector(".menu-lateral-cerrar") as HTMLButtonElement | null;
      const overlay = document.querySelector("#overlay-menu") as HTMLElement | null;

      if (!toggleBtn || !menuLateral || !cerrarBtn || !overlay) return;

      function abrirMenu(): void {
        menuLateral!.classList.add("abierto");
        overlay!.classList.add("visible");
      }

      function cerrarMenu(): void {
        menuLateral!.classList.remove("abierto");
        overlay!.classList.remove("visible");
      }

      toggleBtn.addEventListener("click", abrirMenu);
      cerrarBtn.addEventListener("click", cerrarMenu);
      overlay.addEventListener("click", cerrarMenu);
    })();
  }, []);

  return (
    <header className="main-header container-fluid">
      <div className="main-header-container wrapper">
        <div className="header-row">
          <div className="header-left">
            <button className="menu-toggle boton-menu" aria-label="Abrir menú">
              <i className="bi bi-list"></i>
            </button>
            <Link to="/" className="logo">
              <img
                src={import.meta.env.BASE_URL + "img/otros/logo.png"}
                alt="Logo Level Up"
              />
            </Link>
          </div>
          <div className="menu-celular">
            <ul className="menu-celular-lista">
              <li className="menu-celular-item">
                <Link
                  to="/login"
                  className="boton-menu border-levelup boton-identificate-celular"
                >
                  <i className="bi bi-person-fill"></i> Ingresar
                </Link>
              </li>
              <li>
                <Link
                  to={"/carrito"}
                  className="boton-menu boton-carrito-header"
                >
                  <i className="bi bi-cart-fill"></i>
                  <span className="contador-carrito">0</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="header-search">
            <form id="form-busqueda" onSubmit={handleSubmit} autoComplete="off">
              <input
                type="search"
                name="q"
                placeholder="Buscar productos..."
                className="input-busqueda"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button
                type="submit"
                className="boton-busqueda"
                aria-label="Buscar"
              >
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          <nav className="header-nav">
            <ul className="menu">
              <li>
                <Link to="/" className="boton-submenu">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/producto" className="boton-submenu">
                  Productos
                </Link>
              </li>

              <li className="tiene-submenu">
                <button className="boton-submenu">
                  Comunidad <i className="bi bi-caret-down-fill"></i>
                </button>
                <ul className="despliegue-submenu">
                  <li>
                    <Link to="/gaming-hub">Blogs</Link> //cambie el nombre na mas
                  </li>
                  <li>
                    <Link to="/eventos">Eventos</Link>
                  </li>
                </ul>
              </li>

              <li className="tiene-submenu">
                <button className="boton-submenu">
                  Nosotros <i className="bi bi-caret-down-fill"></i>
                </button>
                <ul className="despliegue-submenu">
                  <li>
                    <Link to="/nosotros">Nuestra empresa</Link>
                  </li>
                  <li>
                    <Link to="/contacto">Contáctanos</Link>
                  </li>
                  <li>
                    <a 
                      href="https://wa.me/56912345678?text=¡Hola!%20Necesito%20soporte%20técnico%20para%20un%20producto%20gaming%20de%20Level-Up.%20¿Podrían%20ayudarme%20con%20la%20solución%20del%20problema?"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔧 Contacto Soporte
                    </a> // el wazaaaaAAaAaA!!!1
                  </li>
                </ul>
              </li>

              <li className="tiene-submenu">
                <button className="boton-submenu boton-identificate">
                  <i className="bi bi-person-fill"></i>
                  <span className="detalles-identificate">
                    <span>Ingresar</span>
                    <span>Tu cuenta</span>
                  </span>
                  <i className="bi bi-caret-down-fill"></i>
                </button>
                <ul className="despliegue-submenu">
                  <li>
                    <Link to="/login">Iniciar sesión</Link>
                  </li>
                  <li>
                    <Link to="/register">Registrarse</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  to={"/carrito"}
                  className="boton-menu boton-carrito-header"
                >
                  <i className="bi bi-cart-fill"></i>
                  <span className="contador-carrito">0</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <aside id="menu-lateral" className="menu-lateral">
        <header>
          <div className="menu-lateral-header">
            <h2>Menú LevelUp</h2>
            <button
              className="menu-lateral-cerrar boton-menu"
              aria-label="Cerrar menú"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </header>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/producto">Productos</Link>
          </li>
          <li>
            <Link to="/gaming-hub">Blogs</Link>
          </li>
          <li>
            <Link to="/eventos">Eventos</Link>
          </li>
          <li>
            <Link to="/nosotros">Nuestra empresa</Link>
          </li>
          <li>
            <Link to="/contacto">Contáctanos</Link>
          </li>
          <li>
            <a 
              href="https://wa.me/56912345678?text=¡Hola!%20Necesito%20soporte%20técnico%20para%20un%20producto%20gaming%20de%20Level-Up.%20¿Podrían%20ayudarme%20con%20la%20solución%20del%20problema?"
              target="_blank"
              rel="noopener noreferrer"
            >
              🎧 Soporte
            </a>
          </li>
        </ul>
      </aside>

      <div id="overlay-menu" className="overlay-menu"></div>
    </header>
  );
}
