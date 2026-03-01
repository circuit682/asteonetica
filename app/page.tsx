import OrbitalMark from "@/components/OrbitalMark";

export default function Home() {
  return (
    <main className="bg-[var(--space-black)] text-white">

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 text-center">
        <OrbitalMark />

        <h1 className="text-4xl md:text-6xl font-extralight leading-tight tracking-tight">
          From Nairobi’s Night Sky <br />
          <span className="opacity-70">
            To Near-Earth Orbit.
          </span>
        </h1>
      </section>

      {/* TRANSITION SECTION */}
      <section className="h-40 bg-gradient-to-b from-transparent to-black/40" />

      {/* CONTENT SECTION */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light mb-8 tracking-wide">
          A Collective in Orbit
        </h2>

        <p className="text-white/70 leading-relaxed text-lg mb-6">
          Asteonetica exists at the intersection of mathematics, art,
          and speculative design. What begins as geometry becomes
          interaction. What begins as interaction becomes narrative.
        </p>

        <p className="text-white/60 leading-relaxed text-lg">
          We design systems that feel celestial — not mechanical.
          Interfaces that move like orbit, not machinery.
          Light that responds like starlight, not LEDs.
        </p>
      </section>

    </main>
  );
}