import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

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

interface User {
  id: string;
  nombre: string;
  apellidos?: string;
  email: string;
  password: string;
  referralCode?: string;
}

interface UserSession {
  displayName: string;
  loginAt: number;
  userId: string;
  role?: string;
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

  // Funciones auxiliares para manejo de usuarios
  const readUsers = (): User[] => {
    try {
      return JSON.parse(localStorage.getItem("lvup_users") || "[]");
    } catch {
      return [];
    }
  };

  const findUser = (emailOrName: string, password: string): User | null => {
    const users = readUsers();
    return (
      users.find(
        (user) =>
          (user.email === emailOrName || user.nombre === emailOrName) &&
          user.password === password
      ) || null
    );
  };

  const saveUserSession = (user: User): void => {
    // Extraer solo el primer nombre
    const firstName = user.nombre.split(" ")[0];
    const session: UserSession = {
      displayName: firstName,
      loginAt: Date.now(),
      userId: user.id,
      role: "cliente", // Por defecto cliente, podría extenderse para roles admin/vendedor
    };
    localStorage.setItem("lvup_user_session", JSON.stringify(session));
  };

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

    if (!formData.emailOrName.trim()) {
      newErrors.emailOrName = "El nombre o email es requerido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 4 || formData.password.length > 10) {
      newErrors.password = "La contraseña debe tener entre 4 y 10 caracteres";
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
      // simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Buscar usuario en localStorage
      const user = findUser(formData.emailOrName.trim(), formData.password);

      if (user) {
        // Usuario encontrado - guardar sesión
        saveUserSession(user);

        // Mensaje de éxito
        alert(
          `¡Bienvenido, ${user.nombre.split(" ")[0]}! Inicio de sesión exitoso.`
        );

        // Limpiar formulario
        setFormData({
          emailOrName: "",
          password: "",
        });

        // Redirigir al home
        navigate("/");

        // Forzar recarga para actualizar header
        window.location.reload();
      } else {
        // Usuario no encontrado o contraseña incorrecta
        setErrors({
          general:
            "Email/Usuario o contraseña incorrectos. Verifica tus credenciales.",
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrors({ general: "Error al iniciar sesión. Inténtalo de nuevo." });
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
              src="/img/otros/logo.png"
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
