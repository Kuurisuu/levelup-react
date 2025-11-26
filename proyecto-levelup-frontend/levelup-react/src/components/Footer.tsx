import { Link } from "react-router-dom";

export default function Footer(): React.JSX.Element {
  const base = import.meta.env.BASE_URL || "/";

  return (
    <footer>
      <div className="footer-container">
        {/* Marca */}
        <div className="footer-col">
          <p className="texto-footer">&copy; 2025 A.C.A Company</p>
          <p className="texto-footer">Level Up — Gamer</p>
          <div className="footer-social" style={{ gap: '1rem', display: 'flex' }}>
            <a
              href="https://www.instagram.com/level_up_gamer__/"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram"></i>
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=56912345678&text=Hola,%20necesito%20ayuda"
              aria-label="Whatsapp"
            >
              <i className="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>

        {/* Enlaces */}
        <div className="footer-col">
          <h3>Enlaces</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/carrito">Carrito</Link>
            </li>
            <li>
              <Link to="/login">Ingresar</Link>
            </li>
            <li>
              <Link to="/register">Registrarse</Link>
            </li>
          </ul>
        </div>

        {/* Soporte */}
        <div className="footer-col">
          <h3>Soporte</h3>
          <ul className="footer-links">
            <li>
              <a href="https://www.whatsapp.com/?lang=es_LA">
                Preguntas frecuentes
              </a>
            </li>
            <li>
              <a
                href={base + "docs/Política_de_Devoluciones_y_Garantía.txt"}
                download
              >
                Política de devoluciones
              </a>
            </li>
            <li>
              <a
                href={base + "docs/Términos_y_Condiciones–Level-Up_Gamer.txt"}
                download
              >
                Términos y condiciones
              </a>
            </li>
            <li>
              <a href={base + "docs/Politica_de_privacidad.docx"} download>
                Política de privacidad
              </a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="footer-col">
          <h3>Contacto</h3>
          <p className="texto-footer">Teléfono: +56 9 1234 5678</p>
          <p className="texto-footer">correo@levelup.cl</p>
          <p className="texto-footer">Santiago, Chile</p>
          <div className="footer-trust">
            <span className="trust-item">
              <i className="bi bi-shield-check"></i> Compra segura
            </span>
            <p></p>
            <span className="trust-item">
              <i className="bi bi-truck"></i> Envío a todo Chile
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div className="footer-container">
            <p className="texto-footer">
              &copy; 2025 Level Up — Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
