// This file is a server component, so 'use client' should not be present.
// Removing 'use client' to allow for export of generateMetadata.

// "use client"; // This line is being removed
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import ContainerGradientNoPadding from "@/components/atoms/ContainerGradientNoPadding";
import membersData from "@/constants/members.json";
import { i18nAlternates } from "@/utils/i18nAlternates";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const members = Object.values(membersData.members);
  const currentMembers = members.filter(
    (m) =>
      m.period.es?.includes("presente") || m.period.en?.includes("present"),
  );
  const formerCount = members.length - currentMembers.length;
  const currentNames = currentMembers.map((m) => m.name).join(", ");

  const title =
    locale === "es"
      ? `Miembros de Megadeth: formación actual y ${formerCount} ex integrantes`
      : `Megadeth Members: Current Lineup & ${formerCount} Former Members`;

  const description =
    locale === "es"
      ? `Conocé a los ${members.length} músicos de Megadeth: la formación actual (${currentNames}) y todos los ex integrantes.`
      : `Meet all ${members.length} Megadeth musicians: the current lineup (${currentNames}) and every former band member.`;

  const keywords = [
    "Megadeth",
    "miembros",
    "members",
    "músicos Megadeth",
    "Dave Mustaine",
    "Nick Menza",
    "Marty Friedman",
    "David Ellefson",
    "James LoMenzo",
    "Dirk Verbeuren",
    "Teemu Mäntysaari",
    "alineaciones Megadeth",
    "thrash metal",
    "bandas metal",
    "historia Megadeth",
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: "/miembros",
      siteName: "Megadeth Fan Site",
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/lineups/og-members.jpg",
          width: 1200,
          height: 630,
          alt:
            locale === "es"
              ? "Miembros de Megadeth - Todos los músicos de la banda"
              : "Megadeth Members - All musicians in the band",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/lineups/og-members.jpg"],
      creator: "@MegadethFanSite",
    },
    alternates: i18nAlternates("/miembros", locale),
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

import { Typography, Box, Grid, Card, CardContent, Chip } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { BilingualText } from "@/types";
import Breadcrumb from "@/components/Breadcrumb";

type Member = {
  id: string;
  name: string;
  fullName: { es: string; en: string };
  nickname?: { es: string; en: string };
  period: { es: string; en: string };
  instruments: { es: string[]; en: string[] };
  role: { es: string; en: string };
  albums?: string[];
  otherProjects?: { es: string[]; en: string[] };
  biography?: { es: string; en: string };
  image?: string;
  birthYear?: number;
  deathYear?: number;
  country: { es: string; en: string };
};
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import RandomSectionBanner from "@/components/NewsBanner";

export default function MembersPage() {
  const t = useTranslations("lineups");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale() as "es" | "en";

  const members = Object.values(membersData.members) as Member[];

  const getLocalizedText = (text: BilingualText): string => {
    if (!text || typeof text !== "object") return "";
    return text[locale] || text.es || "";
  };

  // Sort members by importance (Dave first, then by start year)
  const sortedMembers = [...members].sort((a, b) => {
    if (a.id === "dave-mustaine") return -1;
    if (b.id === "dave-mustaine") return 1;
    const aYear = typeof a.birthYear === "number" ? a.birthYear : 9999;
    const bYear = typeof b.birthYear === "number" ? b.birthYear : 9999;
    return aYear - bYear;
  });

  const currentMembers = sortedMembers.filter(
    (member) =>
      member.period[locale]?.includes("presente") ||
      member.period[locale]?.includes("present"),
  );

  const formerMembers = sortedMembers.filter(
    (member) =>
      !(
        member.period[locale]?.includes("presente") ||
        member.period[locale]?.includes("present")
      ),
  );

  // Respuesta directa (featured-snippet friendly): "¿quién es el
  // guitarrista/bajista/baterista actual de Megadeth?"
  const joinWithAnd = (items: string[]): string => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    const conjunction = locale === "es" ? "y" : "and";
    return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1]}`;
  };

  const currentLineupSentence = joinWithAnd(
    currentMembers.map((member) => {
      const instrument =
        member.instruments[locale]?.[0] || member.instruments.es?.[0] || "";
      return `${member.name} (${instrument})`;
    }),
  );

  // Ex miembros agrupados por instrumento (categorías amplias: exact-match
  // sobre el instrumento fragmentaría en grupos de 1, ej. "Bajo eléctrico" vs
  // "Bajo eléctrico (fretless)").
  const categorizeInstrument = (instrument: string): string => {
    const lower = instrument.toLowerCase();
    if (lower.includes("guitar")) return locale === "es" ? "Guitarra" : "Guitar";
    if (lower.includes("baj") || lower.includes("bass"))
      return locale === "es" ? "Bajo" : "Bass";
    if (lower.includes("bater") || lower.includes("drum"))
      return locale === "es" ? "Batería" : "Drums";
    if (lower.includes("voz") || lower.includes("vocal"))
      return locale === "es" ? "Voz" : "Vocals";
    return locale === "es" ? "Otros" : "Other";
  };

  const categoryOrder =
    locale === "es"
      ? ["Guitarra", "Bajo", "Batería", "Voz", "Otros"]
      : ["Guitar", "Bass", "Drums", "Vocals", "Other"];

  const formerMembersByCategory = formerMembers.reduce<
    Record<string, typeof formerMembers>
  >((acc, member) => {
    const instrument =
      member.instruments[locale]?.[0] || member.instruments.es?.[0] || "";
    const category = categorizeInstrument(instrument);
    acc[category] = acc[category] || [];
    acc[category].push(member);
    return acc;
  }, {});

  const MemberCard = ({ member }: { member: (typeof members)[0] }) => (
    <Link
      href={`/miembros/${member.id}`}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      <Card
        sx={{
          height: "100%",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 8,
          },
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
        <Image
          src={member.image ?? "/images/default.jpg"}
          alt={member.name}
          width={200}
          height={200}
          style={{ borderRadius: "16px", objectFit: "cover" }}
        />

        <Typography variant="h5" component="h3" gutterBottom>
          {member.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {member.nickname && getLocalizedText(member.nickname)}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {member.instruments[locale]?.join(", ") ||
            member.instruments.es?.join(", ")}
        </Typography>

        <Chip
          label={getLocalizedText(member.period)}
          color={member.id === "dave-mustaine" ? "primary" : "default"}
          size="small"
          sx={{ mb: 1 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {getLocalizedText(member.role)}
        </Typography>

        {member.birthYear && member.deathYear && (
          <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
            {`${member.birthYear} - ${member.deathYear}`}
          </Typography>
        )}
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <ContainerGradientNoPadding>
      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 0 }}>
        <Breadcrumb items={[{ label: tb("members") }]} />
      </Box>
      <Box display={"flex"} justifyContent={"center"} width="100%" px={2}>
        <Box maxWidth={"1350px"} sx={{ pt: 4, pb: 2 }}>
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{ fontSize: { xs: 28, md: 48 } }}
              fontWeight={600}
            >
              {t("members")}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight={500}
              sx={{ mx: "auto", fontSize: { xs: 16, md: 20 } }}
            >
              {t("meet")}
            </Typography>
          </Box>

          {/* Current Members */}
          <Box mb={8}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontSize: { xs: 20, md: 30 } }}
            >
              {t("currentLineup")}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 900 }}
            >
              {locale === "es"
                ? `La formación actual de Megadeth está compuesta por ${currentLineupSentence}.`
                : `The current lineup of Megadeth is made up of ${currentLineupSentence}.`}
            </Typography>

            <Grid container spacing={3}>
              {currentMembers.map((member) => (
                <Grid key={member.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <MemberCard member={member} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Former Members */}
          <Box>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontSize: { xs: 20, md: 30 } }}
            >
              {t("formerMembers")}
            </Typography>

            {categoryOrder
              .filter((category) => formerMembersByCategory[category]?.length)
              .map((category) => (
                <Box key={category} sx={{ mb: 5 }}>
                  <Typography
                    variant="h4"
                    component="h3"
                    gutterBottom
                    sx={{ fontSize: { xs: 16, md: 22 }, fontWeight: 600 }}
                  >
                    {category}
                  </Typography>

                  <Grid container spacing={3}>
                    {formerMembersByCategory[category].map((member) => (
                      <Grid key={member.id} size={{ xs: 12, sm: 6, md: 3 }}>
                        <MemberCard member={member} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
      <Box mb={4}>
        <RandomSectionBanner currentSection="members" />
      </Box>
    </ContainerGradientNoPadding>
  );
}
