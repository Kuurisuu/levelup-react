// cada objeto tiene un nombre de region y un arreglo de comunas
export interface Region {
  nombre: string;
  comunas: string[];
}

// regiones pero mas amplias
export const REGIONES: Region[] = [
  { nombre: 'Región Metropolitana', comunas: ['Santiago', 'Las Condes', 'Providencia', 'Ñuñoa', 'Maipú', 'La Florida', 'Puente Alto'] },
  { nombre: 'Valparaíso', comunas: ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana', 'San Antonio'] },
  { nombre: 'Biobío', comunas: ['Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles', 'Coronel'] },
  { nombre: 'Coquimbo', comunas: ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel'] },
  { nombre: 'Antofagasta', comunas: ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones'] },
  { nombre: 'Tarapacá', comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte'] },
  { nombre: 'Arica y Parinacota', comunas: ['Arica', 'Putre', 'Camarones'] }
];
