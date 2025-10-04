import { Box } from "@mui/material";

export const ContainerGradient = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 14 },
        background:
          "radial-gradient(60% 80% at 50% 0%, rgba(239,83,80,0.15), transparent 60%)",
      }}
    >
      {children}
    </Box>
  );
};

export default ContainerGradient;
