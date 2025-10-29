// Datos de productos, categorías y subcategorías

// Definición de tipos
export interface Categoria {
  id: string;
  nombre: string;
}

export interface Subcategoria {
  id: string;
  nombre: string;
  categoria: Categoria;
}

export interface Review {
  id: string;
  productoId: string;
  usuarioNombre: string;
  rating: number;
  comentario: string;
  fecha: string;
}

export interface ImagenCarrusel {
  id: number;
  imagenUrl: string;
  titulo: string;
  descripcion: string;
  enlace: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  categoria: Categoria;
  subcategoria?: Subcategoria;
  rating: number;
  disponible: boolean;
  destacado: boolean;
  stock: number;
  imagenesUrls: string[];
  fabricante?: string;
  distribuidor?: string;
  descuento?: number;
  reviews: Review[];
  productosRelacionados: Producto[];
  // Propiedades calculadas
  precioConDescuento?: number;
  ratingPromedio: number;
}

const categorias: Categoria[] = [
  {
    id: "CO",
    nombre: "Consola",
  },
  {
    id: "PE",
    nombre: "Perifericos",
  },
  {
    id: "RO",
    nombre: "Ropa",
  },
  {
    id: "EN",
    nombre: "Entretenimiento",
  },
];

const subcategorias: Subcategoria[] = [
  {
    id: "MA",
    nombre: "Mandos",
    categoria: categorias[0], // Consola
  },
  {
    id: "AC",
    nombre: "Accesorios",
    categoria: categorias[0], // Consola
  },
  {
    id: "HA",
    nombre: "Hardware",
    categoria: categorias[0], // Consola
  },
  {
    id: "TE",
    nombre: "Teclados",
    categoria: categorias[1], // Periféricos
  },
  {
    id: "MO",
    nombre: "Mouses",
    categoria: categorias[1], // Periféricos
  },
  {
    id: "AU",
    nombre: "Auriculares",
    categoria: categorias[1], // Periféricos
  },
  {
    id: "MT",
    nombre: "Monitores",
    categoria: categorias[1], // Periféricos
  },
  {
    id: "MI",
    nombre: "Microfonos",
    categoria: categorias[1], // Periféricos
  },
  {
    id: "CW",
    nombre: "Camaras web",
    categoria: categorias[1], // Periféricos
  },
  {
    id: "JM",
    nombre: "Juegos de Mesa",
    categoria: categorias[3], // Entretenimiento
  },
  {
    id: "PG",
    nombre: "Polerones Gamers Personalizados",
    categoria: categorias[2], // Ropa
  },
  {
    id: "PR",
    nombre: "Poleras Personalizadas",
    categoria: categorias[2], // Ropa
  },
  {
    id: "MP",
    nombre: "Mousepad",
    categoria: categorias[1], // Periféricos
  },
  {
    id: "SI",
    nombre: "Sillas Gamers",
    categoria: categorias[1], // Periféricos
  },
];

// Datos del carrusel de imágenes
const imagenesCarrusel: ImagenCarrusel[] = [
  {
    id: 1,
    imagenUrl: "carrusel",
    titulo: "¡Nuevos lanzamientos!",
    descripcion: "Descubre los últimos juegos y accesorios",
    enlace: "",
  },
  {
    id: 2,
    imagenUrl: "carrusel",
    titulo: "Ofertas especiales",
    descripcion: "Hasta 50% de descuento en productos seleccionados",
    enlace: "",
  },
  {
    id: 3,
    imagenUrl: "carrusel",
    titulo: "Setup gamer completo",
    descripcion: "Arma tu estación de juego perfecta",
    enlace: "",
  },
];

// Función helper para crear productos con la estructura correcta
function crearProducto(
  id: string,
  nombre: string,
  descripcion: string,
  precio: number,
  imagenUrl: string,
  categoria: Categoria,
  subcategoria: Subcategoria | undefined,
  rating: number = 0,
  disponible: boolean = true,
  destacado: boolean = false,
  stock: number = 0,
  imagenesUrls: string[] = [],
  fabricante?: string,
  distribuidor?: string,
  descuento?: number,
  reviews: Review[] = [],
  productosRelacionados: Producto[] = []
): Producto {
  const imagenes = imagenesUrls.length > 0 ? imagenesUrls : [imagenUrl];
  const precioConDescuento = descuento
    ? precio * (1 - descuento / 100.0)
    : undefined;
  const ratingPromedio =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : rating;

  return {
    id,
    nombre,
    descripcion,
    precio,
    imagenUrl,
    categoria,
    subcategoria,
    rating,
    disponible,
    destacado,
    stock,
    imagenesUrls: imagenes,
    fabricante,
    distribuidor,
    descuento,
    reviews,
    productosRelacionados,
    precioConDescuento,
    ratingPromedio,
  };
}

// Función para migrar datos legacy al nuevo formato
function migrarProductoLegacy(productoLegacy: any): Producto {
  const categoria =
    categorias.find((c) => c.id === productoLegacy.categoriaId) ||
    categorias[0];
  const subcategoria = subcategorias.find(
    (s) => s.id === productoLegacy.subcategoriaId
  );

  const imagenes = productoLegacy.imagenes || [productoLegacy.imagen];
  const precioConDescuento = productoLegacy.descuento
    ? productoLegacy.precio * (1 - productoLegacy.descuento / 100.0)
    : undefined;
  const ratingPromedio =
    productoLegacy.reviews && productoLegacy.reviews.length > 0
      ? productoLegacy.reviews.reduce(
          (sum: number, review: any) => sum + review.rating,
          0
        ) / productoLegacy.reviews.length
      : productoLegacy.rating;

  return {
    id: productoLegacy.id,
    nombre: productoLegacy.titulo,
    descripcion: productoLegacy.descripcion,
    precio: productoLegacy.precio,
    imagenUrl: productoLegacy.imagen,
    categoria,
    subcategoria,
    rating: productoLegacy.rating,
    disponible: productoLegacy.disponible,
    destacado: productoLegacy.destacado || false,
    stock: productoLegacy.stock || 0,
    imagenesUrls: imagenes,
    fabricante: productoLegacy.fabricante,
    distribuidor: productoLegacy.distribuidor,
    descuento: productoLegacy.descuento,
    reviews: productoLegacy.reviews || [],
    productosRelacionados: [],
    precioConDescuento,
    ratingPromedio,
  };
}

// Datos de productos en formato legacy (para compatibilidad)
const productosLegacy = [
  {
    id: "CO001",
    titulo: "PlayStation 5",
    categoriaId: "CO",
    subcategoriaId: "HA",
    imagen: "./img/consolas/4.png",
    imagenes: [
      "./img/consolas/4.png",
      "./img/consolas/1.png",
      "./img/consolas/2.png",
      "./img/consolas/3.png",
    ], //eSTE a nivel de UI serian las imagenes a la izquierda de la imagen principal
    precio: 549990,
    disponible: true,
    rating: 1.7,
    descripcion:
      "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva.",
    destacado: true,
    stock: 15,
    fabricante: "Sony",
    distribuidor: "Sony Chile",
    descuento: 10,
    reviews: [],
  },
  {
    id: "CO002",
    titulo: "PlayStation 4 Slim",
    categoriaId: "CO",
    subcategoriaId: "HA",
    imagen: "./img/consolas/2.png",
    imagenes: ["./img/consolas/1.png", "./img/consolas/3.png"],
    precio: 179990,
    disponible: true,
    rating: 5,
    descripcion:
      "Una consola versátil y compacta que sigue siendo ideal para disfrutar de un extenso catálogo de juegos con gran rendimiento y entretenimiento garantizado.",
    destacado: true,
    stock: 12,
    fabricante: "Sony",
    distribuidor: "Sony Chile",
    descuento: 5,
    reviews: [],
  },
  {
    id: "CO003",
    titulo: "DualShock 4",
    categoriaId: "CO",
    subcategoriaId: "MA",
    imagen: "./img/consolas/3.png",
    imagenes: ["./img/consolas/3.png"],
    precio: 60000,
    disponible: true,
    rating: 4,
    descripcion:
      "Control oficial de PlayStation 4 con diseño ergonómico y funciones avanzadas que ofrecen precisión y comodidad durante tus sesiones de juego.",
    destacado: true,
    stock: 30,
    fabricante: "Sony",
    distribuidor: "Sony Chile",
    descuento: undefined,
    reviews: [],
  },
  {
    id: "CO005",
    titulo: "Dualsense Azul",
    categoriaId: "CO",
    subcategoriaId: "MA",
    imagen: "./img/consolas/5.png",
    imagenes: ["./img/consolas/5.png"],
    precio: 69990,
    disponible: true,
    rating: 4,
    descripcion:
      "Control de PlayStation 5 en elegante color azul, con retroalimentación háptica y gatillos adaptativos que llevan la experiencia de juego a otro nivel.",
    destacado: true,
    stock: 25,
    fabricante: "Sony",
    distribuidor: "Sony Chile",
    descuento: 15,
    reviews: [],
  },
  {
    id: "CO006",
    titulo: "Auriculares PS4",
    categoriaId: "CO",
    subcategoriaId: "AC",
    imagen: "./img/consolas/6.png",
    imagenes: ["./img/consolas/6.png"],
    precio: 150000,
    disponible: false,
    rating: 3,
    descripcion:
      "Auriculares diseñados para PlayStation 4, con sonido envolvente y micrófono integrado para comunicación clara en partidas multijugador.",
    destacado: false,
    stock: 0,
    fabricante: "Sony",
    distribuidor: "Sony Chile",
    descuento: undefined,
    reviews: [],
  },
  {
    id: "PE001",
    titulo: "Auriculares Logitech",
    categoriaId: "PE",
    subcategoriaId: "AU",
    imagen: "./img/perifericos/1.png",
    imagenes: ["./img/perifericos/1.png"],
    precio: 100000,
    disponible: true,
    rating: 4,
    descripcion:
      "Auriculares de alto rendimiento con gran calidad de sonido y micrófono ajustable, ideales para juegos, streaming y comunicación online.",
    destacado: true,
    stock: 20,
    fabricante: "Logitech",
    distribuidor: "Logitech Chile",
    descuento: 10,
    reviews: [],
  },
  {
    id: "PE002",
    titulo: "Teclado Redragon RGB",
    categoriaId: "PE",
    subcategoriaId: "TE",
    imagen: "./img/perifericos/2.png",
    imagenes: ["./img/perifericos/2.png"],
    precio: 145990,
    disponible: true,
    rating: 4,
    descripcion:
      "Teclado mecánico con iluminación RGB y switches de alto rendimiento, ideal para juegos y escritura intensiva.",
    destacado: true,
    stock: 25,
    fabricante: "Redragon",
    distribuidor: "Redragon Chile",
    descuento: 20,
    reviews: [],
  },
  {
    id: "PE003",
    titulo: "Mouse Cougar",
    categoriaId: "PE",
    subcategoriaId: "MO",
    imagen: "./img/perifericos/3.png",
    imagenes: ["./img/perifericos/3.png"],
    precio: 85990,
    disponible: true,
    rating: 4,
    descripcion:
      "Mouse gamer ergonómico con alta precisión y diseño personalizable, perfecto para sesiones intensas y competitivas.",
    destacado: false,
    stock: 30,
    fabricante: "Cougar",
    distribuidor: "Cougar Chile",
    descuento: undefined,
    reviews: [],
  },
  {
    id: "PE004",
    titulo: "Monitor ASUS",
    categoriaId: "PE",
    subcategoriaId: "MT",
    imagen: "./img/perifericos/4.png",
    imagenes: ["./img/perifericos/4.png"],
    precio: 175990,
    disponible: true,
    rating: 4,
    descripcion:
      "Monitor de alto rendimiento con gran calidad de imagen y refresco rápido, ideal para disfrutar de gráficos nítidos en juegos y multimedia.",
    destacado: true,
    stock: 8,
    fabricante: "ASUS",
    distribuidor: "ASUS Chile",
    descuento: 12,
    reviews: [],
  },
  {
    id: "PE005",
    titulo: "Webcam Logitech",
    categoriaId: "PE",
    subcategoriaId: "CW",
    imagen: "./img/perifericos/5.png",
    imagenes: ["./img/perifericos/5.png"],
    precio: 67990,
    disponible: true,
    rating: 4,
    descripcion:
      "Webcam de alta definición con gran calidad de imagen y audio, perfecta para streaming, videollamadas y creación de contenido.",
    destacado: false,
    stock: 18,
    fabricante: "Logitech",
    distribuidor: "Logitech Chile",
    descuento: undefined,
    reviews: [],
  },
  {
    id: "PE006",
    titulo: "Microfono Logitech",
    categoriaId: "PE",
    subcategoriaId: "MI",
    imagen: "./img/perifericos/6.png",
    imagenes: ["./img/perifericos/6.png"],
    precio: 86990,
    disponible: true,
    rating: 4,
    descripcion:
      "Micrófono de alta fidelidad con captación clara y profesional, ideal para streaming, grabaciones y comunicación en equipo.",
    destacado: false,
    stock: 15,
    fabricante: "Logitech",
    distribuidor: "Logitech Chile",
    descuento: undefined,
    reviews: [],
  },
  {
    id: "RO001",
    titulo: "Poleron StarCraft",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/1.png",
    imagenes: ["./img/polerones/1.png"],
    precio: 40000,
    disponible: true,
    rating: 4.5,
    descripcion:
      "Polerón inspirado en StarCraft con diseño gamer único y tela cómoda, perfecto para mostrar tu pasión por el universo de Blizzard.",
    destacado: false,
    stock: 50,
    fabricante: "Blizzard",
    distribuidor: "Level-Up",
    descuento: undefined,
    reviews: [],
  },
  {
    id: "RO002",
    titulo: "Poleron Super Papá Gamer",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/2.png",
    imagenes: ["./img/polerones/2.png"],
    precio: 40000,
    disponible: true,
    rating: 4.5,
    descripcion:
      "Polerón divertido y cómodo diseñado para los papás que disfrutan tanto del gaming como de la familia.",
    destacado: false,
    stock: 50,
    fabricante: "Level-Up",
    distribuidor: "Level-Up",
    descuento: 10,
    reviews: [],
  },
  {
    id: "RO003",
    titulo: "Poleron Hollow Knight",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/3.png",
    imagenes: ["./img/polerones/3.png"],
    precio: 40000,
    disponible: true,
    rating: 4.5,
    descripcion:
      "Polerón con diseño inspirado en Hollow Knight, ideal para fanáticos del juego indie y su mundo misterioso.",
    destacado: false,
    stock: 50,
    fabricante: "Team Cherry",
    distribuidor: "Level-Up",
    descuento: undefined,
    reviews: [],
  },
  {
    id: "RO004",
    titulo: "Poleron PlayStation Retro Negro",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/4.png",
    imagenes: ["./img/polerones/4.png"],
    precio: 40000,
    disponible: true,
    rating: 4.5,
    descripcion:
      "Polerón retro en color negro con el clásico logo de PlayStation, perfecto para los nostálgicos del gaming.",
    destacado: false,
    stock: 50,
    fabricante: "Sony",
    distribuidor: "Level-Up",
    descuento: undefined,
    reviews: [],
  },
  {
    id: "RO005",
    titulo: "Poleron Stumble Guys",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/5.png",
    imagenes: ["./img/polerones/5.png"],
    precio: 40000,
    disponible: true,
    rating: 4.5,
    descripcion:
      "Polerón colorido y divertido inspirado en Stumble Guys, ideal para gamers que disfrutan de las partidas llenas de caos y risas.",
    destacado: false,
    stock: 50,
    fabricante: "Kitka Games",
    distribuidor: "Level-Up",
    descuento: 5,
    reviews: [],
  },
  {
    id: "RO006",
    titulo: "Poleron S.T.A.R.S",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/6.png",
    imagenes: ["./img/polerones/6.png"],
    precio: 40000,
    disponible: true,
    rating: 4.5,
    descripcion:
      "Polerón con diseño de la unidad S.T.A.R.S de Resident Evil, pensado para los fanáticos del survival horror.",
    destacado: false,
    stock: 50,
    fabricante: "Capcom",
    distribuidor: "Level-Up",
    descuento: undefined,
    reviews: [],
  },
  {
    id: "EN001",
    titulo: "Catan",
    categoriaId: "EN",
    subcategoriaId: "JM",
    imagen: "./img/entretenimiento/catan.png",
    imagenes: ["./img/entretenimiento/catan.png"],
    precio: 29990,
    disponible: true,
    rating: 4,
    descripcion:
      "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos.",
    destacado: false,
    stock: 30,
    fabricante: "KOSMOS",
    distribuidor: "Devir",
    descuento: 15,
    reviews: [],
  },
  {
    id: "EN002",
    titulo: "Carcassonne",
    categoriaId: "EN",
    subcategoriaId: "JM",
    imagen: "./img/entretenimiento/carcassone.png",
    imagenes: ["./img/entretenimiento/carcassone.png"],
    precio: 24990,
    disponible: true,
    rating: 4,
    descripcion:
      "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender.",
    destacado: false,
    stock: 25,
    fabricante: "Hans im Glück",
    distribuidor: "Devir",
    descuento: 10,
    reviews: [],
  },
];

// Convertir productos legacy al nuevo formato (se define al final del archivo)

// Funciones auxiliares del repository
export const obtenerProductos = (): Producto[] => {
  return productosArray;
};

export const obtenerProductosDestacados = (): Producto[] => {
  return productosArray.filter((producto) => producto.destacado);
};

export const obtenerProductoPorId = (id: string): Producto | undefined => {
  return productosArray.find((producto) => producto.id === id);
};

export const obtenerProductosRelacionados = (
  producto: Producto
): Producto[] => {
  return productosArray
    .filter(
      (p) => p.id !== producto.id && p.categoria.id === producto.categoria.id
    )
    .slice(0, 4);
};

export const obtenerImagenesCarrusel = (): ImagenCarrusel[] => {
  return imagenesCarrusel;
};

// Convertir productos legacy al nuevo formato
const productosArray: Producto[] = productosLegacy.map(migrarProductoLegacy);

// Exponer catálogo base en localStorage para que producto_detalle lo pueda leer
try {
  localStorage.setItem("catalogo-base", JSON.stringify(productosArray));
} catch {}

export { productosArray, categorias, subcategorias, imagenesCarrusel };
