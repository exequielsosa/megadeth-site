import { Box, CardContent, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";

function IronMaidenTour() {
  const t = useTranslations("ironMaidenTour");

  return (
    <>
      <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 48 } }}>
        {t("title")}
      </Typography>
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
            {t("paragraph1")}
            {"\n\n"}
            {t("paragraph2")}
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
              borderRadius: 2,
              boxShadow: 4,
              overflow: "hidden",
              height: { xs: 300, sm: 400 },
              maxHeight: 400,
              maxWidth: 400,
              minWidth: 200,
            }}
          >
            <Image
              src="/ironmaiden.webp"
              alt="Iron Maiden Tour"
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width: 600px) 100vw, 400px"
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
              {t("caption")}
            </Typography>
          </CardContent>
        </Box>
      </Box>
    </>
  );
}

export default IronMaidenTour;
