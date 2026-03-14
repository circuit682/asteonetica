"use client";

import Link from "next/link";

type UnderConstructionFallbackProps = {
  sectionName: string;
  details?: string;
};

export default function UnderConstructionFallback({
  sectionName,
  details,
}: UnderConstructionFallbackProps) {
  return (
    <main className="min-h-screen pt-28 px-6 pb-16 text-white">
      <section className="mx-auto max-w-3xl dashboard-card-soft rounded-2xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--radar-green)]">Temporary Service View</p>
        <h1 className="mt-4 text-3xl md:text-4xl font-light text-white/92">{sectionName} is under construction</h1>

        <p className="mt-5 text-sm md:text-base leading-7 text-white/68">
          This section is being refined. You can safely continue exploring the observatory while this route is
          prepared for full release.
        </p>

        {details && <p className="mt-3 text-sm leading-7 text-white/56">{details}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded border border-[var(--radar-green)] bg-[var(--radar-green)]/15 px-4 py-2 text-sm text-[var(--radar-green)] hover:bg-[var(--radar-green)]/25"
          >
            Return Home
          </Link>
          <Link
            href="/dispatch"
            className="rounded border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 hover:bg-white/10"
          >
            Read Dispatch
          </Link>
          <Link
            href="/vault"
            className="rounded border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 hover:bg-white/10"
          >
            Visit Vault
          </Link>
        </div>
      </section>
    </main>
  );
}
