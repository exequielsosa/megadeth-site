"use client";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const t = useTranslations("video");
  const videoTitle = title || t("defaultTitle");
  return (
    <Box
      sx={{
        position: "relative",
        paddingBottom: "56.25%", // 16:9 aspect ratio
        height: 0,
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: 4,
        border: "2px solid",
        borderColor: "primary.main",
        background:
          "linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(211, 47, 47, 0.05) 100%)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 6,
          borderColor: "primary.dark",
          transition: "all 0.3s ease",
        },
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`}
        title={videoTitle}
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
  );
}
