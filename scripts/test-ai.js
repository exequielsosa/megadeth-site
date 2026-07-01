/**
 * Test del modelo de Groq (openai/gpt-oss-120b) sin scrapear feeds ni escribir
 * en la base de datos. Prueba el filtro de relevancia y el procesamiento de
 * noticias con ejemplos fijos. Sirve para validar el cambio de modelo.
 *
 * Uso: npm run test:ai
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { isRelevantToMegadeth, processNewsWithAI } from "../src/lib/ai.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

if (!process.env.GROQ_API_KEY) {
  console.log("❌ GROQ_API_KEY no está configurada en .env");
  process.exit(1);
}

console.log("🧪 Test del modelo Groq (openai/gpt-oss-120b)\n");

// Noticia real de Megadeth → debería ser RELEVANTE
const relevante = {
  title: "Megadeth announce final album and 2026 farewell world tour",
  content:
    "Dave Mustaine has announced that Megadeth will release their final studio album in January 2026, followed by a farewell world tour. The thrash metal legends will play across North America, Europe and South America, including shows in Buenos Aires, São Paulo and Santiago, sharing the stage with Iron Maiden and Anthrax.",
};

// Noticia de otra banda sin conexión con Megadeth → debería ser NO RELEVANTE
const noRelevante = {
  title: "Slipknot reveal 25th anniversary reissue of their debut album",
  content:
    "Slipknot have announced a 25th anniversary reissue of their self-titled debut album, featuring unreleased demos and a remastered version of the record. The Iowa band will also headline several festivals later this year.",
};

async function main() {
  // 1) Filtro de relevancia — caso positivo
  console.log("1️⃣  Filtro — noticia de Megadeth (esperado: RELEVANTE)");
  const r1 = await isRelevantToMegadeth(relevante.title, relevante.content);
  console.log(
    `   → ${r1 ? "✅ relevante" : "❌ NO relevante"}  ${r1 ? "(OK)" : "(⚠️ debería ser relevante)"}\n`,
  );

  // 2) Filtro de relevancia — caso negativo
  console.log("2️⃣  Filtro — noticia de otra banda (esperado: NO RELEVANTE)");
  const r2 = await isRelevantToMegadeth(noRelevante.title, noRelevante.content);
  console.log(
    `   → ${r2 ? "✅ relevante" : "❌ NO relevante"}  ${!r2 ? "(OK)" : "(⚠️ debería ser NO relevante)"}\n`,
  );

  // 3) Procesamiento completo — genera el JSON bilingüe
  console.log(
    "3️⃣  Procesamiento — genera JSON bilingüe (puede tardar unos segundos)...\n",
  );
  const processed = await processNewsWithAI(
    relevante.title,
    relevante.content,
    "https://example.com/megadeth-farewell-tour",
  );
  console.log("   ✅ JSON válido devuelto y validado con Zod:\n");
  console.log(`   Título EN: ${processed.title_en}`);
  console.log(`   Título ES: ${processed.title_es}`);
  console.log(`   Caption EN: ${processed.image_caption_en}`);
  console.log(`   Caption ES: ${processed.image_caption_es}`);
  console.log(`\n   Descripción ES (primeros 200 caracteres):`);
  console.log(`   ${processed.description_es.substring(0, 200)}...\n`);

  console.log(
    "🎉 Test completado. Si los 3 pasos salieron OK, el modelo nuevo funciona bien.",
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ ERROR en el test:", error.message);
    process.exit(1);
  });
