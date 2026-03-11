export interface Observation {
  id: string
  observers: string[]
  team: string
  country: string
  region: string
  status: string
  date: string
  imageSet: string
}

export interface CampaignDataset {
  campaign: string
  start: string
  end: string
  totalObservations: number
  observations: Observation[]
}

export function afronautDetections(data: CampaignDataset): Observation[] {
  return data.observations.filter((o) => o.team === "Asteroid Afronauts")
}

export function africanDetections(data: CampaignDataset): Observation[] {
  return data.observations.filter((o) => o.region === "africa" || o.region === "east_africa")
}

export function detectionsByRegion(
  data: CampaignDataset
): Record<string, number> {
  return data.observations.reduce<Record<string, number>>((acc, o) => {
    acc[o.region] = (acc[o.region] || 0) + 1
    return acc
  }, {})
}

export function teamLeaderboard(
  data: CampaignDataset
): { team: string; count: number }[] {
  const counts = data.observations.reduce<Record<string, number>>((acc, o) => {
    acc[o.team] = (acc[o.team] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .map(([team, count]) => ({ team, count }))
    .sort((a, b) => b.count - a.count)
}

export function countryLeaderboard(
  data: CampaignDataset
): { country: string; count: number }[] {
  const counts = data.observations.reduce<Record<string, number>>((acc, o) => {
    acc[o.country] = (acc[o.country] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
}

export function uniqueObservers(data: CampaignDataset): string[] {
  const all = data.observations.flatMap((o) => o.observers)
  return [...new Set(all)].sort()
}

export function detectionsByDate(
  data: CampaignDataset
): { date: string; count: number }[] {
  const counts = data.observations.reduce<Record<string, number>>((acc, o) => {
    if (o.date) acc[o.date] = (acc[o.date] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
