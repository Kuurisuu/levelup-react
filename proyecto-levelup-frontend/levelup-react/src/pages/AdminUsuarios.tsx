import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { REGIONES } from '../utils/regiones';
import '../styles/admin.css';

type Usuario = {
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  fechaNacimiento?: string;
  tipo: string;
  region: string;
  comuna: string;
  direccion: string;
};

type FormErrors = {
  run?: string;
  nombre?: string;
  apellidos?: string;
  correo?: string;
  tipo?: string;
  region?: string;
  comuna?: string;
  direccion?: string;
};

const AdminUsuarios = () => {
  // estado para usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  
  // estado para el formulario
  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    fechaNacimiento: '',
    tipoUsuario: '',
    region: '',
    comuna: '',
    direccion: ''
  });

  // estado para errores
  const [errors, setErrors] = useState<FormErrors>({});

  // estado para edicion
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  // estado para comunas disponibles
  const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([]);

  // dominios validos
  const EMAIL_DOMINIOS_VALIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

  // funciones de validacion
  const validarRun = (run: string): boolean => {
    return /^[0-9kK]{7,9}$/.test(run);
  };

  const dominioValido = (correo: string): boolean => {
    const partes = correo.split('@');
    if (partes.length !== 2) return false;
    return EMAIL_DOMINIOS_VALIDOS.includes(partes[1]);
  };

  // funciones de storage
  const guardarEnLocalStorage = (lista: Usuario[]) => {
    localStorage.setItem('admin_usuarios', JSON.stringify(lista));
  };

  const cargarDesdeLocalStorage = (): Usuario[] => {
    try {
      return JSON.parse(localStorage.getItem('admin_usuarios') || '[]');
    } catch {
      return [];
    }
  };

  // cargar usuarios al montar componente
  useEffect(() => {
    const usuariosGuardados = cargarDesdeLocalStorage();
    setUsuarios(usuariosGuardados);
  }, []);

  // actualizar comunas cuando cambia la region
  useEffect(() => {
    if (formData.region) {
      const region = REGIONES.find(r => r.nombre === formData.region);
      setComunasDisponibles(region ? region.comunas : []);
      // limpiar comuna si no esta en la nueva region
      if (formData.comuna && region && !region.comunas.includes(formData.comuna)) {
        setFormData(prev => ({ ...prev, comuna: '' }));
      }
    } else {
      setComunasDisponibles([]);
      setFormData(prev => ({ ...prev, comuna: '' }));
    }
  }, [formData.region, formData.comuna]);

  // manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // limpiar error del campo cuando el usuario empieza a escribir
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // validar formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // validar run
    if (!formData.run.trim()) {
      newErrors.run = 'El RUN es requerido';
    } else if (!validarRun(formData.run.trim())) {
      newErrors.run = 'RUN inválido (7-9 dígitos, puede terminar en K)';
    } else if (!editingUser && usuarios.find(u => u.run === formData.run.trim())) {
      newErrors.run = 'Ya existe un usuario con este RUN';
    }

    // validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length > 50) {
      newErrors.nombre = 'El nombre no puede tener más de 50 caracteres';
    }

    // validar apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    } else if (formData.apellidos.trim().length > 100) {
      newErrors.apellidos = 'Los apellidos no pueden tener más de 100 caracteres';
    }

    // validar correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!dominioValido(formData.correo.trim())) {
      newErrors.correo = `Dominio no válido. Use: ${EMAIL_DOMINIOS_VALIDOS.join(', ')}`;
    } else if (!editingUser && usuarios.find(u => u.correo === formData.correo.trim())) {
      newErrors.correo = 'Ya existe un usuario con este correo';
    }

    // validar tipo de usuario
    if (!formData.tipoUsuario) {
      newErrors.tipo = 'El tipo de usuario es requerido';
    }

    // validar region
    if (!formData.region) {
      newErrors.region = 'La región es requerida';
    }

    // validar comuna
    if (!formData.comuna) {
      newErrors.comuna = 'La comuna es requerida';
    }

    // validar direccion
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    } else if (formData.direccion.trim().length > 300) {
      newErrors.direccion = 'La dirección no puede tener más de 300 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // manejar submit del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const usuario: Usuario = {
      run: formData.run.trim(),
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      correo: formData.correo.trim(),
      fechaNacimiento: formData.fechaNacimiento,
      tipo: formData.tipoUsuario,
      region: formData.region,
      comuna: formData.comuna,
      direccion: formData.direccion.trim()
    };

    let nuevaLista;
    if (editingUser) {
      // editar usuario existente
      nuevaLista = usuarios.map(u => 
        u.run === editingUser.run ? usuario : u
      );
    } else {
      // agregar nuevo usuario
      nuevaLista = [...usuarios, usuario];
    }

    setUsuarios(nuevaLista);
    guardarEnLocalStorage(nuevaLista);
    handleReset();
  };

  // limpiar formulario
  const handleReset = () => {
    setFormData({
      run: '',
      nombre: '',
      apellidos: '',
      correo: '',
      fechaNacimiento: '',
      tipoUsuario: '',
      region: '',
      comuna: '',
      direccion: ''
    });
    setErrors({});
    setEditingUser(null);
    setComunasDisponibles([]);
  };

  // editar usuario
  const handleEdit = (usuario: Usuario) => {
    setFormData({
      run: usuario.run,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      fechaNacimiento: usuario.fechaNacimiento || '',
      tipoUsuario: usuario.tipo,
      region: usuario.region,
      comuna: usuario.comuna,
      direccion: usuario.direccion
    });
    setEditingUser(usuario);
    setErrors({});
  };

  // eliminar usuario
  const handleDelete = (run: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      const nuevaLista = usuarios.filter(u => u.run !== run);
      setUsuarios(nuevaLista);
      guardarEnLocalStorage(nuevaLista);
    }
  };

  return (
    <div className="wrapper">
      <main>
        <div className="admin-layout">
          <aside className="sidebar">
            <h2>Admin</h2>
            <ul>
              <li>
                <Link to="/admin/dashboard">
                  <i className="bi bi-speedometer2"></i> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/usuarios">
                  <i className="bi bi-people-fill"></i> Usuarios
                </Link>
              </li>
              <li>
                <Link to="/admin/productos">
                  <i className="bi bi-controller"></i> Productos
                </Link>
              </li>
              <li>
                <Link to="/admin/ordenes">
                  <i className="bi bi-cart-check"></i> Órdenes
                </Link>
              </li>
              <li>
                <Link to="/admin/categorias">
                  <i className="bi bi-tags"></i> Categorías
                </Link>
              </li>
              <li>
                <Link to="/admin/reportes">
                  <i className="bi bi-graph-up"></i> Reportes
                </Link>
              </li>
            </ul>
          </aside>

          <main className="admin-content">
            <h1>Usuarios</h1>
            
            <section>
              <h2>Crear / Editar usuario</h2>
              <form id="form-usuario" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="run">RUN (sin puntos ni guion)</label>
                  <input 
                    type="text" 
                    id="run" 
                    maxLength={9} 
                    required 
                    value={formData.run}
                    onChange={handleInputChange}
                    disabled={!!editingUser}
                  />
                  <small className="error" id="e-run">{errors.run}</small>
                </div>
                
                <div>
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    maxLength={50} 
                    required 
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                  <small className="error" id="e-nombre">{errors.nombre}</small>
                </div>
                
                <div>
                  <label htmlFor="apellidos">Apellidos</label>
                  <input 
                    type="text" 
                    id="apellidos" 
                    maxLength={100} 
                    required 
                    value={formData.apellidos}
                    onChange={handleInputChange}
                  />
                  <small className="error" id="e-apellidos">{errors.apellidos}</small>
                </div>
                
                <div>
                  <label htmlFor="correo">Correo</label>
                  <input 
                    type="email" 
                    id="correo" 
                    maxLength={100} 
                    required 
                    placeholder="usuario@duoc.cl" 
                    value={formData.correo}
                    onChange={handleInputChange}
                    disabled={!!editingUser}
                  />
                  <small className="error" id="e-correo">{errors.correo}</small>
                </div>
                
                <div>
                  <label htmlFor="fechaNacimiento">Fecha Nacimiento</label>
                  <input 
                    type="date" 
                    id="fechaNacimiento" 
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="tipoUsuario">Tipo de Usuario</label>
                  <select 
                    id="tipoUsuario" 
                    required 
                    value={formData.tipoUsuario}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="VENDEDOR">Vendedor</option>
                    <option value="CLIENTE">Cliente</option>
                  </select>
                  <small className="error" id="e-tipo">{errors.tipo}</small>
                </div>
                
                <div>
                  <label htmlFor="region">Región</label>
                  <select 
                    id="region" 
                    required 
                    value={formData.region}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione</option>
                    {REGIONES.map(region => (
                      <option key={region.nombre} value={region.nombre}>
                        {region.nombre}
                      </option>
                    ))}
                  </select>
                  <small className="error" id="e-region">{errors.region}</small>
                </div>
                
                <div>
                  <label htmlFor="comuna">Comuna</label>
                  <select 
                    id="comuna" 
                    required 
                    value={formData.comuna}
                    onChange={handleInputChange}
                    disabled={!formData.region}
                  >
                    <option value="">Seleccione</option>
                    {comunasDisponibles.map(comuna => (
                      <option key={comuna} value={comuna}>
                        {comuna}
                      </option>
                    ))}
                  </select>
                  <small className="error" id="e-comuna">{errors.comuna}</small>
                </div>
                
                <div>
                  <label htmlFor="direccion">Dirección</label>
                  <input 
                    type="text" 
                    id="direccion" 
                    maxLength={300} 
                    required 
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                  <small className="error" id="e-direccion">{errors.direccion}</small>
                </div>
                
                <div>
                  <button type="submit">
                    {editingUser ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button type="button" id="btn-reset" onClick={handleReset}>
                    Limpiar
                  </button>
                </div>
              </form>
            </section>

            <section>
              <h2>Listado</h2>
              <table id="tabla-usuarios">
                <thead>
                  <tr>
                    <th>RUN</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Correo</th>
                    <th>Tipo</th>
                    <th>Región</th>
                    <th>Comuna</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => (
                    <tr key={usuario.run}>
                      <td>{usuario.run}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.apellidos}</td>
                      <td>{usuario.correo}</td>
                      <td>{usuario.tipo}</td>
                      <td>{usuario.region}</td>
                      <td>{usuario.comuna}</td>
                      <td>
                        <button 
                          className="btn-editar" 
                          onClick={() => handleEdit(usuario)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn-eliminar" 
                          onClick={() => handleDelete(usuario.run)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </main>
        </div>
      </main>
    </div>
  );
};

export default AdminUsuarios;