import { useState, useMemo } from "react";
import { productosArray, Producto } from "../data/catalogo";

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

  const productosFiltrados = useMemo(() => {
    // combinar productosArray base con cualquier producto persistido por el admin en localStorage (lvup_products)
    let persisted: Producto[] = [];
    try {
      const raw = localStorage.getItem("lvup_products") || "[]";
      persisted = JSON.parse(raw) as Producto[];
    } catch {
      persisted = [];
    }

    // si hay productos persistidos, usarlos como catalogo autoritativo
    const allProducts =
      Array.isArray(persisted) && persisted.length > 0
        ? persisted
        : productosArray;

    return allProducts
      .filter((p) => {
        // If subcategories are selected, they take precedence.
        if (filtros.subcategorias.length > 0) {
          const allCats = filtros.subcategorias.filter((s) =>
            s.startsWith("ALL-")
          );
          const directSubcats = filtros.subcategorias.filter(
            (s) => !s.startsWith("ALL-")
          );

          // If any ALL-XXX is selected, include products in those categories
          if (allCats.length > 0) {
            const cats = new Set(allCats.map((a) => a.replace("ALL-", "")));
            if (cats.has(p.categoria.id)) return true;
          }

          // Otherwise include only if product's subcategory id is explicitly selected
          if (directSubcats.length > 0) {
            return directSubcats.includes(p.subcategoria?.id || "");
          }

          // No matching subcategory nor ALL- selection -> exclude
          return false;
        }

        // No subcategories selected: fall back to category filter
        if (filtros.categoria === "todos") return true;
        return p.categoria.id === filtros.categoria;
      })
      .filter(
        (p) =>
          filtros.texto
            ? p.nombre.toLowerCase().includes(filtros.texto.toLowerCase()) //se leeria asi esto: "si hay texto, filtrar por el texto"
            : true //si no hay texto, mostrar todos los productos
      )
      .filter((p) =>
        filtros.precioMin ? p.precio >= Number(filtros.precioMin) : true
      )
      .filter((p) =>
        filtros.precioMax ? p.precio <= Number(filtros.precioMax) : true
      )
      .filter((p) => (filtros.disponible ? p.disponible : true))
      .filter((p) => (filtros.rating ? p.rating >= filtros.rating : true))
      .sort((a, b) => {
        switch (filtros.orden) {
          case "precio-asc":
            return a.precio - b.precio;
          case "precio-desc":
            return b.precio - a.precio;
          case "rating-desc":
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
  }, [filtros]);

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
  };
}
