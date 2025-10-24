import React, { useState, useEffect } from "react"; //importamos los hooks de react para el estado y el efecto
import { Producto } from "../../data/catalogo"; 


//ESTE COMPONENTE ES UN SUFRIMIENTO SOLO OCUPALO PARA REUTILIZARLO YA QUE TRATAR DE ENTENDERLO ES COMO
// LOCURA MAXIMA 
interface ProductoDetalleVisualProps {
  galeriaImgs: string[];
  mainImg: string;
  setMainImg: (img: string) => void;
  producto: Producto;
}

//al final tODO ESTO ES PARA EL ZOOM DE LA IMAGEN PRINCIPAL DEL PRODUCTO
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

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => { //se ejecuta cuando el mouse se desplaza sobre la imagen
    // Siempre prevenir el scroll de la página cuando el mouse está  sobre la imagen
    e.preventDefault(); 
    e.stopPropagation(); //se evita que el scroll se propague a otros elementos
     
    // Si no está en zoom, activarlo con el scroll
    if (!isZoomed) {
      setIsZoomed(true); //se activa el zoom
      setIsMoving(false); // Fijo para hacer zoom inicial
      setZoomLevel(1.2); // Zoom inicial suave
      return; //se retorna para que no se ejecute el codigo de abajo
    }
    
    const delta = e.deltaY > 0 ? -0.2 : 0.2; //se calcula el delta q es el cambio de zoom
    const newZoomLevel = Math.max(1, Math.min(3, zoomLevel + delta)); //se calcula el nuevo nivel de zoom
    
    setZoomLevel(newZoomLevel); //se setea el nuevo nivel de zoom
    
    // Si llega a 1x, cerrar zoom
    if (newZoomLevel <= 1) {
      closeZoom();
    }
  };

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
                <img
                  className="producto-detalle-img"
                  src={
                    img.startsWith("./")
                      ? import.meta.env.BASE_URL + img.replace(/^\.\//, "")
                      : img
                  }
                  alt={producto.nombre + " miniatura " + (i + 1)} //se agrega el nombre de la imagen y el numero de la imagen
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Imagen principal con zoom */}
      <div 
        className={`producto-detalle-main-img-container ${isZoomed ? 'zoomed' : ''}`}
        onClick={toggleZoom}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        <img
          className="producto-detalle-main-img"
          src={
            mainImg && mainImg.startsWith("./")
              ? import.meta.env.BASE_URL + mainImg.replace(/^\.\//, "")
              : mainImg ||
                (producto.imagenUrl &&
                  (producto.imagenUrl.startsWith("./") //si la imagen comienza con "./", se agrega el url base
                    ? import.meta.env.BASE_URL +
                      producto.imagenUrl.replace(/^\.\//, "") //se reemplaza el "./" por el url base
                    : producto.imagenUrl)) 
          }
          alt={producto.nombre} //se agrega el nombre de la imagen
          style={{ //se agrega el estilo de la imagen
            transform: isZoomed //si el zoom esta activo, se escala la imagen
              ? `scale(${zoomLevel}) translate(${-zoomPosition.x + 50}%, ${-zoomPosition.y + 50}%)` //se escala la imagen a la posicion x y y
              : 'scale(1)',
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`, //se setea la posicion de la imagen
            transition: isZoomed ? 'none' : 'transform 0.3s ease', //se setea la transicion de la imagen
            cursor: isZoomed //si el zoom esta activo, se cambia el cursor
              ? (isMoving ? 'move' : 'zoom-in') //si el movimiento esta activo, se cambia el cursor a move, si no, se cambia el cursor a zoom-in
              : 'zoom-in' //si el zoom no esta activo, se cambia el cursor a zoom-in
          }}
        />

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
              {isMoving ? 'Moviendo' : 'Fijo'} - {zoomLevel.toFixed(1)}x //se agrega el estado del zoom y el nivel de zoom
            </div>
            <div className="zoom-scroll-hint">
              <i className="bi bi-mouse"></i> Scroll para zoom //se agrega el icono de mouse y el texto de scroll para zoom
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
