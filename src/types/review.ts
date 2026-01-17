import { BilingualText } from "./index";

export interface Review {
  id: string;
  title: BilingualText;
  subtitle?: BilingualText;
  content: BilingualText;
  publishedDate: string;
  imageUrl: string;
  imageAlt: BilingualText;
  rating: number; // 1-10
  category: "album" | "concert" | "documentary" | "other";
  relatedAlbumId?: string; // Para vincular con un álbum de la discografía
  author?: BilingualText;
}
