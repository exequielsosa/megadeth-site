/**
 * Script de auto-posting a redes sociales
 * Postea artículos no publicados (social_posted_at IS NULL) a Facebook, Instagram y X
 * Máximo 3 artículos por ejecución para evitar spam
 */

import { createClient } from '@supabase/supabase-js';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const twitter = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const SITE_URL = 'https://megadeth.com.ar';
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FB_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

function articleUrl(id) {
  return `${SITE_URL}/noticias/${id}`;
}

function buildFacebookPost(article) {
  const url = articleUrl(article.id);
  const MAX = 30000;

  const rawEs = article.description_es || '';
  const rawEn = article.description_en || '';

  const descEs = rawEs.length > MAX
    ? `${rawEs.slice(0, MAX)}...\n\nVer nota completa: ${url}`
    : `${rawEs}\n\nVer más noticias y novedades en https://megadeth.com.ar/noticias`;

  const descEn = rawEn.length > MAX
    ? `${rawEn.slice(0, MAX)}...\n\nRead full article: ${url}`
    : `${rawEn}\n\nMore news at https://megadeth.com.ar/noticias`;

  const message =
    `${article.title_es}\n\n${descEs}\n\n` +
    `─────────────────────\n\n` +
    `${article.title_en}\n\n${descEn}`;
  return { message, link: url };
}

function buildInstagramCaption(article) {
  const url = articleUrl(article.id);
  const MAX = 900;
  const hashtags = '#Megadeth #MegadethArgentina #metal #heavymetal #thrashmetal #DaveMustaine';

  const rawEs = article.description_es || '';
  const rawEn = article.description_en || '';

  const descEs = rawEs.length > MAX
    ? `${rawEs.slice(0, MAX)}...\n\nVer nota completa: ${url}`
    : `${rawEs}\n\nVer más noticias: megadeth.com.ar/noticias`;

  const descEn = rawEn.length > MAX
    ? `${rawEn.slice(0, MAX)}...\n\nRead full article: ${url}`
    : `${rawEn}\n\nMore news: megadeth.com.ar/noticias`;

  return (
    `${article.title_es}\n\n${descEs}\n\n` +
    `─────────────────────\n\n` +
    `${article.title_en}\n\n${descEn}\n\n` +
    hashtags
  );
}

function buildXTweets(article) {
  const url = articleUrl(article.id);
  // URL cuenta como 23 chars en X, límite 280
  const maxTitle = 280 - 23 - 2;
  const tweetEs = `${article.title_es.slice(0, maxTitle)}\n\n${url}`;
  const tweetEn = article.title_en.slice(0, 280);
  return { tweetEs, tweetEn };
}

async function postToFacebook(article) {
  const { message, link } = buildFacebookPost(article);
  const res = await fetch(`https://graph.facebook.com/v19.0/${FB_PAGE_ID}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, link, access_token: FB_TOKEN }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  console.log(`  ✅ Facebook: ${data.id}`);
}

async function postToInstagram(article) {
  if (!article.image_url) {
    console.log(`  ⚠️  Instagram: sin imagen, omitiendo`);
    return;
  }
  const caption = buildInstagramCaption(article);

  // Paso 1: crear container
  const containerRes = await fetch(`https://graph.facebook.com/v19.0/${IG_USER_ID}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: article.image_url, caption, access_token: IG_TOKEN }),
  });
  const container = await containerRes.json();
  if (container.error) throw new Error(container.error.message);

  await new Promise(r => setTimeout(r, 2000));

  // Paso 2: publicar
  const publishRes = await fetch(`https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id, access_token: IG_TOKEN }),
  });
  const published = await publishRes.json();
  if (published.error) throw new Error(published.error.message);
  console.log(`  ✅ Instagram: ${published.id}`);
}

async function postToX(article) {
  const { tweetEs, tweetEn } = buildXTweets(article);
  const tweet1 = await twitter.v2.tweet(tweetEs);
  await twitter.v2.reply(tweetEn, tweet1.data.id);
  console.log(`  ✅ X: ${tweet1.data.id}`);
}

async function markAsPosted(id) {
  const { error } = await supabase
    .from('news_articles')
    .update({ social_posted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

async function main() {
  console.log('🚀 Iniciando post-social...');

  const { data: articles, error } = await supabase
    .from('news_articles')
    .select('id, title_es, title_en, description_es, description_en, image_url')
    .is('social_posted_at', null)
    .order('published_date', { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);

  if (!articles || articles.length === 0) {
    console.log('✅ No hay artículos nuevos para postear.');
    return;
  }

  console.log(`📰 ${articles.length} artículo(s) para postear`);

  for (const article of articles) {
    console.log(`\n📝 ${article.title_es}`);

    try { await postToFacebook(article); } catch (e) { console.error(`  ❌ Facebook: ${e.message}`); }
    try { await postToInstagram(article); } catch (e) { console.error(`  ❌ Instagram: ${e.message}`); }
    try { await postToX(article); } catch (e) { console.error(`  ❌ X: ${e.message}`); }

    await markAsPosted(article.id);
    console.log(`  ✅ Marcado como posteado`);

    if (articles.indexOf(article) < articles.length - 1) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log('\n✅ Post-social finalizado.');
}

main().catch(e => {
  console.error('❌ Error fatal:', e.message);
  process.exit(1);
});
