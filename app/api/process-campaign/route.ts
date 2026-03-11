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

  const observationsDir = path.join(
    process.cwd(),
    "content/observations"
  )

  if (!fs.existsSync(observationsDir)) {
    fs.mkdirSync(observationsDir, { recursive: true })
  }

  const eastAfrica = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"]

  const africa = [
    "Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia",
    "Nigeria", "Ghana", "South Africa", "Morocco",
    "Egypt", "Namibia", "Botswana", "Senegal"
  ]

  console.log("Total spreadsheet rows:", rawRows.length)

  let count = 0

  for (const cells of rawRows) {

    const rowText = cells
      .map(c => String(c ?? "").trim())
      .filter(Boolean)
      .join(" ")

    // detect asteroid ID
    const idMatch = rowText.match(/IU[a-zA-Z0-9]+/)
    if (!idMatch) continue

    const id = idMatch[0]

    // remove ID from the row to isolate names
    let remainder = rowText.replace(id, "").trim()

    // observers appear before the team name
    const observerMatch = remainder.match(/^([A-Z]\.\s?[A-Za-z]+(?:,\s*[A-Z]\.\s?[A-Za-z]+)*)/)

    let observers: string[] = []

    if (observerMatch) {
      observers = observerMatch[1]
        .split(",")
        .map(o => o.trim())
        .filter(Boolean)

      remainder = remainder.replace(observerMatch[1], "").trim()
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

    const observation = {
      id,
      observers,
      team,
      country,
      status,
      date,
      imageSet,
      campaign: "JanFeb26"
    }

    const filePath = path.join(
      observationsDir,
      `${id}.json`
    )

    fs.writeFileSync(
      filePath,
      JSON.stringify(observation, null, 2)
    )

    count++

  }

  return NextResponse.json({
    success: true,
    records: count
  })

}