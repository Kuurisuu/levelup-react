import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/eventos.css";

// configurar iconos de leaflet para react
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// tipos para TypeScript
type Evento = {
  id: number;
  nombre: string;
  direccion: string;
  lugar: string;
  fecha: string;
  puntos: number;
  position: { lat: number; lng: number };
};

type User = {
  id: string;
  points?: number;
  redeemedCodes?: string[];
};

type UserSession = {
  userId: string;
};

const Eventos = () => {
  // estado para los eventos y mapa
  const [eventoSeleccionado, setEventoSeleccionado] = useState<number | null>(
    null
  );
  const [puntosUsuario, setPuntosUsuario] = useState(0);
  const [codigoInput, setCodigoInput] = useState("");
  const [mensajeCodigo, setMensajeCodigo] = useState("");

  // referencia para el mapa
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // datos exactos del html original
  const eventosLevelUp: Evento[] = [
    {
      id: 0,
      nombre: "Santiago Gaming Fest",
      direccion: "Av. Presidente Balmaceda 850, Santiago",
      lugar: "Centro Cultural Estación Mapocho",
      fecha: "12 Jul 2025 — 11:00",
      puntos: 100,
      position: { lat: -33.4346, lng: -70.6514 },
    },
    {
      id: 1,
      nombre: "Viña eSports Meetup",
      direccion: "Quinta Vergara, Viña del Mar",
      lugar: "Quinta Vergara",
      fecha: "26 Jul 2025 — 16:00",
      puntos: 80,
      position: { lat: -33.0253, lng: -71.543 },
    },
    {
      id: 2,
      nombre: "Concepción Retro Game Day",
      direccion: "Plaza de la Independencia, Concepción",
      lugar: "Plaza de la Independencia",
      fecha: "09 Ago 2025 — 12:00",
      puntos: 70,
      position: { lat: -36.8269, lng: -73.0498 },
    },
    {
      id: 3,
      nombre: "La Serena LAN Party",
      direccion: "Mall Plaza La Serena, La Serena",
      lugar: "Mall Plaza La Serena",
      fecha: "23 Ago 2025 — 14:00",
      puntos: 60,
      position: { lat: -29.9045, lng: -71.2506 },
    },
    {
      id: 4,
      nombre: "Antofagasta Arena Gaming",
      direccion: "Plaza Colón, Antofagasta",
      lugar: "Plaza Colón",
      fecha: "06 Sep 2025 — 15:00",
      puntos: 80,
      position: { lat: -23.6509, lng: -70.4005 },
    },
    {
      id: 5,
      nombre: "Temuco Indie Dev Showcase",
      direccion: "Plaza Aníbal Pinto, Temuco",
      lugar: "Plaza Aníbal Pinto",
      fecha: "20 Sep 2025 — 10:00",
      puntos: 60,
      position: { lat: -38.7359, lng: -72.5904 },
    },
    {
      id: 6,
      nombre: "Puerto Montt Game Night",
      direccion: "Arena Puerto Montt, Puerto Montt",
      lugar: "Arena Puerto Montt",
      fecha: "04 Oct 2025 — 18:00",
      puntos: 90,
      position: { lat: -41.4723, lng: -72.9369 },
    },
  ];

  // punto de referencia para abrir popup al cargar
  const referenciaLevelUp = {
    position: { lat: -33.4346, lng: -70.6514 },
    titulo: "Punto de referencia",
    popupHtml: "<b>Punto de referencia</b><br>Estación Mapocho, Santiago",
  };

  // codigos validos de ejemplo
  const codigosValidos: { [key: string]: number } = {
    "LVUP-SANTIAGO-100": 100,
    "LVUP-VINA-80": 80,
    "LVUP-CONCE-70": 70,
    "LVUP-SERENA-60": 60,
    "LVUP-ANTOF-80": 80,
    "LVUP-TEMUCO-60": 60,
    "LVUP-PMONT-90": 90,
  };

  // funciones de sesion de usuario
  const getUserSession = (): UserSession | null => {
    try {
      const raw = localStorage.getItem("lvup_user_session");
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  };

  const readUsers = (): User[] => {
    try {
      const item = localStorage.getItem("lvup_users");
      return item ? JSON.parse(item) : [];
    } catch (_) {
      return [];
    }
  };

  const writeUsers = (users: User[]): void => {
    localStorage.setItem("lvup_users", JSON.stringify(users));
  };

  const getCurrentUser = (): User | null => {
    const session = getUserSession();
    if (!session || !session.userId) return null;
    const users = readUsers();
    return users.find((u: User) => u.id === session.userId) || null;
  };

  const setCurrentUser = (updatedUser: User): void => {
    const users = readUsers();
    const idx = users.findIndex((u: User) => u.id === updatedUser.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      writeUsers(users);
    }
  };

  // actualizar puntos del usuario
  const refreshPuntos = () => {
    const u = getCurrentUser();
    const pts = u ? u.points || 0 : 0;
    console.log('Refreshing puntos. Usuario:', u, 'Puntos:', pts);
    setPuntosUsuario(pts);
  };

  // inicializar mapa leaflet
  const initLeaflet = () => {
    if (mapInstanceRef.current || !mapRef.current) return;

    try {
      // crear mapa leaflet centrado en chile
      const map = L.map(mapRef.current, { zoomControl: true }).setView(
        [-35.6751, -71.543],
        5
      );

      // capa base de openstreetmap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      mapInstanceRef.current = map;
      markersRef.current = [];

      // dibujar marcadores para cada evento
      eventosLevelUp.forEach((evento, index) => {
        const marker = L.marker([
          evento.position.lat,
          evento.position.lng,
        ]).addTo(map);

        marker.on("click", () => {
          abrirInfoLeaflet(index, marker);
          resaltarItemLista(index);
        });

        markersRef.current.push(marker);
      });

      // marcador de referencia
      const ref = L.marker([
        referenciaLevelUp.position.lat,
        referenciaLevelUp.position.lng,
      ]).addTo(map);
      ref.bindPopup(referenciaLevelUp.popupHtml).openPopup();
      map.setView(
        [referenciaLevelUp.position.lat, referenciaLevelUp.position.lng],
        15
      );
    } catch (error) {
      console.error("error inicializando mapa:", error);
    }
  };

  // abrir popup en leaflet
  const abrirInfoLeaflet = (index: number, marker: L.Marker) => {
    const e = eventosLevelUp[index];
    const contenido = `
      <div style="min-width:240px;color:#000;">
        <h3 style="margin:0 0 4px 0;font-family:Orbitron,sans-serif;color:#1e90ff;">${e.nombre}</h3>
        <p style="margin:0;color:#333;">${e.lugar}</p>
        <p style="margin:0;color:#333;">${e.direccion}</p>
        <p style="margin:6px 0 0 0;color:#333;">${e.fecha}</p>
        <p style="margin:6px 0 0 0;color:#39ff14;font-weight:600;">+${e.puntos} pts LevelUp</p>
      </div>`;
    marker.bindPopup(contenido).openPopup();
  };

  // resaltar item en lista
  const resaltarItemLista = (index: number) => {
    setEventoSeleccionado(index);
  };

  // manejar click en evento de la lista
  const handleEventoClick = (index: number) => {
    const evento = eventosLevelUp[index];
    if (mapInstanceRef.current && markersRef.current[index]) {
      mapInstanceRef.current.setView(
        [evento.position.lat, evento.position.lng],
        12
      );
      abrirInfoLeaflet(index, markersRef.current[index]);
      resaltarItemLista(index);
    }
  };

  // manejar canje de puntos
  const handleCanje = (cost: number, desc: string) => {
    const u = getCurrentUser();
    if (!u) {
      alert("Debes iniciar sesión para canjear puntos.");
      return;
    }

    const pts = u.points || 0;
    if (pts < cost) {
      alert("No tienes puntos suficientes para este canje.");
      return;
    }

    // descontar y guardar
    u.points = pts - cost;
    setCurrentUser(u);
    refreshPuntos();
    alert(`Canje realizado: ${desc}. Puntos descontados: ${cost}.`);
  };

  // manejar canje por codigo
  const handleCanjeCodigo = () => {
    const code = codigoInput.trim().toUpperCase();
    setMensajeCodigo("");

    console.log('Intentando canjear código:', code);

    const u = getCurrentUser();
    if (!u) {
      console.log('No hay usuario logueado');
      setMensajeCodigo("Debes iniciar sesión para canjear un código.");
      return;
    }

    console.log('Usuario actual:', u);

    if (!code) {
      setMensajeCodigo("Ingresa un código válido.");
      return;
    }

    console.log('Códigos válidos disponibles:', codigosValidos);
    const pts = codigosValidos[code];
    console.log('Puntos para código', code, ':', pts);
    
    if (!pts) {
      setMensajeCodigo("Código inválido o expirado.");
      return;
    }

    // evitar canje duplicado
    u.redeemedCodes = Array.isArray(u.redeemedCodes) ? u.redeemedCodes : [];
    console.log('Códigos ya canjeados por el usuario:', u.redeemedCodes);
    
    if (u.redeemedCodes.includes(code)) {
      setMensajeCodigo("Este código ya fue canjeado en tu cuenta.");
      return;
    }

    // actualizar usuario con nuevo código y puntos
    u.redeemedCodes.push(code);
    u.points = (u.points || 0) + pts;
    console.log('Puntos antes del canje:', (u.points || 0) - pts);
    console.log('Puntos después del canje:', u.points);
    
    setCurrentUser(u);
    refreshPuntos();
    setCodigoInput("");
    setMensajeCodigo(`Código canjeado: +${pts} pts`);
  };

  // inicializar cuando se monta el componente
  useEffect(() => {
    refreshPuntos();
    setTimeout(() => {
      initLeaflet();
    }, 100);
  }, []);

  return (
    <div className="wrapper">
      <main>
        <section className="eventos-hero">
          <h1>Eventos Level-Up Gamer</h1>
          <p>
            Participa en actividades gamer a nivel nacional y acumula puntos
            <strong> LevelUp</strong> asistiendo a eventos oficiales.
          </p>
        </section>

        <section className="eventos-layout">
          <aside
            className="eventos-lista"
            id="lista-eventos"
            aria-label="Listado de eventos"
          >
            <h2 style={{ marginBottom: "0.6rem" }}>Próximos eventos</h2>
            {/* la lista se construye tambien en html para accesibilidad */}
            {eventosLevelUp.map((evento, index) => (
              <div
                key={evento.id}
                className={`evento-item ${
                  eventoSeleccionado === index ? "active" : ""
                }`}
                data-index={index}
                onClick={() => handleEventoClick(index)}
              >
                <span className="evento-titulo">{evento.nombre}</span>
                <span className="evento-detalle">{evento.lugar}</span>
                <span className="evento-detalle">{evento.direccion}</span>
                <span className="evento-detalle">Fecha: {evento.fecha}</span>
                <span className="evento-puntos">
                  Gana {evento.puntos} puntos LevelUp
                </span>
              </div>
            ))}
          </aside>

          <div className="eventos-col-derecha">
            <div className="mapa-container">
              <div
                ref={mapRef}
                id="map"
                role="region"
                aria-label="Mapa de ubicaciones de eventos"
              ></div>
            </div>

            <div
              className="canje-codigo-container"
              aria-label="Canje de código de evento"
            >
              <h3>Canjea tu código de evento</h3>
              <div className="canje-codigo-form">
                <input
                  id="lvup-code-input"
                  type="text"
                  placeholder="Ingresa tu código (ej: LVUP-SANTIAGO-100)"
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value)}
                />
                <button
                  className="boton-menu deco-levelup"
                  id="lvup-code-submit"
                  onClick={handleCanjeCodigo}
                >
                  Canjear código
                </button>
              </div>
              <p id="lvup-code-msg">{mensajeCodigo}</p>
            </div>

            <section
              className="canje-levelup"
              aria-label="Canje de puntos LevelUp"
            >
              <div className="container">
                <h2>Canjea tus puntos LevelUp</h2>
                <p>
                  Participa en eventos y gana puntos LevelUp. Canjéalos por
                  descuentos o productos.
                </p>

                <div className="canje-grid">
                  <div
                    className="canje-card"
                    data-cost="200"
                    data-desc="5% de descuento"
                  >
                    <h3>Descuento 5%</h3>
                    <p>Costo: 200 pts</p>
                    <button
                      className="boton-menu deco-levelup btn-canjear"
                      onClick={() => handleCanje(200, "5% de descuento")}
                    >
                      Canjear
                    </button>
                  </div>
                  <div
                    className="canje-card"
                    data-cost="400"
                    data-desc="10% de descuento"
                  >
                    <h3>Descuento 10%</h3>
                    <p>Costo: 400 pts</p>
                    <button
                      className="boton-menu deco-levelup btn-canjear"
                      onClick={() => handleCanje(400, "10% de descuento")}
                    >
                      Canjear
                    </button>
                  </div>
                  <div
                    className="canje-card"
                    data-cost="800"
                    data-desc="15% de descuento"
                  >
                    <h3>Descuento 15%</h3>
                    <p>Costo: 800 pts</p>
                    <button
                      className="boton-menu deco-levelup btn-canjear"
                      onClick={() => handleCanje(800, "15% de descuento")}
                    >
                      Canjear
                    </button>
                  </div>
                  <div
                    className="canje-card"
                    data-cost="1200"
                    data-desc="Gift Card $10.000 CLP"
                  >
                    <h3>Gift Card $10.000</h3>
                    <p>Costo: 1200 pts</p>
                    <button
                      className="boton-menu deco-levelup btn-canjear"
                      onClick={() => handleCanje(1200, "Gift Card $10.000 CLP")}
                    >
                      Canjear
                    </button>
                  </div>
                </div>

                <div>
                  <span id="lvup-puntos-label">
                    Tus puntos: {puntosUsuario}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Eventos;
