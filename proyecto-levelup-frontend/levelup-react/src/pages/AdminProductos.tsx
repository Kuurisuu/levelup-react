import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin.css';

type Producto = {
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockCritico: number | null;
  categoria: string;
  imagen: string;
};

type FormErrors = {
  codigo?: string;
  nombre?: string;
  precio?: string;
  stock?: string;
  categoria?: string;
};

const AdminProductos = () => {
  // estado para productos
  const [productos, setProductos] = useState<Producto[]>([]);
  
  // estado para el formulario
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    stockCritico: '',
    categoria: '',
    imagen: ''
  });

  // estado para errores
  const [errors, setErrors] = useState<FormErrors>({});

  // estado para edicion
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  // clave de storage
  const STORAGE_KEY = 'admin_productos';

  // funciones de storage
  const guardar = (lista: Producto[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  };

  const cargar = (): Producto[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  // cargar productos al montar componente
  useEffect(() => {
    const productosGuardados = cargar();
    setProductos(productosGuardados);
  }, []);

  // manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    // validar codigo
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es requerido';
    } else if (formData.codigo.trim().length < 3) {
      newErrors.codigo = 'El código debe tener al menos 3 caracteres';
    } else if (!editingProduct && productos.find(p => p.codigo === formData.codigo.trim())) {
      newErrors.codigo = 'Ya existe un producto con este código';
    }

    // validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length > 100) {
      newErrors.nombre = 'El nombre no puede tener más de 100 caracteres';
    }

    // validar precio
    if (!formData.precio) {
      newErrors.precio = 'El precio es requerido';
    } else if (Number(formData.precio) < 0) {
      newErrors.precio = 'El precio debe ser mayor o igual a 0';
    }

    // validar stock
    if (!formData.stock) {
      newErrors.stock = 'El stock es requerido';
    } else if (Number(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser mayor o igual a 0';
    }

    // validar categoria
    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
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

    const producto: Producto = {
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      stockCritico: formData.stockCritico ? Number(formData.stockCritico) : null,
      categoria: formData.categoria,
      imagen: formData.imagen.trim()
    };

    let nuevaLista;
    if (editingProduct) {
      // editar producto existente
      nuevaLista = productos.map(p => 
        p.codigo === editingProduct.codigo ? producto : p
      );
    } else {
      // agregar nuevo producto
      nuevaLista = [...productos, producto];
    }

    setProductos(nuevaLista);
    guardar(nuevaLista);
    handleReset();
  };

  // limpiar formulario
  const handleReset = () => {
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      stockCritico: '',
      categoria: '',
      imagen: ''
    });
    setErrors({});
    setEditingProduct(null);
  };

  // editar producto
  const handleEdit = (producto: Producto) => {
    setFormData({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      stockCritico: producto.stockCritico ? producto.stockCritico.toString() : '',
      categoria: producto.categoria,
      imagen: producto.imagen || ''
    });
    setEditingProduct(producto);
    setErrors({});
  };

  // eliminar producto
  const handleDelete = (codigo: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const nuevaLista = productos.filter(p => p.codigo !== codigo);
      setProductos(nuevaLista);
      guardar(nuevaLista);
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
                <Link to="/admin/usuarios">
                  <i className="bi bi-people-fill"></i> Usuarios
                </Link>
              </li>
              <li>
                <Link to="/admin/productos">
                  <i className="bi bi-controller"></i> Productos
                </Link>
              </li>
            </ul>
          </aside>

          <main className="admin-content">
            <h1>Productos</h1>
            
            <section>
              <h2>Crear / Editar producto</h2>
              <form id="form-producto" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="codigo">Código</label>
                  <input 
                    type="text" 
                    id="codigo" 
                    minLength={3} 
                    required 
                    value={formData.codigo}
                    onChange={handleInputChange}
                    disabled={!!editingProduct}
                  />
                  <small className="error" id="e-codigo">{errors.codigo}</small>
                </div>
                
                <div>
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    maxLength={100} 
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
                    maxLength={500}
                    value={formData.descripcion}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="precio">Precio</label>
                  <input 
                    type="number" 
                    id="precio" 
                    min="0" 
                    step="0.01" 
                    required 
                    value={formData.precio}
                    onChange={handleInputChange}
                  />
                  <small className="error" id="e-precio">{errors.precio}</small>
                </div>
                
                <div>
                  <label htmlFor="stock">Stock</label>
                  <input 
                    type="number" 
                    id="stock" 
                    min="0" 
                    step="1" 
                    required 
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                  <small className="error" id="e-stock">{errors.stock}</small>
                </div>
                
                <div>
                  <label htmlFor="stockCritico">Stock Crítico (opcional)</label>
                  <input 
                    type="number" 
                    id="stockCritico" 
                    min="0" 
                    step="1" 
                    value={formData.stockCritico}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="categoria">Categoría</label>
                  <select 
                    id="categoria" 
                    required 
                    value={formData.categoria}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione</option>
                    <option value="Juegos de Mesa">Juegos de Mesa</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Consolas">Consolas</option>
                    <option value="Computadores Gamers">Computadores Gamers</option>
                    <option value="Sillas Gamers">Sillas Gamers</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Mousepad">Mousepad</option>
                    <option value="Poleras Personalizadas">Poleras Personalizadas</option>
                    <option value="Polerones Gamers Personalizados">Polerones Gamers Personalizados</option>
                    <option value="Contacto Soporte">🎧 Soporte</option>
                  </select>
                  <small className="error" id="e-categoria">{errors.categoria}</small>
                </div>
                
                <div>
                  <label htmlFor="imagen">Imagen (URL opcional)</label>
                  <input 
                    type="url" 
                    id="imagen" 
                    value={formData.imagen}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <button type="submit">
                    {editingProduct ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button type="button" id="btn-reset" onClick={handleReset}>
                    Limpiar
                  </button>
                </div>
              </form>
            </section>

            <section>
              <h2>Listado</h2>
              <table id="tabla-productos">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(producto => (
                    <tr key={producto.codigo}>
                      <td>{producto.codigo}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoria}</td>
                      <td>${Number(producto.precio).toLocaleString('es-CL')}</td>
                      <td>{producto.stock}</td>
                      <td>
                        <button 
                          className="btn-editar" 
                          onClick={() => handleEdit(producto)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn-eliminar" 
                          onClick={() => handleDelete(producto.codigo)}
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

export default AdminProductos;