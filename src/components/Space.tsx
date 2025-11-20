import { Box, CardContent, Typography, Link as MuiLink } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

function Space() {
  const t = useTranslations("spaceInterview");

  return (
    <>
      <MuiLink
        component={Link}
        href="/entrevistas/dave-mustaine-final-show-space-2025"
        target="_blank"
        sx={{
          textDecoration: "none",
          color: "inherit",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 48 } }}>
          {t("title")}
        </Typography>
      </MuiLink>
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="flex-start"
        mt={3}
        mb={6}
        gap={4}
      >
        <Box width="100%" maxWidth={900}>
          <Typography
            variant="body1"
            sx={{ fontSize: { xs: 14, md: 18 }, whiteSpace: "pre-line" }}
            fontWeight={400}
          >
            {t("description")}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              overflow: "hidden",
              height: { xs: 300, sm: 400 },
              maxHeight: 400,
              maxWidth: 400,
              minWidth: 200,
              borderRadius: 2,
            }}
          >
            <Image
              src="/images/interviews/space.webp"
              alt={t("imageAlt")}
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width: 600px) 100vw, 400px"
            />
          </Box>

          <CardContent sx={{ px: 0, pt: 0, pb: 0 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                textAlign: "center",
                fontWeight: 600,
                color: "text.primary",
                fontSize: { xs: "1rem", sm: "1.1rem" },
                pt: 1,
              }}
            >
              {t("imageCaption")}
            </Typography>
          </CardContent>
        </Box>
      </Box>
    </>
  );
}

export default Space;
