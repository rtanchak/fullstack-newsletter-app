import { Box, CircularProgress, Container } from "@mui/material";

export default function Loading() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    </Container>
  );
}
