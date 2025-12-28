export interface NewsArticle {
  id: string;
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  imageUrl?: string;
  imageAlt?: {
    en: string;
    es: string;
  };
  imageCaption?: {
    en: string;
    es: string;
  };
  publishedDate: string; // ISO format YYYY-MM-DD
  linkUrl?: string;
  linkTarget?: "_blank" | "_self";
  youtubeVideoId?: string;
  externalLinks?: Array<{
    url: string;
    text: {
      en: string;
      es: string;
    };
  }>;
}
