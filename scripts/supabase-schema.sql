-- ============================================
-- MEGADETH SITE - NEWS SCHEMA
-- Base de datos para noticias con soporte multiidioma
-- ============================================

-- Crear la tabla de noticias
CREATE TABLE IF NOT EXISTS news_articles (
  id TEXT PRIMARY KEY,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  image_url TEXT,
  image_alt_es TEXT,
  image_alt_en TEXT,
  image_caption_es TEXT,
  image_caption_en TEXT,
  published_date DATE NOT NULL,
  link_url TEXT,
  link_target TEXT CHECK (link_target IN ('_blank', '_self')),
  comments_active BOOLEAN DEFAULT true,
  youtube_video_id TEXT,
  is_automated BOOLEAN DEFAULT false,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla para enlaces externos
CREATE TABLE IF NOT EXISTS news_external_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id TEXT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  text_es TEXT NOT NULL,
  text_en TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news_articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_automated ON news_articles(is_automated);
CREATE INDEX IF NOT EXISTS idx_external_links_news_id ON news_external_links(news_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_external_links ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad: Todos pueden leer, nadie puede escribir directamente
-- (escritura se hará vía API con service key)
CREATE POLICY "Permitir lectura pública de noticias"
  ON news_articles FOR SELECT
  USING (true);

CREATE POLICY "Permitir lectura pública de enlaces externos"
  ON news_external_links FOR SELECT
  USING (true);

-- Vista para obtener noticias con enlaces externos en formato JSON
CREATE OR REPLACE VIEW news_articles_with_links AS
SELECT 
  na.*,
  COALESCE(
    json_agg(
      json_build_object(
        'url', nel.url,
        'text_es', nel.text_es,
        'text_en', nel.text_en
      ) ORDER BY nel.order_index
    ) FILTER (WHERE nel.id IS NOT NULL),
    '[]'::json
  ) as external_links
FROM news_articles na
LEFT JOIN news_external_links nel ON na.id = nel.news_id
GROUP BY na.id
ORDER BY na.published_date DESC;

-- Comentarios para documentación
COMMENT ON TABLE news_articles IS 'Tabla principal de noticias del sitio Megadeth';
COMMENT ON TABLE news_external_links IS 'Enlaces externos relacionados a cada noticia';
COMMENT ON COLUMN news_articles.is_automated IS 'TRUE si la noticia fue generada automáticamente por el scraper';
COMMENT ON COLUMN news_articles.source_url IS 'URL de la noticia original (para noticias automatizadas)';
