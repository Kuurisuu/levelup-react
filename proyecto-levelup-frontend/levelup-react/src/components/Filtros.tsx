import { useState } from "react";
import { Filtros as FiltrosType } from "../logic/useFiltros";

interface FiltrosProps {
  filtros: FiltrosType;
  setCategoria: (id: string) => void;
  toggleSubcategoria: (id: string) => void;
  actualizar: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  limpiar: () => void;
  asideAbierto: boolean;
  toggleAside: () => void;
}

export default function Filtros({
  filtros,
  setCategoria,
  toggleSubcategoria,
  actualizar,
  limpiar,
  asideAbierto,
  toggleAside,
}: FiltrosProps): React.JSX.Element {
  const [openSubcat, setOpenSubcat] = useState<string>("");
  const handleToggleSubcat = (cat: string): void => {
    setOpenSubcat(openSubcat === cat ? "" : cat);
  };
  // Mapa de subcategorías por categoría para calcular conteos locales
  const categoryMap: Record<string, string[]> = {
    EN: ["JM"],
    CO: ["MA", "HA", "AC"],
    PE: ["MO", "TE", "AU", "MT", "MI", "CW"],
    RO: ["PG", "PR"],
  };

  const countSelected = (cat: string): number => {
    return filtros.subcategorias.reduce((acc, s) => {
      if (s.startsWith("ALL-")) {
        return acc + (s === `ALL-${cat}` ? 1 : 0);
      }
      return acc + (categoryMap[cat]?.includes(s) ? 1 : 0);
    }, 0);
  };
  return (
    <aside
      id="filtros"
      className={`product-aside-filter ${asideAbierto ? "abierto" : ""}`}
      aria-label="Filtros de productos"
    >
      <div className="product-aside-filter-header">
        <h2 className="product-aside-title">Filtrar productos</h2>
        <button
          id="cerrar-filtros"
          className="boton-menu cerrar-filtros"
          onClick={toggleAside}
          aria-label="Cerrar filtros"
          title="Cerrar filtros"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="filter">
        <h3 className="filtros-section-title">
          <i className="bi bi-list-ul"></i> Categoría
        </h3>
        <ul className="menu-categorias">
          <li className="categoria">
            <button
              className={`boton-categoria abrir-subcat ${
                filtros.categoria === "todos" ? "active" : ""
              }`} //agrege el active para que se vea el boton activo
              onClick={() => setCategoria("todos")}
              aria-label="Mostrar todos"
            >
              Todas las categorías
            </button>
          </li>
          <li className={`categoria${openSubcat === "EN" ? " open" : ""}`}>
            <button
              className={`boton-categoria abrir-subcat ${
                openSubcat === "EN" || filtros.categoria === "EN"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                // Solo expandir/colapsar; no disparar el filtro automáticamente al abrir
                handleToggleSubcat("EN");
              }}
              aria-expanded={openSubcat === "EN"}
            >
              <span className="boton-categoria-label">Entretenimiento</span>
              {countSelected("EN") > 0 && (
                <span className="filtro-badge" aria-hidden="true">
                  {countSelected("EN")}
                </span>
              )}
              <i
                className={`bi caret-icon ${
                  openSubcat === "EN"
                    ? "bi-caret-up-fill"
                    : "bi-caret-down-fill"
                }`}
                aria-hidden="true"
              />
            </button>

            <ul
              className={`subcategorias ${openSubcat === "EN" ? "open" : ""}`}
            >
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={filtros.subcategorias.includes("ALL-EN")}
                    onChange={() => toggleSubcategoria("ALL-EN")}
                  />
                  Todos
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={filtros.subcategorias.includes("JM")}
                    onChange={() => toggleSubcategoria("JM")}
                  />
                  Juegos de Mesa
                </label>
              </li>
            </ul>
          </li>
          <li className={`categoria${openSubcat === "CO" ? " open" : ""}`}>
            <button
              className={`boton-categoria abrir-subcat ${
                openSubcat === "CO" || filtros.categoria === "CO"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                // Solo expandir/colapsar; no disparar el filtro automáticamente al abrir
                handleToggleSubcat("CO");
              }}
              aria-expanded={openSubcat === "CO"}
            >
              <span className="boton-categoria-label">Consolas</span>
              {countSelected("CO") > 0 && (
                <span className="filtro-badge" aria-hidden="true">
                  {countSelected("CO")}
                </span>
              )}
              <i
                className={`bi caret-icon ${
                  openSubcat === "CO"
                    ? "bi-caret-up-fill"
                    : "bi-caret-down-fill"
                }`}
                aria-hidden="true"
              />
            </button>

            <ul
              className={`subcategorias ${openSubcat === "CO" ? "open" : ""}`}
            >
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={filtros.subcategorias.includes("ALL-CO")}
                    onChange={() => toggleSubcategoria("ALL-CO")}
                  />
                  Todos
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    className="filtro-subcat"
                    checked={filtros.subcategorias.includes("MA")}
                    onChange={() => toggleSubcategoria("MA")}
                  />
                  Mandos
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    className="filtro-subcat"
                    checked={filtros.subcategorias.includes("HA")}
                    onChange={() => toggleSubcategoria("HA")}
                  />
                  Hardware
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    className="filtro-subcat"
                    checked={filtros.subcategorias.includes("AC")}
                    onChange={() => toggleSubcategoria("AC")}
                  />
                  Accesorios
                </label>
              </li>
            </ul>
          </li>
          <li className={`categoria${openSubcat === "PE" ? " open" : ""}`}>
            <button
              className={`boton-categoria abrir-subcat ${
                openSubcat === "PE" || filtros.categoria === "PE"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                // Solo expandir/colapsar; no disparar el filtro automáticamente al abrir
                handleToggleSubcat("PE");
              }}
              aria-expanded={openSubcat === "PE"}
            >
              <span className="boton-categoria-label">Perifericos</span>
              {countSelected("PE") > 0 && (
                <span className="filtro-badge" aria-hidden="true">
                  {countSelected("PE")}
                </span>
              )}
              <i
                className={`bi caret-icon ${
                  openSubcat === "PE"
                    ? "bi-caret-up-fill"
                    : "bi-caret-down-fill"
                }`}
                aria-hidden="true"
              />
            </button>

            <ul
              className={`subcategorias ${openSubcat === "PE" ? "open" : ""}`}
            >
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={filtros.subcategorias.includes("ALL-PE")}
                    onChange={() => toggleSubcategoria("ALL-PE")}
                  />
                  Todos
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    className="filtro-subcat"
                    checked={filtros.subcategorias.includes("MO")}
                    onChange={() => toggleSubcategoria("MO")}
                  />
                  Mouse
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    className="filtro-subcat"
                    checked={filtros.subcategorias.includes("TE")}
                    onChange={() => toggleSubcategoria("TE")}
                  />
                  Teclado
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    className="filtro-subcat"
                    checked={filtros.subcategorias.includes("AU")}
                    onChange={() => toggleSubcategoria("AU")}
                  />
                  Auriculares
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    className="filtro-subcat"
                    checked={filtros.subcategorias.includes("MT")}
                    onChange={() => toggleSubcategoria("MT")}
                  />
                  Monitores
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    className="filtro-subcat"
                    checked={filtros.subcategorias.includes("MI")}
                    onChange={() => toggleSubcategoria("MI")}
                  />
                  Microfonos
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    className="filtro-subcat"
                    checked={filtros.subcategorias.includes("CW")}
                    onChange={() => toggleSubcategoria("CW")}
                  />
                  Camara web
                </label>
              </li>
            </ul>
          </li>
          <li className={`categoria${openSubcat === "RO" ? " open" : ""}`}>
            <button
              className={`boton-categoria abrir-subcat ${
                openSubcat === "RO" || filtros.categoria === "RO"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                // Solo expandir/colapsar; no disparar el filtro automáticamente al abrir
                handleToggleSubcat("RO");
              }}
              aria-expanded={openSubcat === "RO"}
            >
              <span className="boton-categoria-label">Ropa</span>
              {countSelected("RO") > 0 && (
                <span className="filtro-badge" aria-hidden="true">
                  {countSelected("RO")}
                </span>
              )}
              <i
                className={`bi caret-icon ${
                  openSubcat === "RO"
                    ? "bi-caret-up-fill"
                    : "bi-caret-down-fill"
                }`}
                aria-hidden="true"
              />
            </button>

            <ul
              className={`subcategorias ${openSubcat === "RO" ? "open" : ""}`}
            >
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={filtros.subcategorias.includes("ALL-RO")}
                    onChange={() => toggleSubcategoria("ALL-RO")}
                  />
                  Todos
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    className="filtro-subcat"
                    checked={filtros.subcategorias.includes("PG")}
                    onChange={() => toggleSubcategoria("PG")}
                  />
                  Polerones Gamers Personalizados
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    className="filtro-subcat"
                    checked={filtros.subcategorias.includes("PR")}
                    onChange={() => toggleSubcategoria("PR")}
                  />
                  Poleras Personalizadas
                </label>
              </li>
            </ul>
          </li>
        </ul>

        <h3 className="mt-1 filtros-section-title">
          <i className="bi bi-search"></i> Búsqueda avanzada
        </h3>
        <div className="advanced-filters">
          <div>
            <label htmlFor="texto">Busqueda</label>
            <input
              id="texto"
              type="text"
              className="filtros-input-text"
              value={filtros.texto}
              onChange={actualizar}
              placeholder="Buscar por nombre"
            />
          </div>

          <div className="grupo-precios">
            <div>
              <label htmlFor="precioMin">Precio Min.</label>
              <input
                id="precioMin"
                type="number"
                value={filtros.precioMin}
                onChange={actualizar}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="precioMax">Precio Max.</label>
              <input
                id="precioMax"
                type="number"
                value={filtros.precioMax}
                onChange={actualizar}
                min="0"
              />
            </div>
          </div>

          <div className="grupo-check">
            <label>
              <input
                id="disponible"
                type="checkbox"
                checked={filtros.disponible}
                onChange={actualizar}
              />
              <span>Disponible</span>
            </label>
            <div>
              <label htmlFor="rating">Rating mín.</label>
              <select id="rating" value={filtros.rating} onChange={actualizar}>
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}+
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filtros-orden">
            <label htmlFor="orden">Ordenar por</label>
            <select id="orden" value={filtros.orden} onChange={actualizar}>
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="rating-desc">Rating: mayor a menor</option>
            </select>
          </div>

          <button className="boton-menu filtros-limpiar" onClick={limpiar}>
            <i className="bi bi-eraser"></i>
            Limpiar filtros
          </button>
        </div>
      </div>
    </aside>
  );
}
