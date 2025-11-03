"use client";
import { useTranslations } from "next-intl";
import { Container, Typography, Box } from "@mui/material";
import { useEffect } from "react";

export default function FAQPage() {
  const t = useTranslations("faq");
  useEffect(() => {
    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": t("q1"),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t("a1"),
          },
        },
        {
          "@type": "Question",
          "name": t("q2"),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t("a2"),
          },
        },
        {
          "@type": "Question",
          "name": t("q3"),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t("a3"),
          },
        },
      ],
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-jsonld";
    script.text = JSON.stringify(faqJsonLd);
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("faq-jsonld");
      if (el) document.head.removeChild(el);
    };
  }, [t]);
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        color="primary"
        fontWeight={700}
      >
        {t("title")}
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="text.primary" fontWeight={600}>
          {t("q1")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t("a1")}
        </Typography>
        <Typography variant="h6" color="text.primary" fontWeight={600}>
          {t("q2")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t("a2")}
        </Typography>
        <Typography variant="h6" color="text.primary" fontWeight={600}>
          {t("q3")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t("a3")}
        </Typography>
      </Box>
    </Container>
  );
}
