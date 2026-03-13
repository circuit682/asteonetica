import MissionControlConsole from "@/components/MissionControlConsole";
import { requireMissionControlSession } from "@/lib/mission-auth";

export default async function MissionControlPage() {
  await requireMissionControlSession();

  return <MissionControlConsole />;
}