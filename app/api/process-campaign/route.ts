import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import * as XLSX from "xlsx"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {

  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const workbook = XLSX.read(buffer)

  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  const rawRows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
    header: 1,
    defval: ""
  })

  const campaignsDir = path.join(
    process.cwd(),
    "content/campaigns"
  )

  if (!fs.existsSync(campaignsDir)) {
    fs.mkdirSync(campaignsDir, { recursive: true })
  }

  const eastAfrica = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"]

  const africa = [
    "Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia",
    "Nigeria", "Ghana", "South Africa", "Morocco",
    "Egypt", "Namibia", "Botswana", "Senegal"
  ]

  const campaign = "JanFeb26"
  const campaignFileName = "janfeb26.json"
  const defaultStart = "2026-01-12"
  const defaultEnd = "2026-02-06"

  console.log("Total spreadsheet rows:", rawRows.length)

  const observations: Array<{
    id: string
    observers: string[]
    team: string
    country: string
    status: string
    date: string
    imageSet: string
    region: string
  }> = []

  for (const cells of rawRows) {

    const rowText = cells.join(" ")

    const idMatch = rowText.match(/IU[a-zA-Z0-9]+/)
    const imageMatch = rowText.match(/[A-Z]{3}[0-9]{4}/)

    if (!idMatch || !imageMatch) continue

    const id = idMatch[0]

    // remove ID from the row to isolate names
    const remainder = rowText.replace(id, "").trim()

    // observers appear before the team name
    const observerMatch = remainder.match(/^([A-Z]\.\s?[A-Za-z]+(?:,\s*[A-Z]\.\s?[A-Za-z]+)*)/)

    let observers: string[] = []

    if (observerMatch) {
      observers = observerMatch[1]
        .split(",")
        .map(o => o.trim())
        .filter(Boolean)
    }

    const team = String(cells[3] ?? "").trim()

    const country = String(cells[4] ?? "").trim()

    const status = String(cells[5] ?? "")
      .replace(/^F/, "")
      .trim()

    const excelDate = Number(cells[6])

    let date = ""

    if (!isNaN(excelDate)) {
      const jsDate = new Date((excelDate - 25569) * 86400 * 1000)
      date = jsDate.toISOString().slice(0, 10)
    }

    const imageSet = String(cells[7] ?? "").trim()

    let region = "global"
    if (africa.includes(country)) region = "africa"
    if (eastAfrica.includes(country)) region = "east_africa"

    const observation = {
      id,
      observers,
      team,
      country,
      region,
      status,
      date,
      imageSet
    }

    observations.push(observation)

  }

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
  fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2))

  return NextResponse.json({
    success: true,
    records: observations.length,
    file: campaignFileName
  })

}