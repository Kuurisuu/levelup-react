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

      window.location.href = "/";
    }

    // ====== Setup Auth UI ======
    function setupAuthUI(): void {
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
          // Añadir enlace a Perfil y opción de Cerrar Sesión
          submenu.innerHTML = `
            <li>
              <a href="/profile" class="despliegue-submenu-link">Perfil</a>
            </li>
            <li>
              <button type="button" id="lvup-logout" class="despliegue-submenu-boton">
                Cerrar Sesión
              </button>
            </li>
          `;
          const logoutBtn = submenu.querySelector("#lvup-logout");
          if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

          // Usar navigate para el link de perfil
          const perfilLink = submenu.querySelector(
            ".despliegue-submenu-link"
          ) as HTMLAnchorElement | null;
          if (perfilLink) {
            perfilLink.addEventListener("click", (ev) => {
              ev.preventDefault();
              navigate("/profile");
            });
          }
        }
        // --- Mobile: cambiar boton ingresar a Cerrar Sesión ---
        const botonCelular = document.querySelector(
          ".boton-identificate-celular"
        ) as HTMLAnchorElement | null;
        if (botonCelular) {
          botonCelular.innerHTML = `<i class=\"bi bi-person-fill\"></i> Cerrar Sesión`;
          botonCelular.setAttribute("href", "#");
          botonCelular.setAttribute("id", "lvup-logout-celular");
          botonCelular.addEventListener("click", (ev) => {
            ev.preventDefault();
            handleLogout();
          });
        }

        // --- Menu lateral (mobile): agregar Perfil y Cerrar Sesión ---
        const menuLateralList = document.querySelector(
          "#menu-lateral ul"
        ) as HTMLUListElement | null;
        if (menuLateralList) {
          // evitar duplicados
          if (!menuLateralList.querySelector(".lvup-perfil-link")) {
            const liPerfil = document.createElement("li");
            liPerfil.className = "lvup-perfil-link";
            liPerfil.innerHTML = `<a href=\"/profile\">Perfil</a>`;
            menuLateralList.appendChild(liPerfil);
            const a = liPerfil.querySelector("a");
            if (a) {
              a.addEventListener("click", (ev) => {
                ev.preventDefault();
                navigate("/profile");
                // cerrar menu lateral si está abierto
                const menuLateralEl = document.querySelector("#menu-lateral");
                const overlay = document.querySelector("#overlay-menu");
                menuLateralEl?.classList.remove("abierto");
                overlay?.classList.remove("visible");
              });
            }
          }

          if (!menuLateralList.querySelector(".lvup-logout-link")) {
            const liLogout = document.createElement("li");
            liLogout.className = "lvup-logout-link";
            liLogout.innerHTML = `<button class=\"boton-menu\">Cerrar Sesión</button>`;
            menuLateralList.appendChild(liLogout);
            const btn = liLogout.querySelector("button");
            if (btn) btn.addEventListener("click", () => handleLogout());
          }
        }
      } else {
        // No hay session: asegurarse de que el boton celular muestre Ingresar
        const botonCelular = document.querySelector(
          ".boton-identificate-celular"
        ) as HTMLAnchorElement | null;
        if (botonCelular) {
          botonCelular.innerHTML = `<i class=\"bi bi-person-fill\"></i> Ingresar`;
          botonCelular.setAttribute("href", "/login");
          botonCelular.removeAttribute("id");
        }

        // Asegurar que en el menu lateral existan Iniciar sesión y Registrarse
        const menuLateralList = document.querySelector(
          "#menu-lateral ul"
        ) as HTMLUListElement | null;
        if (menuLateralList) {
          // eliminar perfiles/logout si existen
          const existPerfil =
            menuLateralList.querySelector(".lvup-perfil-link");
          if (existPerfil) existPerfil.remove();
          const existLogout =
            menuLateralList.querySelector(".lvup-logout-link");
          if (existLogout) existLogout.remove();

          // añadir login/register si no existen
          if (!menuLateralList.querySelector(".lvup-login-link")) {
            const liLogin = document.createElement("li");
            liLogin.className = "lvup-login-link";
            liLogin.innerHTML = `<a href=\"/login\">Iniciar sesión</a>`;
            menuLateralList.appendChild(liLogin);
            const a = liLogin.querySelector("a");
            if (a) {
              a.addEventListener("click", (ev) => {
                ev.preventDefault();
                navigate("/login");
                const menuLateralEl = document.querySelector("#menu-lateral");
                const overlay = document.querySelector("#overlay-menu");
                menuLateralEl?.classList.remove("abierto");
                overlay?.classList.remove("visible");
              });
            }
          }

          if (!menuLateralList.querySelector(".lvup-register-link")) {
            const liReg = document.createElement("li");
            liReg.className = "lvup-register-link";
            liReg.innerHTML = `<a href=\"/register\">Registrarse</a>`;
            menuLateralList.appendChild(liReg);
            const a = liReg.querySelector("a");
            if (a) {
              a.addEventListener("click", (ev) => {
                ev.preventDefault();
                navigate("/register");
                const menuLateralEl = document.querySelector("#menu-lateral");
                const overlay = document.querySelector("#overlay-menu");
                menuLateralEl?.classList.remove("abierto");
                overlay?.classList.remove("visible");
              });
            }
          }
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
               class="boton-submenu vendedor-productos-link">
               Gestionar Productos
            </a>`;
          menu.appendChild(li);
        }
      }
    }

    setupAuthUI();

    function onLogout() {
      setupAuthUI();
    }
    function onLogin() {
      setupAuthUI();
    }

    window.addEventListener("lvup:logout", onLogout);
    window.addEventListener("lvup:login", onLogin);

    // ====== Menu Lateral ======
    const toggleBtn = document.querySelector(
      ".menu-toggle"
    ) as HTMLButtonElement | null;
    const menuLateral = document.querySelector(
      "#menu-lateral"
    ) as HTMLElement | null;
    const cerrarBtn = document.querySelector(
      ".menu-lateral-cerrar"
    ) as HTMLButtonElement | null;
    const overlay = document.querySelector(
      "#overlay-menu"
    ) as HTMLElement | null;


    let listenersAdded = false;
    if (toggleBtn && menuLateral && cerrarBtn && overlay) {
      const _abrirMenu = () => {
        menuLateral.classList.add("abierto");
        overlay.classList.add("visible");
      };
      const _cerrarMenu = () => {
        menuLateral.classList.remove("abierto");
        overlay.classList.remove("visible");
      };

      toggleBtn.addEventListener("click", _abrirMenu);
      cerrarBtn.addEventListener("click", _cerrarMenu);
      overlay.addEventListener("click", _cerrarMenu);
      listenersAdded = true;

      const removeMenuListeners = () => {
        toggleBtn.removeEventListener("click", _abrirMenu);
        cerrarBtn.removeEventListener("click", _cerrarMenu);
        overlay.removeEventListener("click", _cerrarMenu);
      };

      (window as any).__lvup_removeMenuListeners = removeMenuListeners;
    }

    return () => {
      window.removeEventListener("lvup:logout", onLogout);
      window.removeEventListener("lvup:login", onLogin);
      try {
        const rem = (window as any).__lvup_removeMenuListeners;
        if (typeof rem === "function") rem();
      } catch {}
    };
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
                    <Link to="/gaming-hub">Blogs</Link>
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
                      Contacto Soporte
                    </a>
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
              Soporte
            </a>
          </li>
        </ul>
      </aside>

      <div id="overlay-menu" className="overlay-menu"></div>
    </header>
  );
}
