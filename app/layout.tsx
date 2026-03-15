import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SparkleProvider } from "@/lib/SparkleContext";
import ScrollUp from "@/components/ScrollUp";
import CosmicEnvironment from "@/components/cosmic/CosmicEnvironment";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  verification: {
    google: googleSiteVerification,
  },

  title: {
    default: "Asteroid Afronauts Kenya | Volunteer Astronomy Research – Kenya",
    template: "%s | Asteroid Afronauts Kenya",
  },

  description:
    "Asteonetica is a Kenyan volunteer astronomy research collective participating in IASC asteroid search campaigns. Afronaut citizen scientists analyze telescope survey data to identify near-Earth asteroids and contribute to planetary defense research.",

  keywords: [
    "asteroid detection",
    "citizen science astronomy",
    "IASC asteroid search",
    "Afronaut astronomy initiative",
    "near earth objects research",
    "Kenya astronomy research",
    "African astronomy citizen science",
  ],

  authors: [{ name: "Asteroid Afronauts Kenya Research Collective" }],
  creator: "Asteroid Afronauts Kenya",
  publisher: "Asteroid Afronauts Kenya",

  openGraph: {
    title: "Asteroid Afronauts Kenya – Volunteer Astronomy Research | Kenya",
    description:
      "Kenyan volunteer research collective participating in IASC asteroid detection campaigns.",
    url: siteUrl,
    type: "website",
    locale: "en_KE",
    siteName: "Asteroid Afronauts Kenya",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Asteroid Afronauts Kenya Astronomy Research Collective",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <SparkleProvider>
          {/* Global Space Background */}
          <CosmicEnvironment />

          <Navbar />

          <main className="min-h-screen relative">
            {children}
          </main>

          <ScrollUp />
        </SparkleProvider>
      </body>
    </html>
  );
}