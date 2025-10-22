import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/register.css';

interface RegisterFormData {
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
  terminos: boolean;
}

interface RegisterErrors {
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
  role?: string;
}

interface UserSession {
  displayName: string;
  loginAt: number;
  userId: string;
  role?: string;
}

const Register: React.FC = (): React.JSX.Element => {
  const navigate = useNavigate();
  
  // estados para el formulario de registro
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: '',
    terminos: false
  });

  // estado para errores de validacion
  const [errors, setErrors] = useState<RegisterErrors>({});

  // estado para mostrar/ocultar passwords
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // estado para loading del formulario
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // datos para regiones y comunas de Chile
  const regionesYComunas: RegionesYComunas = {
    'Región Metropolitana': ['Santiago', 'Las Condes', 'Providencia', 'Ñuñoa', 'Maipú', 'La Florida', 'Puente Alto'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana', 'San Antonio'],
    'Biobío': ['Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles', 'Coronel'],
    'Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel'],
    'Antofagasta': ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones'],
    'Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte'],
    'Arica y Parinacota': ['Arica', 'Putre', 'Camarones']
  };

  // Funciones auxiliares para manejo de usuarios
  const readUsers = (): User[] => {
    try {
      return JSON.parse(localStorage.getItem('lvup_users') || '[]');
    } catch {
      return [];
    }
  };

  const writeUsers = (users: User[]): void => {
    localStorage.setItem('lvup_users', JSON.stringify(users));
  };

  const generateUserId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const generateReferralCode = (nombre: string): string => {
    const raw = nombre.replace(/\s+/g, '').toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    // Usar hasta 6 caracteres del nombre + 4 aleatorios = máximo 10 caracteres
    const namepart = raw.slice(0, 6);
    return namepart + rand;
  };

  const createUserSession = (user: User): void => {
    const firstName = user.nombre.split(' ')[0];
    const session: UserSession = {
      displayName: firstName,
      loginAt: Date.now(),
      userId: user.id,
      role: 'cliente'
    };
    localStorage.setItem('lvup_user_session', JSON.stringify(session));
  };

  const emailExists = (email: string): boolean => {
    const users = readUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  };

  // manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // limpiar errores al escribir
    if (errors[name as keyof RegisterErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // limpiar comuna cuando cambia la región
    if (name === 'region') {
      setFormData(prev => ({
        ...prev,
        comuna: ''
      }));
    }
  };

  // validar formulario
  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    // validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // validar apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    } else if (formData.apellidos.length < 2) {
      newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
    }

    // validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 4 || formData.password.length > 10) {
      newErrors.password = 'La contraseña debe tener entre 4 y 10 caracteres';
    }

    // validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // validar fecha de nacimiento (mayor de edad)
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else {
      const today = new Date();
      const birthDate = new Date(formData.fechaNacimiento);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.fechaNacimiento = 'Debes ser mayor de 18 años';
      }
    }

    // validar teléfono (opcional pero con formato)
    if (formData.telefono && !/^\+?[0-9\s-()]+$/.test(formData.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido';
    }

    // validar región y comuna
    if (!formData.region) {
      newErrors.region = 'Selecciona una región';
    }

    if (!formData.comuna) {
      newErrors.comuna = 'Selecciona una comuna';
    }

    // validar términos y condiciones
    if (!formData.terminos) {
      newErrors.terminos = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // manejar envio del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Verificar si el email ya existe
    if (emailExists(formData.email)) {
      setErrors({ general: 'Este email ya está registrado. Usa otro o inicia sesión.' });
      return;
    }

    setIsLoading(true);
    
    try {
      // simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Crear nuevo usuario
      const userId = generateUserId();
      const newUser: User = {
        id: userId,
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password, // En producción esto debería estar hasheado
        telefono: formData.telefono || undefined,
        fechaNacimiento: formData.fechaNacimiento || undefined,
        region: formData.region || undefined,
        comuna: formData.comuna || undefined,
        direccion: formData.direccion || undefined,
        referralCode: generateReferralCode(formData.nombre),
        points: 0,
        role: 'cliente'
      };

      // Guardar usuario
      const users = readUsers();
      users.push(newUser);
      writeUsers(users);

      // Crear sesión automáticamente
      createUserSession(newUser);

      // Mensaje de éxito
      const firstName = formData.nombre.split(' ')[0];
      alert(`¡Registro exitoso, ${firstName}! Bienvenido a Level-Up Gamer. Tu código de referido es: ${newUser.referralCode}`);
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        fechaNacimiento: '',
        region: '',
        comuna: '',
        direccion: '',
        terminos: false
      });
      
      // Redirigir al home
      navigate('/');
      
      // Forzar recarga para actualizar header
      window.location.reload();
      
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setErrors({ general: 'Error al crear la cuenta. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      {/* contenido principal: formulario de registro de usuario */}
      <main>
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
                className={errors.nombre ? 'error' : ''}
              />
              {errors.nombre && <div className="error-message">{errors.nombre}</div>}
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
                className={errors.apellidos ? 'error' : ''}
              />
              {errors.apellidos && <div className="error-message">{errors.apellidos}</div>}
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
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
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
                className={errors.password ? 'error' : ''}
                minLength={4}
                maxLength={10}
              />
              <i 
                className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}
                onClick={() => setShowPassword(!showPassword)}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
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
                className={errors.confirmPassword ? 'error' : ''}
                minLength={4}
                maxLength={10}
              />
              <i 
                className={`bi ${showConfirmPassword ? 'bi-eye' : 'bi-eye-slash'}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
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
                className={errors.telefono ? 'error' : ''}
              />
              {errors.telefono && <div className="error-message">{errors.telefono}</div>}
            </div>

            {/* campo de entrada para la fecha de nacimiento */}
            <div className="form-group">
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                className={errors.fechaNacimiento ? 'error' : ''}
              />
              {errors.fechaNacimiento && <div className="error-message">{errors.fechaNacimiento}</div>}
            </div>

            {/* seleccion de region */}
            <div className="form-group">
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className={errors.region ? 'error' : ''}
              >
                <option value="">Selecciona una región</option>
                {Object.keys(regionesYComunas).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {errors.region && <div className="error-message">{errors.region}</div>}
            </div>

            {/* seleccion de comuna */}
            <div className="form-group">
              <select
                id="comuna"
                name="comuna"
                value={formData.comuna}
                onChange={handleInputChange}
                className={errors.comuna ? 'error' : ''}
                disabled={!formData.region}
              >
                <option value="">
                  {formData.region ? 'Selecciona una comuna' : 'Primero selecciona una región'}
                </option>
                {formData.region && regionesYComunas[formData.region]?.map(comuna => (
                  <option key={comuna} value={comuna}>{comuna}</option>
                ))}
              </select>
              {errors.comuna && <div className="error-message">{errors.comuna}</div>}
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

            {/* checkbox para aceptar terminos y condiciones */}
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="terminos"
                name="terminos"
                checked={formData.terminos}
                onChange={handleInputChange}
                className={errors.terminos ? 'error' : ''}
              />
              <label htmlFor="terminos">
                Acepto los <a href="/terminos" target="_blank">términos y condiciones</a>
              </label>
              {errors.terminos && <div className="error-message">{errors.terminos}</div>}
            </div>

            {/* mensaje de error general */}
            {errors.general && (
              <div className="error-message general-error">{errors.general}</div>
            )}

            {/* boton de envio del formulario */}
            <button 
              type="submit" 
              className={`btn-register ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          {/* enlace para ir al login si ya tienes cuenta */}
          <p className="login-link">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;