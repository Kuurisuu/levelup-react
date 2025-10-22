import { useState } from "react";
import { Filtros as FiltrosType } from "../logic/useFiltros";

interface FiltrosProps {
  filtros: FiltrosType;
  setCategoria: (id: string) => void;
  toggleSubcategoria: (id: string) => void;
  actualizar: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
              className="boton-categoria abrir-subcat"
              onClick={() => setCategoria("todos")}
              aria-label="Mostrar todos"
            >
              Todas las categorías
            </button>
          </li>
          <li className={`categoria${openSubcat === "EN" ? " open" : ""}`}>
            <button
              className="boton-categoria abrir-subcat"
              onClick={() => handleToggleSubcat("EN")}
            >
              Entretenimiento <span>{openSubcat === "EN" ? "▲" : "▼"}</span>
            </button>
            {openSubcat === "EN" && (
              <ul className="subcategorias">
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
            )}
          </li>
          <li className={`categoria${openSubcat === "CO" ? " open" : ""}`}>
            <button
              className="boton-categoria abrir-subcat"
              onClick={() => handleToggleSubcat("CO")}
            >
              Consolas <span>{openSubcat === "CO" ? "▲" : "▼"}</span>
            </button>
            {openSubcat === "CO" && (
              <ul className="subcategorias">
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
            )}
          </li>
          <li className={`categoria${openSubcat === "PE" ? " open" : ""}`}>
            <button
              className="boton-categoria abrir-subcat"
              onClick={() => handleToggleSubcat("PE")}
            >
              Perifericos <span>{openSubcat === "PE" ? "▲" : "▼"}</span>
            </button>
            {openSubcat === "PE" && (
              <ul className="subcategorias">
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
            )}
          </li>
          <li className={`categoria${openSubcat === "RO" ? " open" : ""}`}>
            <button
              className="boton-categoria abrir-subcat"
              onClick={() => handleToggleSubcat("RO")}
            >
              Ropa <span>{openSubcat === "RO" ? "▲" : "▼"}</span>
            </button>
            {openSubcat === "RO" && (
              <ul className="subcategorias">
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
            )}
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
