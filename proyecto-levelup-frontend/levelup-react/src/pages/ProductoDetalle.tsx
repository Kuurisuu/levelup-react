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
import {
  categorias,
  subcategorias,
  productosArray,
  Producto,
  Review,
} from "../data/catalogo";
import { calcularRatingPromedio } from "../utils/ratingUtils"; // nuevo import

type ReviewType = {
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
  return (productosArray[0] && productosArray[0].id) || null;
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
    // Fusionar productos administrados persistidos (lvup_products) con el catálogo base para que
    // nuevos productos creados sean visibles en la vista de detalle.
    let mergedProducts: Producto[] = productosArray.slice();
    try {
      const raw = localStorage.getItem("lvup_products");
      const persisted: Producto[] = raw ? JSON.parse(raw) : [];
      if (Array.isArray(persisted) && persisted.length > 0) {
        // El catalogo persistido es autoritativo (gestionado por admin)
        mergedProducts = persisted;
      }
    } catch (e) {
      // Ignorar y volver al catálogo base
    }

    const prod = paramId
      ? mergedProducts.find((p) => String(p.id) === String(paramId))
      : null;
    setProducto(prod || null);
    setCarrito(getCarrito());
    if (prod) setReviews(readReviews(prod.id));

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
  function handleReviewSubmit(e: React.FormEvent) {
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

    const list = readReviews(producto.id);
    list.push({
      rating: reviewRating,
      text: reviewText,
      author: session.displayName || "Usuario",
      title: "",
      ts: Date.now(),
    });
    writeReviews(producto.id, list);
    setReviewText("");
    setReviewMsg("Reseña enviada.");
    setTimeout(() => setReviewMsg(""), 1500);

    // Actualizar las reseñas y recalcular el rating
    const nuevasReviews = readReviews(producto.id);
    setReviews(nuevasReviews);

    // Actualizar el producto con las nuevas reseñas para recalcular el rating
    setProducto((prevProducto) => {
      if (!prevProducto) return null; //si no hay producto, retornar null
      return {
        ...prevProducto, //copiar el producto anterior
        reviews: nuevasReviews.map((review) => ({
          // map es para crear un nuevo array con los valores de la reseña
          id: review.ts.toString(), //convertir el tiempo a string
          productoId: producto.id, //id del producto
          usuarioNombre: review.author, //nombre del usuario
          rating: review.rating, //rating de la reseña
          comentario: review.text, //comentario de la reseña
          fecha: new Date(review.ts).toISOString(), //fecha de la reseña
        })), //retornar el nuevo array
      };
    });
  }

  // Función para eliminar comentario
  function handleDeleteReview(reviewTimestamp: number) {
    //el tiempo q se creo la reseña
    const session = getUserSession(); //obtener la session del usuario para verificar si es el creador de la reseña
    if (!session) {
      alert("Debes iniciar sesión para eliminar comentarios.");
      return;
    }

    if (!producto) return; //si no hay producto, retornar null

    const list = readReviews(producto.id); //obtener las reseñas del producto por id
    const reviewIndex = list.findIndex(
      (review) => review.ts === reviewTimestamp
    ); //encontrar el indice de la reseña

    if (reviewIndex === -1) return; //si no se encuentra la reseña, retornar null el -1 es porque no se encontro la reseña ya que es el indice de la reseña que no existe

    const review = list[reviewIndex]; //obtener la reseña por el indice

    // Verificar que el usuario solo puede eliminar sus propios comentarios
    if (
      review.author !== session.displayName &&
      review.author !== session.email
    ) {
      alert("Solo puedes eliminar tus propios comentarios.");
      return;
    }

    // Confirmar eliminación
    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      return;
    }

    // Eliminar el comentario
    list.splice(reviewIndex, 1); //desde el indice de la reseña, eliminar 1 reseña
    writeReviews(producto.id, list); //escribir las reseñas actualizadas

    // Actualizar las reseñas y recalcular el rating
    const nuevasReviews = readReviews(producto.id); //obtener las reseñas actualizadas
    setReviews(nuevasReviews); //actualizar las reseñas

    // Actualizar el producto con las nuevas reseñas para recalcular el rating
    setProducto((prevProducto) => {
      if (!prevProducto) return null; //si no hay producto, retornar null
      return {
        ...prevProducto, //copiar el producto anterior
        reviews: nuevasReviews.map((review) => ({
          id: review.ts.toString(),
          productoId: producto.id,
          usuarioNombre: review.author,
          rating: review.rating,
          comentario: review.text,
          fecha: new Date(review.ts).toISOString(),
        })),
      };
    });

    alert("Comentario eliminado correctamente.");
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
                return productosArray
                  .filter(
                    (p) =>
                      p.id !== producto.id &&
                      p.categoria.id === producto.categoria.id
                  )
                  .slice(0, 4);
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
