"use client"

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import Providers from "./providers"

const theme = createTheme()

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Providers>{children}</Providers>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
