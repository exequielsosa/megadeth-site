import { Box, Card, CardContent, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export const NewTour = () => {
  const t = useTranslations("newTour");

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
            sx={{ fontSize: { xs: 14, md: 18 } }}
            fontWeight={400}
          >
            {t("paragraph1")}
            <br />
            {t("paragraph2.start")} <b>{t("paragraph2.quote")}</b>{" "}
            {t("paragraph2.end")}
            <br />
            {t("paragraph3")}
            <br />
            {t("paragraph4")} <b>{t("paragraph5.quote")}</b>,{" "}
            {t("paragraph5.attribution")}
            <br />
            {t("paragraph6")}
          </Typography>
        </Box>

        <Box sx={{ width: "100%", maxWidth: 300, mx: "auto" }}>
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
                src={`https://www.youtube.com/embed/trDNxFIehVM?rel=0&modestbranding=1&iv_load_policy=3`}
                title={t("videoTitle")}
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
                {t("videoCardTitle")}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default NewTour;
