import { useEffect, useState } from "react";
import { Producto, obtenerProductos, cargarProductosDesdeCache, recargarProductosDesdeBackend } from "../data/catalogo";

// Definición de tipos
export interface Filtros {
  categoria: string;
  subcategorias: string[];
  texto: string;
  precioMin: string;
  precioMax: string;
  disponible: boolean;
  rating: number;
  orden: string;
}

export interface UseFiltrosReturn {
  filtros: Filtros;
  setCategoria: (id: string) => void;
  toggleSubcategoria: (id: string) => void;
  setTexto: (texto: string) => void;
  setPrecioMin: (precio: string) => void;
  setPrecioMax: (precio: string) => void;
  setDisponible: (disponible: boolean) => void;
  setRating: (rating: number) => void;
  setOrden: (orden: string) => void;
  limpiarFiltros: () => void;
  productosFiltrados: Producto[];
  actualizar: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  setFiltros: React.Dispatch<React.SetStateAction<Filtros>>;
  pagina: number;
  totalPaginas: number;
  totalElementos: number;
  cargando: boolean;
  siguientePagina: () => void;
  anteriorPagina: () => void;
  irAPagina: (pag: number) => void;
}

export function useFiltros(): UseFiltrosReturn {
  const [filtros, setFiltros] = useState<Filtros>({
    categoria: "todos",
    subcategorias: [],
    texto: "",
    precioMin: "",
    precioMax: "",
    disponible: false,
    rating: 0,
    orden: "relevancia",
  });

  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [todosLosProductos, setTodosLosProductos] = useState<Producto[]>([]);
  const [pagina, setPagina] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);
  const [totalElementos, setTotalElementos] = useState<number>(0);
  const [cargando, setCargando] = useState<boolean>(false);

  const setCategoria = (id: string) =>
    setFiltros((prev) => ({ ...prev, categoria: id, subcategorias: [] }));

  const toggleSubcategoria = (id: string) => {
    setFiltros((prev) => {
      // Si es un checkbox 'Todos' (ALL-XXX)
      if (id.startsWith("ALL-")) {
        const cat = id.replace("ALL-", "");
        // Al marcar 'Todos', quitar todas las subcategorías de esa categoría y dejar solo el ALL-XXX
        const nuevas = [
          ...prev.subcategorias.filter(
            (s) => !isSubcatOfCategory(s, cat) || s === id
          ),
        ];
        if (!prev.subcategorias.includes(id)) {
          nuevas.push(id);
        }
        // Al seleccionar ALL-XXX solo actualizamos el conjunto de subcategorías; no tocamos 'categoria'
        return { ...prev, subcategorias: nuevas };
      } else {
        // Si se marca una subcategoría normal, quitar el ALL-XXX de esa categoría
        const cat = getCategoryOfSubcat(id);
        let nuevas = prev.subcategorias.filter((s) => s !== `ALL-${cat}`);
        if (prev.subcategorias.includes(id)) {
          nuevas = nuevas.filter((s) => s !== id);
        } else {
          nuevas.push(id);
        }
        // Solo actualizamos subcategorías; dejamos que el usuario controle la categoría con el botón 'Todas' si lo desea.
        return { ...prev, subcategorias: nuevas };
      }
    });
  };

  // Helpers para saber a qué categoría pertenece una subcategoría
  function isSubcatOfCategory(subcat: string, cat: string): boolean {
    if (subcat.startsWith("ALL-")) return subcat === `ALL-${cat}`;
    // Mapea aquí tus subcategorías a categorías
    const map: Record<string, string[]> = {
      EN: ["JM"],
      CO: ["MA", "HA", "AC"],
      PE: ["MO", "TE", "AU", "MT", "MI", "CW"],
      RO: ["PG", "PR"],
    };
    return map[cat] && map[cat].includes(subcat);
  }

  function getCategoryOfSubcat(subcat: string): string {
    const map: Record<string, string> = {
      JM: "EN",
      MA: "CO",
      HA: "CO",
      AC: "CO",
      MO: "PE",
      TE: "PE",
      AU: "PE",
      MT: "PE",
      MI: "PE",
      CW: "PE",
      PG: "RO",
      PR: "RO",
    };
    return map[subcat] || "";
  }

  const actualizar = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { id, value, type } = e.target;
    const checked = "checked" in e.target ? e.target.checked : false;
    setFiltros((prev) => ({
      ...prev,
      [id]:
        type === "checkbox"
          ? checked
          : id === "precioMin" || id === "precioMax" || id === "rating"
          ? value
          : value,
    }));
  };

  const limpiarFiltros = () =>
    setFiltros({
      categoria: "todos",
      subcategorias: [],
      texto: "",
      precioMin: "",
      precioMax: "",
      disponible: false,
      rating: 0,
      orden: "relevancia",
    });

  const setTexto = (texto: string) =>
    setFiltros((prev) => ({ ...prev, texto }));
  const setPrecioMin = (precioMin: string) =>
    setFiltros((prev) => ({ ...prev, precioMin }));
  const setPrecioMax = (precioMax: string) =>
    setFiltros((prev) => ({ ...prev, precioMax }));
  const setDisponible = (disponible: boolean) =>
    setFiltros((prev) => ({ ...prev, disponible }));
  const setRating = (rating: number) =>
    setFiltros((prev) => ({ ...prev, rating }));
  const setOrden = (orden: string) =>
    setFiltros((prev) => ({ ...prev, orden }));

  // Cargar todos los productos desde el backend (o cache) al montar el componente
  useEffect(() => {
    const cargarTodosLosProductos = async () => {
      setCargando(true);
      try {
        // Intentar desde cache primero
        const cached = cargarProductosDesdeCache();
        if (cached && cached.length > 0) {
          setTodosLosProductos(cached);
          console.log('Productos cargados desde localStorage:', cached.length);
        } else {
          // Cargar desde backend si no hay cache
          console.log('Cargando productos desde el backend...');
          const productos = await obtenerProductos();
          setTodosLosProductos(productos);
          console.log('Productos cargados desde backend:', productos.length);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setTodosLosProductos([]);
      } finally {
        setCargando(false);
      }
    };
    
    void cargarTodosLosProductos();
  }, []); // Solo al montar el componente

  // Resetear página cuando cambien los filtros (excepto cuando cambia la página misma)
  useEffect(() => {
    setPagina(0);
  }, [filtros.categoria, filtros.subcategorias, filtros.texto, filtros.precioMin, filtros.precioMax, filtros.disponible, filtros.rating, filtros.orden]);

  // Filtrar productos localmente desde todosLosProductos
  useEffect(() => {
    if (todosLosProductos.length === 0) {
      setProductosFiltrados([]);
      setTotalElementos(0);
      setTotalPaginas(0);
      return;
    }

    console.log('Aplicando filtros localmente a', todosLosProductos.length, 'productos');
    console.log('Filtros activos:', {
      categoria: filtros.categoria,
      subcategorias: filtros.subcategorias,
      texto: filtros.texto,
      precioMin: filtros.precioMin,
      precioMax: filtros.precioMax,
      disponible: filtros.disponible,
      rating: filtros.rating,
      orden: filtros.orden
    });
    
    // Debug: mostrar algunos productos de ejemplo
    if (todosLosProductos.length > 0) {
      const ejemplo = todosLosProductos.slice(0, 3).map(p => ({
        nombre: p.nombre,
        categoriaId: p.categoria?.id,
        categoriaNombre: p.categoria?.nombre,
        subcategoriaId: p.subcategoria?.id,
        subcategoriaNombre: p.subcategoria?.nombre,
        tieneSubcategoria: !!p.subcategoria
      }));
      console.log('Ejemplo de productos (primeros 3):', ejemplo);
      
      // Si hay filtros de subcategoría, mostrar más detalles
      if (filtros.subcategorias && filtros.subcategorias.length > 0) {
        console.log('Filtrando por subcategorías:', filtros.subcategorias);
        console.log('Productos con subcategorías definidas:', 
          todosLosProductos.filter(p => p.subcategoria?.id).length, 
          'de', todosLosProductos.length);
      }
    }

    // Función para mapear categoría a código
    const getCategoriaCodigo = (categoria: string): string => {
      if (!categoria || categoria === "todos") return "";
      const categoriaMap: Record<string, string> = {
        'consolas': 'CO',
        'perifericos': 'PE',
        'periféricos': 'PE',
        'ropa': 'RO',
        'entretenimiento': 'EN',
        'CO': 'CO',
        'PE': 'PE',
        'RO': 'RO',
        'EN': 'EN'
      };
      return categoriaMap[categoria.toLowerCase()] || categoria.toUpperCase();
    };

    // Aplicar filtros
    let filtrados = todosLosProductos.filter(producto => {
      // Filtro por categoría
      if (filtros.categoria && filtros.categoria !== "todos") {
        const categoriaCodigo = getCategoriaCodigo(filtros.categoria);
        const productoCatId = producto.categoria?.id || '';
        if (productoCatId !== categoriaCodigo) {
          return false;
        }
      }

      // Filtro por subcategorías
      if (filtros.subcategorias && filtros.subcategorias.length > 0) {
        let matchSubcat = false;
        
        // Normalizar el filtro de subcategorías para comparación
        const subcategoriasFiltro = filtros.subcategorias.map(s => s.toUpperCase().trim());
        
        for (const subcat of subcategoriasFiltro) {
          if (subcat.startsWith("ALL-")) {
            // Si es "ALL-XXX", incluir todos los productos de esa categoría
            const cat = subcat.replace("ALL-", "");
            const catCodigo = getCategoriaCodigo(cat);
            const productoCatId = (producto.categoria?.id || '').toUpperCase();
            
            if (productoCatId === catCodigo) {
              matchSubcat = true;
              console.log(`Producto ${producto.nombre} INCLUIDO por ALL-${cat} (categoria: ${productoCatId})`);
              break;
            }
          } else {
            // Comparar subcategoría directamente
            const productoSubcatId = producto.subcategoria?.id ? 
              String(producto.subcategoria.id).toUpperCase().trim() : '';
            const subcatNormalized = String(subcat).toUpperCase().trim();
            
            // Comparar exactamente
            if (productoSubcatId && productoSubcatId === subcatNormalized) {
              matchSubcat = true;
              break;
            }
          }
        }
        
        if (!matchSubcat) {
          // Si no coincide con ninguna subcategoría del filtro, excluir el producto
          return false;
        }
      }

      // Filtro por texto (búsqueda)
      if (filtros.texto && filtros.texto.trim() !== "") {
        const textoLower = filtros.texto.trim().toLowerCase();
        const tituloLower = producto.nombre?.toLowerCase() || '';
        const descripcionLower = producto.descripcion?.toLowerCase() || '';
        if (!tituloLower.includes(textoLower) && !descripcionLower.includes(textoLower)) {
          return false;
        }
      }

      // Filtro por precio mínimo
      if (filtros.precioMin && filtros.precioMin !== "") {
        const precioMin = Number(filtros.precioMin);
        if (producto.precio < precioMin) {
          return false;
        }
      }

      // Filtro por precio máximo
      if (filtros.precioMax && filtros.precioMax !== "") {
        const precioMax = Number(filtros.precioMax);
        if (producto.precio > precioMax) {
          return false;
        }
      }

      // Filtro por disponibilidad
      if (filtros.disponible && !producto.disponible) {
        return false;
      }

      // Filtro por rating
      if (filtros.rating && filtros.rating > 0) {
        const ratingProducto = producto.rating || 0;
        if (ratingProducto < filtros.rating) {
          return false;
        }
      }

      return true;
    });

    // Aplicar ordenamiento
    if (filtros.orden && filtros.orden !== "relevancia") {
      filtrados = [...filtrados].sort((a, b) => {
        switch (filtros.orden) {
          case "precio-asc":
            return (a.precio || 0) - (b.precio || 0);
          case "precio-desc":
            return (b.precio || 0) - (a.precio || 0);
          case "rating-desc":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
    }

    // Aplicar paginación
    const tamanoPagina = 10;
    const totalElementosFiltrados = filtrados.length;
    const totalPaginasFiltradas = Math.ceil(totalElementosFiltrados / tamanoPagina);
    const inicio = pagina * tamanoPagina;
    const fin = inicio + tamanoPagina;
    const productosPaginados = filtrados.slice(inicio, fin);

    console.log('Filtrado local completado:', {
      totalProductos: todosLosProductos.length,
      productosFiltrados: totalElementosFiltrados,
      productosEnPagina: productosPaginados.length,
      pagina: pagina + 1,
      totalPaginas: totalPaginasFiltradas
    });

    setProductosFiltrados(productosPaginados);
    setTotalElementos(totalElementosFiltrados);
    setTotalPaginas(totalPaginasFiltradas);
  }, [todosLosProductos, filtros, pagina]);

  const siguientePagina = () => {
    if (pagina < totalPaginas - 1) {
      setPagina(pagina + 1);
    }
  };
  
  const anteriorPagina = () => {
    if (pagina > 0) {
      setPagina(pagina - 1);
    }
  };
  
  const irAPagina = (pag: number) => {
    if (pag >= 0 && pag < totalPaginas) {
      setPagina(pag);
    }
  };

  return {
    filtros,
    setCategoria,
    toggleSubcategoria,
    setTexto,
    setPrecioMin,
    setPrecioMax,
    setDisponible,
    setRating,
    setOrden,
    limpiarFiltros,
    productosFiltrados,
    actualizar,
    setFiltros,
    pagina,
    totalPaginas,
    totalElementos,
    cargando,
    siguientePagina,
    anteriorPagina,
    irAPagina,
  };
}
