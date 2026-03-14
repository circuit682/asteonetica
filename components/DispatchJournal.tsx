"use client";

import { motion } from "framer-motion";
import FooterSection from "@/components/FooterSection";
import { motionEase, motionTimings } from "@/lib/motion";
import type { DispatchEntry } from "@/lib/dispatch";

function formatEntryType(type: DispatchEntry["type"]) {
  switch (type) {
    case "campaign-update":
      return "Campaign Update";
    case "discovery-announcement":
      return "Discovery Announcement";
    case "observatory-log":
      return "Observatory Log";
    case "team-highlight":
      return "Team Highlight";
    default:
      return "Dispatch Entry";
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export default function DispatchJournal({ entries }: { entries: DispatchEntry[] }) {
  const featuredEntry = entries.find((entry) => entry.featured) ?? entries[0] ?? null;
  const archiveEntries = featuredEntry
    ? entries.filter((entry) => entry.slug !== featuredEntry.slug)
    : entries;

  return (
    <main className="min-h-screen text-white pt-28 md:pt-32">
      <section className="relative overflow-hidden px-6 pb-16 md:px-12 lg:px-24">
        <div className="absolute inset-x-0 top-0 pointer-events-none flex justify-center">
          <div className="h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(0,255,156,0.2),rgba(0,255,156,0.06)_42%,transparent_72%)] blur-3xl opacity-70" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTimings.reveal, ease: motionEase }}
          className="relative mx-auto max-w-5xl"
        >
          <span className="inline-flex rounded-full border border-[rgba(130,255,210,0.25)] bg-[rgba(6,24,18,0.72)] px-4 py-1 text-[11px] uppercase tracking-[0.34em] text-[var(--radar-green)] shadow-[0_0_18px_rgba(0,255,156,0.12)]">
            Kenya Asteroid Dispatch
          </span>

          <div className="mt-8 space-y-6">
            <h1 className="text-4xl font-extralight leading-tight text-white/92 md:text-6xl">
              The outward voice of the observatory.
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-white/68 md:text-lg">
              Dispatch is where Asteonetica records Kenya asteroid campaigns, asteroid research notes,
              observatory journal entries, and the milestones that give public shape to the work.
              It reads like a research journal, but it functions like an archive.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-10 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl space-y-8">
            {featuredEntry && (
              <motion.article
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: motionEase }}
                className="vault-emerald-tablet relative overflow-hidden rounded-2xl p-7 md:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(145,255,214,0.08),transparent)]" />
                <div className="relative space-y-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/44">
                    <span className="text-[var(--radar-green)]">Featured Dispatch</span>
                    <span>{formatEntryType(featuredEntry.type)}</span>
                    <span>{formatDate(featuredEntry.date)}</span>
                    {featuredEntry.location && <span>{featuredEntry.location}</span>}
                  </div>
                  <h2 className="max-w-3xl text-3xl font-light leading-tight text-white/92 md:text-4xl">
                    {featuredEntry.title}
                  </h2>
                  <p className="max-w-3xl text-base leading-8 text-white/68 md:text-lg">
                    {featuredEntry.summary}
                  </p>
                  <div className="space-y-5 border-t border-white/10 pt-6 text-[15px] leading-8 text-white/70">
                    {featuredEntry.content.split("\n\n").map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {featuredEntry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="emerald-tablet-chip rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            )}

            <div className="space-y-5">
              {archiveEntries.map((entry, index) => (
                <motion.article
                  key={entry.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: motionEase }}
                  className="dashboard-card rounded-2xl p-6 md:p-7"
                >
                  <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/44">
                    <span className="text-[var(--radar-green)]">{formatEntryType(entry.type)}</span>
                    <span>{formatDate(entry.date)}</span>
                    {entry.location && <span>{entry.location}</span>}
                  </div>
                  <h3 className="mt-4 text-2xl font-light text-white/90">{entry.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/64 md:text-base">{entry.summary}</p>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-white/60 md:text-[15px]">
                    {entry.content.split("\n\n").slice(0, 2).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/52"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
