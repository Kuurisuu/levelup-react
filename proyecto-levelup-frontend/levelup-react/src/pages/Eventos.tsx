import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axiosConfig from "../config/axios";
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
  ciudad?: string;
  imagen?: string;
};

// Formatear fecha para mostrar
const formatearFechaEvento = (fecha: string): string => {
  try {
    const date = new Date(fecha);
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");
    return `${dia} ${mes} ${año} — ${horas}:${minutos}`;
  } catch {
    return fecha;
  }
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
  const [eventosLevelUp, setEventosLevelUp] = useState<Evento[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<number | null>(
    null
  );
  const [puntosUsuario, setPuntosUsuario] = useState(0);
  const [codigoInput, setCodigoInput] = useState("");
  const [mensajeCodigo, setMensajeCodigo] = useState("");
  const [loadingEventos, setLoadingEventos] = useState(true);

  // referencia para el mapa
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Cargar eventos desde el backend
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        setLoadingEventos(true);
        const response = await axiosConfig.get<any[]>('/eventos');
        
        if (response.data && response.data.length > 0) {
          const eventosMapeados: Evento[] = response.data.map((evento: any, index: number) => ({
            id: evento.idEvento || evento.id || index,
            nombre: evento.nombreEvento || evento.nombre || "",
            direccion: evento.ubicacionEvento || evento.direccion || "",
            lugar: evento.ubicacionEvento || evento.lugar || "",
            fecha: formatearFechaEvento(evento.fechaInicio || evento.fecha || new Date().toISOString()),
            puntos: evento.puntosLevelUp || evento.puntos || 0,
            position: {
              lat: evento.coordenadasLatitud || evento.lat || 0,
              lng: evento.coordenadasLongitud || evento.lng || 0,
            },
            ciudad: evento.ciudad || "",
            imagen: evento.imagen || "",
          }));
          setEventosLevelUp(eventosMapeados);
        } else {
          // Fallback estático si no hay datos
          setEventosLevelUp([]);
        }
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        // Fallback estático en caso de error
        setEventosLevelUp([]);
      } finally {
        setLoadingEventos(false);
      }
    };

    cargarEventos();
  }, []);

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
    console.log("Refreshing puntos. Usuario:", u, "Puntos:", pts);
    setPuntosUsuario(pts);
  };

  // inicializar mapa leaflet
  const initLeaflet = () => {
    if (mapInstanceRef.current || !mapRef.current || eventosLevelUp.length === 0) return;

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
        if (evento.position.lat && evento.position.lng) {
          const marker = L.marker([
            evento.position.lat,
            evento.position.lng,
          ]).addTo(map);

          marker.on("click", () => {
            abrirInfoLeaflet(index, marker);
            resaltarItemLista(index);
          });

          markersRef.current.push(marker);
        }
      });

      // Si hay eventos, centrar en el primero
      if (eventosLevelUp.length > 0 && eventosLevelUp[0].position.lat && eventosLevelUp[0].position.lng) {
        map.setView(
          [eventosLevelUp[0].position.lat, eventosLevelUp[0].position.lng],
          12
        );
      }
    } catch (error) {
      console.error("error inicializando mapa:", error);
    }
  };

  // Reinicializar mapa cuando cambien los eventos
  useEffect(() => {
    if (!loadingEventos && eventosLevelUp.length > 0) {
      // Limpiar mapa anterior si existe
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
      
      // Inicializar nuevo mapa
      setTimeout(() => {
        initLeaflet();
      }, 100);
    }
  }, [loadingEventos, eventosLevelUp]);

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

    console.log("Intentando canjear código:", code);

    const u = getCurrentUser();
    if (!u) {
      console.log("No hay usuario logueado");
      setMensajeCodigo("Debes iniciar sesión para canjear un código.");
      return;
    }

    console.log("Usuario actual:", u);

    if (!code) {
      setMensajeCodigo("Ingresa un código válido.");
      return;
    }

    console.log("Códigos válidos disponibles:", codigosValidos);
    const pts = codigosValidos[code];
    console.log("Puntos para código", code, ":", pts);

    if (!pts) {
      setMensajeCodigo("Código inválido o expirado.");
      return;
    }

    // evitar canje duplicado
    u.redeemedCodes = Array.isArray(u.redeemedCodes) ? u.redeemedCodes : [];
    console.log("Códigos ya canjeados por el usuario:", u.redeemedCodes);

    if (u.redeemedCodes.includes(code)) {
      setMensajeCodigo("Este código ya fue canjeado en tu cuenta.");
      return;
    }

    // actualizar usuario con nuevo código y puntos
    u.redeemedCodes.push(code);
    u.points = (u.points || 0) + pts;
    console.log("Puntos antes del canje:", (u.points || 0) - pts);
    console.log("Puntos después del canje:", u.points);

    setCurrentUser(u);
    refreshPuntos();
    setCodigoInput("");
    setMensajeCodigo(`Código canjeado: +${pts} pts`);
  };

  // inicializar cuando se monta el componente
  useEffect(() => {
    refreshPuntos();
  }, []);

  return (
    <div className="wrapper">
      <section>
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
            {loadingEventos ? (
              <div>Cargando eventos...</div>
            ) : eventosLevelUp.length === 0 ? (
              <div>No hay eventos disponibles</div>
            ) : (
              eventosLevelUp.map((evento, index) => (
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
                  {evento.ciudad && (
                    <span className="evento-detalle">Ciudad: {evento.ciudad}</span>
                  )}
                  <span className="evento-detalle">Fecha: {evento.fecha}</span>
                  <span className="evento-puntos">
                    Gana {evento.puntos} puntos LevelUp
                  </span>
                </div>
              ))
            )}
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
      </section>
    </div>
  );
};

export default Eventos;
