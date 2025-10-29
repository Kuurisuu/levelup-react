import { useState, useEffect } from "react";
import "../styles/blog.css";

const GamingHub = () => {
  // estado para filtro activo
  const [activeFilter, setActiveFilter] = useState("todas");

  // datos de articulos exactos del html original
  const articlesData = [
    {
      id: 1,
      category: "noticias",
      image: "/img/eventos/maxresdefault.jpg",
      alt: "PlayStation 5 Pro",
      categoryLabel: "Consolas",
      date: "15 Dic 2024",
      author: "Miguel Torres",
      title: "PlayStation 5 Pro: Todo lo que necesitas saber",
      description:
        "Sony anuncia oficialmente la PlayStation 5 Pro con mejoras significativas en rendimiento y gráficos. Descubre todas las características y fecha de lanzamiento.",
      link: "https://www.playstation.com/es-cl/ps5/ps5-pro/",
    },
    {
      id: 2,
      category: "guias",
      image: "/img/eventos/hq720.jpg",
      alt: "Gaming Setup 2025",
      categoryLabel: "Setup Gaming",
      date: "22 Dic 2024",
      author: "Ana López",
      title: "Guía completa para armar tu setup gaming perfecto en 2025",
      description:
        "¿Quieres crear el setup gaming definitivo? Te mostramos los componentes esenciales, periféricos recomendados y tips de configuración para que tengas la mejor experiencia de juego posible. Desde monitores hasta sillas gaming, aquí encontrarás todo lo que necesitas.",
      link: "https://www.youtube.com/watch?v=5neU9AevyTY",
    },
    {
      id: 3,
      category: "comunidad",
      image: "/img/eventos/Elcrecimiento.jpg",
      alt: "Esports Chile",
      categoryLabel: "Esports",
      date: "28 Dic 2024",
      author: "Carlos Mendoza",
      title:
        "El crecimiento de los esports en Chile: Una industria en expansión",
      description:
        "Los deportes electrónicos han experimentado un crecimiento exponencial en Chile durante los últimos años. Desde torneos locales hasta competencias internacionales, el país se posiciona como un referente en la región. Conoce los equipos más destacados y las oportunidades que ofrece esta industria.",
      link: "https://esports.eldesconcierto.cl/", //link de la pagina de esports
    },
    {
      id: 4,
      category: "noticias",
      image: "/img/eventos/Gamingmov.jfif",
      alt: "Gaming Movement",
      categoryLabel: "Industria",
      date: "2 Ene 2025",
      author: "Sofia Ramirez",
      title: "Gaming Movement: La revolución de los videojuegos independientes",
      description:
        "El movimiento de desarrolladores independientes está transformando la industria gaming. Pequeños estudios crean experiencias únicas que compiten con grandes producciones. Descubre los juegos indie más prometedores del año.",
      link: "#",
    },
    {
      id: 5,
      category: "guias",
      image: "/img/eventos/Realidadv.jfif",
      alt: "Realidad Virtual",
      categoryLabel: "VR Gaming",
      date: "8 Ene 2025",
      author: "Diego Silva",
      title: "Realidad Virtual en 2025: Guía para principiantes",
      description:
        "La realidad virtual ha llegado para quedarse. Con nuevos dispositivos más accesibles y una biblioteca de juegos en constante crecimiento, nunca ha sido mejor momento para adentrarse en el mundo VR.",
      link: "#",
    },
    {
      id: 6,
      category: "comunidad",
      image: "/img/eventos/Los juegos más esperados del resto del 2025.jpg",
      alt: "Juegos 2025",
      categoryLabel: "Lanzamientos",
      date: "15 Ene 2025",
      author: "Maria Gonzalez",
      title: "Los juegos más esperados del resto del 2025",
      description:
        "El año gaming está lleno de sorpresas. Desde secuelas muy esperadas hasta nuevas IPs revolucionarias, te mostramos los títulos que marcarán el resto del año.",
      link: "#",
    },
  ];

  // manejar cambio de filtro
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // filtrar articulos segun categoria activa
  const filteredArticles =
    activeFilter === "todas"
      ? articlesData
      : articlesData.filter((article) => article.category === activeFilter);

  return (
    <div className="wrapper">
      <section className="main-content">
        {/* seccion hero */}
        <section className="hero-blogs">
          <div className="container">
            <h1>Blogs</h1> //le cambie el nombre na mas
            <p>Tu portal de noticias y guías de videojuegos</p>
          </div>
        </section>

        {/* lista de blogs */}
        <section className="blogs-container">
          <div className="container">
            <div
              className="blogs-filters"
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                marginBottom: "1.2rem",
              }}
            >
              <button
                className={`boton-menu ${
                  activeFilter === "todas" ? "deco-levelup" : ""
                }`}
                onClick={() => handleFilterChange("todas")}
              >
                Todas
              </button>
              <button
                className={`boton-menu ${
                  activeFilter === "noticias" ? "deco-levelup" : ""
                }`}
                onClick={() => handleFilterChange("noticias")}
              >
                Noticias
              </button>
              <button
                className={`boton-menu ${
                  activeFilter === "guias" ? "deco-levelup" : ""
                }`}
                onClick={() => handleFilterChange("guias")}
              >
                Guías
              </button>
              <button
                className={`boton-menu ${
                  activeFilter === "comunidad" ? "deco-levelup" : ""
                }`}
                onClick={() => handleFilterChange("comunidad")}
              >
                Comunidad
              </button>
            </div>

            <div className="blogs-grid">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="tarjeta-blog"
                  data-cat={article.category}
                >
                  <div className="imagen-blog">
                    <img src={article.image} alt={article.alt} loading="lazy" />
                    {/* etiqueta de categoria del articulo */}
                    <div className="categoria-blog">
                      {article.categoryLabel}
                    </div>
                  </div>
                  <div className="contenido-blog">
                    {/* metadatos del articulo: fecha y autor */}
                    <div className="meta-blog">
                      <span className="fecha-blog">
                        <i className="bi bi-calendar"></i>
                        {article.date}
                      </span>
                      <span className="autor-blog">
                        <i className="bi bi-person"></i>
                        {article.author}
                      </span>
                    </div>
                    {/* titulo principal del articulo */}
                    <h3 className="titulo-blog">{article.title}</h3>
                    {/* extracto/resumen del contenido */}
                    <p className="descripcion-blog">{article.description}</p>
                    {/* enlace para leer el articulo completo */}
                    <a
                      href={article.link}
                      className="btn-leer-mas"
                      target={
                        article.link.startsWith("http") ? "_blank" : "_self"
                      }
                      rel={
                        article.link.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      Leer más
                      <i className="bi bi-arrow-right"></i>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default GamingHub;
