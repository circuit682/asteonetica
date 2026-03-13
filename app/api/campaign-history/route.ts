import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { loadOrRebuildCampaignSummary } from "@/lib/campaign-store"

export const dynamic = "force-dynamic"

export async function GET() {
  const campaignsDir = path.join(process.cwd(), "content/campaigns")

  if (!fs.existsSync(campaignsDir)) {
    return NextResponse.json({ success: true, campaigns: [] })
  }

  const summary = loadOrRebuildCampaignSummary(campaignsDir)

  return NextResponse.json({ success: true, campaigns: summary.campaigns })
}