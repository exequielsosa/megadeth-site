"use client";

import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

interface YouTubeShort {
  videoId: string;
  title: string;
}

interface YouTubeShortsGridProps {
  shorts: YouTubeShort[];
}

export default function YouTubeShortsGrid({ shorts }: YouTubeShortsGridProps) {
  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Grid container spacing={3}>
        {shorts.map((short) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={short.videoId}>
            <Card
              sx={{
                background: "transparent",
                boxShadow: "none",
                "&:hover": {
                  transform: "translateY(-4px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  paddingBottom: "177.78%", // 9:16 aspect ratio for shorts
                  height: 0,
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: 4,
                  border: "2px solid",
                  borderColor: "primary.main",
                  background:
                    "linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(211, 47, 47, 0.05) 100%)",
                  "&:hover": {
                    boxShadow: 6,
                    borderColor: "primary.dark",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${short.videoId}?rel=0&modestbranding=1&iv_load_policy=3`}
                  title={short.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                />
              </Box>

              <CardContent sx={{ px: 0, pt: 2, pb: 0 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    textAlign: "center",
                    fontWeight: 600,
                    color: "text.primary",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  {short.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
