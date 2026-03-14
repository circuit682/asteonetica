import type { Metadata } from "next";
import MissionControlConsole from "@/components/MissionControlConsole";
import { requireMissionControlSession } from "@/lib/mission-auth";

export const metadata: Metadata = {
  title: "Mission Control",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MissionControlPage() {
  await requireMissionControlSession();

  return <MissionControlConsole />;
}