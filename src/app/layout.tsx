import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://brandonhuerta.dev"),
  title: {
    default: "Brandon Huerta | Desarrollador Full-Stack",
    template: "%s | Brandon Huerta",
  },
  description:
    "Desarrollador Full-Stack titulado por SENATI. Especializado en Java, Spring Boot, React y soluciones GIS. RNP activo para consultorías del Estado Peruano.",
  keywords: [
    "desarrollador full-stack",
    "brandon huerta",
    "java",
    "spring boot",
    "react",
    "next.js",
    "gis",
    "postgis",
    "senati",
    "perú",
  ],
  authors: [{ name: "Brandon Mike Huerta Neyra" }],
  creator: "Brandon Mike Huerta Neyra",
  openGraph: {
    type: "website",
    locale: "es_PE",
    title: "Brandon Huerta | Desarrollador Full-Stack",
    description:
      "Desarrollador Full-Stack titulado por SENATI. Java, Spring Boot, React y soluciones GIS.",
    siteName: "Brandon Huerta Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandon Huerta | Desarrollador Full-Stack",
    description:
      "Desarrollador Full-Stack titulado por SENATI. Java, Spring Boot, React y soluciones GIS.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/IDemon-San-Icon.svg",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-bg-primary text-primary antialiased theme-transition">
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
