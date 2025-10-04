"use client";
import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary">
          Fan site no oficial. © {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
}
