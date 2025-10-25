"use client";

import {
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
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    lineupId: string;
  }>;
}

export default function LineupDetailPage({ params }: PageProps) {
  const { lineupId } = use(params);
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
    <Box display={"flex"} width={"100%"} justifyContent={"center"} px={1}>
      <Box sx={{ py: 4, maxWidth: "1350px", width: "100%" }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              flexDirection: "column",
            }}
          >
            <Image
              src={lineup.image}
              alt={getLocalizedText(lineup.title)}
              width={1350}
              height={600}
              style={{
                borderRadius: "12px",
                objectFit: "cover",
                width: "100%",
                height: "auto",
                maxWidth: "1350px",
                maxHeight: "760px",
              }}
            />
            <Box width="100%" mt={3} textAlign="left">
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{ fontSize: { xs: 28, md: 48 } }}
              >
                {getLocalizedText(lineup.title)}
              </Typography>
              <Chip label={lineup.period} color="primary" sx={{ mr: 2 }} />
              {/* <Chip
                label={`${lineup.yearStart} - ${lineup.yearEnd || "presente"}`}
                variant="outlined"
              /> */}
            </Box>
          </Box>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontSize: { xs: 16, md: 20 },
              whiteSpace: "pre-line",
            }}
          >
            {getLocalizedText(lineup.longDescription || lineup.description)}
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
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontSize: { xs: 20, md: 30 } }}
          >
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
                          <Image
                            src={memberData.image}
                            alt={memberData.name}
                            width={200}
                            height={200}
                            style={{ borderRadius: "16px", objectFit: "cover" }}
                          />
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
                          label={getLocalizedText({
                            es: t(`classifications.${lineupMember.role}`),
                            en: t(`classifications.${lineupMember.role}`),
                          })}
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
      </Box>
    </Box>
  );
}
