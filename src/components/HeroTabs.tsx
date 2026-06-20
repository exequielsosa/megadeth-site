"use client";

import { useState } from "react";
import { keyframes } from "@emotion/react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import AnimatedCounter from "./AnimatedCounter";
import { tourDates } from "@/constants/tourDates";

interface SectionLink {
  label: string;
  href: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const sectionLinks: { [key: string]: SectionLink[] } = {
  es: [
    { label: "Noticias", href: "/noticias" },
    { label: "Discografía", href: "/discography" },
    { label: "Bootlegs", href: "/bootlegs" },
    { label: "Compilaciones", href: "/discography" },
    { label: "Álbumes en vivo", href: "/discography" },
    { label: "EPs", href: "/discography" },
    { label: "DVDs", href: "/dvds" },
    { label: "Shows y fechas de tour", href: "/tour" },
    { label: "Miembros", href: "/members" },
    { label: "Videos", href: "/videos" },
    { label: "Letras de canciones con traducción al español", href: "/songs" },
  ],
  en: [
    { label: "News", href: "/noticias" },
    { label: "Discography", href: "/discography" },
    { label: "Bootlegs", href: "/bootlegs" },
    { label: "Compilations", href: "/discography" },
    { label: "Live Albums", href: "/discography" },
    { label: "EPs", href: "/discography" },
    { label: "DVDs", href: "/dvds" },
    { label: "Tour dates", href: "/tour" },
    { label: "Members", href: "/members" },
    { label: "Videos", href: "/videos" },
    { label: "Song lyrics with Spanish translation", href: "/songs" },
  ],
};

function PresentationSectionsLinks({
  text,
  locale,
}: {
  text: string;
  locale: string;
}) {
  const links = sectionLinks[locale === "es" ? "es" : "en"];
  const content: React.ReactNode[] = [];
  let lastIndex = 0;

  // Find "Secciones:" prefix
  const seccionesIndex = text.indexOf("Secciones:");
  if (seccionesIndex === -1) return <>{text}</>;

  content.push(text.substring(0, seccionesIndex + 10)); // "Secciones: "
  const remainingText = text.substring(seccionesIndex + 10);

  links.forEach((link, index) => {
    const linkIndex = remainingText.indexOf(link.label);
    if (linkIndex !== -1) {
      // Add text before link
      if (linkIndex > lastIndex) {
        content.push(remainingText.substring(lastIndex, linkIndex));
      }
      // Add link
      content.push(
        <Link
          key={`link-${index}`}
          href={link.href}
          style={{ color: "#fff", textDecoration: "none" }}
        >
          {link.label}
        </Link>,
      );
      lastIndex = linkIndex + link.label.length;
    }
  });

  // Add remaining text
  if (lastIndex < remainingText.length) {
    content.push(remainingText.substring(lastIndex));
  }

  return <>{content}</>;
}

function TabBackground({
  src,
  alt,
  overlay,
  priority = false,
  position = "center",
}: {
  src: string;
  alt: string;
  overlay: string;
  priority?: boolean;
  position?: string;
}) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1440px) 100vw, 1440px"
        style={{ objectFit: "cover", objectPosition: position, zIndex: 0 }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: overlay,
          zIndex: 1,
        }}
      />
    </>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`hero-tabpanel-${index}`}
      aria-labelledby={`hero-tab-${index}`}
      {...other}
    >
      <Box
        sx={{
          borderRadius: 0,
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </div>
  );
}

export default function HeroTabs() {
  const t = useTranslations("heroTabs");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ maxWidth: 1440 }}>
      {/* Titulo y descripcion */}
      <Stack spacing={3} alignItems="start" sx={{ mb: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 32, md: 56 },
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          {t("title")}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: 18, md: 24 },
            color: "text.secondary",
            maxWidth: 1350,
          }}
        >
          {t("subtitle")}
        </Typography>
      </Stack>

      {/* Tabs */}
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", mb: 0, borderRadius: 0 }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="hero sections"
          variant="scrollable"
          scrollButtons={false}
          sx={{
            borderRadius: 0,
            "& .MuiTab-root": {
              fontSize: { xs: "0.9rem", md: "1rem" },
              fontWeight: 600,
              textTransform: "uppercase",
              px: { xs: 1, md: 3 },
              borderRadius: 0,
            },
          }}
        >
          <Tab label={t("tabs.presentation")} id="hero-tab-0" />
          <Tab label={t("tabs.news")} id="hero-tab-1" />
          <Tab label={t("tabs.shows")} id="hero-tab-2" />
          <Tab label={t("tabs.history")} id="hero-tab-3" />
          <Tab label={t("tabs.songs")} id="hero-tab-4" />
        </Tabs>
      </Box>

      {/* Tab Panels */}

      {/* Tab 0: Presentación */}
      <TabPanel value={activeTab} index={0}>
        <Box
          sx={{
            borderRadius: "0px 0px 8px 8px",
            p: { xs: 1, md: 4 },
            position: "relative",
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TabBackground
            src="/images/site-updates/megadeth_argentina.avif"
            alt="Megadeth en Argentina"
            overlay="rgba(0, 0, 0, 0.75)"
            priority
            position="left top"
          />
          <Stack
            spacing={6}
            sx={{
              width: "100%",
              position: "relative",
              zIndex: 2,
              marginTop: "auto",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: 14, md: 18 },
                lineHeight: 1.8,
                color: "#fff",
                animation: `${fadeIn} 0.6s ease-in`,
              }}
            >
              {t("content.presentation")}
            </Typography>

            {/* Stats como boxes independientes */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: { xs: 2, md: 3 },
              }}
            >
              <Box
                sx={{
                  p: { xs: 1.5, md: 3 },
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  animation: `${fadeIn} 0.6s ease-in`,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 32 },
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                    animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                  }}
                >
                  <AnimatedCounter end={200} />
                  <span style={{ fontSize: "0.8em" }}>+</span>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    animation: `${fadeIn} 0.6s ease-in 0.4s both`,
                    textAlign: "center",
                  }}
                >
                  {t("stats.songs")}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: { xs: 1.5, md: 3 },
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  animation: `${fadeIn} 0.6s ease-in`,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 32 },
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                    animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                  }}
                >
                  <AnimatedCounter end={17} />
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    animation: `${fadeIn} 0.6s ease-in 0.4s both`,
                    textAlign: "center",
                  }}
                >
                  {t("stats.albums")}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: { xs: 1.5, md: 3 },
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  animation: `${fadeIn} 0.6s ease-in`,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 32 },
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                    animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                  }}
                >
                  <AnimatedCounter end={27} />
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    animation: `${fadeIn} 0.6s ease-in 0.4s both`,
                    textAlign: "center",
                  }}
                >
                  {t("stats.members")}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: { xs: 1.5, md: 3 },
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  animation: `${fadeIn} 0.6s ease-in`,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 32 },
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                    animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                  }}
                >
                  <AnimatedCounter end={53} />
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    animation: `${fadeIn} 0.6s ease-in 0.4s both`,
                    textAlign: "center",
                  }}
                >
                  {t("stats.videos")}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: 12, md: 14 },
                  color: "#fff",
                  animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                }}
              >
                <PresentationSectionsLinks
                  text={t("content.presentationSections")}
                  locale={locale}
                />
              </Typography>
            </Box>
          </Stack>
        </Box>
      </TabPanel>

      {/* Tab 1: Noticias */}
      <TabPanel value={activeTab} index={1}>
        <Box
          sx={{
            borderRadius: "0px 0px 8px 8px",
            p: { xs: 1, md: 4 },
            position: "relative",
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TabBackground
            src="/images/site-updates/noticias_back2.jpg"
            alt="Noticias de Megadeth"
            overlay="rgba(0, 0, 0, 0.55)"
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              position: "relative",
              zIndex: 2,
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "7fr 3fr" },
                gap: { xs: 3, md: 4 },
                marginTop: "auto",
              }}
            >
              {/* Columna Izquierda: Texto y Botón */}
              <Stack spacing={3}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: 14, md: 18 },
                    lineHeight: 1.8,
                    color: "#fff",
                    animation: `${fadeIn} 0.6s ease-in`,
                  }}
                >
                  {t("content.news")}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/noticias"
                  sx={{
                    alignSelf: "flex-start",
                    animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                  }}
                >
                  {t("buttons.viewNews")}
                </Button>
              </Stack>

              {/* Columna Derecha: Stats */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                  },
                  gap: { xs: 2, md: 3 },
                }}
              >
                <Box
                  sx={{
                    p: { xs: 1.5, md: 3 },
                    borderRadius: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.35)",
                    border: "1px solid rgba(0, 0, 0, 0.35)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "120px",
                    transition: "all 0.3s ease",
                    animation: `${fadeIn} 0.6s ease-in`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: 18, md: 32 },
                      fontWeight: 700,
                      color: "primary.main",
                      mb: 1,
                    }}
                  >
                    {t("stats.newsWeeklyTitle")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#fff",
                      animation: `${fadeIn} 0.6s ease-in 0.4s both`,
                    }}
                  >
                    {t("stats.newsWeekly")}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: { xs: 1.5, md: 3 },
                    borderRadius: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.35)",
                    border: "1px solid rgba(0, 0, 0, 0.35)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "120px",
                    transition: "all 0.3s ease",
                    animation: `${fadeIn} 0.6s ease-in`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: 18, md: 32 },
                      fontWeight: 700,
                      color: "primary.main",
                      mb: 1,
                    }}
                  >
                    <AnimatedCounter end={100} />
                    <span style={{ fontSize: "0.8em" }}>%</span>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#fff",
                      animation: `${fadeIn} 0.6s ease-in 0.4s both`,
                    }}
                  >
                    {t("stats.newsMegadeth")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </TabPanel>

      {/* Tab 2: Shows */}
      <TabPanel value={activeTab} index={2}>
        <Box
          sx={{
            borderRadius: "0px 0px 8px 8px",
            p: { xs: 1, md: 4 },
            position: "relative",
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "500px",
          }}
        >
          <TabBackground
            src="/images/site-updates/megadeth.webp"
            alt="Megadeth en vivo"
            overlay="rgba(0, 0, 0, 0.65)"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "7fr 3fr" },
              gap: { xs: 3, md: 4 },
              marginTop: "auto",
              width: "100%",
              position: "relative",
              zIndex: 2,
              flex: 1,
              alignItems: "flex-end",
            }}
          >
            {/* Columna Izquierda: Texto y Botón */}
            <Stack spacing={3}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: 14, md: 18 },
                  lineHeight: 1.8,
                  color: "#fff",
                  animation: `${fadeIn} 0.6s ease-in`,
                }}
              >
                {t("content.shows")}
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/tour"
                sx={{
                  alignSelf: "flex-start",
                  animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                }}
              >
                {t("buttons.viewTour")}
              </Button>
            </Stack>

            {/* Columna Derecha: Próximos Shows */}
            {(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const upcomingShows = tourDates
                .filter((show) => {
                  const [year, month, day] = show.date.split("-").map(Number);
                  const showDate = new Date(year, month - 1, day);
                  return showDate >= today;
                })
                .sort((a, b) => {
                  const [aYear, aMonth, aDay] = a.date.split("-").map(Number);
                  const [bYear, bMonth, bDay] = b.date.split("-").map(Number);
                  const dateA = new Date(aYear, aMonth - 1, aDay);
                  const dateB = new Date(bYear, bMonth - 1, bDay);
                  return dateA.getTime() - dateB.getTime();
                })
                .slice(0, 2);

              if (upcomingShows.length === 0) return null;

              const formatDate = (date: Date) =>
                date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

              return (
                <Box
                  sx={{
                    p: { xs: 1.5, md: 3 },
                    borderRadius: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.35)",
                    border: "1px solid rgba(0, 0, 0, 0.35)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "120px",
                    minWidth: "250px",
                    transition: "all 0.3s ease",
                    animation: `${fadeIn} 0.6s ease-in`,
                    textAlign: "center",
                    mx: "auto",
                    gap: 1.5,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: 12, md: 14 },
                      color: "#fff",
                      fontWeight: 600,
                      animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                    }}
                  >
                    {t("upcomingShows")}
                  </Typography>

                  {upcomingShows.map((show, index) => {
                    const [year, month, day] = show.date.split("-").map(Number);
                    const showDate = new Date(year, month - 1, day);
                    return (
                      <Box key={show.date} sx={{ width: "100%" }}>
                        {index > 0 && (
                          <Box
                            sx={{
                              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                              my: 1,
                            }}
                          />
                        )}
                        <Typography
                          sx={{
                            fontSize: { xs: 13, md: 15 },
                            fontWeight: 700,
                            color: "primary.main",
                            mb: 0.5,
                            animation: `${fadeIn} 0.6s ease-in ${0.4 + index * 0.2}s both`,
                          }}
                        >
                          {formatDate(showDate)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: 10, md: 11 },
                            color: "#fff",
                            animation: `${fadeIn} 0.6s ease-in ${0.6 + index * 0.2}s both`,
                          }}
                        >
                          {show.venue}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: 9, md: 10 },
                            color: "#ccc",
                            animation: `${fadeIn} 0.6s ease-in ${0.8 + index * 0.2}s both`,
                          }}
                        >
                          {show.city}, {show.country}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              );
            })()}
          </Box>
        </Box>
      </TabPanel>

      {/* Tab 3: Historia */}
      <TabPanel value={activeTab} index={3}>
        <Box
          sx={{
            borderRadius: "0px 0px 8px 8px",
            p: { xs: 1, md: 4 },
            position: "relative",
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "500px",
          }}
        >
          <TabBackground
            src="/images/site-updates/hystoryback.jpg"
            alt="Historia de Megadeth"
            overlay="rgba(0, 0, 0, 0.45)"
          />
          <Stack
            spacing={3}
            sx={{
              width: "100%",
              position: "relative",
              zIndex: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {/* Stats Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: { xs: 2, md: 3 },
              }}
            >
              <Box
                sx={{
                  p: { xs: 1.5, md: 3 },
                  borderRadius: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(0, 0, 0, 0.35)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  animation: `${fadeIn} 0.6s ease-in`,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 32 },
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                    animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                  }}
                >
                  <AnimatedCounter end={43} />
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    animation: `${fadeIn} 0.6s ease-in 0.4s both`,
                    textAlign: "center",
                  }}
                >
                  {t("stats.activeYears")}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: { xs: 1.5, md: 3 },
                  borderRadius: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(0, 0, 0, 0.35)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  animation: `${fadeIn} 0.6s ease-in`,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 32 },
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                    animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                  }}
                >
                  <AnimatedCounter end={17} />
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    animation: `${fadeIn} 0.6s ease-in 0.4s both`,
                    textAlign: "center",
                  }}
                >
                  {t("stats.studioAlbums")}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: { xs: 1.5, md: 3 },
                  borderRadius: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(0, 0, 0, 0.35)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  animation: `${fadeIn} 0.6s ease-in`,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 32 },
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                    animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                  }}
                >
                  <AnimatedCounter end={20} />
                  <span style={{ fontSize: "0.8em" }}>+</span>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    animation: `${fadeIn} 0.6s ease-in 0.4s both`,
                    textAlign: "center",
                  }}
                >
                  {t("stats.lineupChanges")}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: { xs: 1.5, md: 3 },
                  borderRadius: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(0, 0, 0, 0.35)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  animation: `${fadeIn} 0.6s ease-in`,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 32 },
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                    animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                  }}
                >
                  <AnimatedCounter end={38} />
                  <span style={{ fontSize: "0.8em" }}>M</span>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    animation: `${fadeIn} 0.6s ease-in 0.4s both`,
                    textAlign: "center",
                  }}
                >
                  {t("stats.worldwideSales")}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: 14, md: 18 },
                lineHeight: 1.8,
                color: "#fff",
                animation: `${fadeIn} 0.6s ease-in`,
              }}
            >
              {t("content.history")}
            </Typography>

            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/historia"
              sx={{
                alignSelf: "flex-start",
                animation: `${fadeIn} 0.6s ease-in 0.2s both`,
              }}
            >
              {t("buttons.viewHistory")}
            </Button>
          </Stack>
        </Box>
      </TabPanel>

      {/* Tab 4: Canciones */}
      <TabPanel value={activeTab} index={4}>
        <Box
          sx={{
            borderRadius: "0px 0px 8px 8px",
            p: { xs: 1, md: 4 },
            position: "relative",
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "500px",
          }}
        >
          <TabBackground
            src="/images/site-updates/songs_back.jpg"
            alt="Canciones de Megadeth"
            overlay="rgba(0, 0, 0, 0.45)"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "7fr 3fr" },
              gap: { xs: 3, md: 4 },
              marginTop: "auto",
              width: "100%",
              position: "relative",
              zIndex: 2,
              flex: 1,
              alignItems: "flex-end",
            }}
          >
            {/* Columna Izquierda: Texto y Botón */}
            <Stack spacing={3}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: 14, md: 18 },
                  lineHeight: 1.8,
                  color: "#fff",
                  animation: `${fadeIn} 0.6s ease-in`,
                }}
              >
                {t("content.songs")}
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/songs"
                sx={{
                  alignSelf: "flex-start",
                  animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                }}
              >
                {t("buttons.viewSongs")}
              </Button>
            </Stack>

            {/* Columna Derecha: Top 5 Songs Stat */}
            <Box
              sx={{
                p: { xs: 1.5, md: 3 },
                borderRadius: 2,
                backgroundColor: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(0, 0, 0, 0.35)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "auto",
                transition: "all 0.3s ease",
                animation: `${fadeIn} 0.6s ease-in`,
                textAlign: "center",
                mx: "auto",
                gap: 1,
                width: "100%",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 11, md: 12 },
                  color: "#fff",
                  fontWeight: 600,
                  animation: `${fadeIn} 0.6s ease-in 0.2s both`,
                }}
              >
                {t("topSongs")}
              </Typography>

              {[
                {
                  title: "Peace Sells",
                  album: "Peace Sells... but Who's Buying?",
                  plays: 2016,
                },
                {
                  title: "Holy Wars... The Punishment Due",
                  album: "Rust in Peace",
                  plays: 1885,
                },
                {
                  title: "Symphony of Destruction",
                  album: "Countdown to Extinction",
                  plays: 1763,
                },
                { title: "Hangar 18", album: "Rust in Peace", plays: 1760 },
                {
                  title: "In My Darkest Hour",
                  album: "So Far, So Good... So What!",
                  plays: 1416,
                },
              ].map((song, index) => (
                <Box key={song.title} sx={{ width: "100%" }}>
                  {index > 0 && (
                    <Box
                      sx={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                        my: 0.75,
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      animation: `${fadeIn} 0.6s ease-in ${0.4 + index * 0.2}s both`,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 10, md: 11 },
                        color: "primary.main",
                        fontWeight: 700,
                        mb: 0.2,
                      }}
                    >
                      {index + 1}. {song.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 8, md: 9 },
                        color: "#ccc",
                      }}
                    >
                      {song.plays} {t("timesPlayed")}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </TabPanel>
    </Container>
  );
}
