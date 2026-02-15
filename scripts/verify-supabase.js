/**
 * Script para verificar que Supabase está configurado correctamente
 *
 * Uso: node scripts/verify-supabase.js
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env
dotenv.config({ path: path.join(__dirname, "../.env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log("🔍 Verificando configuración de Supabase...\n");

// Verificar variables de entorno
console.log("1️⃣ Variables de entorno:");
if (!supabaseUrl) {
  console.log("   ❌ NEXT_PUBLIC_SUPABASE_URL no está definida");
} else {
  console.log(`   ✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`);
}

if (!supabaseAnonKey) {
  console.log("   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida");
} else {
  console.log(
    `   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 20)}...`,
  );
}

if (!supabaseServiceKey) {
  console.log("   ❌ SUPABASE_SERVICE_KEY no está definida");
} else {
  console.log(
    `   ✅ SUPABASE_SERVICE_KEY: ${supabaseServiceKey.substring(0, 20)}...`,
  );
}

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.log("\n❌ Faltan variables de entorno. Por favor configurá .env");
  process.exit(1);
}

// Verificar conexión con Supabase
console.log("\n2️⃣ Conexión a Supabase:");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

try {
  // Intentar hacer una query simple
  const { data, error } = await supabase
    .from("news_articles")
    .select("count", { count: "exact", head: true });

  if (error) {
    if (
      error.message.includes("relation") &&
      error.message.includes("does not exist")
    ) {
      console.log("   ⚠️ Las tablas no existen todavía");
      console.log(
        "   📝 Ejecutá el script SQL en Supabase (scripts/supabase-schema.sql)",
      );
    } else {
      console.log(`   ❌ Error: ${error.message}`);
    }
  } else {
    console.log("   ✅ Conexión exitosa a Supabase");
    console.log(`   ✅ Tabla news_articles existe`);
  }
} catch (error) {
  console.log(`   ❌ Error de conexión: ${error.message}`);
  process.exit(1);
}

// Verificar permisos con service key
console.log("\n3️⃣ Permisos de escritura:");
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

try {
  // Intentar crear un registro de prueba
  const testId = "test-" + Date.now();
  const { data, error } = await supabaseAdmin
    .from("news_articles")
    .insert({
      id: testId,
      title_es: "Test",
      title_en: "Test",
      description_es: "Test",
      description_en: "Test",
      published_date: new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  if (error) {
    console.log(`   ❌ No se puede insertar: ${error.message}`);
  } else {
    console.log("   ✅ Permisos de escritura OK");

    // Eliminar el registro de prueba
    await supabaseAdmin.from("news_articles").delete().eq("id", testId);

    console.log("   ✅ Permisos de eliminación OK");
  }
} catch (error) {
  console.log(`   ❌ Error verificando permisos: ${error.message}`);
}

console.log("\n✅ Verificación completada");
console.log("\n📝 Próximo paso: npm run migrate:news");
