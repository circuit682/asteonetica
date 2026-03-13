"use client";

import { motion } from "framer-motion";
import FooterSection from "@/components/FooterSection";
import TeamOrbit from "@/components/TeamOrbit";
// This page presents the Afronauts, volunteers who analyze astronomical survey data to identify potential asteroids. It includes a hero section describing the mission, followed by a grid of team roles with descriptions. The TeamOrbit component visually represents the crew members in an orbiting layout. The page emphasizes the collaborative effort of citizen scientists in planetary defense initiatives.
const roles = [
  {
    title: "Mission Lead",
    desc: "Coordinates campaign objectives, ensures alignment with IASC search protocols, and guides the research team during observation cycles.",
  },
  {
    title: "Data Analyst",
    desc: "Examines astronomical survey datasets, identifying moving objects across sequential telescope images.",
  },
  {
    title: "Observer",
    desc: "Carefully inspects image sequences to detect candidate asteroids and other moving celestial objects.",
  },
  {
    title: "Coordinator",
    desc: "Organizes team workflows, observation assignments, and communication during active search campaigns.",
  },
  {
    title: "Tracker",
    desc: "Follows potential asteroid candidates across multiple frames to confirm consistent motion signatures.",
  },
  {
    title: "Researcher",
    desc: "Documents findings, compiles observational notes, and contributes to campaign reporting.",
  },
  {
    title: "Navigator",
    desc: "Assists in verifying orbital motion patterns and interpreting positional changes across image sets.",
  },
  {
    title: "Systems Lead",
    desc: "Maintains tools, data systems, and workflow infrastructure supporting asteroid detection analysis.",
  },
];

export default function AfronautsPage() {
  return (
    <main className="min-h-screen">

  <section className="relative flex flex-col items-center justify-center w-full min-h-screen py-16">

      <h1 className="text-4xl md:text-5xl font-light mb-8 text-white/80 z-30 relative">
        THE CREW
      </h1>

      <TeamOrbit />

    </section>

      {/* HERO */}
      <section className="relative min-h-[65vh] flex items-center justify-center text-center px-6 py-24 overflow-hidden">

{/* subtle background glow */}

  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
    <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,255,170,0.15),transparent_70%)] blur-3xl opacity-40" />
  </div>

<motion.div
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}
viewport={{ once: true }}
className="relative max-w-3xl"

>


<h1 className="text-5xl md:text-6xl font-light tracking-wide mb-8">
  Asteroid Afronauts
</h1>

<p className="text-white/70 text-lg md:text-xl leading-relaxed">
  Volunteers participating in asteroid search campaigns through the
  International Astronomical Search Collaboration (IASC), analyzing
  astronomical survey data to identify potential near-Earth objects.
</p>

<p className="text-white/50 text-sm md:text-base mt-6 max-w-xl mx-auto leading-relaxed">
  Through collaborative observation and careful analysis, Afronauts
  contribute to the global effort of detecting and cataloging
  asteroids within our solar system.
</p>


</motion.div>

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

  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

    {roles.map((role, i) => (
      <motion.div
        key={role.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: i * 0.08
        }}
        viewport={{ once: true }}
        whileHover={{ y: -6, scale: 1.01 }}
        className="dashboard-card p-6 text-center"
      >

        <h3 className="text-white/90 text-sm md:text-base mb-3 tracking-wide">
          {role.title}
        </h3>

        <p className="text-white/60 text-xs md:text-sm leading-relaxed">
          {role.desc}
        </p>

      </motion.div>
    ))}

  </div>

</section>
      <FooterSection />
    </main>
  );
}