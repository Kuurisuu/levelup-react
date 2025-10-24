/**
 * Formatea un número como precio en CLP sin decimales y redondeado a la decena más cercana
 * @param price - El precio a formatear
 * @returns String formateado como "$XXX.XXX CLP"
 */
export function formatPriceCLP(price: number): string {
  // Redondear a la decena más cercana (múltiplos de 10)
  const roundedPrice = Math.round(price / 10) * 10;
  return `$${roundedPrice.toLocaleString("es-CL")} CLP`;
}

/**
 * Formatea un número como precio en CLP usando el estilo de moneda
 * @param price - El precio a formatear
 * @returns String formateado como "$XXX.XXX"
 */
export function formatPriceCLPCurrency(price: number): string {
  return price.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}
//AL FINAL LA FUNCION DE ESTO ES PARA FORMATEAR EL PRECIO EN CLP USANDO EL ESTILO DE MONEDA Y NADA MAS