import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { loadOrRebuildCampaignSummary } from "@/lib/campaign-store"

export const dynamic = "force-dynamic"

export async function GET() {
  const campaignsDir = path.join(process.cwd(), "content/campaigns")

  if (!fs.existsSync(campaignsDir)) {
    return NextResponse.json(
      {
        success: false,
        error: "No campaign datasets available yet."
      },
      { status: 404 }
    )
  }

  const summary = loadOrRebuildCampaignSummary(campaignsDir)
  const latestFile = summary.latestFile

  if (!latestFile) {
    return NextResponse.json(
      {
        success: false,
        error: "No campaign datasets available yet."
      },
      { status: 404 }
    )
  }

  const datasetPath = path.join(campaignsDir, latestFile)

  if (!fs.existsSync(datasetPath)) {
    return NextResponse.json(
      {
        success: false,
        error: "Latest campaign dataset could not be found."
      },
      { status: 404 }
    )
  }

  const raw = fs.readFileSync(datasetPath, "utf-8")
  const campaign = JSON.parse(raw)

  return NextResponse.json({
    success: true,
    file: latestFile,
    campaign
  })
}
