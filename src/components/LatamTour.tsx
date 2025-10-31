import { Box, CardContent, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";

function LatamTour() {
  const t = useTranslations("ironMaidenTour");

  return (
    <>
      <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 48 } }}>
        {t("latamTitle")}
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
            dangerouslySetInnerHTML={{ __html: t.raw("latamParagraph") }}
          />
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
            }}
          >
            <Image
              src="/images/unnamed.png"
              alt="Iron Maiden Tour"
              fill
              style={{ objectFit: "contain" }}
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
              {t("latamDates")}
            </Typography>
          </CardContent>
        </Box>
      </Box>
    </>
  );
}

export default LatamTour;
