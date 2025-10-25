import membersData from "@/constants/members.json";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";

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
  const title = member.name;
  const fullName = member.fullName?.[lang] || member.fullName?.es || "";
  const description = member.biography?.[lang] || member.biography?.es || "";

  return {
    title: `${title} (${fullName}) - ${
      locale === "en" ? "Megadeth Member" : "Miembro de Megadeth"
    }`,
    description,
    openGraph: {
      title: `${title} - Megadeth`,
      description,
      images: [member.image],
    },
  };
}

export default function MemberLayout(props: unknown) {
  return <>{(props as { children: React.ReactNode }).children}</>;
}
