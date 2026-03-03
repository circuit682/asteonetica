import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://yourdomain.com",
      lastModified: new Date(),
    },
    {
      url: "https://yourdomain.com/afronauts",
      lastModified: new Date(),
    },
    {
      url: "https://yourdomain.com/observatory",
      lastModified: new Date(),
    },
    {
      url: "https://yourdomain.com/vault",
      lastModified: new Date(),
    },
    {
      url: "https://yourdomain.com/dispatch",
      lastModified: new Date(),
    },
  ];
}