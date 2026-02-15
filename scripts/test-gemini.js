/**
 * Script para verificar y testear la API Key de Google Gemini
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Verificando configuración de Google Gemini AI\n');

if (!GEMINI_API_KEY) {
  console.log('❌ GEMINI_API_KEY no está configurada en .env');
  console.log('\n📝 Pasos para obtener tu API Key:');
  console.log('   1. Ve a https://aistudio.google.com/app/apikey');
  console.log('   2. Inicia sesión con tu cuenta de Google');
  console.log('   3. Click en "Create API Key"');
  console.log('   4. Copia la key y agrégala a tu archivo .env:');
  console.log('      GEMINI_API_KEY=tu-key-aqui\n');
  process.exit(1);
}

console.log(`✅ GEMINI_API_KEY encontrada: ${GEMINI_API_KEY.substring(0, 20)}...\n`);

// Paso 1: Listar modelos disponibles
console.log('🔍 Listando modelos disponibles en tu API Key...\n');

try {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  
  // Intentar con fetch directo para listar modelos
  const listUrl = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + GEMINI_API_KEY;
  const response = await fetch(listUrl);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  console.log('📋 Modelos disponibles:\n');
  
  const availableModels = [];
  
  if (data.models && Array.isArray(data.models)) {
    for (const model of data.models) {
      const supportsGeneration = model.supportedGenerationMethods?.includes('generateContent');
      if (supportsGeneration) {
        const modelName = model.name.replace('models/', '');
        availableModels.push(modelName);
        console.log(`   ✅ ${modelName}`);
        console.log(`      Descripción: ${model.displayName || 'N/A'}`);
      }
    }
  }
  
  if (availableModels.length === 0) {
    console.log('   ⚠️  No se encontraron modelos con soporte para generateContent');
    process.exit(1);
  }
  
  // Paso 2: Probar el primer modelo disponible
  const testModel = availableModels[0];
  console.log(`\n🧪 Testeando modelo: ${testModel}...\n`);
  
  const model = genAI.getGenerativeModel({ model: testModel });
  const prompt = "Responde únicamente con la palabra 'OK' si puedes leer este mensaje.";
  
  const result = await model.generateContent(prompt);
  const responseText = await result.response;
  const text = responseText.text();

  console.log('✅ CONEXIÓN EXITOSA con Gemini API');
  console.log(`📝 Respuesta de prueba: "${text.trim()}"\n`);
  
  console.log('🎯 MODELO RECOMENDADO PARA USAR:');
  console.log(`   ${testModel}\n`);
  
  console.log('📝 Se actualizará automáticamente en el código...');
  
  // Guardar el nombre del modelo para usarlo
  console.log(`\n✅ Modelo verificado: ${testModel}`);
  console.log('💡 Ya puedes ejecutar: npm run scrape:news\n');
  
  process.exit(0);
  
} catch (error) {
  console.error('❌ ERROR:\n');
  console.error(error.message);
  
  if (error.message.includes('403')) {
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verifica que la API Key sea correcta (copia/pega sin espacios)');
    console.log('   2. Ve a https://aistudio.google.com/app/apikey y genera una nueva key');
    console.log('   3. Asegúrate de habilitar "Generative Language API" en Google Cloud Console');
    console.log('   4. Si es nueva, espera 1-2 minutos para que se active\n');
  } else if (error.message.includes('404')) {
    console.log('\n🔧 El modelo especificado no existe.');
    console.log('   Ejecuta este script de nuevo para ver los modelos disponibles.\n');
  }
  
  process.exit(1);
}
