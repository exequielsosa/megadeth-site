import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Card, Typography } from "@mui/material";
import HistoryChapterComponent from "@/components/HistoryChapter";
import HistoryNavigation from "@/components/HistoryNavigation";
import historiaData from "@/constants/historia.json";
import interviewsData from "@/constants/interviews.json";
import { getTranslations, getLocale } from "next-intl/server";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "@/i18n/navigation";
import { i18nAlternates } from "@/utils/i18nAlternates";
import {
  HistoryData,
  findChapterBySlug,
  getNextChapter,
  getPreviousChapter,
  getText,
} from "@/types/historia";
import {
  Interview,
  generateInterviewSlug,
  getInterviewTitle,
} from "@/types/interview";

interface PageProps {
  params: Promise<{ capitulo: string }>;
}

// Entrevistas cuyo año cae dentro del rango del capítulo. El capítulo con el
// yearEnd más alto (la era actual) queda sin tope superior, para no perder
// entrevistas más recientes que la fecha de cierre declarada en
// historia.json.
function getRelatedInterviews(
  chapter: HistoryData["chapters"][number],
  allChapters: HistoryData["chapters"],
): Interview[] {
  const isLatestChapter =
    chapter.yearEnd === Math.max(...allChapters.map((c) => c.yearEnd));

  return (interviewsData as Interview[]).filter((interview) => {
    // getUTCFullYear(), no getFullYear(): las fechas son strings "YYYY-01-01"
    // (medianoche UTC) — en timezones UTC-negativos, getFullYear() (hora
    // local) devuelve el año anterior para esos casos.
    const year = new Date(interview.date).getUTCFullYear();
    return (
      year >= chapter.yearStart && (isLatestChapter || year <= chapter.yearEnd)
    );
  });
}

export async function generateStaticParams() {
  const data = historiaData as HistoryData;

  return data.chapters.map((chapter) => ({
    capitulo: chapter.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { capitulo } = await params;
  const data = historiaData as HistoryData;
  const chapter = findChapterBySlug(data.chapters, capitulo);
  const t = await getTranslations("chapterPage");
  const locale = (await getLocale()) as "es" | "en";

  if (!chapter) {
    return {
      title: t("notFoundTitle"),
      description: t("notFoundDescription"),
    };
  }

  const chapterTitle = getText(chapter.title, locale);
  const chapterSummary = getText(chapter.summary, locale);

  const keywords = [
    `Megadeth ${chapterTitle}`,
    `Historia ${chapter.period}`,
    "Dave Mustaine",
    "thrash metal",
    chapterTitle.toLowerCase(),
    ...chapter.sections.flatMap((section) =>
      section.title ? [getText(section.title, locale)] : [],
    ),
  ];

  return {
    title: `${chapterTitle} (${chapter.period}) | ${t("historyMegadeth")}`,
    description: chapterSummary,
    keywords: keywords.join(", "),
    openGraph: {
      title: `${chapterTitle} | ${t("historyMegadeth")}`,
      description: chapterSummary,
      type: "article",
      images: chapter.coverImage
        ? [
            {
              url: chapter.coverImage.src,
              width: 1200,
              height: 630,
              alt: chapter.coverImage.alt,
            },
          ]
        : [
            {
              url: "/images/historia/megadeth-default-chapter.jpg",
              width: 1200,
              height: 630,
              alt: `${chapterTitle} - ${t("megadethHistory")}`,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${chapterTitle} | ${t("historyMegadeth")}`,
      description: chapterSummary,
      images: chapter.coverImage
        ? [chapter.coverImage.src]
        : ["/images/historia/megadeth-default-chapter.jpg"],
    },
    alternates: i18nAlternates(`/historia/${chapter.slug}`, locale),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CapituloPage({ params }: PageProps) {
  const { capitulo } = await params;
  const data = historiaData as HistoryData;
  const locale = (await getLocale()) as "es" | "en";
  const tb = await getTranslations("breadcrumb");

  const chapter = findChapterBySlug(data.chapters, capitulo);

  if (!chapter) {
    notFound();
  }

  const chapterTitle = getText(chapter.title, locale);
  const chapterSummary = getText(chapter.summary, locale);

  const previousChapter = getPreviousChapter(data.chapters, capitulo);
  const nextChapter = getNextChapter(data.chapters, capitulo);
  const relatedInterviews = getRelatedInterviews(chapter, data.chapters);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${chapterTitle} (${chapter.period})`,
    description: chapterSummary,
    image:
      chapter.coverImage?.src ||
      "/images/historia/megadeth-default-chapter.jpg",
    author: {
      "@type": "Organization",
      name: "Megadeth",
      url: "https://megadeth.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Megadeth Official",
      logo: {
        "@type": "ImageObject",
        url: "/images/megadeth-logo.png",
      },
    },
    datePublished: "2025-01-01T00:00:00.000Z",
    dateModified: "2025-01-01T00:00:00.000Z",
    articleSection: "Historia",
    keywords: [
      `Megadeth ${chapter.title}`,
      `Historia ${chapter.period}`,
      "thrash metal",
      "Dave Mustaine",
    ].join(", "),
    about: {
      "@type": "MusicGroup",
      name: "Megadeth",
      genre: "Thrash Metal",
      foundingDate: "1983",
      description:
        "Banda estadounidense de thrash metal fundada por Dave Mustaine",
    },
    mainEntity: {
      "@type": "CreativeWork",
      name: `Historia: ${chapter.title}`,
      description: chapter.summary,
      creator: {
        "@type": "Person",
        name: "Dave Mustaine",
        jobTitle: "Fundador y líder de Megadeth",
      },
    },
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Contenido principal */}
      <ContainerGradientNoPadding>
        <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
          <Breadcrumb
            items={[
              { label: tb("history"), href: "/historia" },
              { label: chapterTitle },
            ]}
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          width={"100%"}
        >
          <Box maxWidth="1392px" sx={{ py: 4, pb: 0, mb: "0px" }} width="100%">
            <HistoryChapterComponent chapter={chapter} />
          </Box>
          {/* Entrevistas de esta era — interlinking automático por año */}
          {relatedInterviews.length > 0 && (
            <Box sx={{ mt: 2, maxWidth: "1400px", mb: "200px" }}>
              <Typography
                component="h2"
                variant="h5"
                sx={{ fontWeight: 700, mb: 2 }}
              >
                {locale === "es"
                  ? "Entrevistas de esta era"
                  : "Interviews from this era"}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {relatedInterviews.map((interview) => (
                  <Link
                    key={interview.id}
                    href={`/entrevistas/${generateInterviewSlug(interview.id)}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                      height: "100%",
                    }}
                  >
                    <Card variant="outlined" sx={{ p: 2, height: "100%" }}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {getInterviewTitle(interview, locale)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {interview.media.name} ·{" "}
                        {new Date(interview.date).getUTCFullYear()}
                      </Typography>
                    </Card>
                  </Link>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </ContainerGradientNoPadding>

      {/* Navegación sticky */}
      <HistoryNavigation
        currentChapter={chapter}
        previousChapter={previousChapter}
        nextChapter={nextChapter}
        allChapters={data.chapters}
      />
    </>
  );
}
