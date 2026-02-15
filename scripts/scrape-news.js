/**
 * Script de scraping automático de noticias sobre Megadeth
 * Ejecutado por GitHub Actions DIARIAMENTE con rotación de feeds
 *
 * Estrategia de rotación:
 * - 2 feeds por día (dentro del límite de 100K tokens/día de Groq)
 * - Feeds top (Blabbermouth, Loudwire, Metal Injection) se procesan 2 veces/semana
 * - Feeds secundarios se procesan 1 vez/semana
 *
 * Flujo:
 * 1. Consume RSS feeds de sitios de metal (2 por día según rotación)
 * 2. Filtra noticias sobre Megadeth
 * 3. Procesa con Groq AI (traducción + optimización)
 * 4. Crea noticias vía API
 */

import Parser from "rss-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { processNewsWithAI, isRelevantToMegadeth } from "../src/lib/ai.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const API_URL =
  process.env.NEWS_API_URL || "http://localhost:3000/api/news/create";
const API_KEY = process.env.NEWS_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Definición de todos los feeds disponibles
const ALL_FEEDS = {
  blabbermouth: "https://www.blabbermouth.net/feed/",
  loudwire: "https://loudwire.com/feed/",
  metalinjection: "https://metalinjection.net/feed",
  metalsucks: "https://www.metalsucks.net/feed/",
  bravewords: "https://bravewords.com/rss",
  loudersound: "https://www.loudersound.com/metal-hammer/feed",
  revolver: "https://www.revolvermag.com/feed",
  consequence: "https://consequence.net/category/heavy-consequence/feed/",
  theprp: "https://www.theprp.com/feed/",
  mariskalrock: "https://mariskalrock.com/feed",
};

/**
 * Rotación semanal de feeds (2 por día)
 * Feeds top (blabbermouth, loudwire, metalinjection) aparecen 2 veces/semana
 * El resto aparece 1 vez/semana
 */
const FEED_ROTATION = {
  0: ["blabbermouth", "metalinjection"], // Domingo
  1: ["loudwire", "bravewords"], // Lunes
  2: ["blabbermouth", "loudersound"], // Martes (repite blabbermouth)
  3: ["metalinjection", "metalsucks"], // Miércoles (repite metalinjection)
  4: ["loudwire", "consequence"], // Jueves (repite loudwire)
  5: ["revolver", "theprp"], // Viernes
  6: ["mariskalrock", "blabbermouth"], // Sábado (3ra vez blabbermouth)
};

/**
 * Obtiene los feeds que deben procesarse hoy según el día de la semana
 * @returns {string[]} Array de URLs de feeds para procesar hoy
 */
function getTodaysFeeds() {
  const today = new Date().getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
  const feedKeys = FEED_ROTATION[today];
  const feedUrls = feedKeys.map((key) => ALL_FEEDS[key]);

  console.log(
    `📅 Día de la semana: ${today} (${["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][today]})`,
  );
  console.log(`🎯 Feeds programados: ${feedKeys.join(", ")}`);

  return feedUrls;
}

// RSS Feeds que se procesarán HOY
const RSS_FEEDS = getTodaysFeeds();

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["content:encoded", "contentEncoded"],
      ["description", "description"],
    ],
  },
});

/**
 * Extrae el contenido completo de un item del feed
 */
function extractContent(item) {
  return (
    item.contentEncoded ||
    item["content:encoded"] ||
    item.content ||
    item.description ||
    item.summary ||
    ""
  );
}

/**
 * Extrae la imagen del feed item
 */
function extractImage(item) {
  // Intentar varias formas de obtener la imagen
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  if (item.mediaContent && Array.isArray(item.mediaContent)) {
    const image = item.mediaContent.find((m) => m.$ && m.$.url);
    if (image) return image.$.url;
  }

  // Buscar en el contenido HTML
  const content = extractContent(item);
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch) {
    return imgMatch[1];
  }

  return null;
}

/**
 * Extrae el ID de video de YouTube del contenido
 */
function extractYouTubeId(item) {
  const content = extractContent(item);
  const link = item.link || "";

  // Combinar contenido y link para buscar
  const text = content + " " + link;

  // Patrones comunes de YouTube
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Genera un ID único basado en el título
 */
function generateId(title) {
  const timestamp = Date.now();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 50);
  return `${slug}-${timestamp}`;
}

/**
 * Limpia el contenido HTML y obtiene texto plano
 */
function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Crea una noticia vía API
 */
async function createNews(newsData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(newsData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Error creando noticia:", result.error);
      if (result.validation_errors) {
        result.validation_errors.forEach((err) => {
          console.error(`  • ${err.field}: ${err.message}`);
        });
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    return false;
  }
}

/**
 * Procesa un feed RSS
 */
async function processFeed(feedUrl) {
  console.log(`\n📡 Procesando feed: ${feedUrl}`);

  try {
    const feed = await parser.parseURL(feedUrl);
    console.log(`   Encontrados ${feed.items.length} items`);

    const relevantNews = [];

    // Filtrar solo los últimos 30 items más recientes (~1 semana)
    const recentItems = feed.items.slice(0, 30);

    for (const item of recentItems) {
      const title = item.title || "";
      const content = stripHtml(extractContent(item));

      // Verificar relevancia
      console.log(`   🔍 Analizando: "${title.substring(0, 60)}..."`);

      const isRelevant = await isRelevantToMegadeth(title, content);

      if (isRelevant) {
        console.log(`   ✅ Relevante para Megadeth`);
        relevantNews.push({
          title,
          content,
          link: item.link,
          pubDate: item.pubDate,
          image: extractImage(item),
          youtubeId: extractYouTubeId(item),
        });
      } else {
        console.log(`   ⏭️  No es relevante`);
      }
    }

    return relevantNews;
  } catch (error) {
    console.error(`❌ Error procesando feed ${feedUrl}:`, error.message);
    return [];
  }
}

/**
 * Script principal
 */
async function main() {
  console.log("╔═══════════════════════════════════════════════╗");
  console.log("║  Megadeth News Scraper - Automatización IA   ║");
  console.log("╚═══════════════════════════════════════════════╝\n");

  // Validar configuración
  if (!API_KEY) {
    console.error("❌ ERROR: NEWS_API_KEY no configurada");
    process.exit(1);
  }

  if (!GROQ_API_KEY) {
    console.error("❌ ERROR: GROQ_API_KEY no configurada");
    process.exit(1);
  }

  console.log(`📅 Fecha: ${new Date().toISOString()}`);
  console.log(`🎯 Feeds a procesar: ${RSS_FEEDS.length}\n`);

  let totalFound = 0;
  let totalCreated = 0;
  let totalSkipped = 0;

  // Procesar todos los feeds
  for (const feedUrl of RSS_FEEDS) {
    const relevantNews = await processFeed(feedUrl);
    totalFound += relevantNews.length;

    // Procesar cada noticia relevante con delay para respetar rate limit
    for (let i = 0; i < relevantNews.length; i++) {
      const news = relevantNews[i];

      // Delay de 8 segundos entre noticias (Groq free tier: 30 RPM)
      if (i > 0) {
        console.log(
          `\n⏱️  Esperando 8 segundos para respetar rate limit de Groq...`,
        );
        await new Promise((resolve) => setTimeout(resolve, 8000));
      }

      console.log(
        `\n🤖 Procesando con Groq AI [${i + 1}/${relevantNews.length}]: "${news.title.substring(0, 60)}..."`,
      );

      try {
        // Procesar con AI
        const processed = await processNewsWithAI(
          news.title,
          news.content,
          news.link,
        );

        // Preparar datos para la API
        const newsData = {
          id: generateId(processed.title_en),
          title_es: processed.title_es,
          title_en: processed.title_en,
          description_es: processed.description_es,
          description_en: processed.description_en,
          // Usar fecha real del artículo o fecha actual como fallback
          published_date: news.pubDate
            ? new Date(news.pubDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          image_url: news.image || "/images/band.webp",
          image_alt_es: processed.title_es,
          image_alt_en: processed.title_en,
          image_caption_es: processed.image_caption_es,
          image_caption_en: processed.image_caption_en,
          source_url: news.link,
          is_automated: true,
          comments_active: true,
          ...(news.youtubeId && { youtube_video_id: news.youtubeId }),
        };

        console.log(`   📝 Título EN: ${processed.title_en}`);
        console.log(`   📝 Título ES: ${processed.title_es}`);

        // Crear noticia
        const success = await createNews(newsData);

        if (success) {
          console.log(`   ✅ Noticia creada exitosamente`);
          totalCreated++;
        } else {
          console.log(`   ⚠️  No se pudo crear (posiblemente duplicada)`);
          totalSkipped++;
        }

        // Pausa para no saturar la API
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(
          `   ❌ Error en Groq AI: Noticia descartada - ${error.message}`,
        );
        console.log(
          `   ℹ️  Esta noticia NO se guardará (solo contenido correctamente procesado)`,
        );
        totalSkipped++;
      }
    }
  }

  // Resumen final
  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║              RESUMEN DE EJECUCIÓN             ║");
  console.log("╚═══════════════════════════════════════════════╝");
  console.log(`📊 Noticias relevantes encontradas: ${totalFound}`);
  console.log(`✅ Noticias creadas exitosamente:   ${totalCreated}`);
  console.log(`⏭️  Noticias descartadas (duplicadas/errores): ${totalSkipped}`);
  console.log(`\n🎉 Proceso completado a las ${new Date().toLocaleString()}`);
}

// Ejecutar
main().catch((error) => {
  console.error("💥 Error fatal:", error);
  process.exit(1);
});
