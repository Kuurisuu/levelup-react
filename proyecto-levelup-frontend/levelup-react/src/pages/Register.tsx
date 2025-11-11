import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";
import { isDuocEmail } from "../utils/orden.helper";
import { AuthService } from "../services/api/auth";
import { saveSession } from "../logic/auth";

interface RegisterFormData {
  run: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono: string;
  fechaNacimiento: string;
  region: string;
  comuna: string;
  direccion: string;
  codigoReferido: string;
  avatar: string;
  terminos: boolean;
}

interface RegisterErrors {
  run?: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  telefono?: string;
  fechaNacimiento?: string;
  region?: string;
  comuna?: string;
  direccion?: string;
  codigoReferido?: string;
  avatar?: string;
  terminos?: string;
  general?: string;
}

interface RegionesYComunas {
  [key: string]: string[];
}

interface User {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
  fechaNacimiento?: string;
  region?: string;
  comuna?: string;
  direccion?: string;
  referralCode: string;
  points?: number;
  redeemedCodes?: string[];
  referredBy?: string;
  role?: string;
  avatar?: string;
  duocMember?: boolean;
}

interface UserSession {
  displayName: string;
  loginAt: number;
  userId: number;
  id: number;
  role?: string;
  duocMember?: boolean;
  email?: string;
}

const Register: React.FC = (): React.JSX.Element => {
  const navigate = useNavigate();

  // estados para el formulario de registro
  const [formData, setFormData] = useState<RegisterFormData>({
    run: "",
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    fechaNacimiento: "",
    region: "",
    comuna: "",
    direccion: "",
    codigoReferido: "",
    avatar: "",
    terminos: false,
  });

  // estado para errores de validacion
  const [errors, setErrors] = useState<RegisterErrors>({});

  // estado para mostrar/ocultar passwords
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // estado para loading del formulario
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // datos para regiones y comunas de Chile
  const regionesYComunas: RegionesYComunas = {
    "Región Metropolitana": [
      "Santiago",
      "Las Condes",
      "Providencia",
      "Ñuñoa",
      "Maipú",
      "La Florida",
      "Puente Alto",
    ],
    Valparaíso: [
      "Valparaíso",
      "Viña del Mar",
      "Concón",
      "Quilpué",
      "Villa Alemana",
      "San Antonio",
    ],
    Biobío: ["Concepción", "Talcahuano", "Chillán", "Los Ángeles", "Coronel"],
    Coquimbo: ["La Serena", "Coquimbo", "Ovalle", "Illapel"],
    Antofagasta: ["Antofagasta", "Calama", "Tocopilla", "Mejillones"],
    Tarapacá: ["Iquique", "Alto Hospicio", "Pozo Almonte"],
    "Arica y Parinacota": ["Arica", "Putre", "Camarones"],
  };


  // manejar cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = "checked" in e.target ? e.target.checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // limpiar errores al escribir
    if (errors[name as keyof RegisterErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // limpiar comuna cuando cambia la región
    if (name === "region") {
      setFormData((prev) => ({
        ...prev,
        comuna: "",
      }));
    }
  };
  // ESTA FUNCION ES PARA FORZAR EL COLOR DEL TEXTO CUANDO SE Pega el texto en el input
  // manejar pegado de texto
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    // Aplicar clase para forzar el color correcto del texto pegado
    const target = e.target as HTMLInputElement;
    target.classList.add("text-pasted");

    // Remover la clase después de un breve momento para permitir que el CSS normal tome efecto
    setTimeout(() => {
      target.classList.remove("text-pasted");
    }, 100);
  };

  // validar formulario
  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    // validar RUN
    if (formData.run.trim()) {
      if (!/^[0-9]{7,8}[0-9Kk]$/.test(formData.run.trim())) {
        newErrors.run = "El RUN debe tener formato válido (ej: 123456789)";
      }
    }

    // validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length < 2 || formData.nombre.length > 50) {
      newErrors.nombre = "El nombre debe tener entre 2 y 50 caracteres";
    }

    // validar apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son requeridos";
    } else if (formData.apellidos.length < 2 || formData.apellidos.length > 100) {
      newErrors.apellidos = "Los apellidos deben tener entre 2 y 100 caracteres";
    }

    // validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    } else if (!/(@duoc\.cl|@profesor\.duoc\.cl|@gmail\.com)$/.test(formData.email)) {
      newErrors.email = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com";
    }

    // validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 4 || formData.password.length > 10) {
      newErrors.password = "La contraseña debe tener entre 4 y 10 caracteres";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número";
    }

    // validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // validar fecha de nacimiento
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es requerida";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.fechaNacimiento)) {
      newErrors.fechaNacimiento = "La fecha debe tener formato YYYY-MM-DD";
    }

    // validar región y comuna
    if (!formData.region) {
      newErrors.region = "Selecciona una región";
    }

    if (!formData.comuna) {
      newErrors.comuna = "Selecciona una comuna";
    }

    // validar dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    } else if (formData.direccion.length > 300) {
      newErrors.direccion = "La dirección no puede exceder 300 caracteres";
    }

    // validar términos y condiciones
    if (!formData.terminos) {
      newErrors.terminos = "Debes aceptar los términos y condiciones";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // manejar envio del formulario
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos para el backend
      const runLimpio = formData.run.trim();
      const registerData = {
        runUsuario: runLimpio !== "" ? runLimpio : undefined,
        nombreUsuario: formData.nombre.trim(),
        apellidosUsuario: formData.apellidos.trim(),
        correoUsuario: formData.email.trim().toLowerCase(),
        password: formData.password,
        fechaNacimiento: formData.fechaNacimiento,
        region: formData.region,
        comuna: formData.comuna,
        direccionUsuario: formData.direccion.trim(),
        telefono: formData.telefono.trim() || undefined,
        codigoReferido: formData.codigoReferido.trim() || undefined,
        aceptaMarketing: false,
      };

      // Llamar al backend para registrar
      const response = await AuthService.registro(registerData);

      if (response.data) {
        const { accessToken, refreshToken, usuario } = response.data;

        // Guardar token en localStorage (el interceptor de axios lo usará)
        localStorage.setItem("auth_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        // Crear sesión con datos del usuario del backend
        const firstName = usuario.nombre.split(" ")[0];
        const session: UserSession = {
          displayName: firstName,
          loginAt: Date.now(),
          userId: usuario.id,
          id: usuario.id,
          role: usuario.tipoUsuario || "cliente",
          duocMember: usuario.descuentoDuoc || isDuocEmail(usuario.correo),
          email: usuario.correo,
        };

        // Guardar sesión usando la función centralizada
        saveSession(session);

        // si es correo Duoc, avisar al usuario del beneficio
        if (session.duocMember) {
          alert(
            "¡Felicidades! Al registrarte con un correo @duoc.cl recibirás un 20% de descuento adicional en todos los productos. Se aplicará automáticamente en tu carrito y en el checkout."
          );
        }

        // Mensaje de éxito
        alert(
          `¡Registro exitoso, ${firstName}! Bienvenido a Level-Up Gamer.`
        );

        // Limpiar formulario
        setFormData({
          run: "",
          nombre: "",
          apellidos: "",
          email: "",
          password: "",
          confirmPassword: "",
          telefono: "",
          fechaNacimiento: "",
          region: "",
          comuna: "",
          direccion: "",
          codigoReferido: "",
          avatar: "",
          terminos: false,
        });

        // Redirigir al home
        navigate("/");

        // Forzar recarga para actualizar header
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Error al registrar usuario:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Error al crear la cuenta. Inténtalo de nuevo.";
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      {/* contenido principal: formulario de registro de usuario */}
      <section>
        {/* contenedor principal del formulario de registro */}
        <div className="register-container">
          <h2>Registrarse</h2>

          {/* formulario de registro con validacion */}
          <form onSubmit={handleSubmit}>
            {/* campo de entrada para el nombre */}
            <div className="form-group">
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                onPaste={handlePaste}
                className={errors.nombre ? "error" : ""}
              />
              {errors.nombre && (
                <div className="error-message">{errors.nombre}</div>
              )}
            </div>

            {/* campo de entrada para los apellidos */}
            <div className="form-group">
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                placeholder="Apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                onPaste={handlePaste}
                className={errors.apellidos ? "error" : ""}
              />
              {errors.apellidos && (
                <div className="error-message">{errors.apellidos}</div>
              )}
            </div>

            {/* campo de entrada para el email */}
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleInputChange}
                onPaste={handlePaste}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            {/* campo de entrada para la contraseña */}
            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Contraseña (entre 4 y 10 caracteres)"
                value={formData.password}
                onChange={handleInputChange}
                onPaste={handlePaste}
                className={errors.password ? "error" : ""}
                minLength={4}
                maxLength={10}
              />
              <i
                className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                onClick={() => setShowPassword(!showPassword)}
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            {/* campo de entrada para confirmar contraseña */}
            <div className="form-group password-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onPaste={handlePaste}
                className={errors.confirmPassword ? "error" : ""}
                minLength={4}
                maxLength={10}
              />
              <i
                className={`bi ${
                  showConfirmPassword ? "bi-eye" : "bi-eye-slash"
                }`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              {errors.confirmPassword && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
            </div>

            {/* campo de entrada para el telefono (opcional) */}
            <div className="form-group">
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="Teléfono (opcional)"
                value={formData.telefono}
                onChange={handleInputChange}
                onPaste={handlePaste}
                className={errors.telefono ? "error" : ""}
              />
              {errors.telefono && (
                <div className="error-message">{errors.telefono}</div>
              )}
            </div>

            {/* campo de entrada para la fecha de nacimiento */}
            <div className="form-group">
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                className={errors.fechaNacimiento ? "error" : ""}
              />
              {errors.fechaNacimiento && (
                <div className="error-message">{errors.fechaNacimiento}</div>
              )}
            </div>

            {/* seleccion de region */}
            <div className="form-group">
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className={errors.region ? "error" : ""}
              >
                <option value="">Selecciona una región</option>
                {Object.keys(regionesYComunas).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && (
                <div className="error-message">{errors.region}</div>
              )}
            </div>

            {/* seleccion de comuna */}
            <div className="form-group">
              <select
                id="comuna"
                name="comuna"
                value={formData.comuna}
                onChange={handleInputChange}
                className={errors.comuna ? "error" : ""}
                disabled={!formData.region}
              >
                <option value="">
                  {formData.region
                    ? "Selecciona una comuna"
                    : "Primero selecciona una región"}
                </option>
                {formData.region &&
                  regionesYComunas[formData.region]?.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
              </select>
              {errors.comuna && (
                <div className="error-message">{errors.comuna}</div>
              )}
            </div>

            {/* campo de entrada para la direccion (opcional) */}
            <div className="form-group">
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Dirección (opcional)"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </div>

            {/* campo de entrada para el código de referido (opcional) */}
            <div className="form-group">
              <input
                type="text"
                id="codigoReferido"
                name="codigoReferido"
                placeholder="Código de referido (opcional)"
                value={formData.codigoReferido}
                onChange={handleInputChange}
                className={errors.codigoReferido ? "error" : ""}
              />
              {errors.codigoReferido && (
                <div className="error-message">{errors.codigoReferido}</div>
              )}
            </div>


            {/* checkbox para aceptar terminos y condiciones */}
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="terminos"
                name="terminos"
                checked={formData.terminos}
                onChange={handleInputChange}
                className={errors.terminos ? "error" : ""}
              />
              <label htmlFor="terminos">
                Acepto los{" "}
                <a href="/terminos" target="_blank">
                  términos y condiciones
                </a>
              </label>
              {errors.terminos && (
                <div className="error-message">{errors.terminos}</div>
              )}
            </div>

            {/* mensaje de error general */}
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}

            {/* boton de envio del formulario */}
            <button
              type="submit"
              className={`btn-register ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          {/* enlace para ir al login si ya tienes cuenta */}
          <p className="login-link">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Register;
