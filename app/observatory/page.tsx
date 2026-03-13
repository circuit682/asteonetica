"use client"

import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import FooterSection from "@/components/FooterSection"
import {
  afronautDetections,
  africanOnlyObservations,
  africaTeamLeaderboard,
  africaCountryLeaderboard,
  uniqueAfricanObservers,
  detectionsByRegion,
  detectionsByDate,
  type CampaignDataset
} from "@/lib/analytics"

type LatestCampaignResponse = {
  success: boolean
  file?: string
  campaign?: CampaignDataset
  error?: string
}

type TeamMilestonesResponse = {
  success: boolean
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
  badges: Array<{
    label: string
    value: string
    description: string
  }>
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

type CampaignHistoryItem = {
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

type CampaignHistoryResponse = {
  success: boolean
  campaigns: CampaignHistoryItem[]
}

function StatCard({
  label,
  value,
  sub
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="dashboard-card p-6 flex flex-col gap-1"
    >
      <span className="text-white/40 text-xs uppercase tracking-widest">{label}</span>
      <span className="text-3xl font-light text-white">{value}</span>
      {sub && <span className="text-white/40 text-xs">{sub}</span>}
    </motion.div>
  )
}

function LeaderRow({
  rank,
  label,
  count,
  total,
  delay
}: {
  rank: number
  label: string
  count: number
  total: number
  delay?: number
}) {
  const pct = Math.round((count / total) * 100)
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ x: 2 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay ?? 0 }}
      className="flex flex-col gap-1 transition-colors duration-200 hover:text-[var(--radar-green)]"
    >
      <div className="flex justify-between text-sm gap-3">
        <span className="text-white/70">
          <span className="text-white/30 mr-2">#{rank}</span>
          {label}
        </span>
        <span className="text-white/50 tabular-nums">{count} &middot; {pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: (delay ?? 0) + 0.2 }}
          className="h-full rounded-full bg-[var(--radar-green)]"
        />
      </div>
    </motion.div>
  )
}

export default function ObservatoryPage() {
  const [campaign, setCampaign] = useState<CampaignDataset | null>(null)
  const [milestones, setMilestones] = useState<TeamMilestonesResponse | null>(null)
  const [history, setHistory] = useState<CampaignHistoryItem[]>([])
  const [selectedYear, setSelectedYear] = useState("All years")
  const [selectedCampaignFile, setSelectedCampaignFile] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadMessage, setLoadMessage] = useState("Loading campaign analytics...")

  useEffect(() => {
    let active = true

    async function loadData() {
      setLoading(true)

      try {
        let hasTeamData = false

        const [latestResponse, milestonesResponse, historyResponse] = await Promise.all([
          fetch("/api/campaign-latest", { cache: "no-store" }),
          fetch("/api/afronauts-milestones", { cache: "no-store" }),
          fetch("/api/campaign-history", { cache: "no-store" })
        ])

        if (!active) return

        if (latestResponse.ok) {
          const latestPayload = (await latestResponse.json()) as LatestCampaignResponse
          setCampaign(latestPayload.campaign ?? null)
        } else {
          setCampaign(null)
        }

        if (milestonesResponse.ok) {
          const milestonesPayload = (await milestonesResponse.json()) as TeamMilestonesResponse
          setMilestones(milestonesPayload)
          hasTeamData = milestonesPayload.summary.totalDetections > 0
        } else {
          setMilestones(null)
        }

        if (historyResponse.ok) {
          const historyPayload = (await historyResponse.json()) as CampaignHistoryResponse
          setHistory(historyPayload.campaigns ?? [])
        } else {
          setHistory([])
        }

        const hasLatestData = latestResponse.ok
        if (!hasTeamData && !hasLatestData) {
          setLoadMessage("No campaign data yet. Upload campaign Excel files in Mission Control to build annual milestones.")
        }
      } catch {
        if (!active) return

        setCampaign(null)
        setMilestones(null)
        setHistory([])
        setLoadMessage("Unable to load campaign analytics right now.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  const historyYears = useMemo(() => {
    return [
      "All years",
      ...Array.from(new Set(history.map((item) => item.year))).filter((year) => year !== "Unknown")
    ]
  }, [history])

  const filteredHistory = useMemo(() => {
    if (selectedYear === "All years") return history
    return history.filter((item) => item.year === selectedYear)
  }, [history, selectedYear])

  useEffect(() => {
    if (filteredHistory.length === 0) {
      setSelectedCampaignFile(null)
      return
    }

    const currentStillVisible = filteredHistory.some((item) => item.file === selectedCampaignFile)
    if (!currentStillVisible) {
      const latestVisible = filteredHistory.find((item) => item.isLatest)
      setSelectedCampaignFile(latestVisible?.file ?? filteredHistory[0].file)
    }
  }, [filteredHistory, selectedCampaignFile])

  const selectedCampaign = useMemo(() => {
    return filteredHistory.find((item) => item.file === selectedCampaignFile) ?? null
  }, [filteredHistory, selectedCampaignFile])

  const total = campaign?.totalObservations ?? 0
  const safeTotal = Math.max(total, 1)

  const afronauts = useMemo(() => {
    return campaign ? afronautDetections(campaign) : []
  }, [campaign])

  const african = useMemo(() => {
    return campaign ? africanOnlyObservations(campaign) : []
  }, [campaign])

  const teams = useMemo(() => {
    return campaign ? africaTeamLeaderboard(campaign) : []
  }, [campaign])

  const countries = useMemo(() => {
    return campaign ? africaCountryLeaderboard(campaign) : []
  }, [campaign])

  const observers = useMemo(() => {
    return campaign ? uniqueAfricanObservers(campaign) : []
  }, [campaign])

  const byRegion = useMemo(() => {
    return campaign ? detectionsByRegion(campaign) : {}
  }, [campaign])

  const byDate = useMemo(() => {
    return campaign ? detectionsByDate(campaign) : []
  }, [campaign])

  const regionEntries = useMemo(() => {
    return Object.entries(byRegion).sort((a, b) => b[1] - a[1])
  }, [byRegion])

  const africanTotal = Math.max(african.length, 1)
  const annualSeries = milestones?.yearly ?? []
  const filteredAnnualSeries = selectedYear === "All years"
    ? annualSeries
    : annualSeries.filter((entry) => entry.year === selectedYear)
  const annualMax = Math.max(1, ...filteredAnnualSeries.map((item) => item.detections))
  const teamSummary = milestones?.summary
  const milestoneBadges = milestones?.badges ?? []
  const kenyaSummary = milestones?.kenya
  const kenyaTeams = kenyaSummary?.teams ?? []
  const kenyaObserverNames = kenyaSummary?.observerNames ?? []
  const kenyaTeamCardClassName = (teamName: string) => {
    const normalized = teamName.toLowerCase()
    if (normalized.includes("asteroid afronauts")) {
      return "dashboard-card kenya-team-card-primary p-6 flex flex-col gap-2"
    }
    if (normalized.includes("space society of kenya")) {
      return "dashboard-card kenya-team-card-secondary p-6 flex flex-col gap-2"
    }
    return "dashboard-card p-6 flex flex-col gap-2"
  }
  const teamDataReady = Boolean(teamSummary && teamSummary.totalDetections > 0)
  const latestHistoryCampaign = history.find((item) => item.isLatest) ?? null

  return (
    <main className="min-h-screen">
      <section className="relative flex flex-col items-center justify-center min-h-[45vh] text-center px-6 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,255,170,0.12),transparent_70%)] blur-3xl opacity-30" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-3xl"
        >
          <p className="text-[var(--radar-green)] text-xs tracking-[0.3em] uppercase mb-4">
            Asteroid Afronauts (Kenya) Milestones
          </p>
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6">
            Observatory
          </h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            Annual detections and campaign progress for Asteroid Afronauts (Kenya), aggregated across every uploaded campaign dataset.
          </p>
          {latestHistoryCampaign && (
            <p className="text-white/45 text-sm mt-5">
              Latest campaign in view: <span className="text-white/75">{latestHistoryCampaign.campaign}</span> · {latestHistoryCampaign.end || latestHistoryCampaign.start}
            </p>
          )}
        </motion.div>
      </section>

      {!teamDataReady && (
        <section className="px-6 md:px-12 max-w-6xl mx-auto pb-2">
          <div className="dashboard-card p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--radar-green)] mb-2">
              Team Dashboard Status
            </p>
            <p className="text-white/65 text-sm">
              {loading ? "Loading campaign analytics..." : loadMessage}
            </p>
          </div>
        </section>
      )}

      <section className="px-6 md:px-12 max-w-5xl mx-auto py-10">
        <h2 className="text-xl font-light tracking-wide text-white/70 uppercase mb-6">
          Asteroid Afronauts (Kenya) Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Detections" value={teamSummary?.totalDetections ?? "--"} />
          <StatCard label="Campaigns Participated" value={teamSummary?.campaignsParticipated ?? "--"} />
          <StatCard label="Active Years" value={teamSummary?.activeYears ?? "--"} />
          <StatCard label="Unique Team Observers" value={teamSummary?.uniqueObservers ?? "--"} />
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-6xl mx-auto py-4">
        <div className="dashboard-card p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
            <h2 className="text-xl font-light tracking-wide text-white/70 uppercase">
              Milestone Badges
            </h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {milestoneBadges.length > 0 ? milestoneBadges.map((badge) => (
              <div key={`${badge.label}-${badge.value}`} className="rounded-xl border border-[rgba(0,255,156,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <p className="text-[var(--radar-green)] text-xs uppercase tracking-[0.2em] mb-2">{badge.label}</p>
                <p className="text-white text-lg font-light mb-2">{badge.value}</p>
                <p className="text-white/45 text-xs leading-relaxed">{badge.description}</p>
              </div>
            )) : (
              <p className="text-sm text-white/50">Milestone badges will appear after team detections are available.</p>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-6xl mx-auto py-8">
        <div className="dashboard-card p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <h2 className="text-xl font-light tracking-wide text-white/70 uppercase">
              Kenyan Teams Pulse
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <StatCard
              label="Kenya Combined Detections"
              value={kenyaSummary?.totalDetections ?? "--"}
              sub="Asteroid Afronauts + Space Society of Kenya"
            />

            {kenyaTeams.map((team) => (
              <motion.div
                key={team.team}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3, scale: 1.01 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className={kenyaTeamCardClassName(team.team)}
              >
                <span className="text-white/40 text-xs uppercase tracking-widest">Kenyan Team</span>
                <span className="text-white text-xl font-light">{team.team}</span>
                <span className="text-[var(--radar-green)] text-3xl font-light">{team.detections}</span>
                <span className="text-white/40 text-xs">{team.uniqueObservers} unique observers</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-6xl mx-auto py-10">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
          <h2 className="text-xl font-light tracking-wide text-white/70 uppercase">
            Annual Trend And Drill-down
          </h2>
          <div className="flex flex-wrap gap-2">
            {historyYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                  selectedYear === year
                    ? "border border-[var(--radar-green)] bg-[rgba(0,255,156,0.14)] text-[var(--radar-green)]"
                    : "border border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white/75"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-8 items-stretch">
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-light tracking-wide text-white/60 uppercase mb-6">
              Annual Detections
            </h3>
            <div className="dashboard-card p-6 flex flex-col gap-4 flex-1">
              {filteredAnnualSeries.length > 0 ? filteredAnnualSeries.map((entry, i) => (
                <LeaderRow
                  key={entry.year}
                  rank={i + 1}
                  label={`${entry.year} · ${entry.campaigns} campaign${entry.campaigns > 1 ? "s" : ""}`}
                  count={entry.detections}
                  total={annualMax}
                  delay={i * 0.05}
                />
              )) : (
                <p className="text-sm text-white/50">No annual milestones available for this filter.</p>
              )}
            </div>
          </div>

          <div className="h-full flex flex-col">
            <h3 className="text-lg font-light tracking-wide text-white/60 uppercase mb-6">
              Campaign History
            </h3>
            <div className="dashboard-card p-6 flex flex-col gap-3 flex-1">
              {filteredHistory.length > 0 ? filteredHistory.map((item, i) => (
                <motion.button
                  key={`${item.file}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                  onClick={() => setSelectedCampaignFile(item.file)}
                  className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                    selectedCampaignFile === item.file
                      ? "border-[rgba(0,255,156,0.35)] bg-[rgba(0,255,156,0.08)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <p className="text-white/80 truncate">{item.campaign}</p>
                    <span className="text-[var(--radar-green)] text-xs uppercase tracking-wider">{item.year}</span>
                  </div>
                  <p className="text-white/45 text-xs mt-1">
                    Team detections: {item.afronautDetections} · Total observations: {item.totalObservations}
                  </p>
                  {item.isLatest && (
                    <p className="text-[var(--radar-green)]/80 text-[10px] uppercase tracking-[0.2em] mt-2">
                      Latest campaign by chronology
                    </p>
                  )}
                </motion.button>
              )) : (
                <p className="text-sm text-white/50">No campaign history available for this filter.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 dashboard-card p-6">
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
            <h3 className="text-lg font-light tracking-wide text-white/65 uppercase">
              Campaign Drill-down
            </h3>
            {selectedCampaign?.isLatest && (
              <p className="text-[var(--radar-green)] text-xs uppercase tracking-[0.2em]">
                Chronological latest campaign
              </p>
            )}
          </div>

          {selectedCampaign ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Campaign</p>
                <p className="text-white/85 text-lg font-light">{selectedCampaign.campaign}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Date Range</p>
                <p className="text-white/75 text-sm">{selectedCampaign.start} to {selectedCampaign.end}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Team Detections</p>
                <p className="text-white/85 text-lg font-light">{selectedCampaign.afronautDetections}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Team Observers</p>
                <p className="text-white/85 text-lg font-light">{selectedCampaign.uniqueAfronautObservers}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/50">Select a campaign to inspect its details.</p>
          )}
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-6xl mx-auto py-10 opacity-85">
        <div className="flex items-baseline justify-between gap-4 mb-8 flex-wrap">
          <h2 className="text-xl font-light tracking-wide text-white/55 uppercase">
            Global Context (Latest Campaign)
          </h2>
        </div>

        {!campaign && (
          <div className="dashboard-card p-5 mb-8">
            <p className="text-sm text-white/55">Latest campaign view unavailable right now.</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Detections" value={campaign ? total : "--"} />
          <StatCard label="Afronaut Detections" value={campaign ? afronauts.length : "--"} sub={campaign ? `${Math.round((afronauts.length / safeTotal) * 100)}% of campaign` : "Awaiting import"} />
          <StatCard label="Pan-African Detections" value={campaign ? african.length : "--"} sub={campaign ? `${Math.round((african.length / safeTotal) * 100)}% of campaign` : "Awaiting import"} />
          <StatCard label="Unique Observers" value={campaign ? observers.length : "--"} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch mb-10">
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-light tracking-wide text-white/50 uppercase mb-6">
              Detections by Region
            </h3>
            <div className="dashboard-card p-6 flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full content-start">
                {regionEntries.length > 0 ? regionEntries.map(([region, count]) => (
                  <StatCard
                    key={region}
                    label={region.replace("_", " ")}
                    value={count}
                    sub={`${Math.round((count / safeTotal) * 100)}%`}
                  />
                )) : (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={`region-skeleton-${i}`} className="rounded-xl border border-white/10 bg-white/[0.03] h-[108px] animate-pulse" />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="h-full flex flex-col">
            <h3 className="text-lg font-light tracking-wide text-white/50 uppercase mb-6">
              Detection Timeline
            </h3>
            <div className="dashboard-card p-6 flex flex-col gap-4 flex-1">
              {byDate.length > 0 ? byDate.map(({ date, count }, i) => (
                <LeaderRow
                  key={date}
                  rank={i + 1}
                  label={date}
                  count={count}
                  total={safeTotal}
                  delay={i * 0.05}
                />
              )) : (
                <p className="text-sm text-white/50">No timeline data yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-light tracking-wide text-white/50 uppercase mb-6">
              Team Leaderboard
            </h3>
            <div className="dashboard-card p-6 flex flex-col gap-5 flex-1">
              {teams.length > 0 ? teams.map(({ team, country, count }, i) => (
                <LeaderRow
                  key={team}
                  rank={i + 1}
                  label={`${team} (${country})`}
                  count={count}
                  total={africanTotal}
                  delay={i * 0.06}
                />
              )) : (
                <p className="text-sm text-white/50">No African team data available yet.</p>
              )}
            </div>
          </div>

          <div className="h-full flex flex-col">
            <h3 className="text-lg font-light tracking-wide text-white/50 uppercase mb-6">
              African Countries
            </h3>
            <div className="dashboard-card p-6 flex flex-col gap-5 flex-1">
              {countries.length > 0 ? countries.map(({ country, count }, i) => (
                <LeaderRow
                  key={country}
                  rank={i + 1}
                  label={country}
                  count={count}
                  total={africanTotal}
                  delay={i * 0.05}
                />
              )) : (
                <p className="text-sm text-white/50">No African country data available yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-6xl mx-auto py-12">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-8">
          <h2 className="text-xl font-light tracking-wide text-white/65 uppercase">
            Kenyan Observer Registry
          </h2>
        </div>

        {kenyaObserverNames.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {kenyaObserverNames.map((name, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: index * 0.02 }}
                className="emerald-tablet-chip rounded-full px-4 py-2 text-sm text-[rgba(195,255,228,0.92)]"
              >
                <span className="tracking-wide">{name}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="dashboard-card p-5">
            <p className="text-sm text-white/50">Observer names will appear once Kenyan team detections are available in uploaded campaigns.</p>
          </div>
        )}
      </section>

      <FooterSection />
    </main>
  )
}
