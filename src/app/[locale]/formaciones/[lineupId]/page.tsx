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
import { LineupFormation, BilingualText } from "@/types";
import lineupsData from "@/constants/lineups.json";
import membersData from "@/constants/members.json";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    lineupId: string;
  };
}

export default function LineupDetailPage({ params }: PageProps) {
  const { lineupId } = params;
  const t = useTranslations("lineups");
  const locale = useLocale();
  const currentLocale = locale as "es" | "en";

  const lineups: LineupFormation[] = lineupsData.lineups;
  const lineup = lineups.find((l) => l.id === lineupId);

  if (!lineup) {
    notFound();
  }

  const getLocalizedText = (text: BilingualText): string => {
    return text[currentLocale] || text.es;
  };

  const getMemberData = (memberId: string) => {
    return membersData.members[memberId as keyof typeof membersData.members];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Image
            src={lineup.image}
            alt={getLocalizedText(lineup.title)}
            width={100}
            height={100}
            style={{ borderRadius: "12px", marginRight: "24px" }}
          />
          <Box>
            <Typography variant="h1" component="h1" gutterBottom>
              {getLocalizedText(lineup.title)}
            </Typography>
            <Chip label={lineup.period} color="primary" sx={{ mr: 2 }} />
            <Chip
              label={`${lineup.yearStart} - ${lineup.yearEnd || "presente"}`}
              variant="outlined"
            />
          </Box>
        </Box>

        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800 }}>
          {getLocalizedText(lineup.description)}
        </Typography>
      </Box>

      {/* Albums */}
      {lineup.albums.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            {t("formation.albums")}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {lineup.albums.map((album, index) => (
              <Chip
                key={index}
                label={album}
                variant="outlined"
                color="secondary"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Members */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          {t("formation.members")}
        </Typography>

        <Grid container spacing={3}>
          {lineup.members.map((lineupMember) => {
            const memberData = getMemberData(lineupMember.id);

            return (
              <Grid key={lineupMember.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Link
                  href={`/miembros/${lineupMember.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 8,
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      {memberData ? (
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            mx: "auto",
                            mb: 2,
                            fontSize: "2rem",
                          }}
                        >
                          <Image
                            src={memberData.image}
                            alt={memberData.name}
                            width={80}
                            height={80}
                            style={{ borderRadius: "50%" }}
                          />
                        </Avatar>
                      ) : (
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            mx: "auto",
                            mb: 2,
                            fontSize: "2rem",
                          }}
                        >
                          {lineupMember.name[0]}
                        </Avatar>
                      )}

                      <Typography variant="h6" component="h3" gutterBottom>
                        {lineupMember.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {getLocalizedText(lineupMember.instrument)}
                      </Typography>

                      <Chip
                        label={
                          t(`classifications.${lineupMember.role}`) ||
                          lineupMember.role
                        }
                        size="small"
                        color={
                          lineupMember.role === "founder"
                            ? "primary"
                            : "default"
                        }
                      />
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
}
