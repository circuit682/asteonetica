import { NextResponse } from "next/server"
import { parseSpreadsheetFile } from "@/lib/campaign-parser"
import { isAfronautTeam } from "@/lib/analytics"

export const dynamic = "force-dynamic"

export type CampaignPreviewResponse = {
  success: boolean
  totalObservations?: number
  afronautDetections?: number
  panAfricanDetections?: number
  uniqueTeams?: number
  error?: string
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file uploaded" },
      { status: 400 }
    )
  }

  try {
    const observations = await parseSpreadsheetFile(file)

    if (observations.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid observations found in the spreadsheet." },
        { status: 400 }
      )
    }

    const afronautDetections = observations.filter((o) => isAfronautTeam(o.team)).length

    const panAfricanDetections = observations.filter(
      (o) => o.region === "africa" || o.region === "east_africa"
    ).length

    const uniqueTeams = new Set(observations.map((o) => o.team)).size

    return NextResponse.json({
      success: true,
      totalObservations: observations.length,
      afronautDetections,
      panAfricanDetections,
      uniqueTeams
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to parse file." },
      { status: 500 }
    )
  }
}
