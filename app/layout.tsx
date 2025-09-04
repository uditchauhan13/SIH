import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AccessibilityProvider } from "@/components/accessibility-provider"
import { LoadingScreen } from "@/components/loading-screen"
import { AccessibilityMenu } from "@/components/accessibility-menu"
import "./globals.css"

export const metadata: Metadata = {
  title: "AirSight AI - AI-Powered Satellite Air Quality Monitoring",
  description: "Transforming air quality monitoring with AI-powered satellite technology for a cleaner tomorrow.",
  generator: "v0.app",
  keywords: "air quality, satellite monitoring, AI, environmental monitoring, pollution tracking",
  authors: [{ name: "AirSight AI Team" }],
 
  robots: "index, follow",
  openGraph: {
    title: "AirSight AI - AI-Powered Satellite Air Quality Monitoring",
    description: "Transforming air quality monitoring with AI-powered satellite technology for a cleaner tomorrow.",
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <AccessibilityProvider>
          <LoadingScreen />
          <Suspense fallback={null}>
            <div id="main-content">{children}</div>
          </Suspense>
          <AccessibilityMenu />
        </AccessibilityProvider>
        <Analytics />
      </body>
    </html>
  )
}
