import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCarrito,
  agregarAlCarrito,
  actualizarNumerito,
} from "../logic/carrito";
import { setCarritoLS, ProductoEnCarrito } from "../logic/storage";
import ProductoCard from "../components/ProductoCard";
import ProductoDetalleVisual from "../components/ProductoDetalle/ProductoDetalleVisual";
import ProductoDetalleInfo from "../components/ProductoDetalle/ProductoDetalleInfo";
import ProductoDetalleRelacionados from "../components/ProductoDetalle/ProductoDetalleRelacionados";
import ProductoDetalleComentarios from "../components/ProductoDetalle/ProductoDetalleComentarios";
import { Producto, Review, obtenerProductoPorId, obtenerProductos } from "../data/catalogo";
import { ReseniaService } from "../services/api/resenias";
import { calcularRatingPromedio } from "../utils/ratingUtils"; // nuevo import

type ReviewType = {
  id?: number | string; // ID del backend para poder eliminar
  rating: number;
  text: string;
  author: string;
  title: string;
  ts: number;
};

function getFallbackProductId(): string | number | null {
  try {
    const raw = localStorage.getItem("lvup_historial");
    const hist: any[] = raw ? JSON.parse(raw) : [];
    if (hist.length > 0) return hist[hist.length - 1].id;
  } catch {}
  return null;
}

function storageKeyForReviews(id: string | number): string {
  return `lvup_reviews_${id}`;
}

function readReviews(id: string | number): ReviewType[] {
  try {
    const item = localStorage.getItem(storageKeyForReviews(id));
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
}

function writeReviews(id: string | number, list: ReviewType[]): void {
  localStorage.setItem(storageKeyForReviews(id), JSON.stringify(list));
}

function getUserSession() {
  try {
    const raw = localStorage.getItem("lvup_user_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Funciones auxiliares para los nuevos campos
function calcularPrecioConDescuento(
  precio: number,
  descuento?: number
): number | null {
  return descuento ? precio * (1 - descuento / 100.0) : null;
}

// La función calcularRatingPromedio ahora se importa desde utils/ratingUtils
//para asi mantener la logica de rating en un solo lugar
const ProductoDetalle: React.FC = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [producto, setProducto] = useState<Producto | null>(null);
  const [mainImg, setMainImg] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [carrito, setCarrito] = useState<ProductoEnCarrito[]>([]);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewText, setReviewText] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewMsg, setReviewMsg] = useState<string>("");
  const [galeriaImgs, setGaleriaImgs] = useState<string[]>([]);

  // Refs
  const contadorRef = useRef<HTMLSpanElement>(null);
  const notaRatingRef = useRef<HTMLParagraphElement>(null);
  const notaRatingComentariosRef = useRef<HTMLParagraphElement>(null);

  // Cargar producto y galeria
  useEffect(() => {
    if (!paramId) {
      let fallbackId = getFallbackProductId();
      if (fallbackId) {
        navigate(`/producto/${fallbackId}`, { replace: true });
      }
    }
  }, [paramId, navigate]);

  useEffect(() => {
    const load = async () => {
      let prod: Producto | null = null;
      // 1) Intentar API por id
      try {
        if (paramId) {
          const p = await obtenerProductoPorId(paramId);
          prod = p || null;
        }
      } catch (_) {}
      // 2) Fallback: persisted/local
      if (!prod) {
        let mergedProducts: Producto[] = [];
        try {
          const raw = localStorage.getItem("lvup_products");
          const persisted: Producto[] = raw ? JSON.parse(raw) : [];
          if (Array.isArray(persisted) && persisted.length > 0) {
            mergedProducts = persisted;
          } else {
            // Intentar cargar un listado desde API y buscar ahí
            try {
              const apiList = await obtenerProductos();
              mergedProducts = apiList.length > 0 ? apiList : [];
            } catch {}
          }
        } catch {}
        prod = paramId
          ? mergedProducts.find((p) => String(p.id) === String(paramId)) || null
          : null;
      }

      setProducto(prod);
      setCarrito(getCarrito());
      // Cargar reseñas desde el backend
      if (prod) {
        try {
          const response = await ReseniaService.getByProducto(Number(prod.id));
          const reseniasBackend = response.data || [];
          
          // Mapear a formato de Review
          const reviewsBackend: Review[] = reseniasBackend.map((r: any) => ({
            id: r.id?.toString() || "",
            productoId: prod.id.toString(),
            usuarioNombre: r.usuarioNombre || "",
            rating: r.rating || 5,
            comentario: r.comentario || "",
            fecha: r.fechaCreacion || r.fechaActualizacion || new Date().toISOString()
          }));

          // Mapear a ReviewType incluyendo el ID del backend
          const reviewsBackendMapped: ReviewType[] = reseniasBackend.map((r: any) => ({
            id: r.id, // Guardar el ID del backend para poder eliminar
            rating: r.rating || 5,
            text: r.comentario || "",
            author: r.usuarioNombre || "",
            title: "",
            ts: new Date(r.fechaCreacion || r.fechaActualizacion || new Date()).getTime()
          }));
          
          setReviews(reviewsBackendMapped);
          
          // También actualizar el producto con las reseñas
          if (prod) {
            setProducto({ ...prod, reviews: reviewsBackend });
          }
        } catch (error) {
          console.error("Error al cargar reseñas desde el backend:", error);
          // Fallback a localStorage
          setReviews(readReviews(prod.id));
        }
      }

      // Galería
      if (prod) {
        let galeria: string[] = [];
        if (prod.imagenUrl) galeria.push(prod.imagenUrl);
        if (Array.isArray(prod.imagenesUrls)) {
          galeria = galeria.concat(
            prod.imagenesUrls.filter((img: string) => img !== prod.imagenUrl)
          );
        }
        setMainImg(galeria.length > 0 ? galeria[0] : prod.imagenUrl || "");
        setGaleriaImgs(galeria);
      }
    };
    void load();
  }, [paramId]);

  useEffect(() => {
    if (!producto) return;
    const rating = Math.max(0, Math.min(5, calcularRatingPromedio(producto)));
    if (notaRatingRef.current)
      notaRatingRef.current.textContent = `Nota: ${rating.toFixed(1)}`;
    if (notaRatingComentariosRef.current)
      notaRatingComentariosRef.current.textContent = `${rating.toFixed(1)}`;
  }, [producto, reviews]); // Agregado reviews para actualizar cuando cambian las reseñas

  useEffect(() => {
    if (!producto) return;
    const c = getCarrito();
    setCarrito(c);
    const item = c.find((p: ProductoEnCarrito) => p.id === producto.id);
    setCantidad(item ? item.cantidad : 1);
  }, [producto]);

  // Retorna null si no se encuentra el producto
  if (!producto) {
    return (
      <section>
        <section className="seccion-producto-detalle">
          <div className="producto-detalle-container">
            <p>Producto no encontrado</p>
          </div>
        </section>
      </section>
    );
  }

  // Valores derivados
  const cat = producto.categoria.nombre;
  const sub = producto.subcategoria?.nombre || "";
  const rating = Math.max(0, Math.min(5, calcularRatingPromedio(producto)));
  const stars = Array.from({ length: 5 }, (_, i) => (
    <i key={i} className={`bi ${i < rating ? "bi-star-fill" : "bi-star"}`}></i>
  ));

  // Nuevos campos del modelo de datos
  const precioConDescuento = calcularPrecioConDescuento(
    producto.precio,
    producto.descuento
  );
  const tieneDescuento = (producto.descuento || 0) > 0;
  const stockDisponible = producto.stock || 0;
  const esDestacado = producto.destacado || false;

  // Compartir
  function handleShare(kind: string) {
    if (!producto) return;
    // Construir una URL canónica del producto: evitar duplicar el id si ya está presente
    const path = window.location.pathname.endsWith(String(producto.id))
      ? window.location.pathname
      : window.location.pathname.replace(/\/$/, "") + `/${producto.id}`;
    const pageUrl = window.location.origin + path;
    const title = producto.nombre || "Producto LevelUp";
    const text = `Mira este producto: ${title}`;

    function openUrl(url: string) {
      window.open(url, "_blank");
    }

    if (kind === "native" && navigator.share) {
      navigator.share({ title, text, url: pageUrl }).catch(() => {});
      return;
    }
    if (kind === "whatsapp") {
      openUrl(
        "https://wa.me/?text=" + encodeURIComponent(`${text} ${pageUrl}`)
      );
      return;
    }
    if (kind === "facebook") {
      openUrl(
        "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(pageUrl)
      );
      return;
    }
    if (kind === "twitter") {
      openUrl(
        "https://twitter.com/intent/tweet?text=" +
          encodeURIComponent(text) +
          "&url=" +
          encodeURIComponent(pageUrl)
      );
      return;
    }
    if (kind === "telegram") {
      openUrl(
        "https://t.me/share/url?url=" +
          encodeURIComponent(pageUrl) +
          "&text=" +
          encodeURIComponent(text)
      );
      return;
    }
    if (kind === "copy") {
      navigator.clipboard.writeText(pageUrl).then(() => {});
      return;
    }
  }

  // Reviews
  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    const session = getUserSession();
    if (!session) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }
    if (!reviewText.trim()) {
      setReviewMsg("Escribe una reseña.");
      return;
    }
    if (!producto) return;

    try {
      // Crear reseña en el backend
      const idUsuario = Number(session.userId || session.id || 0);
      if (!idUsuario || idUsuario === 0) {
        setReviewMsg("Error: Usuario no autenticado. Debes iniciar sesión para agregar una reseña.");
        setTimeout(() => setReviewMsg(""), 3000);
        return;
      }
      
      // Validar y limpiar el ID del producto
      let productoId: number;
      if (typeof producto.id === 'string') {
        // Si es string, extraer solo la parte numérica (por si viene "3:1" o similar)
        const numericPart = producto.id.split(':')[0].split('/')[0];
        productoId = Number(numericPart);
      } else {
        productoId = Number(producto.id);
      }
      
      if (isNaN(productoId) || productoId <= 0) {
        setReviewMsg("Error: ID de producto inválido.");
        setTimeout(() => setReviewMsg(""), 3000);
        return;
      }
      
      // Validar rating
      const rating = Number(reviewRating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        setReviewMsg("Error: Rating inválido. Debe ser entre 1 y 5.");
        setTimeout(() => setReviewMsg(""), 3000);
        return;
      }
      
      // Validar comentario
      const comentarioLimpio = reviewText.trim();
      if (!comentarioLimpio || comentarioLimpio.length === 0) {
        setReviewMsg("Escribe una reseña.");
        return;
      }
      
      const reseniaData = {
        idUsuario: idUsuario,
        usuarioNombre: (session.displayName || session.email || "Usuario").trim(),
        rating: rating, // Asegurar que sea Integer
        comentario: comentarioLimpio
      };

      console.log("Enviando reseña:", { productoId, reseniaData });
      await ReseniaService.crear(productoId, reseniaData);
      
      setReviewText("");
      setReviewMsg("Reseña enviada.");
      setTimeout(() => setReviewMsg(""), 1500);

      // Recargar reseñas desde el backend
      const response = await ReseniaService.getByProducto(productoId);
      const reseniasBackend = response.data || [];
      
      // Mapear a formato de Review
      const nuevasReviews: Review[] = reseniasBackend.map((r: any) => ({
        id: r.id?.toString() || "",
        productoId: producto.id.toString(),
        usuarioNombre: r.usuarioNombre || "",
        rating: r.rating || 5,
        comentario: r.comentario || "",
        fecha: r.fechaCreacion || r.fechaActualizacion || new Date().toISOString()
      }));

      // Mapear a ReviewType incluyendo el ID del backend
      setReviews(reseniasBackend.map((r: any) => ({
        id: r.id, // Guardar el ID del backend para poder eliminar
        rating: r.rating || 5,
        text: r.comentario || "",
        author: r.usuarioNombre || "",
        title: "",
        ts: new Date(r.fechaCreacion || r.fechaActualizacion || new Date()).getTime()
      })));

      // Actualizar el producto con las nuevas reseñas
      setProducto((prevProducto) => {
        if (!prevProducto) return null;
        return {
          ...prevProducto,
          reviews: nuevasReviews,
        };
      });
    } catch (error: any) {
      console.error("Error al guardar reseña:", error);
      
      // Mostrar mensaje de error más específico
      let errorMessage = "Error al enviar la reseña. Intenta nuevamente.";
      if (error.response?.status === 400) {
        const errorData = error.response?.data;
        if (errorData?.errors) {
          // Errores de validación del backend
          const errorList = Object.values(errorData.errors).join(", ");
          errorMessage = `Error de validación: ${errorList}`;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else {
          errorMessage = "Error: Datos inválidos. Verifica que todos los campos estén correctos.";
        }
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        errorMessage = "Error: No tienes permisos para crear reseñas. Inicia sesión nuevamente.";
      }
      
      setReviewMsg(errorMessage);
      setTimeout(() => setReviewMsg(""), 5000);
      
      // NO hacer fallback a localStorage si falla el backend
      // Esto causaba que las reseñas aparecieran localmente pero no en el backend
    }
  }

  // Función para eliminar comentario
  async function handleDeleteReview(reviewTimestamp: number) {
    const session = getUserSession();
    if (!session) {
      alert("Debes iniciar sesión para eliminar comentarios.");
      return;
    }

    if (!producto) return;

    try {
      // Buscar la reseña en el estado actual
      const reviewToDelete = reviews.find((r) => r.ts === reviewTimestamp);
      if (!reviewToDelete) {
        alert("Reseña no encontrada.");
        return;
      }

      // Verificar que el usuario solo puede eliminar sus propios comentarios
      if (
        reviewToDelete.author !== session.displayName &&
        reviewToDelete.author !== session.email
      ) {
        alert("Solo puedes eliminar tus propios comentarios.");
        return;
      }

      // Confirmar eliminación
      if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
        return;
      }

      // Usar el ID del backend si está disponible
      const reviewId = reviewToDelete.id;

      if (reviewId) {
        // Eliminar del backend
        try {
          await ReseniaService.eliminar(Number(reviewId));
          
          // Recargar reseñas desde el backend después de eliminar
          const response = await ReseniaService.getByProducto(Number(producto.id));
          const reseniasBackend = response.data || [];
          
          // Mapear a formato de Review
          const reviewsActualizadas: Review[] = reseniasBackend.map((r: any) => ({
            id: r.id?.toString() || "",
            productoId: producto.id.toString(),
            usuarioNombre: r.usuarioNombre || "",
            rating: r.rating || 5,
            comentario: r.comentario || "",
            fecha: r.fechaCreacion || r.fechaActualizacion || new Date().toISOString()
          }));

          // Mapear a ReviewType incluyendo el ID del backend
          setReviews(reseniasBackend.map((r: any) => ({
            id: r.id, // Guardar el ID del backend
            rating: r.rating || 5,
            text: r.comentario || "",
            author: r.usuarioNombre || "",
            title: "",
            ts: new Date(r.fechaCreacion || r.fechaActualizacion || new Date()).getTime()
          })));

          // Actualizar el producto con las nuevas reseñas
          setProducto((prevProducto) => {
            if (!prevProducto) return null;
            return {
              ...prevProducto,
              reviews: reviewsActualizadas,
            };
          });
          
          console.log("Comentario eliminado correctamente del backend");
        } catch (error: any) {
          console.error("Error al eliminar reseña del backend:", error);
          alert("Error al eliminar el comentario del servidor. Intenta nuevamente.");
          throw error;
        }
      } else {
        // Si no hay ID del backend, solo eliminar del estado local (fallback)
        console.warn("No se encontró ID del backend para la reseña, eliminando solo del estado local");
        const nuevasReviews = reviews.filter((r) => r.ts !== reviewTimestamp);
        setReviews(nuevasReviews);
        alert("Comentario eliminado localmente (no estaba en el servidor).");
      }
    } catch (error: any) {
      console.error("Error al eliminar reseña:", error);
      // No mostrar alerta aquí porque ya se mostró arriba si fue error del backend
    }
  }

  // Carrito actions
  function handleAgregar() {
    if (!producto) return;
    agregarAlCarrito(producto as any);
    setCantidad(1);
    setCarrito(getCarrito());
    actualizarNumerito();
  }

  function handleAumentar() {
    if (!producto) return;
    const c = getCarrito();
    const item = c.find((p: ProductoEnCarrito) => p.id === producto.id);
    if (item) {
      item.cantidad++;
      setCarritoLS(c);
      setCantidad(item.cantidad);
      setCarrito(getCarrito());
      actualizarNumerito();
    }
  }

  function handleDisminuir() {
    if (!producto) return;
    const c = getCarrito();
    const item = c.find((p: ProductoEnCarrito) => p.id === producto.id);
    if (item) {
      item.cantidad--;
      if (item.cantidad <= 0) {
        const nuevoCarrito = c.filter(
          (p: ProductoEnCarrito) => p.id !== producto.id
        );
        setCarritoLS(nuevoCarrito);
        setCantidad(1);
        setCarrito(getCarrito());
        actualizarNumerito();
      } else {
        setCarritoLS(c);
        setCantidad(item.cantidad);
        setCarrito(getCarrito());
        actualizarNumerito();
      }
    }
  }

  // Render reviews
  function renderReviews() {
    if (!reviews || reviews.length === 0) {
      return (
        <li className="producto-detalle-comentario">
          <div className="comentario-cuerpo">
            <p className="producto-detalle-comentario-texto">
              Sin reseñas aún. ¡Sé el primero en opinar!
            </p>
          </div>
        </li>
      );
    }

    const session = getUserSession(); //aca pq si

    return reviews
      .slice()
      .reverse()
      .map((r: ReviewType, idx: number) => {
        const stars = Array.from({ length: 5 }, (_, i) => (
          <i
            key={i}
            className={`bi ${i < r.rating ? "bi-star-fill" : "bi-star"}`}
          ></i>
        ));

        // Verificar si el usuario puede eliminar este comentario
        const canDelete =
          session && //si hay session y el nombre del usuario es el mismo que el creador de la reseña o el email del usuario es el mismo que el creador de la reseña
          (r.author === session.displayName || r.author === session.email);

        return (
          <li className="producto-detalle-comentario" key={r.ts + idx}>
            <div className="comentario-encabezado">
              <div className="producto-detalle-comentario-estrellas">
                {stars}
              </div>
              <h4 className="producto-detalle-comentario-titulo">
                {r.title || ""}
              </h4>
              {canDelete && ( //si el usuario puede eliminar el comentario, mostrar el boton de eliminar
                <button
                  className="delete-comment-btn"
                  onClick={() => handleDeleteReview(r.ts)} //eliminar la reseña
                  title="Eliminar comentario"
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
            <div className="comentario-cuerpo">
              <h4 className="producto-detalle-comentario-autor">
                {r.author || "Anónimo"}
              </h4>
              <p className="producto-detalle-comentario-texto">
                {r.text || ""}
              </p>
            </div>
          </li>
        );
      });
  }

  // Carrito UI
  const itemEnCarrito = carrito.find(
    (p: ProductoEnCarrito) => p.id === producto.id
  );
  const disponible = producto.disponible;

  return (
    <div className="wrapper">
      <section>
        <section className="seccion-producto-detalle">
          <div className="producto-detalle-container">
            <ProductoDetalleVisual
              galeriaImgs={galeriaImgs}
              mainImg={mainImg}
              setMainImg={setMainImg}
              producto={producto}
            />
            <ProductoDetalleInfo
              producto={producto}
              stars={stars}
              notaRatingRef={
                notaRatingRef as React.RefObject<HTMLParagraphElement>
              }
              cat={cat}
              sub={sub}
              handleAgregar={handleAgregar}
              handleDisminuir={handleDisminuir}
              handleAumentar={handleAumentar}
              itemEnCarrito={itemEnCarrito}
              contadorRef={contadorRef as React.RefObject<HTMLSpanElement>}
              disponible={disponible}
              handleShare={handleShare}
              precioConDescuento={precioConDescuento}
              tieneDescuento={tieneDescuento}
              stockDisponible={stockDisponible}
              esDestacado={esDestacado}
            />
          </div>
        </section>
        <ProductoDetalleRelacionados
          productos={
            // Use merged list here as well so related items include admin-created products
            (function getRelated() {
              try {
                const raw = localStorage.getItem("lvup_products");
                const persisted: Producto[] = raw ? JSON.parse(raw) : [];
                const catalog =
                  Array.isArray(persisted) && persisted.length > 0
                    ? persisted
                    : productosArray;
                return catalog
                  .filter(
                    (p) =>
                      p.id !== producto.id &&
                      p.categoria.id === producto.categoria.id
                  )
                  .slice(0, 4);
              } catch (e) {
                return [];
              }
            })()
          }
          onCardClick={(id) => {
            window.scrollTo(0, 0);
            navigate(`/producto/${id}`);
          }}
          ProductoCard={ProductoCard}
        />
        <ProductoDetalleComentarios
          stars={stars}
          notaRatingComentariosRef={
            notaRatingComentariosRef as React.RefObject<HTMLParagraphElement>
          }
          showReviewForm={showReviewForm}
          setShowReviewForm={setShowReviewForm}
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
          reviewText={reviewText}
          setReviewText={setReviewText}
          reviewMsg={reviewMsg}
          handleReviewSubmit={handleReviewSubmit}
          renderReviews={renderReviews}
        />
      </section>
    </div>
  );
};

export default ProductoDetalle;
