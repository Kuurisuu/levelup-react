import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosConfig from "../config/axios";
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

// Mapear categorías del backend a categorías del frontend
const mapearCategoria = (categoriaBackend: string): string => {
  const mapa: { [key: string]: string } = {
    "NOTICIAS": "Noticias",
    "INDUSTRIA": "Industria",
    "TECNOLOGIA": "Tecnología",
    "COMUNIDAD": "Comunidad",
    "GUIAS": "Guías",
    "ESPORTS": "eSports",
    "LANZAMIENTOS": "Lanzamientos",
    "REVIEWS": "Reviews",
    "HARDWARE": "Hardware",
    "SOFTWARE": "Software",
    "STREAMING": "Streaming",
    "RETRO": "Retro",
  };
  return mapa[categoriaBackend] || categoriaBackend;
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

// Generar slug desde título
const generarSlug = (titulo: string): string => {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const Blog = () => {
  // Blogs
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  // Cargar blogs desde el backend
  useEffect(() => {
    const cargarBlogs = async () => {
      try {
        setBlogsLoading(true);
        const response = await axiosConfig.get<any[]>('/contenido/articulos/publicados');
        
        if (response.data && response.data.length > 0) {
          const blogsMapeados: BlogPost[] = response.data.map((articulo: any) => {
            const imagenArticulo = articulo.imagenArticulo || articulo.imagen || "";
            // Verificar si la imagen es Base64
            const imagenFinal = imagenArticulo && imagenArticulo.startsWith("data:image")
              ? imagenArticulo
              : imagenArticulo;
            
            return {
              id: articulo.idArticulo || articulo.id || 0,
              titulo: articulo.tituloArticulo || articulo.titulo || "",
              descripcion: articulo.resumenArticulo || articulo.descripcion || "",
              categoria: mapearCategoria(articulo.categoriaArticulo || articulo.categoria || "NOTICIAS"),
              fecha: formatearFecha(articulo.fechaPublicacion || articulo.fecha || new Date().toISOString()),
              autor: articulo.autorArticulo || articulo.autor || "Level-Up Team",
              imagen: imagenFinal,
              tiempoLectura: articulo.tiempoLectura ? `${articulo.tiempoLectura} min` : "5 min",
              slug: generarSlug(articulo.tituloArticulo || articulo.titulo || ""),
            };
          });
          console.log("Blogs cargados:", blogsMapeados.length, "con imágenes:", blogsMapeados.filter(b => b.imagen && b.imagen.startsWith("data:image")).length);
          setBlogs(blogsMapeados);
        } else {
          // Fallback estático si no hay datos
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error al cargar blogs:", error);
        // En caso de error, mantener array vacío o mostrar mensaje
        setBlogs([]);
      } finally {
        setBlogsLoading(false);
      }
    };

    cargarBlogs();
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
      <section>
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
                  : blogs.map((blog) => {
                      // Si es Base64 (data:image), usar directamente; si no, usar URL normal
                      const imagenUrl = blog.imagen && blog.imagen.startsWith("data:image")
                        ? blog.imagen
                        : blog.imagen || "";
                      
                      return (
                        <article key={blog.id} className="tarjeta-blog">
                          <div className="imagen-blog">
                            {imagenUrl && (
                              <img src={imagenUrl} alt={blog.titulo} />
                            )}
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
                      );
                    })}
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Blog;
