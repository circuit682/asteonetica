import OrbitalMark from "@/components/OrbitalMark";

export default function Home() {
  return (
    <main className="bg-[var(--space-black)] text-white">
      
      {/* Hero Section */}
     <section className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 text-center pt-24">
        
        <OrbitalMark />

        <h1 className="text-4xl md:text-6xl font-extralight leading-tight tracking-tight">
          From Nairobi’s Night Sky <br />
          <span className="opacity-70">
            To Near-Earth Orbit.
          </span>
        </h1>

      </section>


      {/* Temporary Scroll Section */}

      <section className="h-screen flex items-center justify-center text-white/40">
  <p>Future Content Section</p>
</section>

    </main>
  );
}