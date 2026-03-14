import type { Metadata } from "next";
import UnderConstructionFallback from "@/components/UnderConstructionFallback";

export const metadata: Metadata = {
  title: "Under Construction",
  description: "This route is temporarily under construction.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnderConstructionPage() {
  return (
    <UnderConstructionFallback
      sectionName="This section"
      details="Use the navigation links below while we finish this part of the observatory."
    />
  );
}
