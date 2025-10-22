import React from "react";

interface ProductoDetalleComentariosProps {
  stars: React.ReactNode;
  notaRatingComentariosRef: React.RefObject<HTMLParagraphElement>;
  showReviewForm: boolean;
  setShowReviewForm: React.Dispatch<React.SetStateAction<boolean>>;
  reviewRating: number;
  setReviewRating: React.Dispatch<React.SetStateAction<number>>;
  reviewText: string;
  setReviewText: React.Dispatch<React.SetStateAction<string>>;
  reviewMsg: string;
  handleReviewSubmit: (e: React.FormEvent) => void;
  renderReviews: () => React.ReactNode;
}

const ProductoDetalleComentarios: React.FC<ProductoDetalleComentariosProps> = ({
  stars,
  notaRatingComentariosRef,
  showReviewForm,
  setShowReviewForm,
  reviewRating,
  setReviewRating,
  reviewText,
  setReviewText,
  reviewMsg,
  handleReviewSubmit,
  renderReviews,
}): React.JSX.Element => (
  <section className="seccion-comentarios">
    <div className="producto-detalle-comentarios-container">
      <div className="producto-detalle-comentarios-header">
        <div className="producto-detalle-titulo-con-barra">
          <h1 className="producto-detalle-comentarios-titulo">
            Reseñas y calificaciones
          </h1>
        </div>
        <div className="producto-detalle-calificacion">
          <div className="producto-detalle-estrellas-container estrellas-medium">
            <div className="producto-detalle-estrellas">{stars}</div>
            <p
              className="producto-detalle-estrellas-valor-comentarios"
              ref={notaRatingComentariosRef}
            ></p>
          </div>
          <button
            className="boton-menu producto-detalle-calificar"
            id="btn-toggle-review"
            onClick={() => setShowReviewForm((v) => !v)}
          >
            Calificar producto
          </button>
        </div>
      </div>
      {/* formulario de reseña */}
      <div
        id="review-form-container"
        style={{
          display: showReviewForm ? "block" : "none",
          marginBottom: "1rem",
        }}
      >
        <form
          id="review-form"
          onSubmit={handleReviewSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.6rem",
            alignItems: "flex-start",
          }}
        >
          <div>
            <label htmlFor="review-rating">Tu calificación</label>
            <select
              id="review-rating"
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
            >
              <option value={5}>5 - Excelente</option>
              <option value={4}>4 - Muy bueno</option>
              <option value={3}>3 - Bueno</option>
              <option value={2}>2 - Regular</option>
              <option value={1}>1 - Malo</option>
            </select>
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label htmlFor="review-text">Tu reseña</label>
            <textarea
              id="review-text"
              rows={3}
              placeholder="Cuéntanos tu experiencia"
              style={{ width: "100%" }}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button type="submit" className="boton-menu deco-levelup">
              Enviar reseña
            </button>
            <span id="review-msg" style={{ color: "#d3d3d3" }}>
              {reviewMsg}
            </span>
          </div>
        </form>
      </div>
      <div className="producto-detalle-comentarios-caja">
        <ul className="producto-detalle-comentarios-lista" id="reviews-list">
          {renderReviews()}
        </ul>
      </div>
    </div>
  </section>
);

export default ProductoDetalleComentarios;
