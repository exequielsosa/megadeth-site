import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";

function Ride() {
  const t = useTranslations("ironMaidenTour");

  return (
    <>
      <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 48 } }}>
        {t("rideTitle")}
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
            {t("rideParagraph")}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: 300,
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
              maxHeight: 300,
              maxWidth: 300,
              minWidth: 200,
              borderRadius: 2,
            }}
          >
            <Image
              src="/images/ride.jpeg"
              alt="Ride The Lightning"
              fill
              style={{ objectFit: "contain" }}
              priority
              sizes="(max-width: 600px) 100vw, 400px"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Ride;
