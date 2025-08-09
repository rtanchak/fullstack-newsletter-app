import type { Metadata } from "next"
import "./../styles/globals.css"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import Providers from "./providers"

export const metadata: Metadata = { title: "Newsletter", description: "Personal newsletter" }
const theme = createTheme()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Providers>{children}</Providers>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
