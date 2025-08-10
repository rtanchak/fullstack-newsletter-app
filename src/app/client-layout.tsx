"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Providers from "./providers";
import Header from "@/components/Header";

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      `,
    },
  },
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Providers>
          <Header />
          {children}
        </Providers>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
