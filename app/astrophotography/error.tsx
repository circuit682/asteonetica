'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface AstrophotographyErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AstrophotographyError({
  error,
  reset,
}: AstrophotographyErrorProps) {
  useEffect(() => {
    console.error('Astrophotography route error:', error);
  }, [error]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[var(--space-black)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(0,255,156,0.14),transparent_50%),linear-gradient(to_bottom,rgba(2,8,15,0.86),rgba(2,10,18,0.96))]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[var(--radar-green)]">
          Astrophotography Console
        </p>

        <h1 className="mb-4 text-3xl font-semibold md:text-5xl">
          We hit unexpected orbital interference
        </h1>

        <p className="mb-10 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          The gallery encountered an unexpected runtime issue. Please retry the
          scene, or return to a stable route while we recover.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-[rgba(0,255,156,0.45)] bg-[rgba(0,255,156,0.12)] px-5 py-2.5 text-sm font-medium text-[var(--radar-green)] hover:bg-[rgba(0,255,156,0.2)]"
          >
            Retry Gallery
          </button>

          <Link
            href="/"
            className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            Go Home
          </Link>

          <Link
            href="/observatory"
            className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            Open Observatory
          </Link>
        </div>
      </section>
    </main>
  );
}
