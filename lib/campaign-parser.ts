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

type HeaderMap = {
  rowIndex: number
  provisional?: number
  object?: number
  observers?: number
  team?: number
  country?: number
  status?: number
  date?: number
  imageSet?: number
}

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim()
}

function parseExcelDate(value: unknown): string {
  if (typeof value === "number" && !Number.isNaN(value)) {
    const jsDate = new Date((value - 25569) * 86400 * 1000)
    if (!Number.isNaN(jsDate.getTime())) {
      return jsDate.toISOString().slice(0, 10)
    }
  }

  const text = String(value ?? "").trim()
  if (!text) return ""

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text
  }

  const ddmmyyyy = text.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/)
  if (ddmmyyyy) {
    const [, dd, mm, yyyy] = ddmmyyyy
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`
  }

  const parsed = new Date(text)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10)
  }

  return ""
}

function splitObservers(raw: string): string[] {
  return raw
    .split(/,|;|\||\band\b/i)
    .map((o) => o.trim())
    .filter(Boolean)
}

function detectHeaderMap(rawRows: (string | number | null)[][]): HeaderMap | null {
  for (let rowIndex = 0; rowIndex < rawRows.length; rowIndex += 1) {
    const cells = rawRows[rowIndex]
    const normalizedCells = cells.map(normalizeHeader)

    const lookup = (candidates: string[]): number | undefined => {
      const idx = normalizedCells.findIndex((cell) => candidates.includes(cell))
      return idx >= 0 ? idx : undefined
    }

    const map: HeaderMap = {
      rowIndex,
      provisional: lookup(["provisional", "provisionaldesignation", "designation"]),
      object: lookup(["object", "objectid", "number", "#object", "id"]),
      observers: lookup(["students", "observers", "observer", "student"]),
      team: lookup(["school", "team", "group"]),
      country: lookup(["location", "country"]),
      status: lookup(["status"]),
      date: lookup(["dateofimage", "date", "imagedate"]),
      imageSet: lookup(["linked", "imageset", "image", "frameset"])
    }

    const hasRequiredShape =
      map.status !== undefined &&
      map.date !== undefined &&
      (map.provisional !== undefined || map.object !== undefined) &&
      (map.team !== undefined || map.country !== undefined)

    if (hasRequiredShape) {
      return map
    }
  }

  return null
}

function inferId(rowText: string, provisionalCell: string, objectCell: string): string {
  const fromCells = provisionalCell || objectCell
  if (fromCells) return fromCells.trim()

  const idMatch = rowText.match(/\bIU[a-zA-Z0-9]+\b/i)
  if (idMatch) return idMatch[0]

  const designationMatch = rowText.match(/\b\d{4}\s?[A-Z]{1,2}\d{0,3}\b/i)
  if (designationMatch) return designationMatch[0].replace(/\s+/g, " ").trim()

  return ""
}

function inferImageSet(rowText: string, imageCell: string): string {
  if (imageCell) return imageCell.trim()

  const imageMatch = rowText.match(/\b[A-Z]{3}[0-9]{4}\b/)
  if (imageMatch) return imageMatch[0]

  return ""
}

function deriveRegion(country: string): string {
  let region = "global"
  if (AFRICA.includes(country)) region = "africa"
  if (EAST_AFRICA.includes(country)) region = "east_africa"
  return region
}

export async function parseSpreadsheetFile(file: File): Promise<ParsedObservation[]> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  const rawRows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
    header: 1,
    defval: ""
  })

  const observations: ParsedObservation[] = []
  const headerMap = detectHeaderMap(rawRows)

  if (headerMap) {
    for (let rowIndex = headerMap.rowIndex + 1; rowIndex < rawRows.length; rowIndex += 1) {
      const cells = rawRows[rowIndex]
      const rowText = cells.join(" ").trim()

      if (!rowText) continue

      const provisionalCell = String(cells[headerMap.provisional ?? -1] ?? "").trim()
      const objectCell = String(cells[headerMap.object ?? -1] ?? "").trim()
      const observersCell = String(cells[headerMap.observers ?? -1] ?? "").trim()
      const team = String(cells[headerMap.team ?? -1] ?? "").trim()
      const country = String(cells[headerMap.country ?? -1] ?? "").trim()
      const status = String(cells[headerMap.status ?? -1] ?? "").trim()
      const date = parseExcelDate(cells[headerMap.date ?? -1])
      const imageSetCell = String(cells[headerMap.imageSet ?? -1] ?? "").trim()

      const id = inferId(rowText, provisionalCell, objectCell)
      const imageSet = inferImageSet(rowText, imageSetCell)
      const observers = splitObservers(observersCell)

      if (!id) continue

      observations.push({
        id,
        observers,
        team,
        country,
        region: deriveRegion(country),
        status: status.replace(/^F/, "").trim(),
        date,
        imageSet
      })
    }

    return observations
  }

  for (const cells of rawRows) {
    const rowText = cells.join(" ")
    const id = inferId(rowText, "", "")
    const imageSet = inferImageSet(rowText, "")

    if (!id || !imageSet) continue

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

    const date = parseExcelDate(cells[6])
    const region = deriveRegion(country)

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
