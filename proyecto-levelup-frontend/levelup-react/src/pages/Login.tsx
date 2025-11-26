import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { isDuocEmail } from "../utils/orden.helper";
import { AuthService } from "../services/api/auth";
import { UsuarioService } from "../services/api/usuario";
import { saveSession } from "../logic/auth";

interface FormData {
  emailOrName: string;
  password: string;
}

interface Errors {
  emailOrName?: string;
  password?: string;
  form?: string;
  general?: string;
}

interface UserSession {
  displayName: string;
  loginAt: number;
  userId: string;
  id: string;
  role?: string;
  duocMember?: boolean;
  email?: string;
  apellidos?: string;
  region?: string;
  comuna?: string;
  telefono?: string;
  direccion?: string;
}

const Login: React.FC = (): React.JSX.Element => {
  const navigate = useNavigate();

  // estado para los datos del formulario
  const [formData, setFormData] = useState<FormData>({
    emailOrName: "",
    password: "",
  });

  // estado para errores de validacion
  const [errors, setErrors] = useState<Errors>({});

  // estado para mostrar/ocultar password
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // estado para loading del formulario
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // limpiar errores al escribir
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // validar formulario
  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    const identifier = formData.emailOrName.trim();
    if (!identifier) {
      newErrors.emailOrName = "Ingresa tu correo o nombre";
    } else if (identifier.includes("@")) {
      if (!/\S+@\S+\.\S+/.test(identifier)) {
        newErrors.emailOrName = "El correo no es válido";
      }
    } else if (identifier.length < 2) {
      newErrors.emailOrName = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
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

    const identifier = formData.emailOrName.trim();

    setIsLoading(true);

    try {
      // Llamar al backend para autenticar
      const response = await AuthService.login(
        identifier,
        formData.password
      );

      if (response.data) {
        const { accessToken, refreshToken, usuario } = response.data;

        // Guardar token en localStorage para que las siguientes peticiones usen el JWT
        localStorage.setItem("auth_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        // Intentar obtener el perfil completo del usuario (requiere token previamente almacenado)
        let perfilCompleto: any = null;
        try {
          const perfilResponse = await UsuarioService.getPerfil();
          perfilCompleto = perfilResponse.data;
        } catch (perfilError) {
          console.warn("No se pudo obtener el perfil completo del usuario", perfilError);
        }

        // Crear sesión con datos del usuario del backend
        const firstName = usuario.nombre.split(" ")[0];
        const session: UserSession = {
          displayName: firstName,
          loginAt: Date.now(),
          userId: String(usuario.id),
          id: String(usuario.id),
          role: usuario.tipoUsuario || "cliente",
          duocMember: usuario.descuentoDuoc || isDuocEmail(usuario.correo),
          email: usuario.correo,
          apellidos: usuario.apellidos || "",
          region: perfilCompleto?.region ?? usuario.region ?? "",
          comuna: perfilCompleto?.comuna ?? usuario.comuna ?? "",
          telefono: perfilCompleto?.telefono ?? "",
          direccion: perfilCompleto?.direccion ?? "",
        };

        // Guardar sesión usando la función centralizada
        saveSession(session);

        // Sincronizar estructura legacy de usuarios en localStorage para componentes antiguos (ej. checkout)
        try {
          const usersKey = "lvup_users";
          const usersRaw = localStorage.getItem(usersKey);
          const users = usersRaw ? JSON.parse(usersRaw) : [];

          const userRecord = {
            id: session.id,
            nombre: usuario.nombre || session.displayName,
            apellidos: usuario.apellidos || "",
            email: usuario.correo,
            telefono: perfilCompleto?.telefono ?? "",
            direccion: perfilCompleto?.direccion ?? "",
            region: perfilCompleto?.region ?? usuario.region ?? "",
            comuna: perfilCompleto?.comuna ?? usuario.comuna ?? "",
            password: "",
            fechaNacimiento: perfilCompleto?.fechaNacimiento ?? "",
            genero: perfilCompleto?.genero ?? "",
            referralCode: perfilCompleto?.codigoReferido ?? "",
          };

          const existingIndex = users.findIndex((u: any) => String(u.id) === userRecord.id);
          if (existingIndex >= 0) {
            users[existingIndex] = { ...users[existingIndex], ...userRecord };
          } else {
            users.push(userRecord);
          }

          localStorage.setItem(usersKey, JSON.stringify(users));
        } catch (syncError) {
          console.warn("No se pudo sincronizar lvup_users", syncError);
        }

        // Mensaje de éxito
        alert(
          `¡Bienvenido, ${firstName}! Inicio de sesión exitoso.`
        );

        // Limpiar formulario
        setFormData({
          emailOrName: "",
          password: "",
        });

        // Redirigir al home
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Error al iniciar sesión. Verifica tus credenciales.";
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // toggle mostrar password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="wrapper">
      {/* contenido principal: formulario de inicio de sesion */}
      <section>
        {/* contenedor principal del formulario de login */}
        <div className="login-container">
          {/* cabecera del formulario con logo y títulos */}
          <div className="login-header">
            <img
              className="login-logo"
              src="https://levelup-gamer-products.s3.us-east-1.amazonaws.com/logo.png"
              alt="Logo Level Up"
            />
            <h1 className="company-name">Level Up</h1>
            <h2>Iniciar Sesión</h2>
          </div>

          {/* formulario de autenticacion */}
          <form onSubmit={handleSubmit}>
            {/* campo de entrada para email o nombre de usuario */}
            <div className="form-group">
              <input
                type="text"
                id="emailOrName"
                name="emailOrName"
              placeholder="Nombre o Correo Electrónico"
                value={formData.emailOrName}
                onChange={handleInputChange}
                className={errors.emailOrName ? "error" : ""}
                required
              />
              {/* contenedor para mostrar errores de validacion */}
              {errors.emailOrName && (
                <div className="error-message">{errors.emailOrName}</div>
              )}
            </div>

            {/* campo de entrada para contraseña con opcion de mostrar/ocultar */}
            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Contraseña (4-10 caracteres)"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "error" : ""}
                required
              />
              {/* icono para alternar visibilidad de la contraseña */}
              <i
                className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              />
              {/* contenedor para mostrar errores de validacion */}
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            {/* mostrar error general si existe */}
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}

            {/* boton de envio del formulario */}
            <button
              type="submit"
              className={`btn-login ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="bi bi-hourglass-split"></i>
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          {/* enlace para usuarios sin cuenta */}
          <p>
            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
