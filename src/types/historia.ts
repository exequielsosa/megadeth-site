export interface HistoryImage {
  src: string;
  alt: string;
  caption?: string;
  position?: 'left' | 'right' | 'center' | 'full' | 'background';
  layout?: 'float' | 'gallery' | 'parallax' | 'carousel' | 'collage';
  size?: 'small' | 'medium' | 'large' | 'full';
  aspectRatio?: '1:1' | '4:3' | '16:9' | '21:9';
}

export interface HistorySection {
  id: string;
  title?: string;
  content: string;
  images?: HistoryImage[];
  layout?: 'text-only' | 'text-with-images' | 'image-gallery' | 'parallax';
}

export interface HistoryChapter {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  period: string; // ej: "1983-1990"
  yearStart: number;
  yearEnd: number;
  summary: string;
  sections: HistorySection[];
  coverImage?: HistoryImage;
  color?: string; // Color temático del capítulo
  icon?: string; // Icono representativo
}

export interface HistoryData {
  title: string;
  subtitle: string;
  introduction: string;
  chapters: HistoryChapter[];
}

// Utilidades helper
export function generateChapterSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function findChapterBySlug(chapters: HistoryChapter[], slug: string): HistoryChapter | undefined {
  return chapters.find(chapter => chapter.slug === slug);
}

export function getChapterByIndex(chapters: HistoryChapter[], index: number): HistoryChapter | undefined {
  return chapters[index];
}

export function getNextChapter(chapters: HistoryChapter[], currentSlug: string): HistoryChapter | undefined {
  const currentIndex = chapters.findIndex(chapter => chapter.slug === currentSlug);
  return currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : undefined;
}

export function getPreviousChapter(chapters: HistoryChapter[], currentSlug: string): HistoryChapter | undefined {
  const currentIndex = chapters.findIndex(chapter => chapter.slug === currentSlug);
  return currentIndex > 0 ? chapters[currentIndex - 1] : undefined;
}

export function getChapterProgress(chapters: HistoryChapter[], currentSlug: string): number {
  const currentIndex = chapters.findIndex(chapter => chapter.slug === currentSlug);
  return currentIndex >= 0 ? ((currentIndex + 1) / chapters.length) * 100 : 0;
}

export function formatYearRange(startYear: number, endYear: number): string {
  return startYear === endYear ? startYear.toString() : `${startYear}–${endYear}`;
}