import * as XLSX from "xlsx"

export interface ParsedObservation {
  id: string
  observers: string[]
  team: string
  country: string
  status: string
  date: string
  imageSet: string
  region: string
}

const EAST_AFRICA = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"]
const AFRICA = [
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Ethiopia",
  "Nigeria",
  "Ghana",
  "South Africa",
  "Morocco",
  "Egypt",
  "Namibia",
  "Botswana",
  "Senegal"
]

export async function parseSpreadsheetFile(file: File): Promise<ParsedObservation[]> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  const rawRows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
    header: 1,
    defval: ""
  })

  const observations: ParsedObservation[] = []

  for (const cells of rawRows) {
    const rowText = cells.join(" ")
    const idMatch = rowText.match(/IU[a-zA-Z0-9]+/)
    const imageMatch = rowText.match(/[A-Z]{3}[0-9]{4}/)

    if (!idMatch || !imageMatch) continue

    const id = idMatch[0]
    const remainder = rowText.replace(id, "").trim()
    const observerMatch = remainder.match(/^([A-Z]\.\s?[A-Za-z]+(?:,\s*[A-Z]\.\s?[A-Za-z]+)*)/)

    let observers: string[] = []
    if (observerMatch) {
      observers = observerMatch[1]
        .split(",")
        .map((o) => o.trim())
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
    if (AFRICA.includes(country)) region = "africa"
    if (EAST_AFRICA.includes(country)) region = "east_africa"

    observations.push({
      id,
      observers,
      team,
      country,
      region,
      status,
      date,
      imageSet
    })
  }

  return observations
}
