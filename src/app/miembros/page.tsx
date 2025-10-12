"use client";

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import { BilingualText } from "@/types";
import membersData from "@/constants/members.json";
import Image from "next/image";
import Link from "next/link";

export default function MembersPage() {
  const t = useTranslations("lineups");
  const locale = useLocale() as "es" | "en";

  const members = Object.values(membersData.members);

  const getLocalizedText = (text: BilingualText): string => {
    return text[locale] || text.es;
  };

  // Sort members by importance (Dave first, then by start year)
  const sortedMembers = [...members].sort((a, b) => {
    if (a.id === "dave-mustaine") return -1;
    if (b.id === "dave-mustaine") return 1;
    return a.birthYear - b.birthYear;
  });

  const currentMembers = sortedMembers.filter(
    (member) =>
      member.period[locale]?.includes("presente") ||
      member.period[locale]?.includes("present")
  );

  const formerMembers = sortedMembers.filter(
    (member) =>
      !(
        member.period[locale]?.includes("presente") ||
        member.period[locale]?.includes("present")
      )
  );

  const MemberCard = ({ member }: { member: (typeof members)[0] }) => (
    <Card
      component={Link}
      href={`/miembros/${member.id}`}
      sx={{
        height: "100%",
        textDecoration: "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            mb: 2,
          }}
        >
          <Image
            src={member.image}
            alt={member.name}
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
        </Avatar>

        <Typography variant="h5" component="h3" gutterBottom>
          {member.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {getLocalizedText(member.nickname)}
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

        {"deathYear" in member && member.deathYear && (
          <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
            {member.birthYear} - {member.deathYear}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h1" component="h1" gutterBottom>
          {t("members")}
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto" }}
        >
          Conoce a todos los músicos que han formado parte de Megadeth a lo
          largo de su historia
        </Typography>
      </Box>

      {/* Current Members */}
      <Box mb={8}>
        <Typography variant="h3" component="h2" gutterBottom>
          {t("currentLineup")}
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
        <Typography variant="h3" component="h2" gutterBottom>
          Miembros Anteriores
        </Typography>

        <Grid container spacing={3}>
          {formerMembers.map((member) => (
            <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <MemberCard member={member} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
