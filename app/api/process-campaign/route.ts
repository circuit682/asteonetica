import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { parseSpreadsheetFile } from "@/lib/campaign-parser"
import { loadOrRebuildCampaignSummary } from "@/lib/campaign-store"

export const dynamic = "force-dynamic"

type LatestCampaignPointer = {
  file: string
  campaign: string
  updatedAt: string
}

function sanitizeCampaignName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function POST(req: Request) {

  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" })
  }

  const observations = await parseSpreadsheetFile(file)

  if (observations.length === 0) {
    return NextResponse.json(
      { error: "No valid observations found in the spreadsheet." },
      { status: 400 }
    )
  }

  const campaignsDir = path.join(
    process.cwd(),
    "content/campaigns"
  )

  if (!fs.existsSync(campaignsDir)) {
    fs.mkdirSync(campaignsDir, { recursive: true })
  }

  const campaign = path.parse(file.name).name || "Campaign"
  const campaignSlug = sanitizeCampaignName(campaign) || "campaign"
  const now = new Date().toISOString()
  const timestamp = now.replace(/[:.]/g, "-")
  const campaignFileName = `${campaignSlug}-${timestamp}.json`
  const latestPointerFileName = "latest.json"
  const defaultStart = "2026-01-12"
  const defaultEnd = "2026-02-06"

  const dates = observations
    .map((item) => item.date)
    .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
    .sort()

  const dataset = {
    campaign,
    start: dates[0] ?? defaultStart,
    end: dates[dates.length - 1] ?? defaultEnd,
    totalObservations: observations.length,
    observations
  }

  const datasetPath = path.join(campaignsDir, campaignFileName)
  const latestPointerPath = path.join(campaignsDir, latestPointerFileName)
  fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2))

  const summary = loadOrRebuildCampaignSummary(campaignsDir)
  const latestCampaignEntry = summary.campaigns.find((item) => item.file === summary.latestFile)

  const pointer: LatestCampaignPointer = {
    file: summary.latestFile ?? campaignFileName,
    campaign: latestCampaignEntry?.campaign ?? campaign,
    updatedAt: now
  }

  fs.writeFileSync(latestPointerPath, JSON.stringify(pointer, null, 2))

  return NextResponse.json({
    success: true,
    records: observations.length,
    file: campaignFileName
  })

}