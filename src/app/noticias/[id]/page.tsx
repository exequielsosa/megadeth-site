export const revalidate = 300;
import { Container, Typography, Box, Chip } from "@mui/material";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { NewsArticle } from "@/types/news";
import Breadcrumb from "@/components/Breadcrumb";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import SafeNewsImage from "@/components/SafeNewsImage";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import Link from "next/link";
import RandomSectionBanner from "@/components/NewsBanner";
import { CommentsSection } from "@/components/CommentsSection";
import { getAllNews, getNewsById } from "@/lib/supabase";
import { getSafeTranslation } from "@/utils/safeContent";

interface NewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const newsData = await getAllNews();
  return newsData.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }: NewsPageProps) {
  const resolvedParams = await params;
  const locale = (await getLocale()) as "es" | "en";
  const article = await getNewsById(resolvedParams.id);

  if (!article) {
    return {
      title: "Noticia no encontrada",
    };
  }

  // Obtener título y descripción de forma segura
  const title = getSafeTranslation(
    article.title,
    locale,
    locale === "es" ? "Noticia sin título" : "Untitled news",
  );

  const description = getSafeTranslation(
    article.description,
    locale,
    locale === "es" ? "Descripción no disponible" : "Description unavailable",
  );

  const imageAlt = getSafeTranslation(article.imageAlt, locale, title);

  return {
    title: `${title} | Megadeth Argentina`,
    description: description,
    other: {
      "fb:app_id": "894918050009208",
    },
    openGraph: {
      title: title,
      description: description,
      type: "article",
      url: `https://megadeth.com.ar/noticias/${resolvedParams.id}`,
      publishedTime: article.publishedDate,
      images: article.imageUrl
        ? [
            {
              url: article.imageUrl.startsWith("http")
                ? article.imageUrl
                : `https://megadeth.com.ar${article.imageUrl}`,
              alt: imageAlt,
            },
          ]
        : article.youtubeVideoId
          ? [
              {
                url: `https://img.youtube.com/vi/${article.youtubeVideoId}/maxresdefault.jpg`,
                alt: title,
              },
            ]
          : [],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: article.imageUrl
        ? [
            article.imageUrl.startsWith("http")
              ? article.imageUrl
              : `https://megadeth.com.ar${article.imageUrl}`,
          ]
        : article.youtubeVideoId
          ? [
              `https://img.youtube.com/vi/${article.youtubeVideoId}/maxresdefault.jpg`,
            ]
          : [],
    },
    alternates: {
      canonical: `https://megadeth.com.ar/noticias/${resolvedParams.id}`,
    },
  };
}

export default async function NoticiaPage({ params }: NewsPageProps) {
  const resolvedParams = await params;
  const locale = (await getLocale()) as "es" | "en";
  const tb = await getTranslations("breadcrumb");

  const article = await getNewsById(resolvedParams.id);

  if (!article) {
    notFound();
  }

  // Obtener título, descripción e imageAlt de forma segura
  const title = getSafeTranslation(
    article.title,
    locale,
    locale === "es" ? "Noticia sin título" : "Untitled news",
  );

  const description = getSafeTranslation(
    article.description,
    locale,
    locale === "es" ? "Descripción no disponible" : "Description unavailable",
  );

  const imageAlt = getSafeTranslation(article.imageAlt, locale, title);

  // Formatear fecha
  const formattedDate = new Date(article.publishedDate).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  // JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: {
      "@type": "Organization",
      name: "Megadeth Argentina",
      url: "https://megadeth.com.ar",
    },
    publisher: {
      "@type": "Organization",
      name: "Megadeth Argentina",
      url: "https://megadeth.com.ar",
      logo: {
        "@type": "ImageObject",
        url: "https://megadeth.com.ar/images/meg-argentina.jpg",
        width: 600,
        height: 60,
      },
    },
    image: article.imageUrl
      ? {
          "@type": "ImageObject",
          url: `https://megadeth.com.ar${article.imageUrl}`,
          ...(article.imageAlt && {
            caption: imageAlt,
          }),
        }
      : article.youtubeVideoId
        ? {
            "@type": "ImageObject",
            url: `https://img.youtube.com/vi/${article.youtubeVideoId}/maxresdefault.jpg`,
          }
        : {
            "@type": "ImageObject",
            url: "https://megadeth.com.ar/images/meg-argentina.jpg",
          },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://megadeth.com.ar${
        locale === "es" ? "" : `/${locale}`
      }/noticias/${article.id}`,
    },
    inLanguage: locale,
    about: {
      "@type": "MusicGroup",
      name: "Megadeth",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb
            items={[{ label: tb("news"), href: `/noticias` }, { label: title }]}
          />
        </Box>
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
          <article>
            {/* Fecha y tipo */}
            <Box sx={{ mb: 3 }}>
              <Chip
                label={formattedDate}
                sx={{ fontSize: "0.875rem", mr: 1 }}
              />
              {article.youtubeVideoId && (
                <Chip
                  label={locale === "es" ? "Video" : "Video"}
                  color="error"
                  sx={{ fontSize: "0.875rem" }}
                />
              )}
            </Box>

            {/* Título */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: 28, md: 48 },
                fontWeight: 600,
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>

            {/* Descripción */}
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: 16, md: 18 },
                mb: 4,
                color: "text.secondary",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
              }}
            >
              {description}
            </Typography>

            {/* Imagen o Video */}
            {article.youtubeVideoId && (
              <Box sx={{ mb: 4 }}>
                <YouTubeEmbed videoId={article.youtubeVideoId} title={title} />
              </Box>
            )}

            {article.imageUrl && !article.youtubeVideoId && (
              <Box
                sx={{
                  mb: 4,
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <SafeNewsImage
                  src={article.imageUrl}
                  alt={imageAlt}
                  width={800}
                  height={400}
                  style={{
                    width: "52%",
                    height: "auto",
                    borderRadius: 8,
                  }}
                />
                {article.imageCaption && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1,
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    {article.imageCaption[locale]}
                  </Typography>
                )}
              </Box>
            )}

            {/* Enlaces externos */}
            {article.externalLinks && article.externalLinks.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {locale === "es" ? "Enlaces relacionados" : "Related links"}
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {article.externalLinks.map((link, index) => (
                    <Box component="li" key={index} sx={{ mb: 1 }}>
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "inherit",
                          textDecoration: "underline",
                        }}
                      >
                        {link.text[locale]}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </article>
          <Box>
            <RandomSectionBanner currentSection="news" />
          </Box>
          {article.commentsActive && (
            <CommentsSection
              pageType="article"
              pageId={article.id}
              title={article.title[locale]}
            />
          )}
        </Container>
      </ContainerGradientNoPadding>
    </>
  );
}
