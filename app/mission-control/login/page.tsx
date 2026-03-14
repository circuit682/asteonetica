import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MissionControlLogin from "@/components/MissionControlLogin";
import { isMissionControlSessionActive } from "@/lib/mission-auth";

export const metadata: Metadata = {
  title: "Mission Control Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MissionControlLoginPage() {
  if (await isMissionControlSessionActive()) {
    redirect("/mission-control");
  }

  return <MissionControlLogin />;
}