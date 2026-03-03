import OrbitalMark from "@/components/OrbitalMark";
import MethodologyDiagram from "@/components/MethodologyDiagram";
import FooterSection from "@/components/FooterSection";

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
      Asteonetica is a volunteer research team participating in the
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
<FooterSection />
    </main>
   
  );
}