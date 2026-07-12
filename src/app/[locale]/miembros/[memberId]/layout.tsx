import membersData from "@/constants/members.json";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { i18nAlternates } from "@/utils/i18nAlternates";

function yearsOnly(period: string): string {
  const idx = period.indexOf(" (");
  return idx === -1 ? period : period.slice(0, idx);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ memberId: string }>;
}): Promise<Metadata> {
  const { memberId } = await params;
  const locale = await getLocale();
  const members = membersData.members;
  const member = members[memberId as keyof typeof members];

  if (!member) {
    return {
      title: locale === "en" ? "Member not found" : "Miembro no encontrado",
    };
  }

  const lang = (locale === "en" ? "en" : "es") as "es" | "en";
  const instrument =
    member.instruments?.[lang]?.[0] || member.instruments?.es?.[0] || "";
  const years = yearsOnly(member.period[lang] || member.period.es);
  const role = member.role?.[lang] || member.role?.es || "";

  const title =
    lang === "es"
      ? `${member.name}: ${instrument} de Megadeth (${years}) — biografía y más`
      : `${member.name}: ${instrument} for Megadeth (${years}) — biography and more`;

  const description =
    lang === "es"
      ? `${role}. Formó parte de Megadeth (${years}). Descubrí su historia, discos y trayectoria en Megadeth.`
      : `${role}. Was part of Megadeth (${years}). Discover his story, albums and career with Megadeth.`;

  return {
    title,
    description,
    openGraph: {
      title: `${member.name} - Megadeth`,
      description,
      images: [member.image],
    },
    alternates: i18nAlternates(`/miembros/${memberId}`, locale),
  };
}

function buildPersonJsonLd(
  member: (typeof membersData.members)[keyof typeof membersData.members],
  memberId: string,
  lang: "es" | "en",
) {
  const instrument =
    member.instruments?.[lang]?.[0] || member.instruments?.es?.[0];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    memberOf: { "@type": "MusicGroup", name: "Megadeth" },
    ...(instrument && { jobTitle: instrument }),
    ...("birthYear" in member &&
      member.birthYear && { birthDate: `${member.birthYear}` }),
    ...("deathYear" in member &&
      member.deathYear && { deathDate: `${member.deathYear}` }),
    image: `https://megadeth.com.ar${member.image}`,
    url: `https://megadeth.com.ar/miembros/${memberId}`,
  };
}

export default async function MemberLayout({
  params,
  children,
}: {
  params: Promise<{ memberId: string }>;
  children: React.ReactNode;
}) {
  const { memberId } = await params;
  const locale = await getLocale();
  const members = membersData.members;
  const member = members[memberId as keyof typeof members];
  const lang = (locale === "en" ? "en" : "es") as "es" | "en";

  return (
    <>
      {member && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildPersonJsonLd(member, memberId, lang),
            ),
          }}
        />
      )}
      {children}
    </>
  );
}
