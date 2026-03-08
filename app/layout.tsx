import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SparkleProvider } from "@/lib/SparkleContext";
import ScrollUp from "@/components/ScrollUp";

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
  metadataBase: new URL("https://asteonetica.org"),

  title: {
    default: "Asteonetica | Volunteer Astronomy Research – Kenya",
    template: "%s | Asteonetica",
  },

  description:
    "A Kenyan-based volunteer research collective contributing to asteroid detection through the International Astronomical Search Collaboration (IASC). Supporting global near-Earth object research and citizen science across Africa.",

  keywords: [
    "asteroid detection",
    "volunteer astronomy",
    "Kenya astronomy",
    "IASC",
    "near earth objects",
    "citizen science Africa",
    "astronomy research Kenya",
    "Afronaut astronomy initiative",
  ],

  authors: [{ name: "Asteonetica Research Collective" }],
  creator: "Asteonetica",
  publisher: "Asteonetica",

  openGraph: {
    title: "Asteonetica – Volunteer Astronomy Research | Kenya",
    description:
      "Kenyan volunteer research collective participating in IASC asteroid detection campaigns.",
    url: "https://asteonetica.org",
    type: "website",
    locale: "en_KE",
    siteName: "Asteonetica",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Asteonetica Astronomy Research Collective",
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
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,20,40,0.9),black_70%)]" />

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