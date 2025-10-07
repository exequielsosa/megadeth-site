export type VideoDescription = {
  es: string;
  en: string;
};

export type Video = {
  title: string;
  year: number;
  youtube: string;
  description: VideoDescription;
};