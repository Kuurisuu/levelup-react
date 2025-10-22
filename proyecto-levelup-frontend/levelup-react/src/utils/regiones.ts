// cada objeto tiene un nombre de region y un arreglo de comunas
export interface Region {
  nombre: string;
  comunas: string[];
}

export const REGIONES: Region[] = [ // lista base con regiones y algunas comunas para partir
  { nombre: 'Región Metropolitana', comunas: ['Santiago', 'Providencia', 'Ñuñoa', 'Maipú'] },
  { nombre: 'Valparaíso', comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué'] },
  { nombre: 'Biobío', comunas: ['Concepción', 'Talcahuano', 'San Pedro de la Paz'] }
]; //con esto lo q se logra esq cuando se carge la region tenga sus propias comunas y asi
