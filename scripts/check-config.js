/**
 * Script de verificación de configuración para scraping automatizado
 * Verifica que todas las variables de entorno necesarias estén configuradas
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_KEY",
  "NEWS_API_KEY",
  "NEWS_API_URL",
  "GEMINI_API_KEY",
];

console.log("🔍 Verificando configuración del sistema de scraping...\n");

let allOk = true;

for (const varName of requiredVars) {
  const value = process.env[varName];

  if (!value) {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
    allOk = false;
  } else {
    // Mostrar solo los primeros caracteres para seguridad
    const preview = value.length > 20 ? `${value.substring(0, 20)}...` : value;
    console.log(`✅ ${varName}: ${preview}`);
  }
}

console.log("\n" + "=".repeat(60));

if (allOk) {
  console.log("✅ TODAS LAS VARIABLES ESTÁN CONFIGURADAS");
  console.log("\n📋 Siguiente paso: Ejecutar el scraper");
  console.log("   npm run scrape:news\n");
  process.exit(0);
} else {
  console.log("❌ FALTAN VARIABLES DE ENTORNO");
  console.log("\n📝 Copia .env.example a .env y configura los valores:");
  console.log("   cp .env.example .env\n");
  process.exit(1);
}
