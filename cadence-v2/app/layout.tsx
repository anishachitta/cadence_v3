import "./globals.css"
import { DM_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const dmSans = DM_Sans({ subsets: ["latin"] })

export const metadata = {
  title: "Cadence - Healthcare Call Management",
  description: "Healthcare call management dashboard with Retell AI integration",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.className} text-black`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
