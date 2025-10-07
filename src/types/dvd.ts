// Estructura para descripciones multiidioma de DVDs
export interface DVDDescription {
  es: string;
  en: string;
}

// Estructura para tracks/contenido del DVD
export interface Track {
  n: number;
  title: string;
}

// Estructura para streaming links
export interface Streaming {
  youtube?: string;
  other?: string;
}

// Estructura principal del DVD
export interface DVD {
  title: string;
  year: number;
  youtube: string;
  label: string;
  duration: string;
  dvdQuantity: number;
  format: string;
  description: {
    short: DVDDescription;
    extended: DVDDescription;
  };
  streaming: Streaming;
  tracks: Track[];
}

// Union type para compatibilidad hacia atrás
export type DVDUnion = DVD;

// Interfaz para manejar estructuras irregulares del JSON
export interface DVDDataItem {
  title?: string;
  album_title?: string;
  year?: number;
  release_year?: number;
  youtube?: string;
  label?: string;
  duration?: string;
  dvdQuantity?: number;
  format?: string;
  cover_image?: string;
  description?: {
    short?: DVDDescription;
    extended?: DVDDescription;
  };
  streaming?: Streaming;
  tracks?: Track[];
}

// Función helper para obtener descripción en el idioma correcto
export function getDVDDescription(
  description: DVDDescription,
  locale: string
): string {
  return description[locale as keyof DVDDescription] || description.es;
}

// Función helper para obtener descripción corta
export function getDVDShortDescription(
  description: DVD["description"] | DVDDataItem["description"] | undefined,
  locale: string
): string {
  if (!description?.short) return "No description available";
  return getDVDDescription(description.short, locale);
}

// Función helper para obtener descripción extendida
export function getDVDExtendedDescription(
  description: DVD["description"] | DVDDataItem["description"] | undefined,
  locale: string
): string {
  if (!description?.extended) return "No description available";
  return getDVDDescription(description.extended, locale);
}

// Función helper para generar slug del DVD
export function generateDVDSlug(title: string | undefined): string {
  if (!title) return "unknown-dvd";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Función helper para encontrar un DVD por slug
export function findDVDBySlug(dvds: DVDDataItem[], slug: string): DVDDataItem | null {
  return dvds.find((dvd) => {
    const dvdTitle = dvd.title || dvd.album_title;
    return generateDVDSlug(dvdTitle) === slug;
  }) || null;
}