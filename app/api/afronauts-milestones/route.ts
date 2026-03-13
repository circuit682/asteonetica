import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { loadOrRebuildCampaignSummary } from "@/lib/campaign-store"

export const dynamic = "force-dynamic"

export async function GET() {
  const campaignsDir = path.join(process.cwd(), "content/campaigns")

  if (!fs.existsSync(campaignsDir)) {
    return NextResponse.json({
      success: true,
      summary: {
        totalDetections: 0,
        campaignsParticipated: 0,
        activeYears: 0,
        uniqueObservers: 0
      },
      yearly: []
    })
  }

  const summary = loadOrRebuildCampaignSummary(campaignsDir)

  return NextResponse.json({
    success: true,
    ...summary.milestones
  })
}