import { Producto, Review } from "../data/catalogo"; // el catalogo para obtener los productos y las reseñas

/**
 * Calcula el rating promedio de un producto considerando que cada usuario
 * solo puede afectar el promedio una vez, sin importar cuántas reseñas haga.
 * Si un usuario tiene múltiples reseñas, se toma el promedio de sus reseñas.
 */
export function calcularRatingPromedio(producto: Producto): number {
  if (!producto.reviews || producto.reviews.length === 0) {
    return producto.rating;
  }
  
  // Agrupar reseñas por usuario (usando usuarioNombre como identificador)
  const reviewsPorUsuario = new Map<string, Review[]>();
  
  producto.reviews.forEach(review => {
    const usuario = review.usuarioNombre || 'Anónimo'; //se obtiene el nombre del usuario 
    if (!reviewsPorUsuario.has(usuario)) { //si el usuario no existe, se crea un nuevo array para el usuario
      reviewsPorUsuario.set(usuario, []); //se crea un nuevo array para el usuario
    }
    reviewsPorUsuario.get(usuario)!.push(review); //se agrega la reseña al array del usuario
  });
  
  // Calcular promedio por usuario (cada usuario solo cuenta una vez)
  const promediosPorUsuario: number[] = [];
  
  reviewsPorUsuario.forEach((reviews, usuario) => {
    // Si un usuario tiene múltiples reseñas, tomar el promedio de sus reseñas
    const sumaRatings = reviews.reduce((sum, review) => sum + review.rating, 0); //se obtiene la suma de las reseñas
    const promedioUsuario = sumaRatings / reviews.length; //se obtiene el promedio de las reseñas
    promediosPorUsuario.push(promedioUsuario); //se agrega el promedio del usuario al array de promedios
  });
  
  // Calcular el promedio final basado en usuarios únicos
  if (promediosPorUsuario.length === 0) { //si el array de promedios esta vacio, se retorna el rating del producto
    return producto.rating;
  }
  
  const sumaPromedios = promediosPorUsuario.reduce((sum, promedio) => sum + promedio, 0); //se obtiene la suma de los promedios
  return sumaPromedios / promediosPorUsuario.length; //se obtiene el promedio final
}

/**
 * Obtiene estadísticas detalladas del rating de un producto
 */
export function obtenerEstadisticasRating(producto: Producto) {
  if (!producto.reviews || producto.reviews.length === 0) { //si el array de reseñas esta vacio, se retorna el rating del producto
    return {
      promedio: producto.rating,
      totalReseñas: 0,
      usuariosUnicos: 0,
      distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } //se crea un objeto con las distribuciones de las reseñas
    };
  }

  // Agrupar reseñas por usuario
  const reviewsPorUsuario = new Map<string, Review[]>(); 
  //se agrupan las reseñas por usuario
  producto.reviews.forEach(review => {
    const usuario = review.usuarioNombre || 'Anónimo'; //se obtiene el nombre del usuario
    if (!reviewsPorUsuario.has(usuario)) { //si el usuario no existe, se crea un nuevo array para el usuario
      reviewsPorUsuario.set(usuario, []); //se crea un nuevo array para el usuario
    }
    reviewsPorUsuario.get(usuario)!.push(review); //se agrega la reseña al array del usuario
  });

  // Calcular promedios por usuario
  const promediosPorUsuario: number[] = [];
  const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; //se crea un objeto con las distribuciones de las reseñas
  
  reviewsPorUsuario.forEach((reviews, usuario) => {
    const sumaRatings = reviews.reduce((sum, review) => sum + review.rating, 0); //se obtiene la suma de las reseñas
    const promedioUsuario = sumaRatings / reviews.length; //se obtiene el promedio de las reseñas
    promediosPorUsuario.push(promedioUsuario); //se agrega el promedio del usuario al array de promedios
    
    // Contar en la distribución (usar el promedio redondeado)
    const ratingRedondeado = Math.round(promedioUsuario); //se redondea el promedio del usuario
    if (ratingRedondeado >= 1 && ratingRedondeado <= 5) { //si el rating redondeado esta entre 1 y 5, se agrega 1 a la distribucion
      distribucion[ratingRedondeado as keyof typeof distribucion]++; //se agrega 1 a la distribucion
    }
  });

  // el promedio final es la suma de los promedios de los usuarios dividida por el numero de usuarios
  const promedio = promediosPorUsuario.reduce((sum, promedio) => sum + promedio, 0) / promediosPorUsuario.length;
  
  return {
    promedio,
    totalReseñas: producto.reviews.length,
    usuariosUnicos: promediosPorUsuario.length,
    distribucion
  };
}
