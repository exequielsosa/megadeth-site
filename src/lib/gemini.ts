import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

/**
 * Cliente de Google Gemini AI para procesamiento de noticias
 * Con retry logic y validación estricta
 */

// Schema de validación para respuesta de Gemini
// 200-300 palabras = ~1200-1800 caracteres
const GeminiNewsResponseSchema = z.object({
  title_en: z.string().min(1).max(100),
  title_es: z.string().min(1).max(100),
  description_en: z.string().min(100).max(2000),
  description_es: z.string().min(100).max(2000),
  image_caption_en: z.string().min(1).max(80),
  image_caption_es: z.string().min(1).max(80),
});

// Lazy initialization: obtiene el cliente solo cuando se necesita
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no está configurada en variables de entorno");
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Retry con exponential backoff para llamadas a Gemini
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Si es el último intento, lanzar el error
      if (attempt === maxRetries - 1) {
        throw lastError;
      }
      
      // Calcular delay con exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      console.warn(`⚠️  Gemini retry ${attempt + 1}/${maxRetries} after ${delay}ms - Error: ${lastError.message}`);
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

export interface ProcessedNewsContent {
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  image_caption_es: string;
  image_caption_en: string;
}

/**
 * Procesa el contenido de una noticia con Gemini AI
 * - Traduce al español si es necesario
 * - Genera títulos optimizados
 * - Crea resúmenes
 */
export async function processNewsWithAI(
  title: string,
  content: string,
  sourceUrl: string
): Promise<ProcessedNewsContent> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Sos un fan de Megadeth que escribe noticias para otros fans. Conocés la historia de la banda, seguís las novedades, pero escribís con naturalidad, sin exagerar.

Se te proporciona una noticia sobre Megadeth. Procesala así:

1. Título optimizado en inglés (máx 80 caracteres, directo y claro)
2. Traducción al español (máx 80 caracteres, manteniendo el sentido)
3. Descripción completa en inglés (200-300 palabras / 1200-1800 caracteres)
4. Traducción completa al español (200-300 palabras / 1200-1800 caracteres)
5. Caption para imagen en inglés (máx 60 caracteres)
6. Caption en español (máx 60 caracteres)

TONO DE ESCRITURA:
- Conversacional, como hablar con un amigo que también le gusta Megadeth
- Podés usar "Dave", "Ellefson", "la banda" de forma natural
- Si es una buena noticia, mostrá entusiasmo genuino pero sin gritar
- Si es noticia triste o seria, sé respetuoso
- Escribí como si estuvieras contando algo interesante, no como vendiendo algo
- Está bien usar expresiones naturales: "increíble", "genial", "brutal"
- NUNCA uses MAYÚSCULAS excesivas, signos de exclamación múltiples (!!!), o "HOLY SH*T"
- Preferí frases simples y directas antes que lenguaje rebuscado

EVITÁ:
- Sobreactuar con exclamaciones (❌ "¡¿QUÉ?! ¡NO PUEDO CREER ESTO!")
- Lenguaje corporativo formal (❌ "El icónico líder de...")
- Exageraciones innecesarias (❌ "¡ESTO ES ÉPICO!")
- Inventar información
- Perder datos concretos (fechas, lugares, nombres)

ESCRIBÍ COMO:
- ✅ "Dave Mustaine acaba de anunciar..."
- ✅ "Esta noticia de Ellefson es interesante porque..."
- ✅ "El libro sale en septiembre de 2027 y va a cubrir su batalla contra el cáncer..."
- ✅ "Parece que los fans podrían tener la chance de ver una reunión..."

TÍTULO ORIGINAL:
${title}

CONTENIDO ORIGINAL:
${content}

FUENTE: ${sourceUrl}

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin \`\`\`json):
{
  "title_en": "título natural, directo",
  "title_es": "título traducido, mismo tono",
  "description_en": "descripción conversacional, datos concretos",
  "description_es": "descripción en español, tono natural",
  "image_caption_en": "frase corta descriptiva",
  "image_caption_es": "frase corta descriptiva"
}`;

  try {
    // Usar retry con backoff para llamada a Gemini
    const parsed = await retryWithBackoff(async () => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Limpiar la respuesta (remover markdown si lo hay)
      const cleanText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // Parsear y validar con Zod
      const jsonData = JSON.parse(cleanText);
      const validated = GeminiNewsResponseSchema.parse(jsonData);
      return validated;
    }, 3, 1000); // 3 intentos, delay inicial 1 segundo

    return {
      title_en: parsed.title_en,
      title_es: parsed.title_es,
      description_en: parsed.description_en,
      description_es: parsed.description_es,
      image_caption_en: parsed.image_caption_en,
      image_caption_es: parsed.image_caption_es,
    };
  } catch (error) {
    console.error("❌ Error procesando con Gemini AI después de varios reintentos:", error);
    
    // NO hay fallback: si Gemini falla, descartamos la noticia
    // Esto garantiza que NUNCA se muestre contenido mal procesado al usuario
    throw new Error(`Gemini AI falló al procesar la noticia: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Valida si una noticia es relevante para Megadeth usando Gemini AI
 */
export async function isRelevantToMegadeth(
  title: string,
  content: string
): Promise<boolean> {
  // Filtro rápido local primero
  const keywords = [
    // Banda
    "megadeth",
    "megadeth's",
    
    // Miembros actuales
    "dave mustaine",
    "mustaine",
    "james lomenzo",
    "dirk verbeuren",
    "teemu mäntysaari",
    "teemu mantysaari",
    
    // Ex-miembros importantes
    "kiko loureiro",
    "marty friedman",
    "david ellefson",
    "ellefson",
    "chris poland",
    "nick menza",
    "gar samuelson",
    "chris broderick",
    "shawn drover",
    "al pitrelli",
    "jimmy degrasso",
    
    // Álbumes icónicos
    "rust in peace",
    "peace sells",
    "countdown to extinction",
    "killing is my business",
    "youthanasia",
    "cryptic writings",
    "the system has failed",
    "endgame",
    "dystopia",
    "united abominations",
    "thirteen",
    "super collider",
    "the sick, the dying",
    
    // Canciones icónicas
    "holy wars",
    "symphony of destruction",
    "hangar 18",
    "à tout le monde",
    "tornado of souls",
    "sweating bullets",
    "peace sells",
    "trust",
    "she-wolf",
  ];

  const text = (title + " " + content).toLowerCase();
  const hasKeyword = keywords.some((keyword) => text.includes(keyword));

  if (!hasKeyword) {
    return false;
  }

  // Si tiene keywords, verificar relevancia con AI
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Eres un filtro ESTRICTO de noticias sobre la banda Megadeth.

Analiza si esta noticia es DIRECTAMENTE sobre Megadeth:

TÍTULO: ${title}
CONTENIDO: ${content.substring(0, 500)}

Criterios ESTRICTOS:
✅ SÍ es relevante si:
   - La noticia es principalmente sobre Megadeth, Dave Mustaine, o miembros actuales/ex-miembros
   - Anuncia álbumes, giras, conciertos de Megadeth
   - Entrevistas donde Megadeth es el tema principal
   - Ex-miembros hablan específicamente sobre su tiempo en Megadeth

❌ NO es relevante si:
   - Megadeth solo se menciona de pasada o en una lista
   - La noticia es principalmente sobre OTRA banda (Metallica, Slayer, Anthrax, Testament, Nevermore, etc.)
   - Solo se menciona a Megadeth como comparación o contexto
   - Es sobre el género thrash metal en general
   - Menciona a Megadeth en una lista de "bandas similares" o "bandas de la escena"

PREGUNTA CLAVE: ¿Un fan de Megadeth ESPECÍFICAMENTE querría leer esto, o es sobre otra banda/tema?

Responde ÚNICAMENTE con "true" o "false" (sin comillas, sin explicación):`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toLowerCase();

    return text === "true";
  } catch (error) {
    console.error("Error validando relevancia:", error);
    // En caso de error, confiar en el filtro de keywords
    return hasKeyword;
  }
}
