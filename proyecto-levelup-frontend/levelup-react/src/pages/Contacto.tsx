import { useState } from "react";
import "../styles/contacto.css";

// tipos para TypeScript
type FormErrors = {
  nombre?: string;
  email?: string;
  asunto?: string;
  mensaje?: string;
};

const Contacto = () => {
  // estado para el formulario de contacto
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  // estado para errores de validacion
  const [errors, setErrors] = useState<FormErrors>({});

  // estado para loading del formulario
  const [isLoading, setIsLoading] = useState(false);

  // estado para mensaje de exito
  const [successMessage, setSuccessMessage] = useState("");

  // contador de caracteres para el textarea
  const [caracteresCount, setCaracteresCount] = useState(0);

  // manejar cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // actualizar contador de caracteres para mensaje
    if (name === "mensaje") {
      setCaracteresCount(value.length);
    }

    // limpiar errores al escribir
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // validar formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.asunto.trim()) {
      newErrors.asunto = "Selecciona un tipo de consulta";
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido";
    } else if (formData.mensaje.length > 500) {
      newErrors.mensaje = "El mensaje no puede exceder 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // manejar envio del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // simular envio de formulario
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccessMessage(
        "¡Consulta enviada exitosamente! Nuestro equipo te responderá en menos de 24 horas."
      );

      // limpiar formulario
      setFormData({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
      });
      setCaracteresCount(0);

      // ocultar mensaje de exito despues de 5 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      {/* contenido principal de la pagina de contacto */}
      <section className="contacto-main">
        {/* seccion hero: introduccion principal de la pagina */}
        <section className="hero-contacto">
          <div className="hero-content">
            <h1>Contáctanos</h1>
            <p>
              ¿Tienes alguna pregunta o sugerencia? Nos encantaría escucharte
            </p>
          </div>
        </section>

        {/* seccion contacto: informacion y formulario de contacto */}
        <section className="contacto-section">
          <div className="container">
            <div className="cuadricula-contacto">
              {/* informacion de contacto: datos de la empresa */}
              <div className="info-contacto">
                <h3>Información de Contacto</h3>
                {/* informacion de la tienda online */}
                <div className="info-item">
                  <i className="bi bi-shop"></i>
                  <div>
                    <h3>Tienda Online</h3>
                    <p>
                      Level-Up Gamer
                      <br />
                      Entrega a todo Chile
                    </p>
                  </div>
                </div>
                {/* contacto por whatsapp */}
                <div className="info-item">
                  <i className="bi bi-whatsapp"></i>
                  <div>
                    <h3>WhatsApp</h3>
                    <p>
                      <a
                        href="https://wa.me/56912345678?text=¡Hola!%20Me%20interesa%20conocer%20más%20sobre%20los%20productos%20gaming%20de%20Level-Up.%20¿Podrían%20ayudarme%20con%20información%20sobre%20disponibilidad%20y%20precios?"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-link"
                      >
                        +56 9 1234 5678
                      </a>
                      <br />
                      Atención personalizada
                    </p>
                  </div>
                </div>
                {/* contacto por email */}
                <div className="info-item">
                  <i className="bi bi-envelope-fill"></i>
                  <div>
                    <h3>Email</h3>
                    <p>
                      info@levelupgamer.cl
                      <br />
                      soporte@levelupgamer.cl
                    </p>
                  </div>
                </div>
                {/* horarios de atencion */}
                <div className="info-item">
                  <i className="bi bi-clock-fill"></i>
                  <div>
                    <h3>Horario de Atención</h3>
                    <p>
                      Lunes - Viernes: 9:00 AM - 7:00 PM
                      <br />
                      Sábados: 10:00 AM - 6:00 PM
                      <br />
                      Domingos: 11:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>

                {/* redes sociales: enlaces a plataformas sociales */}
                <div className="enlaces-sociales">
                  <h3>Síguenos en Redes</h3>
                  <div className="social-icons">
                    {/* enlaces a redes sociales de la empresa */}
                    <a href="#" className="social-btn">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="social-btn">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="#" className="social-btn">
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="social-btn">
                      <i className="bi bi-twitch"></i>
                    </a>
                    <a href="#" className="social-btn">
                      <i className="bi bi-discord"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* formulario de contacto: formulario para consultas de clientes */}
              <div className="contenedor-formulario-contacto">
                <h2>¿Tienes alguna consulta?</h2>
                <p
                  style={{
                    color: "#d3d3d3",
                    marginBottom: "2rem",
                    fontFamily: "Roboto, sans-serif",
                  }}
                >
                  Estamos aquí para ayudarte con cualquier pregunta sobre
                  nuestros productos gaming o tu experiencia de compra.
                </p>

                {/* mensaje de exito: confirmacion de envio exitoso */}
                {successMessage && (
                  <div className="mensaje-exito show">
                    <i className="bi bi-check-circle-fill"></i>
                    <h3>¡Consulta enviada exitosamente!</h3>
                    <p>
                      Gracias por contactarnos. Nuestro equipo te responderá en
                      menos de 24 horas.
                    </p>
                  </div>
                )}

                {/* formulario de contacto con validacion */}
                <form
                  id="formularioContacto"
                  className="formulario-contacto"
                  onSubmit={handleSubmit}
                >
                  {/* campo de entrada para nombre completo */}
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={errors.nombre ? "error" : ""}
                      required
                      placeholder="Ingresa tu nombre completo"
                      maxLength={100}
                    />
                    {/* contenedor para mostrar errores de validacion */}
                    {errors.nombre && (
                      <span className="mensaje-error">{errors.nombre}</span>
                    )}
                  </div>

                  {/* campo de entrada para email */}
                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "error" : ""}
                      required
                      placeholder="tu@email.com"
                    />
                    {/* contenedor para mostrar errores de validacion */}
                    {errors.email && (
                      <span className="mensaje-error">{errors.email}</span>
                    )}
                  </div>

                  {/* selector de tipo de consulta */}
                  <div className="form-group">
                    <label htmlFor="asunto">Tipo de Consulta</label>
                    <select
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleInputChange}
                      className={errors.asunto ? "error" : ""}
                      required
                      style={{
                        width: "100%",
                        padding: "0.8rem",
                        border: "2px solid #1e90ff",
                        borderRadius: "8px",
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        fontFamily: "Roboto, sans-serif",
                      }}
                    >
                      <option value="">Selecciona el tipo de consulta</option>
                      {/* opciones de tipos de consulta */}
                      <option value="productos">
                        Consulta sobre productos
                      </option>
                      <option value="pedido">Estado de mi pedido</option>
                      <option value="garantia">Garantía y devoluciones</option>
                      <option value="tecnico">Soporte técnico</option>
                      <option value="otro">Otro</option>
                    </select>
                    {/* contenedor para mostrar errores de validacion */}
                    {errors.asunto && (
                      <span className="mensaje-error">{errors.asunto}</span>
                    )}
                  </div>

                  {/* campo de texto para el mensaje */}
                  <div className="form-group">
                    <label htmlFor="mensaje">Tu Mensaje</label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={5}
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      className={errors.mensaje ? "error" : ""}
                      required
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      maxLength={500}
                    ></textarea>
                    {/* contador de caracteres dinamico */}
                    <div className="contador-caracteres">
                      <span>{caracteresCount}</span>/500 caracteres
                    </div>
                    {/* contenedor para mostrar errores de validacion */}
                    {errors.mensaje && (
                      <span className="mensaje-error">{errors.mensaje}</span>
                    )}
                  </div>

                  {/* boton de envio del formulario */}
                  <button
                    type="submit"
                    className={`btn-enviar ${isLoading ? "loading" : ""}`}
                    disabled={isLoading}
                  >
                    <i className="bi bi-send-fill"></i>
                    {isLoading ? "Enviando..." : "Enviar Consulta"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Contacto;
