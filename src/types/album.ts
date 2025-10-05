export type StreamingLinks = Partial<{
  spotify: string;
  appleMusic: string;
  youtube: string;
  tidal: string;
  deezer: string;
  bandcamp: string;
}>;

export type MusicianInstrument = {
  es: string;
  en: string;
};

export type Musician = {
  name: string;
  instrument: MusicianInstrument;
};

export type Track = {
  n: number;
  title: string;
  duration?: string; // "4:32"
  writers?: string[]; // Autores/compositores
  lyrics?: string; // Letras de la canción (opcional)
};

export type Album = {
  id: string;                 // slug único
  title: string;
  year: number;
  cover: string;              // URL o /public/...
  label?: string;
  producers?: string[];
  description?: string;       // breve
  musicians?: Musician[];     // Formación del álbum
  streaming?: StreamingLinks;
  tracks?: Track[];
  isUpcoming?: boolean;       // para el disco nuevo
  releaseDate?: string;       // "2026-01-23" si isUpcoming
};
