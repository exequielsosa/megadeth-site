"use client";

import { Button } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";

interface DVDYouTubeButtonProps {
  youtubeUrl: string;
  locale: string;
}

export default function DVDYouTubeButton({
  youtubeUrl,
  locale,
}: DVDYouTubeButtonProps) {
  const handleClick = () => {
    window.open(youtubeUrl, "_blank");
  };

  return (
    <Button
      variant="contained"
      startIcon={<PlayArrow />}
      fullWidth
      sx={{ mt: 2 }}
      onClick={handleClick}
    >
      {locale === "es" ? "Ver en YouTube" : "Watch on YouTube"}
    </Button>
  );
}
