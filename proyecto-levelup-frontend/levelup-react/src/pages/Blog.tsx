import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/blog.css";

type BlogPost = {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  autor: string;
  imagen: string;
  tiempoLectura: string;
  slug: string;
};

const Blog = () => {
  // estado para los blogs
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  // datos de blogs estaticos
  const blogsData = [
    {
      id: 1,
      titulo: "Los juegos más esperados del resto del 2025",
      descripcion:
        "Descubre los títulos que marcarán el final de año en el mundo gaming. Desde secuelas épicas hasta nuevas IPs revolucionarias.",
      categoria: "Noticias",
      fecha: "15 Sep 2025",
      autor: "Level-Up Team",
      imagen: "/img/eventos/Los juegos más esperados del resto del 2025.jpg",
      tiempoLectura: "5 min",
      slug: "juegos-mas-esperados-2025",
    },
    {
      id: 2,
      titulo: "El crecimiento del gaming en Chile",
      descripcion:
        "Análisis completo sobre cómo ha evolucionado la industria gaming en nuestro país y las oportunidades que se avecinan.",
      categoria: "Industria",
      fecha: "12 Sep 2025",
      autor: "Alex Ampuero",
      imagen: "/img/eventos/Elcrecimiento.jpg",
      tiempoLectura: "8 min",
      slug: "crecimiento-gaming-chile",
    },
    {
      id: 3,
      titulo: "Realidad Virtual: El futuro del entretenimiento",
      descripcion:
        "Exploramos las últimas tecnologías VR y cómo están revolucionando la forma en que experimentamos los videojuegos.",
      categoria: "Tecnología",
      fecha: "10 Sep 2025",
      autor: "Christian Mesa",
      imagen: "/img/eventos/Realidadv.jfif",
      tiempoLectura: "6 min",
      slug: "realidad-virtual-futuro",
    },
    {
      id: 4,
      titulo: "Gaming Movement: Comunidades que transforman",
      descripcion:
        "Cómo las comunidades gaming están creando espacios inclusivos y fomentando el crecimiento del ecosistema de videojuegos.",
      categoria: "Comunidad",
      fecha: "08 Sep 2025",
      autor: "Level-Up Team",
      imagen: "/img/eventos/Gamingmov.jfif",
      tiempoLectura: "7 min",
      slug: "gaming-movement-comunidades",
    },
    {
      id: 5,
      titulo: "Guía completa para streamers principiantes",
      descripcion:
        "Todo lo que necesitas saber para comenzar tu carrera como streamer: equipamiento, plataformas, consejos y más.",
      categoria: "Guías",
      fecha: "05 Sep 2025",
      autor: "Ariel Molina",
      imagen: "/img/eventos/maxresdefault.jpg",
      tiempoLectura: "10 min",
      slug: "guia-streamers-principiantes",
    },
    {
      id: 6,
      titulo: "eSports en Chile: Presente y futuro",
      descripcion:
        "Un recorrido por el estado actual de los deportes electrónicos en Chile y las proyecciones para los próximos años.",
      categoria: "eSports",
      fecha: "02 Sep 2025",
      autor: "Level-Up Team",
      imagen: "/img/eventos/hq720.jpg",
      tiempoLectura: "9 min",
      slug: "esports-chile-presente-futuro",
    },
  ];

  // cargar blogs al montar componente
  useEffect(() => {
    setBlogsLoading(true);
    // simular carga de datos
    setTimeout(() => {
      setBlogs(blogsData);
      setBlogsLoading(false);
    }, 1000);
  }, []);

  // obtener color de categoria
  const getCategoriaColor = (categoria: string): string => {
    const colores: { [key: string]: string } = {
      Noticias: "#1e90ff",
      Industria: "#39ff14",
      Tecnología: "#ff6b35",
      Comunidad: "#ff1744",
      Guías: "#9c27b0",
      eSports: "#ffc107",
    };
    return colores[categoria] || "#1e90ff";
  };

  return (
    <div className="wrapper">
      <main>
        {/* seccion hero */}
        <section className="hero-blogs">
          <div className="container">
            <h1>Blog Level-Up Gamer</h1>
            <p>
              Mantente al día con las últimas noticias, análisis y guías del
              mundo gaming. Contenido creado por gamers, para gamers.
            </p>
          </div>
        </section>

        {/* contenedor principal de blogs */}
        <section className="blogs-container">
          <div className="container">
            <div className="cuadricula-blogs">
              {/* grid responsivo para tarjetas de blog */}
              <div className="blogs-grid">
                {blogsLoading
                  ? // loading state
                    Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="tarjeta-blog loading">
                        <div className="imagen-blog">
                          <div className="loading-placeholder"></div>
                        </div>
                        <div className="contenido-blog">
                          <div className="loading-text"></div>
                          <div className="loading-text short"></div>
                          <div className="loading-text"></div>
                        </div>
                      </div>
                    ))
                  : blogs.map((blog) => (
                      <article key={blog.id} className="tarjeta-blog">
                        <div className="imagen-blog">
                          <img src={blog.imagen} alt={blog.titulo} />
                          <span
                            className="categoria-blog"
                            style={{
                              backgroundColor: getCategoriaColor(
                                blog.categoria
                              ),
                            }}
                          >
                            {blog.categoria}
                          </span>
                        </div>
                        <div className="contenido-blog">
                          <div className="meta-blog">
                            <span>
                              <i className="bi bi-calendar3"></i>
                              {blog.fecha}
                            </span>
                            <span>
                              <i className="bi bi-person"></i>
                              {blog.autor}
                            </span>
                            <span>
                              <i className="bi bi-clock"></i>
                              {blog.tiempoLectura}
                            </span>
                          </div>
                          <h2 className="titulo-blog">{blog.titulo}</h2>
                          <p className="descripcion-blog">{blog.descripcion}</p>
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="btn-leer-mas"
                          >
                            Leer más
                            <i className="bi bi-arrow-right"></i>
                          </Link>
                        </div>
                      </article>
                    ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Blog;
