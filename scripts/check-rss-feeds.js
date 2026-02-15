/**
 * Script para verificar fuentes RSS disponibles
 */

import Parser from "rss-parser";

const parser = new Parser();

// Lista de posibles fuentes RSS de metal/rock
const POTENTIAL_FEEDS = [
  // Mariskal Rock (España) - URL correcta
  { name: "Mariskal Rock", url: "https://mariskalrock.com/feed" },
  { name: "Mariskal Rock - Alt 1", url: "https://mariskalrock.com/feed/" },
  { name: "Mariskal Rock - RSS", url: "https://mariskalrock.com/rss" },
  { name: "Mariskal Rock - Atom", url: "https://mariskalrock.com/atom" },

  // Heavy Rock - Variantes a probar
  { name: "Heavy Rock España", url: "https://heavyrock.com/feed" },
  { name: "Heavy Rock Magazine", url: "https://heavyrockmagazine.com/feed" },
];

async function checkFeed(feedInfo) {
  try {
    const feed = await parser.parseURL(feedInfo.url);
    const itemCount = feed.items.length;
    const recentItem = feed.items[0];

    console.log(`✅ ${feedInfo.name}`);
    console.log(`   URL: ${feedInfo.url}`);
    console.log(`   Items: ${itemCount}`);
    console.log(`   Último: ${recentItem?.title || "N/A"}`);
    console.log(`   Fecha: ${recentItem?.pubDate || "N/A"}`);
    return { ...feedInfo, status: "OK", itemCount };
  } catch (error) {
    console.log(`❌ ${feedInfo.name}`);
    console.log(`   URL: ${feedInfo.url}`);
    console.log(`   Error: ${error.message}`);
    return { ...feedInfo, status: "FAIL", error: error.message };
  }
}

async function main() {
  console.log("🔍 Verificando fuentes RSS...\n");

  const results = [];

  for (const feedInfo of POTENTIAL_FEEDS) {
    const result = await checkFeed(feedInfo);
    results.push(result);
    console.log("");
  }

  // Resumen
  const working = results.filter((r) => r.status === "OK");
  const failed = results.filter((r) => r.status === "FAIL");

  console.log("\n📊 RESUMEN:");
  console.log(`   ✅ Funcionando: ${working.length}/${results.length}`);
  console.log(`   ❌ No disponibles: ${failed.length}/${results.length}`);

  if (working.length > 0) {
    console.log("\n📝 URLS RECOMENDADAS PARA RSS_FEEDS:");
    working.forEach((f) => {
      console.log(`  '${f.url}', // ${f.name} (${f.itemCount} items)`);
    });
  }
}

main().catch(console.error);
