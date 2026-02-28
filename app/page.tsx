import OrbitalMark from "@/components/OrbitalMark";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0D17] text-white flex flex-col items-center justify-center gap-10 px-6 text-center">
      
      <OrbitalMark />

      <h1 className="text-3xl md:text-5xl font-light leading-tight">
        From Nairobi’s Night Sky <br />
        <span className="opacity-70">
          To Near-Earth Orbit.
        </span>
      </h1>

    </main>
  );
}