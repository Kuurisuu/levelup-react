import { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos } from '../data/catalogo';
import '../styles/admin.css';

type ProductoAdmin = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockCritico: number | null;
  categoria: string;
  subcategoria?: string;
  imagen: string;
  disponible: boolean;
  destacado: boolean;
  fabricante?: string;
  distribuidor?: string;
  descuento?: number;
  rating: number;
};

type FormErrors = {
  codigo?: string;
  nombre?: string;
  precio?: string;
  stock?: string;
  categoria?: string;
};

// Componente memoizado para filas de productos
const FilaProducto = memo(({ 
  producto, 
  onEdit, 
  onDelete 
}: { 
  producto: ProductoAdmin; 
  onEdit: (producto: ProductoAdmin) => void; 
  onDelete: (id: string) => void; 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const imageSrc = imageError 
    ? './img/otros/placeholder.png' 
    : (producto.imagen.startsWith('./') ? producto.imagen : `./${producto.imagen}`);
  
  return (
    <tr key={producto.id}>
      <td>
        <div className="contenedor-imagen-producto">
          <img 
            src={imageSrc}
            alt={producto.nombre}
            className={`imagen-producto-tabla ${imageLoaded ? 'loaded' : 'loading'}`}
            loading="lazy"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>
      </td>
      <td>
        <strong>{producto.codigo}</strong>
      </td>
      <td>
        <div className="info-producto">
          <strong>{producto.nombre}</strong>
          {producto.destacado && <span className="badge-destacado">Destacado</span>}
        </div>
      </td>
      <td>{producto.categoria}</td>
      <td>{producto.subcategoria || '-'}</td>
      <td>
        <div className="precio-info">
          {producto.descuento && producto.descuento > 0 ? (
            <>
              <span className="precio-original">${Number(producto.precio).toLocaleString('es-CL')}</span>
              <span className="precio-descuento">${Number(producto.precio * (1 - producto.descuento / 100)).toLocaleString('es-CL')}</span>
              <span className="descuento-badge">-{producto.descuento}%</span>
            </>
          ) : (
            <span>${Number(producto.precio).toLocaleString('es-CL')}</span>
          )}
        </div>
      </td>
      <td>
        <span className={producto.stock <= 5 ? 'stock-bajo' : 'stock-normal'}>
          {producto.stock}
        </span>
      </td>
      <td>
        <span className={producto.disponible ? 'status-disponible' : 'status-no-disponible'}>
          {producto.disponible ? 'Disponible' : 'No disponible'}
        </span>
      </td>
      <td>
        <div className="rating-info">
          <span className="rating-stars">★</span>
          <span>{producto.rating ? producto.rating.toFixed(1) : '0.0'}</span>
        </div>
      </td>
      <td>
        <div className="acciones-producto">
          <button 
            className="btn-editar" 
            onClick={() => onEdit(producto)}
            title="Editar producto"
          >
            Editar
          </button>
          <button 
            className="btn-eliminar" 
            onClick={() => onDelete(producto.id)}
            title="Eliminar producto"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
});

const AdminProductos = () => {
  // estado para productos
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  
  // estado para el formulario
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    stockCritico: '',
    categoria: '',
    subcategoria: '',
    imagen: '',
    fabricante: '',
    distribuidor: '',
    descuento: '',
    rating: ''
  });

  // estado para errores
  const [errors, setErrors] = useState<FormErrors>({});

  // estado para edicion
  const [editingProduct, setEditingProduct] = useState<ProductoAdmin | null>(null);

  // clave de storage
  const STORAGE_KEY = 'admin_productos';

  // función para convertir producto del catálogo a formato admin (memoizada)
  const convertirProductoCatalogo = useCallback((producto: any): ProductoAdmin => {
    return {
      id: producto.id || `prod_${Date.now()}`,
      codigo: producto.id || `prod_${Date.now()}`, // Usar el ID como código
      nombre: producto.nombre || 'Sin nombre',
      descripcion: producto.descripcion || '',
      precio: producto.precio || 0,
      stock: producto.stock || 0,
      stockCritico: null,
      categoria: producto.categoria?.nombre || 'Sin categoría',
      subcategoria: producto.subcategoria?.nombre || '',
      imagen: producto.imagenUrl || './img/otros/placeholder.png',
      disponible: producto.disponible !== undefined ? producto.disponible : true,
      destacado: producto.destacado || false,
      fabricante: producto.fabricante || '',
      distribuidor: producto.distribuidor || '',
      descuento: producto.descuento || 0,
      rating: producto.rating || 0
    };
  }, []);

  // funciones de storage
  const guardar = (lista: ProductoAdmin[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  };

  const cargar = (): ProductoAdmin[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  // cargar productos al montar componente
  useEffect(() => {
    try {
      // Cargar productos del catálogo
      const productosCatalogo = obtenerProductos();
      const productosConvertidos = productosCatalogo.map(convertirProductoCatalogo);
      
      // Cargar productos guardados localmente
      const productosGuardados = cargar();
      
      // Combinar productos del catálogo con los guardados localmente
      // Los productos guardados localmente tienen prioridad sobre los del catálogo
      const productosCombinados = [...productosConvertidos];
      
      // Agregar productos guardados que no estén en el catálogo
      productosGuardados.forEach(productoGuardado => {
        if (!productosCombinados.find(p => p.id === productoGuardado.id)) {
          productosCombinados.push(productoGuardado);
        }
      });
      
      setProductos(productosCombinados);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, [convertirProductoCatalogo]);

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

    const producto: ProductoAdmin = {
      id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      stockCritico: formData.stockCritico ? Number(formData.stockCritico) : null,
      categoria: formData.categoria,
      subcategoria: formData.subcategoria || '',
      imagen: formData.imagen.trim() || './img/otros/placeholder.png',
      disponible: true,
      destacado: false,
      fabricante: formData.fabricante || '',
      distribuidor: formData.distribuidor || '',
      descuento: formData.descuento ? Number(formData.descuento) : 0,
      rating: formData.rating ? Number(formData.rating) : 0
    };

    let nuevaLista;
    if (editingProduct) {
      // editar producto existente
      nuevaLista = productos.map(p => 
        p.id === editingProduct.id ? producto : p
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
      subcategoria: '',
      imagen: '',
      fabricante: '',
      distribuidor: '',
      descuento: '',
      rating: ''
    });
    setErrors({});
    setEditingProduct(null);
  };

  // editar producto
  const handleEdit = (producto: ProductoAdmin) => {
    setFormData({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      stockCritico: producto.stockCritico ? producto.stockCritico.toString() : '',
      categoria: producto.categoria,
      subcategoria: producto.subcategoria || '',
      imagen: producto.imagen || '',
      fabricante: producto.fabricante || '',
      distribuidor: producto.distribuidor || '',
      descuento: producto.descuento ? producto.descuento.toString() : '',
      rating: producto.rating ? producto.rating.toString() : ''
    });
    setEditingProduct(producto);
    setErrors({});
  };

  // eliminar producto
  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const nuevaLista = productos.filter(p => p.id !== id);
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
              <h2>Listado de productos</h2>
              <div className="tabla-productos-container">
                <table id="tabla-productos">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Subcategoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Rating</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(producto => (
                      <FilaProducto
                        key={producto.id}
                        producto={producto}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </main>
    </div>
  );
};

export default AdminProductos;