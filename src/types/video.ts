export type VideoDescription = {
  es: string;
  en: string;
};

export type Video = {
  title: string;
  year: number;
  youtube: string;
  description: VideoDescription;
  /** Duración del video en ISO 8601 (ej. "PT4M10S") — la exige VideoObject. */
  duration: string;
};