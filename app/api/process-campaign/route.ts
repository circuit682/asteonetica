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

  let count = 0

  for (const cells of rawRows) {

    const combined = String(cells[1] ?? "").trim()

    if (!combined.startsWith("IU")) continue

    // combined cell looks like:
    // IUe8032   D. MacWilliams, D. Drago

    const parts = combined.split(/\s{2,}/)

    const id = parts[0]?.replace(/\./g, "") ?? ""

    const observers = parts[1]
      ? parts[1].split(",").map((o: string) => o.trim())
      : []

    const team = String(cells[3] ?? "").trim()

    const country = String(cells[4] ?? "").trim()

    const status = String(cells[5] ?? "").replace(/^F/, "").trim()

    const excelDate = Number(cells[6] ?? "")

    let date = ""

    if (!isNaN(excelDate)) {
      const jsDate = new Date((excelDate - 25569) * 86400 * 1000)
      date = jsDate.toISOString().slice(0,10)
    }

    const imageSet = String(cells[7] ?? "").trim()

    if (!id) continue

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