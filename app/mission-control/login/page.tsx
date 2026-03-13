import { redirect } from "next/navigation";
import MissionControlLogin from "@/components/MissionControlLogin";
import { isMissionControlSessionActive } from "@/lib/mission-auth";

export default async function MissionControlLoginPage() {
  if (await isMissionControlSessionActive()) {
    redirect("/mission-control");
  }

  return <MissionControlLogin />;
}