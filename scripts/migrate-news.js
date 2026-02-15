/**
 * Script de migración: news.json → Supabase
 *
 * Este script migra todas las noticias existentes desde el archivo JSON local
 * a la base de datos de Supabase.
 *
 * Uso:
 * 1. Configurar las variables de entorno en .env.local
 * 2. Ejecutar: npm run migrate:news
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env
dotenv.config({ path: path.join(__dirname, "../.env") });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Faltan variables de entorno");
  console.error(
    "Asegurate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY en .env",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Leer el archivo news.json
const newsJsonPath = path.join(__dirname, "../src/constants/news.json");
const newsData = JSON.parse(fs.readFileSync(newsJsonPath, "utf-8"));

console.log(`📰 Encontradas ${newsData.length} noticias en news.json`);

async function migrateNews() {
  let successCount = 0;
  let errorCount = 0;

  for (const article of newsData) {
    try {
      // Preparar datos del artículo para Supabase
      const newsArticle = {
        id: article.id,
        title_es: article.title.es,
        title_en: article.title.en,
        description_es: article.description.es,
        description_en: article.description.en,
        image_url: article.imageUrl || null,
        image_alt_es: article.imageAlt?.es || null,
        image_alt_en: article.imageAlt?.en || null,
        image_caption_es: article.imageCaption?.es || null,
        image_caption_en: article.imageCaption?.en || null,
        published_date: article.publishedDate,
        link_url: article.linkUrl || null,
        link_target: article.linkTarget || null,
        comments_active: article.commentsActive !== false,
        youtube_video_id: article.youtubeVideoId || null,
        is_automated: false, // Las noticias actuales son manuales
        source_url: null,
      };

      // Insertar artículo principal
      const { data: insertedArticle, error: articleError } = await supabase
        .from("news_articles")
        .upsert(newsArticle, { onConflict: "id" })
        .select()
        .single();

      if (articleError) {
        console.error(
          `❌ Error insertando ${article.id}:`,
          articleError.message,
        );
        errorCount++;
        continue;
      }

      // Insertar enlaces externos si existen
      if (article.externalLinks && article.externalLinks.length > 0) {
        // Primero eliminar enlaces existentes (para evitar duplicados en re-runs)
        await supabase
          .from("news_external_links")
          .delete()
          .eq("news_id", article.id);

        const externalLinks = article.externalLinks.map((link, index) => ({
          news_id: article.id,
          url: link.url,
          text_es: link.text.es,
          text_en: link.text.en,
          order_index: index,
        }));

        const { error: linksError } = await supabase
          .from("news_external_links")
          .insert(externalLinks);

        if (linksError) {
          console.error(
            `⚠️ Error insertando enlaces para ${article.id}:`,
            linksError.message,
          );
        }
      }

      console.log(`✅ Migrado: ${article.id}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error procesando ${article.id}:`, error.message);
      errorCount++;
    }
  }

  console.log("\n📊 Resumen de migración:");
  console.log(`✅ Exitosas: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📝 Total: ${newsData.length}`);
}

// Función para verificar la migración
async function verifyMigration() {
  console.log("\n🔍 Verificando migración...");

  const { data, error, count } = await supabase
    .from("news_articles")
    .select("*", { count: "exact" });

  if (error) {
    console.error("❌ Error verificando:", error.message);
    return;
  }

  console.log(`✅ Total de noticias en Supabase: ${count}`);
  console.log(`📝 Total en news.json: ${newsData.length}`);

  if (count === newsData.length) {
    console.log("✅ ¡Migración exitosa! Todos los artículos fueron migrados.");
  } else {
    console.log(
      `⚠️ Advertencia: Hay diferencia entre la base de datos (${count}) y el archivo JSON (${newsData.length})`,
    );
  }
}

// Ejecutar migración
console.log("🚀 Iniciando migración...\n");
migrateNews()
  .then(() => verifyMigration())
  .then(() => {
    console.log("\n✅ Proceso completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
