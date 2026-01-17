import { BilingualText } from "./index";

export interface FeaturedArticle {
  id: string;
  title: BilingualText;
  content: BilingualText;
  publishedDate: string;
  imageUrl: string;
  imageAlt: BilingualText;
  isActive: boolean;
}
