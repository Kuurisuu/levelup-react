import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin.css';

type Subcategoria = {
  id: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
};

type Categoria = {
  id: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
  subcategorias: Subcategoria[];
};

type FormErrors = {
  nombre?: string;
  descripcion?: string;
  subcategoriaNombre?: string;
  subcategoriaDescripcion?: string;
};

const AdminCategorias = () => {
  // estado para categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  // estado para el formulario de categoría
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activa: true
  });

  // estado para el formulario de subcategoría
  const [subcategoriaData, setSubcategoriaData] = useState({
    nombre: '',
    descripcion: '',
    activa: true
  });

  // estado para errores
  const [errors, setErrors] = useState<FormErrors>({});

  // estado para edición
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [editingSubcategoria, setEditingSubcategoria] = useState<{categoriaId: string, subcategoria: Subcategoria} | null>(null);

  // estado para categoría seleccionada en subcategorías
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>('');

  // clave de storage
  const STORAGE_KEY = 'admin_categorias';

  // funciones de storage
  const guardar = (lista: Categoria[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  };

  const cargar = (): Categoria[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  // categorías por defecto basadas en catalogo.ts
  const categoriasPorDefecto: Categoria[] = [
    {
      id: 'CO',
      nombre: 'Consola',
      descripcion: 'Consolas de videojuegos y accesorios oficiales',
      activa: true,
      subcategorias: [
        {
          id: 'MA',
          nombre: 'Mandos',
          descripcion: 'Controles oficiales para consolas',
          activa: true
        },
        {
          id: 'AC',
          nombre: 'Accesorios',
          descripcion: 'Accesorios oficiales para consolas',
          activa: true
        },
        {
          id: 'HA',
          nombre: 'Hardware',
          descripcion: 'Consolas y hardware principal',
          activa: true
        }
      ]
    },
    {
      id: 'PE',
      nombre: 'Perifericos',
      descripcion: 'Periféricos y accesorios para PC gaming',
      activa: true,
      subcategorias: [
        {
          id: 'TE',
          nombre: 'Teclados',
          descripcion: 'Teclados mecánicos y gaming',
          activa: true
        },
        {
          id: 'MO',
          nombre: 'Mouses',
          descripcion: 'Mouse gaming de alta precisión',
          activa: true
        },
        {
          id: 'AU',
          nombre: 'Auriculares',
          descripcion: 'Auriculares y headsets para gaming',
          activa: true
        },
        {
          id: 'MT',
          nombre: 'Monitores',
          descripcion: 'Monitores gaming de alta resolución',
          activa: true
        },
        {
          id: 'MI',
          nombre: 'Microfonos',
          descripcion: 'Micrófonos para streaming y gaming',
          activa: true
        },
        {
          id: 'CW',
          nombre: 'Camaras web',
          descripcion: 'Cámaras web para streaming',
          activa: true
        },
        {
          id: 'MP',
          nombre: 'Mousepad',
          descripcion: 'Alfombrillas para mouse gaming',
          activa: true
        },
        {
          id: 'SI',
          nombre: 'Sillas Gamers',
          descripcion: 'Sillas ergonómicas para gaming',
          activa: true
        }
      ]
    },
    {
      id: 'RO',
      nombre: 'Ropa',
      descripcion: 'Ropa personalizada con temática gaming',
      activa: true,
      subcategorias: [
        {
          id: 'PG',
          nombre: 'Polerones Gamers Personalizados',
          descripcion: 'Polerones con diseños exclusivos de gaming',
          activa: true
        },
        {
          id: 'PR',
          nombre: 'Poleras Personalizadas',
          descripcion: 'Poleras con diseños personalizados de gaming',
          activa: true
        }
      ]
    },
    {
      id: 'EN',
      nombre: 'Entretenimiento',
      descripcion: 'Juegos de mesa y entretenimiento familiar',
      activa: true,
      subcategorias: [
        {
          id: 'JM',
          nombre: 'Juegos de Mesa',
          descripcion: 'Juegos de mesa clásicos y modernos',
          activa: true
        }
      ]
    }
  ];

  // cargar categorías al montar componente
  useEffect(() => {
    const categoriasGuardadas = cargar();
    if (categoriasGuardadas.length === 0) {
      // Si no hay categorías guardadas, usar las por defecto
      setCategorias(categoriasPorDefecto);
      guardar(categoriasPorDefecto);
    } else {
      setCategorias(categoriasGuardadas);
    }
  }, []);

  // manejar cambios en el formulario de categoría
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
    
    // limpiar error del campo cuando el usuario empieza a escribir
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // manejar cambios en el formulario de subcategoría
  const handleSubcategoriaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    console.log('Input change - id:', id, 'value:', value, 'type:', type);
    
    // Mapear los IDs del formulario a las propiedades del estado
    let fieldName = id;
    if (id === 'subcategoriaNombre') fieldName = 'nombre';
    if (id === 'subcategoriaDescripcion') fieldName = 'descripcion';
    if (id === 'subcategoriaActiva') fieldName = 'activa';
    
    setSubcategoriaData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value
    }));
    
    console.log('Estado actualizado:', { [fieldName]: type === 'checkbox' ? checked : value });
    
    // limpiar error del campo cuando el usuario empieza a escribir
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // validar formulario de categoría
  const validateCategoriaForm = (): boolean => {
    const newErrors: FormErrors = {};

    // validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length > 50) {
      newErrors.nombre = 'El nombre no puede tener más de 50 caracteres';
    } else if (!editingCategoria && categorias.find(c => c.nombre.toLowerCase() === formData.nombre.trim().toLowerCase())) {
      newErrors.nombre = 'Ya existe una categoría con este nombre';
    }

    // validar descripción
    if (formData.descripcion.trim().length > 200) {
      newErrors.descripcion = 'La descripción no puede tener más de 200 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // validar formulario de subcategoría
  const validateSubcategoriaForm = (): boolean => {
    const newErrors: FormErrors = {};

    // validar nombre
    if (!subcategoriaData.nombre.trim()) {
      newErrors.subcategoriaNombre = 'El nombre es requerido';
    } else if (subcategoriaData.nombre.trim().length > 50) {
      newErrors.subcategoriaNombre = 'El nombre no puede tener más de 50 caracteres';
    } else {
      const categoria = categorias.find(c => c.id === selectedCategoriaId);
      if (categoria) {
        // Buscar si ya existe una subcategoría con el mismo nombre
        const subcategoriaExistente = categoria.subcategorias.find(s => 
          s.nombre.toLowerCase() === subcategoriaData.nombre.trim().toLowerCase()
        );
        
        // Si existe y no es la que estamos editando, mostrar error
        if (subcategoriaExistente && (!editingSubcategoria || subcategoriaExistente.id !== editingSubcategoria.subcategoria.id)) {
          newErrors.subcategoriaNombre = 'Ya existe una subcategoría con este nombre en esta categoría';
        }
      }
    }

    // validar descripción
    if (subcategoriaData.descripcion.trim().length > 200) {
      newErrors.subcategoriaDescripcion = 'La descripción no puede tener más de 200 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // manejar submit del formulario de categoría
  const handleCategoriaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCategoriaForm()) {
      return;
    }

    const categoria: Categoria = {
      id: editingCategoria ? editingCategoria.id : Date.now().toString(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      activa: formData.activa,
      subcategorias: editingCategoria ? editingCategoria.subcategorias : []
    };

    let nuevaLista;
    if (editingCategoria) {
      // editar categoría existente
      nuevaLista = categorias.map(c => 
        c.id === editingCategoria.id ? categoria : c
      );
    } else {
      // agregar nueva categoría
      nuevaLista = [...categorias, categoria];
    }

    setCategorias(nuevaLista);
    guardar(nuevaLista);
    handleCategoriaReset();
  };

  // manejar submit del formulario de subcategoría
  const handleSubcategoriaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submit subcategoría - editingSubcategoria:', editingSubcategoria);
    console.log('Submit subcategoría - subcategoriaData:', subcategoriaData);
    console.log('Submit subcategoría - selectedCategoriaId:', selectedCategoriaId);
    
    if (!validateSubcategoriaForm()) {
      console.log('Validación falló');
      return;
    }

    const subcategoria: Subcategoria = {
      id: editingSubcategoria ? editingSubcategoria.subcategoria.id : Date.now().toString(),
      nombre: subcategoriaData.nombre.trim(),
      descripcion: subcategoriaData.descripcion.trim(),
      activa: subcategoriaData.activa
    };

    console.log('Subcategoría a guardar:', subcategoria);

    const nuevaLista = categorias.map(categoria => {
      if (categoria.id === selectedCategoriaId) {
        let nuevasSubcategorias;
        if (editingSubcategoria) {
          // editar subcategoría existente
          console.log('Editando subcategoría existente');
          nuevasSubcategorias = categoria.subcategorias.map(s => 
            s.id === editingSubcategoria.subcategoria.id ? subcategoria : s
          );
        } else {
          // agregar nueva subcategoría
          console.log('Agregando nueva subcategoría');
          nuevasSubcategorias = [...categoria.subcategorias, subcategoria];
        }
        return { ...categoria, subcategorias: nuevasSubcategorias };
      }
      return categoria;
    });

    console.log('Nueva lista de categorías:', nuevaLista);
    setCategorias(nuevaLista);
    guardar(nuevaLista);
    handleSubcategoriaReset();
  };

  // limpiar formulario de categoría
  const handleCategoriaReset = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      activa: true
    });
    setErrors({});
    setEditingCategoria(null);
  };

  // limpiar formulario de subcategoría
  const handleSubcategoriaReset = () => {
    setSubcategoriaData({
      nombre: '',
      descripcion: '',
      activa: true
    });
    setErrors({});
    setEditingSubcategoria(null);
    setSelectedCategoriaId('');
  };

  // editar categoría
  const handleEditCategoria = (categoria: Categoria) => {
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      activa: categoria.activa
    });
    setEditingCategoria(categoria);
    setErrors({});
  };

  // editar subcategoría
  const handleEditSubcategoria = (categoriaId: string, subcategoria: Subcategoria) => {
    console.log('Editando subcategoría:', subcategoria);
    console.log('Categoría ID:', categoriaId);
    
    setSubcategoriaData({
      nombre: subcategoria.nombre,
      descripcion: subcategoria.descripcion,
      activa: subcategoria.activa
    });
    setEditingSubcategoria({ categoriaId, subcategoria });
    setSelectedCategoriaId(categoriaId);
    setErrors({});
    
    console.log('Estado actualizado - editingSubcategoria:', { categoriaId, subcategoria });
  };

  // eliminar categoría
  const handleDeleteCategoria = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto también eliminará todas sus subcategorías.')) {
      const nuevaLista = categorias.filter(c => c.id !== id);
      setCategorias(nuevaLista);
      guardar(nuevaLista);
    }
  };

  // eliminar subcategoría
  const handleDeleteSubcategoria = (categoriaId: string, subcategoriaId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta subcategoría?')) {
      const nuevaLista = categorias.map(categoria => {
        if (categoria.id === categoriaId) {
          return {
            ...categoria,
            subcategorias: categoria.subcategorias.filter(s => s.id !== subcategoriaId)
          };
        }
        return categoria;
      });
      setCategorias(nuevaLista);
      guardar(nuevaLista);
    }
  };

  // mostrar formulario de subcategoría
  const showSubcategoriaFormForCategoria = (categoriaId: string) => {
    setSelectedCategoriaId(categoriaId);
    handleSubcategoriaReset();
  };

  return (
    <div className="wrapper">
      <main>
        <div className="admin-layout">
          {/* SIDEBAR */}
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

          {/* CONTENIDO */}
          <main className="admin-content">
            <h1>Categorías</h1>
            
            {/* FORMULARIO DE CATEGORÍA */}
            <section>
              <h2>Crear / Editar categoría</h2>
              <form id="form-categoria" onSubmit={handleCategoriaSubmit} noValidate>
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
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea 
                    id="descripcion" 
                    maxLength={200}
                    value={formData.descripcion}
                    onChange={handleInputChange}
                  />
                  <small className="error" id="e-descripcion">{errors.descripcion}</small>
                </div>
                
                <div>
                  <label>
                    <input 
                      type="checkbox" 
                      id="activa" 
                      checked={formData.activa}
                      onChange={handleInputChange}
                    />
                    Categoría activa
                  </label>
                </div>
                
                <div>
                  <button type="submit">
                    {editingCategoria ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button type="button" onClick={handleCategoriaReset}>
                    Limpiar
                  </button>
                </div>
              </form>
            </section>

            {/* FORMULARIO DE SUBCATEGORÍA */}
            <section>
              <h2>Gestionar subcategorías</h2>
              <form id="form-subcategoria" onSubmit={handleSubcategoriaSubmit} noValidate>
                <div>
                  <label htmlFor="categoriaPadre">Categoría padre</label>
                  <select 
                    id="categoriaPadre" 
                    required 
                    value={selectedCategoriaId}
                    onChange={(e) => {
                      setSelectedCategoriaId(e.target.value);
                      // Limpiar formulario al cambiar de categoría
                      if (e.target.value !== selectedCategoriaId) {
                        handleSubcategoriaReset();
                      }
                    }}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategoriaId && (
                  <>
                    <div>
                      <label htmlFor="subcategoriaNombre">Nombre de la subcategoría</label>
                      <input 
                        type="text" 
                        id="subcategoriaNombre" 
                        maxLength={50} 
                        required 
                        value={subcategoriaData.nombre}
                        onChange={handleSubcategoriaInputChange}
                        placeholder="Ej: Teclados mecánicos"
                      />
                      <small className="error" id="e-subcategoriaNombre">{errors.subcategoriaNombre}</small>
                    </div>
                    
                    <div>
                      <label htmlFor="subcategoriaDescripcion">Descripción</label>
                      <textarea 
                        id="subcategoriaDescripcion" 
                        maxLength={200}
                        value={subcategoriaData.descripcion}
                        onChange={handleSubcategoriaInputChange}
                        placeholder="Describe brevemente esta subcategoría"
                      />
                      <small className="error" id="e-subcategoriaDescripcion">{errors.subcategoriaDescripcion}</small>
                    </div>
                    
                    <div>
                      <label>
                        <input 
                          type="checkbox" 
                          id="subcategoriaActiva" 
                          checked={subcategoriaData.activa}
                          onChange={handleSubcategoriaInputChange}
                        />
                        Subcategoría activa
                      </label>
                    </div>
                    
                    <div>
                      <button type="submit">
                        {editingSubcategoria ? 'Actualizar subcategoría' : 'Crear subcategoría'}
                      </button>
                      <button type="button" onClick={handleSubcategoriaReset}>
                        {editingSubcategoria ? 'Cancelar edición' : 'Limpiar'}
                      </button>
                    </div>

                    {/* Lista de subcategorías existentes */}
                    {categorias.find(c => c.id === selectedCategoriaId)?.subcategorias.length > 0 && (
                      <div className="subcategorias-existentes">
                        <h3>Subcategorías existentes en {categorias.find(c => c.id === selectedCategoriaId)?.nombre}</h3>
                        <div className="lista-subcategorias">
                          {categorias.find(c => c.id === selectedCategoriaId)?.subcategorias.map(subcategoria => (
                            <div key={subcategoria.id} className="item-subcategoria">
                              <div className="info-subcategoria">
                                <strong>{subcategoria.nombre}</strong>
                                <span className="descripcion-subcategoria">{subcategoria.descripcion}</span>
                                <span className={subcategoria.activa ? 'status-activo' : 'status-inactivo'}>
                                  {subcategoria.activa ? 'Activa' : 'Inactiva'}
                                </span>
                              </div>
                              <div className="acciones-subcategoria">
                                <button 
                                  className="btn-editar" 
                                  onClick={() => handleEditSubcategoria(selectedCategoriaId, subcategoria)}
                                  title="Editar subcategoría"
                                >
                                  Editar
                                </button>
                                <button 
                                  className="btn-eliminar" 
                                  onClick={() => handleDeleteSubcategoria(selectedCategoriaId, subcategoria.id)}
                                  title="Eliminar subcategoría"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </form>
            </section>

            {/* LISTADO DE CATEGORÍAS */}
            <section>
              <h2>Listado de categorías</h2>
              <div className="tabla-categorias-container">
                <table id="tabla-categorias">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Subcategorías</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map(categoria => (
                      <tr key={categoria.id}>
                        <td>
                          <strong>{categoria.nombre}</strong>
                        </td>
                        <td>
                          <span className="descripcion-categoria">
                            {categoria.descripcion}
                          </span>
                        </td>
                        <td>
                          <span className={categoria.activa ? 'status-activo' : 'status-inactivo'}>
                            {categoria.activa ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td>
                          <div className="subcategorias-info">
                            <span className="contador-subcategorias">
                              {categoria.subcategorias.length} subcategorías
                            </span>
                            <button 
                              className="btn-agregar-subcategoria"
                              onClick={() => showSubcategoriaFormForCategoria(categoria.id)}
                              title="Agregar subcategoría"
                            >
                              + Agregar
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="acciones-categoria">
                            <button 
                              className="btn-editar" 
                              onClick={() => handleEditCategoria(categoria)}
                              title="Editar categoría"
                            >
                              Editar
                            </button>
                            <button 
                              className="btn-eliminar" 
                              onClick={() => handleDeleteCategoria(categoria.id)}
                              title="Eliminar categoría"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* LISTADO DE SUBCATEGORÍAS */}
            {categorias.some(c => c.subcategorias.length > 0) && (
              <section>
                <h2>Subcategorías</h2>
                {categorias.map(categoria => 
                  categoria.subcategorias.length > 0 && (
                    <div key={categoria.id} className="subcategorias-section">
                      <h3>{categoria.nombre}</h3>
                      <table className="tabla-subcategorias">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoria.subcategorias.map(subcategoria => (
                            <tr key={subcategoria.id}>
                              <td>{subcategoria.nombre}</td>
                              <td>{subcategoria.descripcion}</td>
                              <td>
                                <span className={subcategoria.activa ? 'status-activo' : 'status-inactivo'}>
                                  {subcategoria.activa ? 'Activa' : 'Inactiva'}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="btn-editar" 
                                  onClick={() => handleEditSubcategoria(categoria.id, subcategoria)}
                                >
                                  Editar
                                </button>
                                <button 
                                  className="btn-eliminar" 
                                  onClick={() => handleDeleteSubcategoria(categoria.id, subcategoria.id)}
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </section>
            )}
          </main>
        </div>
      </main>
    </div>
  );
};

export default AdminCategorias;
