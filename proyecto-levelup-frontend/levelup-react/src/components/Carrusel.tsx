import { useState, useEffect } from "react";
import axiosConfig from "../config/axios";

interface ImagenCarrusel {
  id: string;
  url: string;
  nombre: string;
  titulo?: string;
  descripcion: string;
}

export default function Carrusel(): React.JSX.Element {
  const [imagenes, setImagenes] = useState<ImagenCarrusel[]>([]);
  const [actual, setActual] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar imágenes del carrusel desde el backend
  useEffect(() => {
    const cargarCarrusel = async () => {
      try {
        setLoading(true);
        console.log("Carrusel - Iniciando carga desde backend...");
        
        const response = await axiosConfig.get("/productos/carrusel", {
          headers: {
            "X-API-Key": import.meta.env.VITE_API_KEY || "levelup-2024-secret-api-key-change-in-production",
          },
          timeout: 15000, // Aumentar timeout a 15 segundos
        });
        
        console.log("Carrusel - Respuesta recibida:", response);
        console.log("Carrusel - Datos:", response.data);
        
        if (response.data && Array.isArray(response.data)) {
          console.log("Carrusel - Procesando", response.data.length, "imágenes");
          
          const imagenesMapeadas = response.data.map((item: any, index: number) => {
            const imagen = {
              id: item.id?.toString() || String(index + 1),
              url: item.url || "",
              nombre: item.nombre || item.titulo || "",
              titulo: item.titulo || item.nombre || "",
              descripcion: item.descripcion || "",
            };
            
            console.log(`Carrusel - Imagen ${imagen.id} (índice ${index}):`, {
              url: imagen.url,
              nombre: imagen.nombre,
              urlIncorrecta: imagen.url.includes("play5white") || imagen.url.includes("monitorasus")
            });
            
            // Validar y corregir URLs incorrectas
            if (imagen.url.includes("play5white.png")) {
              console.warn("Carrusel - URL incorrecta detectada (play5white), corrigiendo...");
              imagen.url = "https://levelup-gamer-products.s3.us-east-1.amazonaws.com/img/carruselnoticias.png";
            } else if (imagen.url.includes("monitorasus.png")) {
              console.warn("Carrusel - URL incorrecta detectada (monitorasus), corrigiendo...");
              imagen.url = "https://levelup-gamer-products.s3.us-east-1.amazonaws.com/img/carrusel.png";
            } else if (imagen.url.includes("carrusel.png") && index === 0) {
              console.warn("Carrusel - URL incorrecta en posición 0 (carrusel.png), corrigiendo...");
              imagen.url = "https://levelup-gamer-products.s3.us-east-1.amazonaws.com/img/carruselproductos.png";
            }
            
            return imagen;
          });
          
          console.log("Carrusel - Imágenes mapeadas finales:", imagenesMapeadas);
          setImagenes(imagenesMapeadas);
        } else {
          console.warn("Carrusel - Respuesta no es un array:", response.data);
          throw new Error("Respuesta inválida del backend");
        }
      } catch (error: any) {
        console.error("Error al cargar carrusel:", error);
        console.error("Detalles del error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        
        // Fallback a imágenes por defecto si falla la carga
        console.log("Carrusel - Usando imágenes de fallback");
        setImagenes([
          {
            id: "1",
            url: "https://levelup-gamer-products.s3.us-east-1.amazonaws.com/img/carruselproductos.png",
            nombre: "¡Bienvenido a Level-Up Gamer!",
            descripcion: "La tienda gamer lider en todo Chile",
          },
          {
            id: "2",
            url: "https://levelup-gamer-products.s3.us-east-1.amazonaws.com/img/carruselnoticias.png",
            nombre: "¡Explora nuestros productos gamer de alta calidad!",
            descripcion: "Tenemos una gama alta de productos para ti y tu amor por el gaming",
          },
          {
            id: "3",
            url: "https://levelup-gamer-products.s3.us-east-1.amazonaws.com/img/carrusel.png",
            nombre: "¡Lee desde noticias a guias del mundo gaming!",
            descripcion: "Con nuestros blogs estarás atento a todo",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    cargarCarrusel();
  }, []);

  // autoplay
  useEffect(() => {
    if (imagenes.length === 0) return;
    const intervalo = setInterval(() => {
      setActual((prev) => (prev + 1) % imagenes.length);
    }, 4000);

    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  const mostrarImagen = (index: number): void => {
    if (index < 0) {
      setActual(imagenes.length - 1);
    } else if (index >= imagenes.length) {
      setActual(0);
    } else {
      setActual(index);
    }
  };

  return (
    <section className="seccion-carrusel">
      <div className="container-carrusel">
        <div className="atras" onClick={() => mostrarImagen(actual - 1)}>
          <i className="bi bi-arrow-left-short"></i>
        </div>

        <div className="imagenes-carrusel">
          <div
            id="img-carrusel"
            className="img-track"
            style={{
              transform: `translateX(-${actual * 100}%)`, // Mueve el carrusel hacia la imagen actual
            }}
          >
            {imagenes.map((img, i) => {
              // Si es Base64 (data:image), usar directamente; si no, usar URL normal
              const imagenUrl = img.url && img.url.startsWith("data:image") 
                ? img.url 
                : img.url || "";
              return (
                <img
                  key={img.id || i}
                  src={imagenUrl}
                  alt={img.nombre}
                  className="img-carrusel"
                  loading="lazy"
                />
              );
            })}
          </div>

          {imagenes.length > 0 && !loading && (
            <div id="texto-carrusel" className="texto-carrusel">
              <h3>{imagenes[actual]?.nombre || imagenes[actual]?.titulo || ""}</h3>
              <p>{imagenes[actual]?.descripcion || ""}</p>
            </div>
          )}
        </div>

        <div className="adelante" onClick={() => mostrarImagen(actual + 1)}>
          <i className="bi bi-arrow-right-short"></i>
        </div>
      </div>

      <div className="puntos" id="puntos">
        {imagenes.map((_, i) => (
          <p
            key={i}
            className={i === actual ? "bold" : ""}
            onClick={() => mostrarImagen(i)}
          ></p>
        ))}
      </div>
    </section>
  );
}
