"use client";

import { motion } from "framer-motion";
import FooterSection from "@/components/FooterSection";
import TeamOrbit from "@/components/TeamOrbit";

export default function AfronautsPage() {
  return (
    <main className="min-h-screen">


            {/* TEAM ORBIT */}
{/* <section className="py-30 ">
  <h2 className="text-3xl md:text-4xl font-light text-center mb-20 tracking-wide">
    The Crew
  </h2>
</section>
 <TeamOrbit /> */}
  <section className="relative flex flex-col items-center justify-center w-full min-h-screen py-16">

      <h1 className="text-4xl md:text-5xl font-light mb-8 text-white/80 z-30 relative">
        THE CREW
      </h1>

      <TeamOrbit />

    </section>

      {/* HERO */}
      <section className="min-h-[60vh] flex items-center justify-center text-center px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-8">
            The Afronauts
          </h1>

          <p className="text-white/70 text-lg md:text-xl leading-relaxed">
            Volunteers participating in asteroid search campaigns through
            the International Astronomical Search Collaboration (IASC),
            analyzing astronomical survey data to identify potential
            near-Earth objects.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light mb-8 tracking-wide text-center">
          The Mission
        </h2>

        <p className="text-white/70 leading-relaxed text-lg mb-6">
          Afronauts are volunteers trained to analyze astronomical image
          datasets provided through the International Astronomical Search
          Collaboration. By examining sequential telescope images,
          participants identify moving objects that may represent
          asteroids within our solar system.
        </p>

        <p className="text-white/60 leading-relaxed text-lg">
          This work contributes to the global effort of detecting and
          cataloging near-Earth objects, strengthening planetary defense
          initiatives while expanding participation in citizen science
          across Africa.
        </p>
      </section>


      {/* TEAM CARDS */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light mb-12 text-center tracking-wide">
          Research Team
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {["Observer", "Data Analyst", "Campaign Coordinator"].map((role) => (
            <motion.div
              key={role}
              whileHover={{ y: -8 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8 text-center"
            >
              <h3 className="text-lg text-white/90 mb-3">{role}</h3>

              <p className="text-white/60 text-sm">
                Volunteer researchers participating in asteroid detection
                campaigns and astronomical image analysis.
              </p>
            </motion.div>
          ))}

        </div>
      </section>
      <FooterSection />
    </main>
  );
}