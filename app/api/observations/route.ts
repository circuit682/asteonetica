import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {

  const data = await request.json();

  const observationsDir = path.join(
    process.cwd(),
    "content/observations"
  );

  if (!fs.existsSync(observationsDir)) {
    fs.mkdirSync(observationsDir, { recursive: true });
  }

  const filePath = path.join(
    observationsDir,
    `${data.id}.json`
  );

  const observation = {
    id: data.id,
    object: data.object,
    observers: data.observers.split(",").map((o: string) => o.trim()),
    team: data.team,
    country: data.country,
    status: data.status,
    imageSet: data.imageSet,
    date: data.date,
    campaign: data.campaign
  };

  fs.writeFileSync(
    filePath,
    JSON.stringify(observation, null, 2)
  );

  return NextResponse.json({ success: true });

}