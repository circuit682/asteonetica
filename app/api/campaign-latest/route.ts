import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic"

type LatestCampaignPointer = {
  file: string
  campaign?: string
  updatedAt?: string
}

function latestDatasetFromDirectory(campaignsDir: string): string | null {
  const files = fs
    .readdirSync(campaignsDir)
    .filter((file) => file.endsWith(".json") && file !== "latest.json")
    .map((file) => {
      const fullPath = path.join(campaignsDir, file)
      const stat = fs.statSync(fullPath)
      return { file, mtime: stat.mtimeMs }
    })
    .sort((a, b) => b.mtime - a.mtime)

  return files[0]?.file ?? null
}

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

  const latestPointerPath = path.join(campaignsDir, "latest.json")

  let latestFile: string | null = null

  if (fs.existsSync(latestPointerPath)) {
    try {
      const pointerRaw = fs.readFileSync(latestPointerPath, "utf-8")
      const pointer = JSON.parse(pointerRaw) as LatestCampaignPointer
      latestFile = pointer.file
    } catch {
      latestFile = null
    }
  }

  if (!latestFile) {
    latestFile = latestDatasetFromDirectory(campaignsDir)
  }

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
