import OrbitalMark from "@/components/OrbitalMark";
import MethodologyDiagram from "@/components/MethodologyDiagram";
import FooterSection from "@/components/FooterSection";
import CosmicHeroBackdrop from "@/components/cosmic/CosmicHeroBackdrop";
import Link from "next/link";

export default function Home() {
  const sectionLinks = [
    { href: "/afronauts", label: "Afronauts" },
    { href: "/observatory", label: "Observatory" },
    { href: "/vault", label: "Vault" },
    { href: "/dispatch", label: "Dispatch" },
    { href: "/astrophotography", label: "Astrophotography" },
  ];

  return (
    <main className="bg-[var(--space-black)] text-white">
    
    


      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center gap-10 px-6 text-center overflow-hidden">
        <CosmicHeroBackdrop />

        <OrbitalMark />

        <h1 className="relative z-10 text-4xl md:text-6xl font-extralight leading-tight tracking-tight">
          From Nairobi’s Night Sky <br />
          <span className="opacity-70">
            To Near-Earth Orbit.
          </span>
        </h1>
      </section>

      {/* TRANSITION SECTION
      <section className="h-40 bg-gradient-to-b from-transparent to-black/40" /> */}
      <section className="h-40 bg-gradient-to-b from-transparent to-[var(--space-black)]" />

     {/* CONTENT SECTION */}
<section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">

  <h2 className="text-3xl md:text-5xl font-extralight tracking-wide mb-10 text-white/90">
    A Volunteer Research Collective
  </h2>

  <div className="space-y-8 text-lg leading-relaxed">

    <p className="text-white/70">
      Asteroid Afronauts is a volunteer research team participating in the
      <span className="text-white/90"> International Astronomical Search Collaboration (IASC)</span>,
      a global citizen-science initiative focused on the detection of near-Earth objects (NEOs).
    </p>

    <p className="text-white/65">
      Our members analyze astronomical survey data to identify moving
      objects against fixed stellar backgrounds. Using standardized
      measurement tools and verification protocols, we assist in
      preliminary asteroid detection and structured reporting.
    </p>

   <div className="pt-10 grid md:grid-cols-2 gap-12 items-center">

  {/* LEFT — Text */}
  <div>
    <h3 className="text-white/80 uppercase tracking-[0.2em] text-sm mb-6">
      Observation Cycle
    </h3>

    <ul className="space-y-5">
      {[
        "Systematic image blinking and motion tracking",
        "Astrometric measurement and coordinate extraction",
        "Data validation and structured reporting",
        "Peer cross-verification within the team",
      ].map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-4 text-white/65"
        >
          <span className="mt-2 w-2 h-2 rounded-full bg-[var(--radar-green)] shadow-[0_0_8px_var(--radar-green)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>

  {/* RIGHT — Diagram */}
  <div className="flex justify-center">
    <MethodologyDiagram />
  </div>

</div>
    <p className="text-white/60 pt-6">
      Through this structured process, volunteers contribute directly
      to active astronomical research efforts and the broader planetary
      defense community — advancing scientific literacy while supporting
      global asteroid detection initiatives.
    </p>

  </div>

</section>

      <section className="px-6 md:px-12 lg:px-24 pb-16">
        <div className="max-w-4xl mx-auto rounded-2xl border border-[rgba(0,255,156,0.2)] bg-[rgba(4,12,20,0.65)] p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-light tracking-wide text-white/90 mb-2">
            Explore Every Public Section
          </h2>
          <p className="text-white/65 text-sm md:text-base mb-6">
            Jump directly to each section for crawlable internal linking and faster route discovery.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {sectionLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-white/15 px-4 py-3 text-white/85 hover:text-white hover:border-[rgba(0,255,156,0.45)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

<FooterSection />
    </main>
   
  );
}