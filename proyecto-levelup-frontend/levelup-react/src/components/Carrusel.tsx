import { useState, useEffect } from "react";

interface ImagenCarrusel {
  id: string;
  url: string;
  nombre: string;
  descripcion: string;
}

export default function Carrusel(): React.JSX.Element {
  const [imagenes, setImagenes] = useState<ImagenCarrusel[]>([]);
  const [actual, setActual] = useState<number>(0);

  // Cargar imágenes del carrusel desde el backend
  useEffect(() => {
    const base =
      ((import.meta as any).env?.VITE_IMAGE_BASE_URL as string | undefined)?.replace(/\/$/, "") || "";
    const resolveImg = (path: string) => {
      const clean = path.replace(/^\/+/, "").replace(/^img\//, "");
      return base ? `${base}/${clean}` : `/img/${clean}`;
    };
    setImagenes([
      {
        id: "1",
        url: resolveImg("/img/carrusel.png"),
        nombre: "!Bienvenido a Level-Up Gamer!",
        descripcion: "La tienda gamer lider en todo Chile",
      },
      {
        id: "2",
        url: resolveImg("/img/play5white.png"),
        nombre: "!Explora nuestros productos gamer de alta calidad!",
        descripcion: "Tenemos una gama alta de productos para ti y tu amor por el gaming",
      },
      {
        id: "3",
        url: resolveImg("/img/monitorasus.png"),
        nombre: "!Lee desde noticias a guias del mundo gaming!",
        descripcion: "Con nuestros blogs estaras atento a todo",
      },
    ]);
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

          {imagenes.length > 0 && (
            <div id="texto-carrusel" className="texto-carrusel">
              <h3>{imagenes[actual]?.nombre || ""}</h3>
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
