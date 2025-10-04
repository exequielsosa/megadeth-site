export type StreamingLinks = Partial<{
  spotify: string;
  appleMusic: string;
  youtube: string;
  tidal: string;
  deezer: string;
  bandcamp: string;
}>;

export type Track = {
  n: number;
  title: string;
  duration?: string; // "4:32"
};

export type Album = {
  id: string;                 // slug único
  title: string;
  year: number;
  cover: string;              // URL o /public/...
  label?: string;
  producers?: string[];
  description?: string;       // breve
  streaming?: StreamingLinks;
  tracks?: Track[];
  isUpcoming?: boolean;       // para el disco nuevo
  releaseDate?: string;       // "2026-01-23" si isUpcoming
};
