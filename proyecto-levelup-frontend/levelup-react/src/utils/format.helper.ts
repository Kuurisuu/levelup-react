/**
 * Helpers de formateo para el proyecto Level Up
 */

/**
 * Formatea un número a formato de moneda chilena (CLP)
 * @param valor - Número a formatear
 * @returns String con formato de moneda
 */
export const formatCLP = (valor: number): string => {
  if (typeof valor !== "number" || isNaN(valor)) {
    valor = 0;
  }
  return `$${valor.toLocaleString("es-CL")} CLP`;
};

/**
 * Capitaliza la primera letra de un string
 * @param texto - Texto a capitalizar
 * @returns Texto con primera letra en mayúscula
 */
export const capitalize = (texto: string): string => {
  if (!texto || typeof texto !== "string") {
    return "";
  }
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Trunca un texto a una longitud específica
 * @param texto - Texto a truncar
 * @param longitud - Longitud máxima
 * @param sufijo - Sufijo a agregar (por defecto '...')
 * @returns Texto truncado
 */
export const truncateText = (
  texto: string,
  longitud: number,
  sufijo: string = "..."
): string => {
  if (!texto || typeof texto !== "string") {
    return "";
  }
  if (texto.length <= longitud) {
    return texto;
  }
  return texto.slice(0, longitud) + sufijo;
};

/**
 * Valida un email
 * @param email - Email a validar
 * @returns true si es válido, false si no
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Genera un slug a partir de un texto
 * @param texto - Texto a convertir en slug
 * @returns Slug generado
 */
export const generateSlug = (texto: string): string => {
  if (!texto || typeof texto !== "string") {
    return "";
  }

  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
