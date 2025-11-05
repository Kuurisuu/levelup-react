import { useState, useEffect } from "react";
import axiosConfig from "../config/axios";
import "../styles/blog.css";

type Article = {
  id: number;
  category: string;
  image: string;
  alt: string;
  categoryLabel: string;
  date: string;
  author: string;
  title: string;
  description: string;
  link: string;
};

// Mapear categorías del backend a categorías del frontend
const mapearCategoria = (categoriaBackend: string): { category: string; categoryLabel: string } => {
  const mapa: { [key: string]: { category: string; categoryLabel: string } } = {
    "NOTICIAS": { category: "noticias", categoryLabel: "Noticias" },
    "INDUSTRIA": { category: "noticias", categoryLabel: "Industria" },
    "TECNOLOGIA": { category: "noticias", categoryLabel: "Tecnología" },
    "COMUNIDAD": { category: "comunidad", categoryLabel: "Comunidad" },
    "GUIAS": { category: "guias", categoryLabel: "Guías" },
    "ESPORTS": { category: "comunidad", categoryLabel: "eSports" },
    "LANZAMIENTOS": { category: "noticias", categoryLabel: "Lanzamientos" },
    "REVIEWS": { category: "guias", categoryLabel: "Reviews" },
    "HARDWARE": { category: "guias", categoryLabel: "Hardware" },
    "SOFTWARE": { category: "noticias", categoryLabel: "Software" },
    "STREAMING": { category: "comunidad", categoryLabel: "Streaming" },
    "RETRO": { category: "noticias", categoryLabel: "Retro" },
  };
  return mapa[categoriaBackend] || { category: "noticias", categoryLabel: categoriaBackend };
};

// Formatear fecha
const formatearFecha = (fecha: string): string => {
  try {
    const date = new Date(fecha);
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();
    return `${dia} ${mes} ${año}`;
  } catch {
    return fecha;
  }
};

const GamingHub = () => {
  // estado para filtro activo
  const [activeFilter, setActiveFilter] = useState("todas");
  const [articlesData, setArticlesData] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar artículos desde el backend
  useEffect(() => {
    const cargarArticulos = async () => {
      try {
        setIsLoading(true);
        const response = await axiosConfig.get<any[]>('/contenido/articulos/publicados');
        
        if (response.data && response.data.length > 0) {
          const articulosMapeados: Article[] = response.data.map((articulo: any) => {
            const imagenArticulo = articulo.imagenArticulo || articulo.imagen || "";
            // Verificar si la imagen es Base64 y usarla directamente
            const imagenFinal = imagenArticulo && imagenArticulo.startsWith("data:image")
              ? imagenArticulo
              : imagenArticulo;
            
            const categoriaMapeada = mapearCategoria(articulo.categoriaArticulo || articulo.categoria || "NOTICIAS");
            
            return {
              id: articulo.idArticulo || articulo.id || 0,
              category: categoriaMapeada.category,
              image: imagenFinal,
              alt: articulo.tituloArticulo || articulo.titulo || "Imagen del artículo",
              categoryLabel: categoriaMapeada.categoryLabel,
              date: formatearFecha(articulo.fechaPublicacion || articulo.fecha || new Date().toISOString()),
              author: articulo.autorArticulo || articulo.autor || "Level-Up Team",
              title: articulo.tituloArticulo || articulo.titulo || "",
              description: articulo.resumenArticulo || articulo.descripcion || "",
              link: articulo.enlaceExterno || articulo.link || "#",
            };
          });
          console.log("Artículos cargados:", articulosMapeados.length, "con imágenes Base64:", articulosMapeados.filter(a => a.image && a.image.startsWith("data:image")).length);
          setArticlesData(articulosMapeados);
        } else {
          // Fallback estático si no hay datos
          setArticlesData([]);
        }
      } catch (error) {
        console.error("Error al cargar artículos:", error);
        // En caso de error, mantener array vacío
        setArticlesData([]);
      } finally {
        setIsLoading(false);
      }
    };

    cargarArticulos();
  }, []);

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
            <h1>Blogs</h1>
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

            {isLoading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p>Cargando artículos...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p>No hay artículos disponibles</p>
              </div>
            ) : (
              <div className="blogs-grid">
                {filteredArticles.map((article) => {
                  // Resolver la URL de la imagen - si es Base64, usarla directamente
                  let imagenUrl: string = article.image || "";
                  if (imagenUrl && !imagenUrl.startsWith("data:image") && !imagenUrl.startsWith("http")) {
                    // Si no es Base64 ni URL completa, intentar construir la ruta
                    if (imagenUrl.startsWith("/")) {
                      imagenUrl = imagenUrl;
                    } else {
                      imagenUrl = `/img/eventos/${imagenUrl}`;
                    }
                  }
                  
                  return (
                    <article
                      key={article.id}
                      className="tarjeta-blog"
                      data-cat={article.category}
                    >
                      <div className="imagen-blog">
                        <img 
                          src={imagenUrl} 
                          alt={article.alt} 
                          loading="lazy"
                          onError={(e) => {
                            // Fallback si la imagen no carga
                            (e.target as HTMLImageElement).src = "/img/eventos/maxresdefault.jpg";
                          }}
                        />
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
                );
              })}
            </div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
};

export default GamingHub;
