// Datos de productos, categorías y subcategorías

// Definición de tipos
export interface Categoria {
  id: string;
  nombre: string;
}

export interface Subcategoria {
  id: string;
  nombre: string;
  categoriaId: string;
}

export interface Producto {
  id: string;
  titulo: string;
  categoriaId: string;
  subcategoriaId: string;
  imagen: string;
  imagenes?: string[];
  precio: number;
  disponible: boolean;
  rating: number;
  descripcion: string;
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
    categoriaId: "CO",
  },
  {
    id: "AC",
    nombre: "Accesorios",
    categoriaId: "CO",
  },
  {
    id: "HA",
    nombre: "Hardware",
    categoriaId: "CO",
  },
  {
    id: "TE",
    nombre: "Teclados",
    categoriaId: "PE",
  },
  {
    id: "MO",
    nombre: "Mouses",
    categoriaId: "PE",
  },
  {
    id: "AU",
    nombre: "Auriculares",
    categoriaId: "PE",
  },
  {
    id: "MT",
    nombre: "Monitores",
    categoriaId: "PE",
  },
  {
    id: "MI",
    nombre: "Microfonos",
    categoriaId: "PE",
  },
  {
    id: "CW",
    nombre: "Camaras web",
    categoriaId: "PE",
  },
  {
    id: "JM",
    nombre: "Juegos de Mesa",
    categoriaId: "EN",
  },
  {
    id: "PG",
    nombre: "Polerones Gamers Personalizados",
    categoriaId: "RO",
  },
  {
    id: "PR",
    nombre: "Poleras Personalizadas",
    categoriaId: "RO",
  },
  {
    id: "MP",
    nombre: "Mousepad",
    categoriaId: "PE",
  },
  {
    id: "SI",
    nombre: "Sillas Gamers",
    categoriaId: "PE",
  },
];

const productosArray: Producto[] = [
  {
    id: "CO001",
    titulo: "PlayStation 5",
    categoriaId: "CO",
    subcategoriaId: "HA",
    imagen: "./img/consolas/4.png",
    imagenes: [
      "./img/consolas/4.png",
      "./img/consolas/2.png",
      "./img/consolas/3.png",
      "./img/consolas/5.png",
      "./img/consolas/6.png",
    ],
    precio: 549990,
    disponible: true,
    rating: 5,
    descripcion:
      "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva.",
  },
  {
    id: "CO002",
    titulo: "PlayStation 4 Slim",
    categoriaId: "CO",
    subcategoriaId: "HA",
    imagen: "./img/consolas/2.png",
    imagenes: [],
    precio: 179990,
    disponible: true,
    rating: 5,
    descripcion:
      "Una consola versátil y compacta que sigue siendo ideal para disfrutar de un extenso catálogo de juegos con gran rendimiento y entretenimiento garantizado.",
  },
  {
    id: "CO003",
    titulo: "DualShock 4",
    categoriaId: "CO",
    subcategoriaId: "MA",
    imagen: "./img/consolas/3.png",
    precio: 60000,
    disponible: true,
    rating: 4,
    descripcion:
      "Control oficial de PlayStation 4 con diseño ergonómico y funciones avanzadas que ofrecen precisión y comodidad durante tus sesiones de juego.",
  },
  {
    id: "CO005",
    titulo: "Dualsense Azul",
    categoriaId: "CO",
    subcategoriaId: "MA",
    imagen: "./img/consolas/5.png",
    precio: 69990,
    disponible: true,
    rating: 4,
    descripcion:
      "Control de PlayStation 5 en elegante color azul, con retroalimentación háptica y gatillos adaptativos que llevan la experiencia de juego a otro nivel.",
  },
  {
    id: "CO006",
    titulo: "Auriculares PS4",
    categoriaId: "CO",
    subcategoriaId: "AC",
    imagen: "./img/consolas/6.png",
    precio: 150000,
    disponible: false,
    rating: 3,
    descripcion:
      "Auriculares diseñados para PlayStation 4, con sonido envolvente y micrófono integrado para comunicación clara en partidas multijugador.",
  },
  {
    id: "PE001",
    titulo: "Auriculares Logitech",
    categoriaId: "PE",
    subcategoriaId: "AU",
    imagen: "./img/perifericos/1.png",
    precio: 100000,
    disponible: true,
    rating: 4,
    descripcion:
      "Auriculares de alto rendimiento con gran calidad de sonido y micrófono ajustable, ideales para juegos, streaming y comunicación online.",
  },
  {
    id: "PE002",
    titulo: "Teclado Redragon RGB",
    categoriaId: "PE",
    subcategoriaId: "TE",
    imagen: "./img/perifericos/2.png",
    precio: 145990,
    disponible: true,
    rating: 4,
    descripcion:
      "Teclado mecánico con iluminación RGB y switches de alto rendimiento, ideal para juegos y escritura intensiva.",
  },
  {
    id: "PE003",
    titulo: "Mouse Cougar",
    categoriaId: "PE",
    subcategoriaId: "MO",
    imagen: "./img/perifericos/3.png",
    precio: 85990,
    disponible: true,
    rating: 4,
    descripcion:
      "Mouse gamer ergonómico con alta precisión y diseño personalizable, perfecto para sesiones intensas y competitivas.",
  },
  {
    id: "PE004",
    titulo: "Monitor ASUS",
    categoriaId: "PE",
    subcategoriaId: "MT",
    imagen: "./img/perifericos/4.png",
    precio: 175990,
    disponible: true,
    rating: 4,
    descripcion:
      "Monitor de alto rendimiento con gran calidad de imagen y refresco rápido, ideal para disfrutar de gráficos nítidos en juegos y multimedia.",
  },
  {
    id: "PE005",
    titulo: "Webcam Logitech",
    categoriaId: "PE",
    subcategoriaId: "CW",
    imagen: "./img/perifericos/5.png",
    precio: 67990,
    disponible: true,
    rating: 4,
    descripcion:
      "Webcam de alta definición con gran calidad de imagen y audio, perfecta para streaming, videollamadas y creación de contenido.",
  },
  {
    id: "PE006",
    titulo: "Microfono Logitech",
    categoriaId: "PE",
    subcategoriaId: "MI",
    imagen: "./img/perifericos/6.png",
    precio: 86990,
    disponible: true,
    rating: 4,
    descripcion:
      "Micrófono de alta fidelidad con captación clara y profesional, ideal para streaming, grabaciones y comunicación en equipo.",
  },
  {
    id: "RO001",
    titulo: "Poleron StarCraft",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/1.png",
    precio: 40000,
    disponible: true,
    rating: 4,
    descripcion:
      "Polerón inspirado en StarCraft con diseño gamer único y tela cómoda, perfecto para mostrar tu pasión por el universo de Blizzard.",
  },
  {
    id: "RO002",
    titulo: "Poleron Super Papá Gamer",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/2.png",
    precio: 40000,
    disponible: true,
    rating: 4,
    descripcion:
      "Polerón divertido y cómodo diseñado para los papás que disfrutan tanto del gaming como de la familia.",
  },
  {
    id: "RO003",
    titulo: "Poleron Hollow Knight",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/3.png",
    precio: 40000,
    disponible: true,
    rating: 5,
    descripcion:
      "Polerón con diseño inspirado en Hollow Knight, ideal para fanáticos del juego indie y su mundo misterioso.",
  },
  {
    id: "RO004",
    titulo: "Poleron PlayStation Retro Negro",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/4.png",
    precio: 40000,
    disponible: true,
    rating: 4,
    descripcion:
      "Polerón retro en color negro con el clásico logo de PlayStation, perfecto para los nostálgicos del gaming.",
  },
  {
    id: "RO005",
    titulo: "Poleron Stumble Guys",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/5.png",
    precio: 40000,
    disponible: true,
    rating: 4,
    descripcion:
      "Polerón colorido y divertido inspirado en Stumble Guys, ideal para gamers que disfrutan de las partidas llenas de caos y risas.",
  },
  {
    id: "RO006",
    titulo: "Poleron S.T.A.R.S",
    categoriaId: "RO",
    subcategoriaId: "PG",
    imagen: "./img/polerones/6.png",
    precio: 40000,
    disponible: true,
    rating: 5,
    descripcion:
      "Polerón con diseño de la unidad S.T.A.R.S de Resident Evil, pensado para los fanáticos del survival horror.",
  },
  {
    id: "EN001",
    titulo: "Catan",
    categoriaId: "EN",
    subcategoriaId: "JM",
    imagen: "./img/entretenimiento/catan.png",
    precio: 29990,
    disponible: true,
    rating: 4,
    descripcion:
      "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos.",
  },
  {
    id: "EN002",
    titulo: "Carcassonne",
    categoriaId: "EN",
    subcategoriaId: "JM",
    imagen: "./img/entretenimiento/carcassone.png",
    precio: 24990,
    disponible: true,
    rating: 4,
    descripcion:
      "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender.",
  },
];

// Exponer catálogo base en localStorage para que producto_detalle lo pueda leer
try {
  localStorage.setItem("catalogo-base", JSON.stringify(productosArray));
} catch {}

export { productosArray, categorias, subcategorias };

//tengo q revisar mas a detalle si no hice duplicados o algo asi TO-DO
