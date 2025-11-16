import { notFound } from "next/navigation";
import InterviewDetailPage from "@/components/InterviewDetailPage";
import interviewsData from "@/constants/interviews.json";
import {
  Interview,
  generateInterviewSlug,
  getInterviewTitle,
  getInterviewDescription,
} from "@/types/interview";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";

interface InterviewPageProps {
  params: Promise<{
    interviewId: string;
  }>;
}

// Función para encontrar entrevista por slug
function findInterviewBySlug(slug: string): Interview | null {
  const interview = (interviewsData as Interview[]).find((i) => {
    return generateInterviewSlug(i.id) === slug;
  });
  return interview || null;
}

export async function generateStaticParams() {
  return (interviewsData as Interview[]).map((interview: Interview) => ({
    interviewId: generateInterviewSlug(interview.id),
  }));
}

export async function generateMetadata({
  params,
}: InterviewPageProps): Promise<Metadata> {
  const { interviewId } = await params;
  const locale = await getLocale();
  const interview = findInterviewBySlug(interviewId);

  if (!interview) return { title: "Entrevista no encontrada" };

  const title = getInterviewTitle(interview, locale);
  const description = getInterviewDescription(interview, locale);
  const mediaName = interview.media.name;
  const date = new Date(interview.date);
  const year = date.getFullYear();

  const fullTitle = `${title} | ${mediaName} ${year} | Megadeth`;
  const keywords = [
    title,
    mediaName,
    year.toString(),
    "Megadeth",
    "entrevista",
    "interview",
    ...interview.interviewees.map((i) => i.name),
  ];

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      url: `/entrevistas/${interviewId}`,
      siteName: "Megadeth Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "article",
      publishedTime: interview.date,
      authors: interview.interviewees.map((i) => i.name),
      images: [
        {
          url:
            interview.content?.cover_image || "/images/entrevistas/rp1992.jpg",
          width: 1200,
          height: 630,
          alt: `${title} - ${mediaName} ${year}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: interview.content?.cover_image
        ? [interview.content.cover_image]
        : ["/images/entrevistas/rp1992.jpg"],
      creator: "@MegadethFanSite",
    },
    alternates: {
      canonical: `/entrevistas/${interviewId}`,
    },
    other: {
      "article:published_time": interview.date,
      "article:author": interview.interviewees.map((i) => i.name).join(", "),
      "article:section": "Entrevistas",
      "article:tag":
        interview.type === "video" ? "Video Interview" : "Text Interview",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { interviewId } = await params;
  const interview = findInterviewBySlug(interviewId);

  if (!interview) {
    notFound();
  }

  return <InterviewDetailPage interview={interview} />;
}
