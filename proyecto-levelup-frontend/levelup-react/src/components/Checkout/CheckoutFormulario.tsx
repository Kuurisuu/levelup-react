import React, { useState, useEffect } from "react";
import { REGIONES, Region } from "../../utils/regiones";

interface CheckoutFormularioProps {
  onContinuar: (datos: DatosEnvio, guardarDatos?: boolean) => void;
  onCancelar: () => void;
  usuarioLogueado?: UsuarioLogueado | null;
}

interface DatosEnvio {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  departamento: string;
  region: string;
  comuna: string;
  indicadoresEntrega: string;
}

interface UsuarioLogueado {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  region: string;
  comuna: string;
}

//seteamos una constante de checkout donde tneemos los datos y si continaur o no 
const CheckoutFormulario: React.FC<CheckoutFormularioProps> = ({
  onContinuar,
  onCancelar,
  usuarioLogueado
}) => {
  const [formData, setFormData] = useState<DatosEnvio>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    departamento: "",
    region: "",
    comuna: "",
    indicadoresEntrega: ""
  });

  const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([]);
  const [errores, setErrores] = useState<Partial<DatosEnvio>>({});
  const [guardarDatos, setGuardarDatos] = useState<boolean>(true);

  // Cargar datos del usuario si está logueado
  useEffect(() => {
    if (usuarioLogueado) {
      console.log('Usuario logueado:', usuarioLogueado); // Debug
      setFormData({
        nombre: usuarioLogueado.nombre || "",
        apellido: (usuarioLogueado as any).apellidos || usuarioLogueado.apellido || "",
        email: usuarioLogueado.email || "",
        telefono: usuarioLogueado.telefono || "",
        direccion: usuarioLogueado.direccion || "",
        departamento: "",
        region: usuarioLogueado.region || "",
        comuna: usuarioLogueado.comuna || "",
        indicadoresEntrega: ""
      });
      
      // Cargar comunas de la región del usuario
      if (usuarioLogueado.region) {
        console.log('Cargando comunas para región del usuario:', usuarioLogueado.region); // Debug
        const regionSeleccionada = REGIONES.find(r => r.nombre === usuarioLogueado.region);
        if (regionSeleccionada) {
          setComunasDisponibles(regionSeleccionada.comunas);
          console.log('Comunas cargadas para región:', usuarioLogueado.region, regionSeleccionada.comunas); // Debug
        } else {
          console.log('Región del usuario no encontrada en REGIONES:', usuarioLogueado.region); // Debug
          console.log('Regiones disponibles:', REGIONES.map(r => r.nombre)); // Debug
          setComunasDisponibles([]);
        }
      } else {
        console.log('Usuario no tiene región definida'); // Debug
        setComunasDisponibles([]);
      }
    }
  }, [usuarioLogueado]);

  // Efecto adicional para cargar comunas cuando cambie la región
  useEffect(() => {
    if (formData.region) {
      console.log('Efecto: Cargando comunas para región:', formData.region); // Debug
      const region = REGIONES.find(r => r.nombre === formData.region);
      if (region) {
        setComunasDisponibles(region.comunas);
        console.log('Efecto: Comunas cargadas:', region.comunas); // Debug
      } else {
        console.log('Efecto: Región no encontrada'); // Debug
        setComunasDisponibles([]);
      }
    } else {
      setComunasDisponibles([]);
    }
  }, [formData.region]);

  // funcion para manejar el cambio de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; //name y value para el input
    setFormData(prev => ({
      ...prev,
      [name]: value //se actualiza el estado del formulario con el nuevo valor
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name as keyof DatosEnvio]) {
      setErrores(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
 
  /// esta funcion es para pegar el texto en el input pq se ponia en negro 
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Aplicar clase para forzar el color correcto del texto pegado
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    target.classList.add('text-pasted');
    
    // Remover la clase después de un breve momento para permitir que el CSS normal tome efecto
    setTimeout(() => {
      target.classList.remove('text-pasted');
    }, 100);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionSeleccionada = e.target.value;
    console.log('Región seleccionada:', regionSeleccionada); // Debug
    console.log('REGIONES disponibles:', REGIONES.map(r => r.nombre)); // Debug
    
    setFormData(prev => ({
      ...prev,
      region: regionSeleccionada,
      comuna: "" // Reset comuna cuando cambia la región
    }));

    // Actualizar comunas disponibles
    const region = REGIONES.find(r => r.nombre === regionSeleccionada);
    console.log('Región encontrada:', region); // Debug
    
    if (region) {
      setComunasDisponibles(region.comunas);
      console.log('Comunas cargadas:', region.comunas); // Debug
    } else {
      setComunasDisponibles([]);
      console.log('No se encontró la región, comunas vacías'); // Debug
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<DatosEnvio> = {};

    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es requerido";
    if (!formData.apellido.trim()) nuevosErrores.apellido = "El apellido es requerido";
    if (!formData.email.trim()) nuevosErrores.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nuevosErrores.email = "El email no es válido";
    if (!formData.telefono.trim()) nuevosErrores.telefono = "El teléfono es requerido";
    if (!formData.direccion.trim()) nuevosErrores.direccion = "La dirección es requerida";
    if (!formData.region) nuevosErrores.region = "La región es requerida";
    if (!formData.comuna) nuevosErrores.comuna = "La comuna es requerida";

    console.log('Errores de validación:', nuevosErrores); // Debug
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();// el prevent default es para que el formulario no se envie
    console.log('Formulario enviado, datos:', formData); // Debug
    console.log('Guardar datos:', guardarDatos); // Debug
    const esValido = validarFormulario();
    console.log('Formulario válido:', esValido); // Debug
    if (esValido) {
      onContinuar(formData, guardarDatos);
    }
  };

  return (
    <div className="checkout-formulario">
      <h2>Datos de Envío</h2>
      <form onSubmit={handleSubmit} className="formulario-envio">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={errores.nombre ? "error" : ""}
              disabled={false}
            />
            {errores.nombre && <span className="error-message">{errores.nombre}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido *</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              className={errores.apellido ? "error" : ""}
              disabled={false}
            />
            {errores.apellido && <span className="error-message">{errores.apellido}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errores.email ? "error" : ""}
              disabled={false}
            />
            {errores.email && <span className="error-message">{errores.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono *</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className={errores.telefono ? "error" : ""}
              disabled={false}
            />
            {errores.telefono && <span className="error-message">{errores.telefono}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección *</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            className={errores.direccion ? "error" : ""}
            disabled={false}
            placeholder="Calle, número, villa, etc."
          />
          {errores.direccion && <span className="error-message">{errores.direccion}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="departamento">Departamento/Casa (opcional)</label>
          <input
            type="text"
            id="departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleInputChange}
            placeholder="Número de departamento, casa, etc."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="region">Región *</label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleRegionChange}
              className={errores.region ? "error" : ""}
              disabled={false}
            >
              <option value="">Selecciona una región</option>
              {REGIONES.map((region: Region) => (
                <option key={region.nombre} value={region.nombre}>
                  {region.nombre}
                </option>
              ))}
            </select>
            {errores.region && <span className="error-message">{errores.region}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="comuna">Comuna *</label>
            <select
              id="comuna"
              name="comuna"
              value={formData.comuna}
              onChange={handleInputChange}
              className={errores.comuna ? "error" : ""}
              disabled={!formData.region}
            >
              <option value="">Selecciona una comuna</option>
              {comunasDisponibles.map((comuna: string) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
            {errores.comuna && <span className="error-message">{errores.comuna}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="indicadoresEntrega">Indicadores de entrega (opcional)</label>
          <textarea
            id="indicadoresEntrega"
            name="indicadoresEntrega"
            value={formData.indicadoresEntrega}
            onChange={handleInputChange}
            placeholder="Instrucciones especiales para la entrega, referencias, etc."
            rows={3}
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={guardarDatos}
              onChange={(e) => setGuardarDatos(e.target.checked)}
            />
            <span className="checkmark"></span>
            <div className="checkbox-text">
              Guardar mis datos para futuras compras
              <small className="checkbox-help">
                Tus datos se guardarán de forma segura para agilizar futuras compras
              </small>
            </div>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancelar} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" className="btn-continuar">
            Continuar al Resumen
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutFormulario;
