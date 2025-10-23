import { useState, useEffect } from "react";

interface ImagenCarrusel {
  url: string;
  nombre: string;
  descripcion: string;
}

export default function Carrusel(): React.JSX.Element {
  const imagenes: ImagenCarrusel[] = [
    {
      url: "/img/carrusel/1.png",
      nombre: "¡Bienvenido a Level-Up Gamer!",
      descripcion: "La tienda gamer lider en todo Chile",
    },
    {
      url: "/img/carrusel/carruselproductos.png",
      nombre: "!Explora nuestros productos gamer de alta calidad!",
      descripcion:
        "Tenemos una gama alta de productos para ti y tu amor por el gaming",
    },
    {
      url: "/img/carrusel/carruselnoticias.png",
      nombre: "¡Lee desde noticias a guias del mundo gaming!",
      descripcion: "Con nuestros blogs estarás atento a todo", //cambie q diga blogs na mas para andar en onda 
    },
  ];

  const [actual, setActual] = useState<number>(0);

  // autoplay
  useEffect(() => {
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
            {imagenes.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.nombre}
                className="img-carrusel"
                loading="lazy"
              />
            ))}
          </div>

          <div id="texto-carrusel" className="texto-carrusel">
            <h3>{imagenes[actual].nombre}</h3>
            <p>{imagenes[actual].descripcion}</p>
          </div>
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
