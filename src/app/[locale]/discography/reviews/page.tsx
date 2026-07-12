import { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Container, Typography, Box } from "@mui/material";
import Breadcrumb from "@/components/Breadcrumb";
import reviewsData from "@/constants/reviews.json";
import { Review } from "@/types/review";
import ReviewCard from "@/components/ReviewCard";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "reviews" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function ReviewsPage() {
  const locale = await getLocale();
  const t = await getTranslations("reviews");
  const reviews = reviewsData as Review[];

  // Ordenar por fecha más reciente
  const sortedReviews = [...reviews].sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  // JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    description: t("description"),
    url: "https://megadeth.com.ar/discography/reviews",
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "Megadeth Argentina",
      logo: {
        "@type": "ImageObject",
        url: "https://megadeth.com.ar/logo-megadeth.png",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sortedReviews.map((review, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Review",
          itemReviewed: {
            "@type": "MusicAlbum",
            name: review.title[locale as "es" | "en"],
            byArtist: {
              "@type": "MusicGroup",
              name: "Megadeth",
            },
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 10,
            worstRating: 1,
          },
          author: {
            "@type": "Organization",
            name: "Megadeth Argentina",
          },
          datePublished: review.publishedDate,
          reviewBody: review.content[locale as "es" | "en"].substring(0, 300),
          url: `https://megadeth.com.ar/discography/reviews/${review.id}`,
          image: `https://megadeth.com.ar${review.imageUrl}`,
        },
      })),
    },
  };

  return (
    <ContainerGradientNoPadding>
      {/* JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
        <Breadcrumb
          items={[
            { label: t("breadcrumb.discography"), href: `/discography` },
            { label: t("breadcrumb.reviews") },
          ]}
        />
      </Box>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto", py: 4 }}>
        <Box>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: 32, md: 56 }, mb: 2, fontWeight: 700 }}
          >
            {t("title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {t("description")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {sortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} locale={locale} />
          ))}
        </Box>
      </Container>
    </ContainerGradientNoPadding>
  );
}
