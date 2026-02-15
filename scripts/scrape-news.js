/**
 * Script de scraping automático de noticias sobre Megadeth
 * Ejecutado por GitHub Actions 2 veces por semana
 * 
 * Flujo:
 * 1. Consume RSS feeds de sitios de metal
 * 2. Filtra noticias sobre Megadeth
 * 3. Procesa con Gemini AI (traducción + optimización)
 * 4. Crea noticias vía API
 */

import Parser from 'rss-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { processNewsWithAI, isRelevantToMegadeth } from '../src/lib/gemini.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const API_URL = process.env.NEWS_API_URL || 'http://localhost:3000/api/news/create';
const API_KEY = process.env.NEWS_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// RSS Feeds de sitios de noticias de metal
const RSS_FEEDS = [
  // Originales (4)
  'https://www.blabbermouth.net/feed/',
  'https://loudwire.com/feed/',
  'https://metalinjection.net/feed',
  'https://www.metalsucks.net/feed/',
  
  // Nuevas fuentes - Alta prioridad (5)
  'https://bravewords.com/rss',                                    // 300 items - Sitio especializado metal/rock
  'https://www.loudersound.com/metal-hammer/feed',               // 50 items - Revista legendaria desde 1983
  'https://www.revolvermag.com/feed',                            // 9 items - Revista prestigiosa con exclusivas
  'https://consequence.net/category/heavy-consequence/feed/',    // 15 items - Gran sitio, sección heavy dedicada
  'https://www.theprp.com/feed/',                                // 10 items - Punk/hardcore/metal especializado
  
  // Medios españoles (1)
  'https://mariskalrock.com/feed',                               // 12 items - Medio español de rock/metal
];

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
    ],
  },
});

/**
 * Extrae el contenido completo de un item del feed
 */
function extractContent(item) {
  return (
    item.contentEncoded ||
    item['content:encoded'] ||
    item.content ||
    item.description ||
    item.summary ||
    ''
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
    const image = item.mediaContent.find(m => m.$ && m.$.url);
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
  const link = item.link || '';
  
  // Combinar contenido y link para buscar
  const text = content + ' ' + link;
  
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
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50);
  return `${slug}-${timestamp}`;
}

/**
 * Limpia el contenido HTML y obtiene texto plano
 */
function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Crea una noticia vía API
 */
async function createNews(newsData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(newsData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Error creando noticia:', result.error);
      if (result.validation_errors) {
        result.validation_errors.forEach(err => {
          console.error(`  • ${err.field}: ${err.message}`);
        });
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
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
      const title = item.title || '';
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
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║  Megadeth News Scraper - Automatización IA   ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  // Validar configuración
  if (!API_KEY) {
    console.error('❌ ERROR: NEWS_API_KEY no configurada');
    process.exit(1);
  }

  if (!GEMINI_API_KEY) {
    console.error('❌ ERROR: GEMINI_API_KEY no configurada');
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

    // Procesar cada noticia relevante
    for (const news of relevantNews) {
      console.log(`\n🤖 Procesando con Gemini AI: "${news.title.substring(0, 60)}..."`);
      
      try {
        // Procesar con AI
        const processed = await processNewsWithAI(
          news.title,
          news.content,
          news.link
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
            ? new Date(news.pubDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          image_url: news.image || '/images/band.webp',
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
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`   ❌ Error procesando noticia:`, error.message);
        totalSkipped++;
      }
    }
  }

  // Resumen final
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║              RESUMEN DE EJECUCIÓN             ║');
  console.log('╚═══════════════════════════════════════════════╝');
  console.log(`📊 Noticias relevantes encontradas: ${totalFound}`);
  console.log(`✅ Noticias creadas exitosamente:   ${totalCreated}`);
  console.log(`⏭️  Noticias omitidas/duplicadas:   ${totalSkipped}`);
  console.log(`\n🎉 Proceso completado a las ${new Date().toLocaleString()}`);
}

// Ejecutar
main().catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
