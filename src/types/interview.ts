// Estructura para descripciones multiidioma de entrevistas
export interface InterviewDescription {
  es: string;
  en: string;
}

// Estructura para el medio de comunicación
export interface InterviewMedia {
  name: string;
  type: "magazine" | "website" | "tv" | "radio" | "podcast";
  country: string;
  logo?: string;
}

// Estructura para los entrevistados
export interface Interviewee {
  name: string;
  role: string;
  id?: string;
}

// Estructura para el entrevistador
export interface Interviewer {
  name: string;
  role?: string;
}

// Estructura para contenido tipo Q&A
export interface QuestionAnswer {
  type: "qa" | "monologue";
  question: string;
  interviewer: string;
  answer: string;
  respondent: string;
  text?: string;
}

// Estructura para texto de introducción
export interface IntroContent {
  type: "intro";
  text: string;
}

// Union type para contenido de entrevista
export type InterviewContentItem = QuestionAnswer | IntroContent;

// Estructura principal de la entrevista
export interface Interview {
  id: string;
  title: InterviewDescription;
  date: string;
  media: InterviewMedia;
  interviewees: Interviewee[];
  interviewer: Interviewer;
  type: "text" | "video" | "monologue";
  language: "es" | "en";
  topics: string[];
  summary: InterviewDescription;
  content?: {
    es?: InterviewContentItem[];
    en?: InterviewContentItem[];
    cover_image?: string;
  };
  youtube_url?: string;
  duration?: string;
  cover_image: string;
}

// Función para generar slug de entrevista
export function generateInterviewSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quita acentos
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Función para obtener descripción de entrevista
export function getInterviewDescription(
  interview: Interview,
  locale: string
): string {
  return locale === "es" ? interview.summary.es : interview.summary.en;
}

// Función para obtener título de entrevista
export function getInterviewTitle(
  interview: Interview, 
  locale: string
): string {
  return locale === "es" ? interview.title.es : interview.title.en;
}

// Tipo para datos del JSON (compatibilidad)
export type InterviewDataItem = Interview;