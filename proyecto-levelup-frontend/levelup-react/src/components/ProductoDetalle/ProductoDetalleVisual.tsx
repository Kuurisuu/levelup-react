import React, { useState, useEffect, useRef } from "react"; //importamos los hooks de react para el estado, efecto y refs
import { Producto } from "../../data/catalogo"; 


//ESTE COMPONENTE ES UN SUFRIMIENTO SOLO OCUPALO PARA REUTILIZARLO YA QUE TRATAR DE ENTENDERLO ES COMO
// LOCURA MAXIMA 
interface ProductoDetalleVisualProps {
  galeriaImgs: string[];
  mainImg: string;
  setMainImg: (img: string) => void;
  producto: Producto;
}

//se agrega el estado del zoom a nivel de szoom
const ProductoDetalleVisual: React.FC<ProductoDetalleVisualProps> = ({
  galeriaImgs,
  mainImg,
  setMainImg,
  producto,
}): React.JSX.Element => { //aca decimos que es un componente de react y que recibe las props del componente padre
  const [isZoomed, setIsZoomed] = useState(false); //estado para saber si el zoom esta activo
  const [isMoving, setIsMoving] = useState(false); //estado para saber si el movimiento esta activo
  const [isMouseOver, setIsMouseOver] = useState(false); //estado para saber si el mouse esta sobre el contenedor
  const [zoomLevel, setZoomLevel] = useState(1); //estado para saber el nivel de zoom
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 }); //estado para saber la posicion del zoom

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => { //aca decimos que es una funcion que se ejecuta cuando el mouse se mueve sobre el contenedor
    if (!isZoomed || !isMoving) return; //si el zoom no esta activo o el movimiento no esta activo, se retorna
    
    const rect = e.currentTarget.getBoundingClientRect(); //se obtiene el rectangulo del contenedor
    const x = ((e.clientX - rect.left) / rect.width) * 100; //se calcula la posicion x del zoom
    const y = ((e.clientY - rect.top) / rect.height) * 100; //se calcula la posicion y del zoom
    setZoomPosition({ x, y }); //se setea la posicion del zoom
  };

  // Usamos un ref al contenedor para añadir un listener nativo con { passive: false }
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Ref para leer el estado actual de isZoomed dentro del listener sin re-suscribirlo
  const isZoomedRef = useRef(isZoomed);
  useEffect(() => { isZoomedRef.current = isZoomed; }, [isZoomed]);

  // Añadir listener wheel nativo una vez, permitiendo preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wheelListener = (evt: WheelEvent) => {
      // prevenir scroll del documento cuando estemos sobre el contenedor
      evt.preventDefault();
      evt.stopPropagation();

      if (!isZoomedRef.current) {
        setIsZoomed(true);
        setIsMoving(false);
        setZoomLevel(1.2);
        return;
      }

      const delta = evt.deltaY > 0 ? -0.2 : 0.2;
      setZoomLevel(prev => {
        const newLevel = Math.max(1, Math.min(3, prev + delta));
        if (newLevel <= 1) {
          // cerrar zoom si llega a 1x
          setIsZoomed(false);
          setIsMoving(false);
        }
        return newLevel;
      });
    };

    el.addEventListener('wheel', wheelListener, { passive: false });
    return () => el.removeEventListener('wheel', wheelListener as EventListener);
  }, []);

  const toggleZoom = () => {
    if (!isZoomed) {
      // Activar zoom por primera vez
      setIsZoomed(true); //se activa el zoom
      setIsMoving(true); //se activa el movimiento
      setZoomLevel(1.5); //se setea el nivel de zoom inicial
    } else if (isMoving) {
      // Pausar movimiento (mantener zoom pero fijo)
      setIsMoving(false); //se pausa el movimiento
    } else {
      // Reanudar movimiento
      setIsMoving(true); //se reanuda el movimiento
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3)); //se calcula el nuevo nivel de zoom
    // Si no está en modo zoom, activarlo
    if (!isZoomed) {
      setIsZoomed(true); //se activa el zoom
      setIsMoving(false); // Fijo para hacer zoom
    }
  };

  const handleZoomOut = () => { 
    setZoomLevel(prev => { //se calcula el nuevo nivel de zoom
      const newLevel = Math.max(prev - 0.5, 1); //se calcula el nuevo nivel de zoom si es menor a 1, se desactiva el zoom
      if (newLevel <= 1) { //si el nuevo nivel de zoom es menor a 1, se desactiva el zoom
        setIsZoomed(false); //se desactiva el zoom
        setIsMoving(false); //se pausa el movimiento
      }
      return newLevel; //se retorna el nuevo nivel de zoom
    });
  };

  const closeZoom = () => { //se desactiva el zoom
    setIsZoomed(false); //se desactiva el zoom
    setIsMoving(false); //se pausa el movimiento
    setZoomLevel(1); //se setea el nivel de zoom inicial
  };

  const handleMouseEnter = () => { //se activa el mouse sobre el contenedor
    setIsMouseOver(true); //se activa el mouse sobre el contenedor
  };

  const handleMouseLeave = () => { //se desactiva el mouse sobre el contenedor
    setIsMouseOver(false); //se desactiva el mouse sobre el contenedor
    // Si está en zoom, cerrarlo cuando el mouse sale
    if (isZoomed) {
      closeZoom(); //se desactiva el zoom
    }
  };

  // Cerrar zoom con tecla Escape
  useEffect(() => { //se ejecuta cuando el zoom esta activo
    const handleKeyDown = (e: KeyboardEvent) => { //se ejecuta cuando se presiona una tecla
      if (e.key === 'Escape' && isZoomed) { //si la tecla es Escape y el zoom esta activo, se desactiva el zoom
        closeZoom(); //se desactiva el zoom
      }
    };

    if (isZoomed) { //si el zoom esta activo, se agrega el evento de tecla presionada
      document.addEventListener('keydown', handleKeyDown); //se agrega el evento de tecla presionada
    }

    return () => { //se elimina el evento de tecla presionada
      document.removeEventListener('keydown', handleKeyDown); 
    };
  }, [isZoomed]);

  // Prevenir scroll de la página solo cuando está en zoom
  useEffect(() => {
    if (isMouseOver) { //si el mouse esta sobre el contenedor, se oculta el scroll de la pagina
      document.body.style.overflow = 'hidden'; //se oculta el scroll de la pagina
    } else {
      document.body.style.overflow = 'unset'; //se muestra el scroll de la pagina
    }

    return () => { //se elimina el evento de mouse sobre el contenedor
      document.body.style.overflow = 'unset'; //se muestra el scroll de la pagina
    };
  }, [isMouseOver]); //se ejecuta cuando el mouse esta sobre el contenedor

  // Mostrar todas las imágenes disponibles (sin límite artificial)
  const imagenesLimitadas = galeriaImgs; //se setea el array de imagenes
  
  // Encontrar el índice de la imagen actual
  const imagenActualIndex = imagenesLimitadas.findIndex(img => img === mainImg); //se encuentra el indice de la imagen actual
  const imagenActual = imagenActualIndex + 1; // +1 para mostrar desde 1, no desde 0
  const totalImagenes = imagenesLimitadas.length; //se cuenta el numero de imagenes

  return (
    <div className="producto-detalle-visual">
      {/* Miniaturas (máximo 4) - siempre visibles si hay imágenes */}
      {imagenesLimitadas.length > 0 && ( //si el numero de imagenes es mayor a 0, se muestra el contenedor de las imagenes
        <div className="producto-detalle-img-container">
          <ul className="producto-detalle-img-list">
            {imagenesLimitadas.map((img, i) => ( //se mapean las imagenes
              <li
                className={`producto-detalle-img-item${
                  mainImg === img ? " active" : ""
                }`}
                key={i}
                onClick={() => setMainImg(img)}
              >
                {(() => {
                  const raw = img || (producto as any).imagenUrl || (producto as any).imagen || "";
                  let resolved: string | null = null;
                  
                  if (raw && typeof raw === "string") {
                    // Si es URL completa (S3 o HTTP), usarla directamente
                    if (raw.startsWith("http://") || raw.startsWith("https://")) {
                      resolved = raw;
                    } 
                    // Si es Base64 (data:image), usarlo directamente
                    else if (raw.startsWith("data:image")) {
                      resolved = raw;
                    } 
                    // Si es ruta local, construir URL completa (fallback para compatibilidad)
                    else {
                      const base = (import.meta as any).env?.VITE_IMAGE_BASE_URL || "http://localhost:8003/img";
                      if (raw.startsWith("./")) {
                        resolved = import.meta.env.BASE_URL + raw.replace(/^\.\//, "");
                      } else if (raw.startsWith("/img") || raw.startsWith("img")) {
                        const clean = raw.replace(/^\./, "");
                        resolved = base.replace(/\/$/, "") + (clean.startsWith("/") ? "" : "/") + clean.replace(/^\//, "");
                      } else {
                        resolved = base.replace(/\/$/, "") + "/" + raw;
                      }
                    }
                  }
                  
                  return (
                    resolved ? (
                      <img className="producto-detalle-img" src={resolved} alt={producto.nombre + " miniatura " + (i + 1)} />
                    ) : (
                      <div className="producto-detalle-img-placeholder">
                        <span>{i + 1}</span>
                      </div>
                    )
                  );
                })()}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Imagen principal con zoom */}
      <div 
        ref={containerRef}
        className={`producto-detalle-main-img-container ${isZoomed ? 'zoomed' : ''}`}
        onClick={toggleZoom}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {(() => {
          const rawMain = mainImg || (producto as any).imagenUrl || (producto as any).imagen || "";
          let resolved: string | null = null;
          
          if (rawMain && typeof rawMain === "string") {
            // Si es URL completa (S3 o HTTP), usarla directamente
            if (rawMain.startsWith("http://") || rawMain.startsWith("https://")) {
              resolved = rawMain;
            } 
            // Si es Base64 (data:image), usarlo directamente
            else if (rawMain.startsWith("data:image")) {
              resolved = rawMain;
            } 
            // Si es ruta local, construir URL completa (fallback para compatibilidad)
            else {
              const base = (import.meta as any).env?.VITE_IMAGE_BASE_URL || "http://localhost:8003/img";
              if (rawMain.startsWith("./")) {
                resolved = import.meta.env.BASE_URL + rawMain.replace(/^\.\//, "");
              } else if (rawMain.startsWith("/img") || rawMain.startsWith("img")) {
              const clean = rawMain.replace(/^\./, "");
              resolved = base.replace(/\/$/, "") + (clean.startsWith("/") ? "" : "/") + clean.replace(/^\//, "");
            } else {
              resolved = base.replace(/\/$/, "") + "/" + rawMain;
            }
          }
          return (
            resolved ? (
              <img
                className="producto-detalle-main-img"
                src={resolved}
                alt={producto.nombre}
                style={{
                  transform: isZoomed
                    ? `scale(${zoomLevel}) translate(${-zoomPosition.x + 50}%, ${-zoomPosition.y + 50}%)`
                    : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transition: isZoomed ? 'none' : 'transform 0.3s ease',
                  cursor: isZoomed ? (isMoving ? 'move' : 'zoom-in') : 'zoom-in'
                }}
              />
            ) : (
              <div className="producto-detalle-main-img-placeholder">
                <span>Sin imagen</span>
              </div>
            )
          );
        })()}

        {/* Controles de zoom */}
        {isZoomed && ( //si el zoom esta activo, se muestra el contenedor de los controles de zoom
          <div className="zoom-controls">
            <button 
              className="zoom-btn zoom-in-btn"
              onClick={(e) => { //se ejecuta cuando se hace click en el boton de zoom in
                e.stopPropagation(); //se evita que el scroll se propague a otros elementos
                handleZoomIn();
              }}
            >
              <i className="bi bi-plus"></i>
            </button>
            <button 
              className="zoom-btn zoom-out-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
            >
              <i className="bi bi-dash"></i>
            </button>
            <button 
              className="zoom-btn zoom-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                closeZoom();
              }}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        )}
        
        {/* Indicador de estado del zoom */}
        {isZoomed && (
          <div className="zoom-status"> 
            <div className="zoom-status-text">
              {isMoving ? 'Moviendo' : 'Fijo'} - {zoomLevel.toFixed(1)}x 
            </div>
            <div className="zoom-scroll-hint">
              <i className="bi bi-mouse"></i> Scroll para zoom 
            </div>
          </div>
        )}
        
        {/* Indicador de scroll bloqueado */}
        {isMouseOver && !isZoomed && (
          <div className="scroll-blocked-indicator">
            <i className="bi bi-lock"></i> Scroll bloqueado
          </div>
        )}
        
        {/* Indicador de zoom cuando no está activo */}
        {!isZoomed && (
          <div className="zoom-indicator">
            <i className="bi bi-zoom-in"></i>
          </div>
        )}
        
        {/* Contador de imágenes */}
        {imagenesLimitadas.length > 1 && (
          <div className="image-counter">
            {imagenActual}/{totalImagenes}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductoDetalleVisual;
