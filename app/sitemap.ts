import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: "2026-04-10",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/afronauts`,
      lastModified: "2026-04-10",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/observatory`,
      lastModified: "2026-04-11",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/vault`,
      lastModified: "2026-04-11",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/dispatch`,
      lastModified: "2026-04-12",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/astrophotography`,
      lastModified: "2026-04-12",
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
