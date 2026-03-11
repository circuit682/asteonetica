import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {

  const data = await request.json();

  const campaignsDir = path.join(
    process.cwd(),
    "content/campaigns"
  );

  if (!fs.existsSync(campaignsDir)) {
    fs.mkdirSync(campaignsDir, { recursive: true });
  }

  const eastAfrica = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"];
  const africa = [
    "Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia",
    "Nigeria", "Ghana", "South Africa", "Morocco",
    "Egypt", "Namibia", "Botswana", "Senegal"
  ];

  let region = "global";
  if (africa.includes(data.country)) region = "africa";
  if (eastAfrica.includes(data.country)) region = "east_africa";

  const campaign = String(data.campaign || "").trim();
  if (!campaign) {
    return NextResponse.json({ error: "campaign is required" }, { status: 400 });
  }

  const campaignFileName = `${campaign.toLowerCase()}.json`;
  const datasetPath = path.join(campaignsDir, campaignFileName);

  const observation = {
    id: data.id,
    observers: data.observers.split(",").map((o: string) => o.trim()),
    team: data.team,
    country: data.country,
    region,
    status: data.status,
    imageSet: data.imageSet,
    date: data.date
  };

  const existingDataset = fs.existsSync(datasetPath)
    ? JSON.parse(fs.readFileSync(datasetPath, "utf8"))
    : {
      campaign,
      start: data.date || "",
      end: data.date || "",
      totalObservations: 0,
      observations: []
    };

  const observations = Array.isArray(existingDataset.observations)
    ? existingDataset.observations.filter((item: any) => item?.id !== observation.id)
    : [];

  observations.push(observation);

  const dates = observations
    .map((item: any) => item.date)
    .filter((value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value))
    .sort();

  const dataset = {
    campaign,
    start: dates[0] ?? existingDataset.start ?? "",
    end: dates[dates.length - 1] ?? existingDataset.end ?? "",
    totalObservations: observations.length,
    observations
  };

  fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2));

  return NextResponse.json({
    success: true,
    file: campaignFileName,
    records: observations.length
  });

}