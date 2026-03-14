import type { Metadata } from "next";
import DispatchJournal from "@/components/DispatchJournal";
import UnderConstructionFallback from "@/components/UnderConstructionFallback";
import { getDispatchEntries } from "@/lib/dispatch";
import { isUnderConstructionServer } from "@/lib/under-construction-server";

export const metadata: Metadata = {
  title: "Dispatch | Kenya Asteroid Research Journal",
  description:
    "Dispatch is the Kenya asteroid research journal of Asteonetica, documenting asteroid campaigns, asteroid discovery notes, observatory logs, and research updates from Kenya.",
  keywords: [
    "Kenya asteroids",
    "Kenya asteroid research",
    "Kenya asteroid journal",
    "Kenya asteroid dispatch",
    "asteroid observatory Kenya",
    "asteroid research Kenya",
    "Kenya asteroid campaign",
    "Kenya asteroid updates",
    "Asteonetica dispatch",
    "Asteroid Afronauts Kenya dispatch",
  ],
  alternates: {
    canonical: "/dispatch",
  },
  openGraph: {
    title: "Dispatch | Kenya Asteroid Research Journal",
    description:
      "Narrative campaign updates, asteroid discovery notes, and observatory logs from Asteonetica's Kenya asteroid research archive.",
    url: "https://asteonetica.org/dispatch",
    type: "website",
  },
};

export default async function DispatchPage() {
  if (isUnderConstructionServer("dispatch")) {
    return <UnderConstructionFallback sectionName="Dispatch" />;
  }

  const entries = await getDispatchEntries();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Asteonetica Dispatch",
    description:
      "Kenya asteroid research journal documenting asteroid campaigns, observatory logs, and dispatch updates from Asteonetica.",
    url: "https://asteonetica.org/dispatch",
    inLanguage: "en-KE",
    publisher: {
      "@type": "Organization",
      name: "Asteroid Afronauts Kenya",
      url: "https://asteonetica.org",
    },
    blogPost: entries.map((entry) => ({
      "@type": "BlogPosting",
      headline: entry.title,
      datePublished: entry.date,
      dateModified: entry.date,
      keywords: entry.tags.join(", "),
      description: entry.summary,
      articleBody: entry.content,
      url: `https://asteonetica.org/dispatch#${entry.slug}`,
      about: ["Kenya asteroids", "asteroid research", "observatory dispatch"],
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DispatchJournal entries={entries} />
    </>
  );
}
