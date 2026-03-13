import { NextResponse } from "next/server";
import {
  createMissionControlSessionToken,
  getMissionControlCookieOptions,
  missionControlSessionCookie,
  isMissionControlSessionActive,
} from "@/lib/mission-auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.MISSION_CONTROL_PASSWORD;

  if (password === adminPassword) {
    const response = NextResponse.json({ authorized: true });
    response.cookies.set(
      missionControlSessionCookie,
      createMissionControlSessionToken(),
      getMissionControlCookieOptions()
    );

    return response;
  }

  return NextResponse.json(
    { authorized: false, error: "Invalid Mission Control password." },
    { status: 401 }
  );
}

export async function GET() {
  return NextResponse.json({ authorized: await isMissionControlSessionActive() });
}

export async function DELETE() {
  const response = NextResponse.json({ authorized: false });
  response.cookies.set(missionControlSessionCookie, "", {
    ...getMissionControlCookieOptions(),
    maxAge: 0,
  });

  return response;
}