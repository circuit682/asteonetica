import fs from "fs"
import path from "path"
import {
  afronautDetections,
  isAfronautTeam,
  isKenyanPriorityTeam,
  isSpaceSocietyOfKenya,
  type CampaignDataset
} from "@/lib/analytics"

export type CampaignSummaryItem = {
  file: string
  campaign: string
  start: string
  end: string
  year: string
  totalObservations: number
  afronautDetections: number
  uniqueAfronautObservers: number
  sortDate: string
  isLatest: boolean
}

export type MilestoneBadge = {
  label: string
  value: string
  description: string
}

export type PersistedCampaignSummary = {
  generatedAt: string
  latestFile: string | null
  campaigns: CampaignSummaryItem[]
  milestones: {
    summary: {
      totalDetections: number
      campaignsParticipated: number
      activeYears: number
      uniqueObservers: number
    }
    yearly: Array<{
      year: string
      detections: number
      campaigns: number
    }>
    badges: MilestoneBadge[]
    kenya: {
      totalDetections: number
      uniqueObservers: number
      teams: Array<{
        team: string
        detections: number
        uniqueObservers: number
      }>
      observerNames: string[]
    }
  }
}

const SUMMARY_FILE_NAME = "summary.json"

function validDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function inferCampaignYear(dataset: CampaignDataset): string {
  if (validDate(dataset.end)) return dataset.end.slice(0, 4)
  if (validDate(dataset.start)) return dataset.start.slice(0, 4)

  const datedObservation = dataset.observations.find((o) => validDate(o.date))
  if (datedObservation) return datedObservation.date.slice(0, 4)

  return "Unknown"
}

function campaignSortDate(dataset: CampaignDataset): string {
  if (validDate(dataset.end)) return dataset.end
  if (validDate(dataset.start)) return dataset.start

  const dates = dataset.observations
    .map((o) => o.date)
    .filter(validDate)
    .sort()

  return dates[dates.length - 1] ?? "0000-00-00"
}

function listCampaignFiles(campaignsDir: string): string[] {
  return fs
    .readdirSync(campaignsDir)
    .filter(
      (file) =>
        file.endsWith(".json") &&
        file !== "latest.json" &&
        file !== SUMMARY_FILE_NAME
    )
}

function buildBadges(yearly: Array<{ year: string; detections: number; campaigns: number }>, totalDetections: number): MilestoneBadge[] {
  const badges: MilestoneBadge[] = []

  if (yearly.length > 0) {
    const firstYear = yearly[0]
    badges.push({
      label: "First Year",
      value: firstYear.year,
      description: "The first recorded year with Asteroid Afronauts detections."
    })

    const bestYear = yearly.reduce((best, current) =>
      current.detections > best.detections ? current : best
    )

    badges.push({
      label: "Best Year",
      value: `${bestYear.year} · ${bestYear.detections}`,
      description: "Highest annual detection count recorded so far."
    })
  }

  const thresholds = [10, 25, 50, 100]
  for (const threshold of thresholds) {
    if (totalDetections >= threshold) {
      badges.push({
        label: `${threshold}+ Detections`,
        value: `${totalDetections}`,
        description: "Cumulative team detections across all uploaded campaigns."
      })
    }
  }

  return badges
}

export function loadPersistedCampaignSummary(campaignsDir: string): PersistedCampaignSummary | null {
  const summaryPath = path.join(campaignsDir, SUMMARY_FILE_NAME)

  if (!fs.existsSync(summaryPath)) return null

  try {
    const raw = fs.readFileSync(summaryPath, "utf-8")
    const parsed = JSON.parse(raw) as PersistedCampaignSummary

    if (!parsed.milestones?.kenya?.teams || !parsed.milestones?.kenya?.observerNames) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function rebuildCampaignSummary(campaignsDir: string): PersistedCampaignSummary {
  if (!fs.existsSync(campaignsDir)) {
    fs.mkdirSync(campaignsDir, { recursive: true })
  }

  const datasets = listCampaignFiles(campaignsDir).map((file) => {
    const fullPath = path.join(campaignsDir, file)
    const raw = fs.readFileSync(fullPath, "utf-8")
    const dataset = JSON.parse(raw) as CampaignDataset
    return { file, dataset }
  })

  const latestRecord = [...datasets].sort((a, b) => {
    const dateDiff = campaignSortDate(b.dataset).localeCompare(campaignSortDate(a.dataset))
    if (dateDiff !== 0) return dateDiff
    return b.dataset.campaign.localeCompare(a.dataset.campaign)
  })[0]

  const latestFile = latestRecord?.file ?? null

  const campaigns: CampaignSummaryItem[] = datasets
    .map(({ file, dataset }) => {
      const afronautRows = afronautDetections(dataset)
      const observerSet = new Set(afronautRows.flatMap((row) => row.observers).filter(Boolean))

      return {
        file,
        campaign: dataset.campaign,
        start: dataset.start,
        end: dataset.end,
        year: inferCampaignYear(dataset),
        totalObservations: dataset.totalObservations,
        afronautDetections: afronautRows.length,
        uniqueAfronautObservers: observerSet.size,
        sortDate: campaignSortDate(dataset),
        isLatest: file === latestFile
      }
    })
    .sort((a, b) => {
      const dateDiff = b.sortDate.localeCompare(a.sortDate)
      if (dateDiff !== 0) return dateDiff
      return b.campaign.localeCompare(a.campaign)
    })

  const yearlyMap = new Map<string, { detections: number; campaigns: number }>()
  const observerSet = new Set<string>()
  const kenyaObserverSet = new Set<string>()
  const kenyaTeamMap = new Map<string, { detections: number; observers: Set<string> }>()
  let totalDetections = 0
  let campaignsParticipated = 0
  let kenyaTotalDetections = 0

  for (const { dataset } of datasets) {
    const afronautRows = afronautDetections(dataset)
    if (afronautRows.length === 0) continue

    const year = inferCampaignYear(dataset)
    const current = yearlyMap.get(year) ?? { detections: 0, campaigns: 0 }
    current.detections += afronautRows.length
    current.campaigns += 1
    yearlyMap.set(year, current)

    totalDetections += afronautRows.length
    campaignsParticipated += 1

    for (const row of afronautRows) {
      for (const observer of row.observers) {
        if (observer) observerSet.add(observer)
      }
    }
  }

  for (const { dataset } of datasets) {
    for (const row of dataset.observations) {
      if (!isKenyanPriorityTeam(row.team)) continue

      kenyaTotalDetections += 1
      const current = kenyaTeamMap.get(row.team) ?? {
        detections: 0,
        observers: new Set<string>()
      }

      current.detections += 1

      for (const observer of row.observers) {
        if (!observer) continue
        current.observers.add(observer)
        kenyaObserverSet.add(observer)
      }

      kenyaTeamMap.set(row.team, current)
    }
  }

  const yearly = Array.from(yearlyMap.entries())
    .map(([year, value]) => ({
      year,
      detections: value.detections,
      campaigns: value.campaigns
    }))
    .sort((a, b) => a.year.localeCompare(b.year))

  const summary: PersistedCampaignSummary = {
    generatedAt: new Date().toISOString(),
    latestFile,
    campaigns,
    milestones: {
      summary: {
        totalDetections,
        campaignsParticipated,
        activeYears: yearly.length,
        uniqueObservers: observerSet.size
      },
      yearly,
      badges: buildBadges(yearly, totalDetections),
      kenya: {
        totalDetections: kenyaTotalDetections,
        uniqueObservers: kenyaObserverSet.size,
        teams: Array.from(kenyaTeamMap.entries())
          .map(([team, value]) => ({
            team,
            detections: value.detections,
            uniqueObservers: value.observers.size
          }))
          .sort((a, b) => {
            const aPriority = isAfronautTeam(a.team) ? 0 : isSpaceSocietyOfKenya(a.team) ? 1 : 2
            const bPriority = isAfronautTeam(b.team) ? 0 : isSpaceSocietyOfKenya(b.team) ? 1 : 2
            if (aPriority !== bPriority) return aPriority - bPriority
            if (b.detections !== a.detections) return b.detections - a.detections
            return a.team.localeCompare(b.team)
          }),
        observerNames: Array.from(kenyaObserverSet).sort((a, b) => a.localeCompare(b))
      }
    }
  }

  const summaryPath = path.join(campaignsDir, SUMMARY_FILE_NAME)
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))

  return summary
}

export function loadOrRebuildCampaignSummary(campaignsDir: string): PersistedCampaignSummary {
  return loadPersistedCampaignSummary(campaignsDir) ?? rebuildCampaignSummary(campaignsDir)
}
