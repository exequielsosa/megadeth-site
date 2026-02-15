/**
 * Script para agregar noticias manualmente via API
 * Uso: node scripts/add-news.js
 */

import dotenv from "dotenv";
import readline from "readline";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const API_URL =
  process.env.NEWS_API_URL || "http://localhost:3000/api/news/create";
const API_KEY = process.env.NEWS_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: NEWS_API_KEY no está configurada en .env");
  process.exit(1);
}

// Ejemplo de noticia completa con TODOS los campos
const exampleNews = {
  // --- CAMPOS REQUERIDOS ---
  id: "megadeth-tour-2026",
  title_es: "Megadeth anuncia gira mundial 2026",
  title_en: "Megadeth announces 2026 world tour",
  description_es:
    "La banda legendaria ha confirmado su gira mundial que incluirá más de 50 fechas...",
  description_en:
    "The legendary band has confirmed their world tour including over 50 dates...",
  published_date: "2026-02-14", // Formato: YYYY-MM-DD

  // --- CAMPOS OPCIONALES DE IMAGEN ---
  image_url: "https://example.com/images/megadeth-tour-2026.jpg",
  image_alt_es: "Logo de la gira Megadeth 2026",
  image_alt_en: "Megadeth 2026 tour logo",
  image_caption_es: "La nueva gira promete ser épica",
  image_caption_en: "The new tour promises to be epic",

  // --- CAMPOS OPCIONALES DE ENLACE ---
  link_url: "https://megadeth.com/tour",
  link_target: "_blank", // '_blank' o '_self'

  // --- CONFIGURACIÓN ---
  comments_active: true, // default: true
  youtube_video_id: "dQw4w9WgXcQ", // ID del video de YouTube

  // --- AUTOMATIZACIÓN ---
  is_automated: false, // default: false
  source_url: "https://blabbermouth.net/news/megadeth-2026",

  // --- ENLACES EXTERNOS (array opcional) ---
  external_links: [
    {
      url: "https://ticketmaster.com/megadeth",
      text_es: "Comprar entradas",
      text_en: "Buy tickets",
      order_index: 0,
    },
    {
      url: "https://megadeth.com/vip",
      text_es: "Paquetes VIP",
      text_en: "VIP packages",
      order_index: 1,
    },
  ],
};

/**
 * Función para crear una noticia
 */
async function createNews(newsData) {
  try {
    console.log("\n📤 Enviando noticia a la API...\n");

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
      console.error("❌ ERROR:", result.error);
      if (result.validation_errors) {
        console.error("\n📋 Errores de validación:");
        result.validation_errors.forEach((err) => {
          console.error(`  • ${err.field}: ${err.message}`);
        });
      }
      if (result.details) {
        console.error("\n📋 Detalles:", result.details);
      }
      return false;
    }

    console.log("✅ ¡Noticia creada exitosamente!");
    console.log("\n📄 Datos de la noticia:");
    console.log(JSON.stringify(result.data, null, 2));
    return true;
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    return false;
  }
}

/**
 * Función para crear una noticia mínima (solo campos requeridos)
 */
async function createMinimalNews() {
  const timestamp = Date.now();
  const minimalNews = {
    id: `test-news-${timestamp}`,
    title_es: "Noticia de prueba",
    title_en: "Test news",
    description_es: "Esta es una noticia de prueba creada automáticamente",
    description_en: "This is a test news created automatically",
    published_date: new Date().toISOString().split("T")[0],
  };

  console.log("\n🔬 Creando noticia mínima de prueba...");
  console.log(JSON.stringify(minimalNews, null, 2));

  return await createNews(minimalNews);
}

/**
 * Función principal interactiva
 */
async function main() {
  console.log("╔════════════════════════════════════════════╗");
  console.log("║  Megadeth Site - Agregar Noticia Manual   ║");
  console.log("╚════════════════════════════════════════════╝\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) =>
    new Promise((resolve) => rl.question(query, resolve));

  try {
    console.log("Opciones:\n");
    console.log("1. Crear noticia de ejemplo completa (con todos los campos)");
    console.log("2. Crear noticia mínima de prueba (solo campos requeridos)");
    console.log("3. Ver ejemplo de JSON completo y salir\n");

    const choice = await question("Selecciona una opción (1-3): ");

    switch (choice.trim()) {
      case "1":
        await createNews(exampleNews);
        break;

      case "2":
        await createMinimalNews();
        break;

      case "3":
        console.log("\n📋 Ejemplo de JSON completo con TODOS los campos:\n");
        console.log(JSON.stringify(exampleNews, null, 2));
        console.log("\n💡 Puedes usar este formato con curl:");
        console.log(`\ncurl -X POST ${API_URL} \\`);
        console.log(`  -H "Content-Type: application/json" \\`);
        console.log(`  -H "X-API-Key: ${API_KEY}" \\`);
        console.log(`  -d '${JSON.stringify(exampleNews)}'`);
        break;

      default:
        console.log("❌ Opción inválida");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    rl.close();
  }
}

main();
