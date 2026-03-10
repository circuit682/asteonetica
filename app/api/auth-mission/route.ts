import { NextResponse } from "next/server";

export async function POST(request: Request) {

  const { password } = await request.json();

  const adminPassword = process.env.MISSION_CONTROL_PASSWORD;

  if (password === adminPassword) {
    return NextResponse.json({ authorized: true });
  }

  return NextResponse.json({ authorized: false });

}