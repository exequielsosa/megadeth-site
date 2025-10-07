"use client";

import { Box } from "@mui/material";
import { useState } from "react";

interface DVDImageProps {
  src: string;
  alt: string;
}

export default function DVDImage({ src, alt }: DVDImageProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = imageError
    ? "/images/default-dvd.svg"
    : src.startsWith("http")
    ? src
    : src.startsWith("/")
    ? src
    : `/images/dvds/${src}`;

  return (
    <Box
      component="img"
      src={imageUrl}
      alt={alt}
      onError={handleImageError}
      sx={{
        width: "100%",
        height: "400px",
        objectFit: "contain",
        borderRadius: 0,
        boxShadow: 3,
        backgroundColor: "grey.100",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    />
  );
}
