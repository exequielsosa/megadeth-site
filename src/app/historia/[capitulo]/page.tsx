import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box } from "@mui/material";
import HistoryChapterComponent from "@/components/HistoryChapter";
import HistoryNavigation from "@/components/HistoryNavigation";
import historiaData from "@/constants/historia.json";
import { getTranslations, getLocale } from "next-intl/server";
import {
  HistoryData,
  findChapterBySlug,
  getNextChapter,
  getPreviousChapter,
  getText,
} from "@/types/historia";

interface PageProps {
  params: Promise<{ capitulo: string }>;
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
      section.title ? [getText(section.title, locale)] : []
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
    alternates: {
      canonical: `/historia/${chapter.slug}`,
    },
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

  const chapter = findChapterBySlug(data.chapters, capitulo);

  if (!chapter) {
    notFound();
  }

  const chapterTitle = getText(chapter.title, locale);
  const chapterSummary = getText(chapter.summary, locale);

  const previousChapter = getPreviousChapter(data.chapters, capitulo);
  const nextChapter = getNextChapter(data.chapters, capitulo);

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
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        width={"100%"}
      >
        <Box maxWidth="1392px" sx={{ py: 4, pb: 10, mb: "600px" }} width="100%">
          <HistoryChapterComponent chapter={chapter} />
        </Box>
      </Box>

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
