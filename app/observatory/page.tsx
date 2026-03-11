"use client"

import { motion } from "framer-motion"
import FooterSection from "@/components/FooterSection"
import data from "@/content/campaigns/janfeb26.json"
import {
  afronautDetections,
  africanDetections,
  teamLeaderboard,
  countryLeaderboard,
  uniqueObservers,
  detectionsByRegion,
  detectionsByDate,
  type CampaignDataset
} from "@/lib/analytics"

const campaign = data as CampaignDataset

const afronauts  = afronautDetections(campaign)
const african    = africanDetections(campaign)
const teams      = teamLeaderboard(campaign)
const countries  = countryLeaderboard(campaign)
const observers  = uniqueObservers(campaign)
const byRegion   = detectionsByRegion(campaign)
const byDate     = detectionsByDate(campaign)

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
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-1"
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
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay ?? 0 }}
      className="flex flex-col gap-1"
    >
      <div className="flex justify-between text-sm">
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
  const total = campaign.totalObservations

  return (
    <main className="min-h-screen">

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-[45vh] text-center px-6 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,255,170,0.12),transparent_70%)] blur-3xl opacity-30" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-2xl"
        >
          <p className="text-[var(--radar-green)] text-xs tracking-[0.3em] uppercase mb-4">
            Analytics Engine
          </p>
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6">
            Observatory
          </h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            Research metrics for the{" "}
            <span className="text-white/90">{campaign.campaign}</span> campaign
            &mdash; {campaign.start} to {campaign.end}
          </p>
        </motion.div>
      </section>

      {/* HEADLINE STATS */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Detections" value={total} />
          <StatCard label="Afronaut Detections" value={afronauts.length} sub={`${Math.round((afronauts.length / total) * 100)}% of campaign`} />
          <StatCard label="Pan-African Detections" value={african.length} sub={`${Math.round((african.length / total) * 100)}% of campaign`} />
          <StatCard label="Unique Observers" value={observers.length} />
        </div>
      </section>

      {/* REGION BREAKDOWN */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto py-10">
        <h2 className="text-xl font-light tracking-wide text-white/60 uppercase mb-6">
          Detections by Region
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(byRegion)
            .sort((a, b) => b[1] - a[1])
            .map(([region, count]) => (
              <StatCard
                key={region}
                label={region.replace("_", " ")}
                value={count}
                sub={`${Math.round((count / total) * 100)}%`}
              />
            ))}
        </div>
      </section>

      {/* TEAM LEADERBOARD */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto py-10">
        <h2 className="text-xl font-light tracking-wide text-white/60 uppercase mb-6">
          Team Leaderboard
        </h2>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-5">
          {teams.map(({ team, count }, i) => (
            <LeaderRow
              key={team}
              rank={i + 1}
              label={team}
              count={count}
              total={total}
              delay={i * 0.06}
            />
          ))}
        </div>
      </section>

      {/* COUNTRY LEADERBOARD */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto py-10">
        <h2 className="text-xl font-light tracking-wide text-white/60 uppercase mb-6">
          Countries
        </h2>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-5">
          {countries.map(({ country, count }, i) => (
            <LeaderRow
              key={country}
              rank={i + 1}
              label={country}
              count={count}
              total={total}
              delay={i * 0.05}
            />
          ))}
        </div>
      </section>

      {/* DETECTIONS TIMELINE */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto py-10">
        <h2 className="text-xl font-light tracking-wide text-white/60 uppercase mb-6">
          Detection Timeline
        </h2>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
          {byDate.map(({ date, count }, i) => (
            <LeaderRow
              key={date}
              rank={i + 1}
              label={date}
              count={count}
              total={total}
              delay={i * 0.05}
            />
          ))}
        </div>
      </section>

      {/* OBSERVER ROSTER */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto py-10">
        <h2 className="text-xl font-light tracking-wide text-white/60 uppercase mb-6">
          Observer Roster &mdash; {observers.length} participants
        </h2>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex flex-wrap gap-3">
            {observers.map((name) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  )
}
