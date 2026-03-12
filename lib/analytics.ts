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

const AFRICAN_COUNTRIES = new Set([
  "algeria",
  "angola",
  "benin",
  "botswana",
  "burkina faso",
  "burundi",
  "cabo verde",
  "cape verde",
  "cameroon",
  "central african republic",
  "chad",
  "comoros",
  "congo",
  "democratic republic of the congo",
  "dr congo",
  "djibouti",
  "egypt",
  "equatorial guinea",
  "eritrea",
  "eswatini",
  "swaziland",
  "ethiopia",
  "gabon",
  "gambia",
  "ghana",
  "guinea",
  "guinea-bissau",
  "ivory coast",
  "cote d'ivoire",
  "kenya",
  "lesotho",
  "liberia",
  "libya",
  "madagascar",
  "malawi",
  "mali",
  "mauritania",
  "mauritius",
  "morocco",
  "mozambique",
  "namibia",
  "niger",
  "nigeria",
  "rwanda",
  "sao tome and principe",
  "senegal",
  "seychelles",
  "sierra leone",
  "somalia",
  "south africa",
  "south sudan",
  "sudan",
  "tanzania",
  "togo",
  "tunisia",
  "uganda",
  "zambia",
  "zimbabwe"
])

const EAST_AFRICAN_COUNTRIES = new Set([
  "burundi",
  "comoros",
  "djibouti",
  "eritrea",
  "ethiopia",
  "kenya",
  "rwanda",
  "somalia",
  "south sudan",
  "sudan",
  "tanzania",
  "uganda"
])

const KENYA_COUNTRIES = new Set(["kenya"])

function normalizeCountryName(value: string): string {
  return value.trim().toLowerCase()
}

function splitCountryField(country: string): string[] {
  return country
    .split(/\/|,|&| and /i)
    .map((part) => part.trim())
    .filter(Boolean)
}

function fieldContainsCountryInSet(country: string, set: Set<string>): boolean {
  return splitCountryField(country).some((name) => set.has(normalizeCountryName(name)))
}

function isAfricanObservation(observation: Observation): boolean {
  return (
    observation.region === "africa" ||
    observation.region === "east_africa" ||
    fieldContainsCountryInSet(observation.country, AFRICAN_COUNTRIES)
  )
}

function africanCountryLabels(observation: Observation): string[] {
  const matches = splitCountryField(observation.country).filter((country) =>
    AFRICAN_COUNTRIES.has(normalizeCountryName(country))
  )

  if (matches.length > 0) {
    return matches
  }

  if (observation.region === "africa" || observation.region === "east_africa") {
    return [observation.country.trim()]
  }

  return []
}

function countrySortPriority(country: string): number {
  if (fieldContainsCountryInSet(country, KENYA_COUNTRIES)) return 0
  if (fieldContainsCountryInSet(country, EAST_AFRICAN_COUNTRIES)) return 1
  return 2
}

function teamSortPriority(entry: { country: string; region: string }): number {
  if (fieldContainsCountryInSet(entry.country, KENYA_COUNTRIES)) return 0
  if (
    entry.region === "east_africa" ||
    fieldContainsCountryInSet(entry.country, EAST_AFRICAN_COUNTRIES)
  ) {
    return 1
  }
  return 2
}

export function afronautDetections(data: CampaignDataset): Observation[] {
  return data.observations.filter((o) => o.team === "Asteroid Afronauts")
}

export function africanDetections(data: CampaignDataset): Observation[] {
  return data.observations.filter((o) => o.region === "africa" || o.region === "east_africa")
}

export function africanOnlyObservations(data: CampaignDataset): Observation[] {
  return data.observations.filter(isAfricanObservation)
}

export function africaTeamLeaderboard(
  data: CampaignDataset
): { team: string; country: string; count: number }[] {
  const counts = africanOnlyObservations(data).reduce<
    Record<string, { team: string; country: string; region: string; count: number }>
  >((acc, o) => {
    if (!acc[o.team]) {
      acc[o.team] = {
        team: o.team,
        country: o.country,
        region: o.region,
        count: 0
      }
    }

    acc[o.team].count += 1
    return acc
  }, {})

  return Object.values(counts)
    .sort((a, b) => {
      const priorityDiff = teamSortPriority(a) - teamSortPriority(b)
      if (priorityDiff !== 0) return priorityDiff
      if (b.count !== a.count) return b.count - a.count
      return a.team.localeCompare(b.team)
    })
    .map(({ team, country, count }) => ({ team, country, count }))
}

export function africaCountryLeaderboard(
  data: CampaignDataset
): { country: string; count: number }[] {
  const counts = africanOnlyObservations(data).reduce<Record<string, number>>((acc, o) => {
    const labels = africanCountryLabels(o)

    for (const country of labels) {
      acc[country] = (acc[country] || 0) + 1
    }

    return acc
  }, {})

  return Object.entries(counts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => {
      const priorityDiff = countrySortPriority(a.country) - countrySortPriority(b.country)
      if (priorityDiff !== 0) return priorityDiff
      if (b.count !== a.count) return b.count - a.count
      return a.country.localeCompare(b.country)
    })
}

export function uniqueAfricanObservers(data: CampaignDataset): string[] {
  const all = africanOnlyObservations(data).flatMap((o) => o.observers)
  return [...new Set(all)].sort()
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
