import { NextResponse } from "next/server";
import { getDispatchEntries } from "@/lib/dispatch";
import { isMissionControlSessionActive } from "@/lib/mission-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isMissionControlSessionActive())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const entries = await getDispatchEntries();

  return NextResponse.json({
    success: true,
    entries,
  });
}