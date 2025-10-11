import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Container } from "@mui/material";
import HistoryChapterComponent from "@/components/HistoryChapter";
import HistoryNavigation from "@/components/HistoryNavigation";
import historiaData from "@/constants/historia.json";
import {
  HistoryData,
  findChapterBySlug,
  getNextChapter,
  getPreviousChapter,
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

  if (!chapter) {
    return {
      title: "Capítulo no encontrado | Historia Megadeth",
      description: "El capítulo solicitado no existe.",
    };
  }

  const keywords = [
    `Megadeth ${chapter.title}`,
    `Historia ${chapter.period}`,
    "Dave Mustaine",
    "thrash metal",
    chapter.title.toLowerCase(),
    ...chapter.sections.flatMap((section) =>
      section.title ? [section.title] : []
    ),
  ];

  return {
    title: `${chapter.title} (${chapter.period}) | Historia Megadeth`,
    description: chapter.summary,
    keywords: keywords.join(", "),
    openGraph: {
      title: `${chapter.title} | Historia Megadeth`,
      description: chapter.summary,
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
              alt: `${chapter.title} - Historia de Megadeth`,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${chapter.title} | Historia Megadeth`,
      description: chapter.summary,
      images: chapter.coverImage
        ? [chapter.coverImage.src]
        : ["/images/historia/megadeth-default-chapter.jpg"],
    },
    alternates: {
      canonical: `/historia/${chapter.slug}`,
      languages: {
        es: `/es/historia/${chapter.slug}`,
        en: `/en/historia/${chapter.slug}`,
      },
    },
  };
}

export default async function CapituloPage({ params }: PageProps) {
  const { capitulo } = await params;
  const data = historiaData as HistoryData;

  const chapter = findChapterBySlug(data.chapters, capitulo);

  if (!chapter) {
    notFound();
  }

  const previousChapter = getPreviousChapter(data.chapters, capitulo);
  const nextChapter = getNextChapter(data.chapters, capitulo);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${chapter.title} (${chapter.period})`,
    description: chapter.summary,
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
