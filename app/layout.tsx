import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SparkleProvider } from "@/lib/SparkleContext";
import ScrollUp from "@/components/ScrollUp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"), // change after deployment

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
  ],

  authors: [{ name: "Asteonetica Research Collective" }],

  openGraph: {
    title: "Asteonetica – Volunteer Astronomy Research | Kenya",
    description:
      "Kenyan volunteer research collective participating in IASC asteroid detection campaigns.",
    type: "website",
    locale: "en_KE",
    siteName: "Asteonetica",
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
    
    {/* Global Background */}
    <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,20,40,0.9),black_70%)]" />

    <Navbar />

    <main className="min-h-screen">
      {children}
    </main>

    <ScrollUp />

  </SparkleProvider>
</body>
    </html>
  );
}