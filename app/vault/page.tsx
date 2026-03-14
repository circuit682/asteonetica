"use client"

import DetectionGuide from "@/components/DetectionGuide"
import TrainingFrames from "@/components/TrainingFrames"
import FooterSection from "@/components/FooterSection"
import UnderConstructionFallback from "@/components/UnderConstructionFallback"
import { useUnderConstruction } from "@/lib/use-under-construction"
import { motion } from "framer-motion"

export default function VaultPage() {
  const vaultUnderConstruction = useUnderConstruction("vault")

  if (vaultUnderConstruction) {
    return <UnderConstructionFallback sectionName="Vault" />
  }

  return (

    <main className="relative min-h-screen px-4 pb-24 sm:px-6">

      <div className="mx-auto max-w-6xl pt-28 md:pt-32">

      {/* INTRO */}
      <section className="mb-14 text-center">
        <motion.h1
          className="text-[var(--radar-green)] text-2xl md:text-4xl font-light uppercase tracking-[0.14em] mb-4 drop-shadow-[0_0_14px_rgba(0,255,156,0.38)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          animate={{ opacity: [0.9, 1, 0.9], textShadow: ["0 0 0 rgba(0,255,156,0)", "0 0 16px rgba(0,255,156,0.38)", "0 0 0 rgba(0,255,156,0)"] }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        >
          Afronaut Initiation
        </motion.h1>
        <motion.p
          className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/70"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          animate={{ opacity: [0.62, 0.74, 0.62], textShadow: ["0 0 0 rgba(0,255,156,0)", "0 0 10px rgba(0,255,156,0.14)", "0 0 0 rgba(0,255,156,0)"] }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.15 }}
        >
          The Vault contains training material for new Afronauts learning
          how to analyze astronomical survey images and detect potential
          asteroid candidates during IASC search campaigns.
        </motion.p>
      </section>

      {/* TRAINING FRAMES */}
      <section className="mb-28">

        <motion.h2
          className="text-3xl font-light text-center mb-10"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          animate={{ textShadow: ["0 0 0 rgba(0,255,156,0)", "0 0 18px rgba(0,255,156,0.2)", "0 0 0 rgba(0,255,156,0)"] }}
        >
          Survey Training Frames
        </motion.h2>

        <TrainingFrames />

      </section>

      {/* VALIDATION GUIDE */}

      <section>

        <h2 className="text-3xl font-light text-center mb-4">
          Detection Validation Guide
        </h2>

        <p className="text-white/55 text-center max-w-xl mx-auto mb-12">
          Before submitting a detection, verify the object meets the
          validation criteria below.
        </p>

        <DetectionGuide />

      </section>

      {/* ASTROMETRICA RESOURCES */}
      <section className="relative mt-20 mb-8 px-2 py-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[680px] h-[680px] rounded-full bg-[radial-gradient(circle,rgba(0,255,170,0.14),transparent_72%)] blur-3xl opacity-45" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <h2 className="text-2xl font-light text-white/90 mb-6 text-center">
            Astrometrica Resources
          </h2>

          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <h3 className="text-[var(--radar-green)] uppercase tracking-[0.16em] text-xs">
                Astrometrica guides
              </h3>
              <p className="text-white/65 leading-relaxed">
                Download and extract the zip file for helpful information on how to use Astrometrica and properly detect asteroids.
              </p>
              <a
                href="https://iasc.cosmosearch.org/Content/Distributables/Quick%20Start%20Guide%20(updated).zip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--radar-green)] hover:opacity-85 transition-opacity underline decoration-[rgba(0,255,156,0.45)] underline-offset-4"
              >
                Quick Start Guide
              </a>
            </div>

            <div className="space-y-3">
              <h3 className="text-[var(--radar-green)] uppercase tracking-[0.16em] text-xs">
                Practice image sets
              </h3>
              <p className="text-white/65 leading-relaxed">
                Download and extract the image sets from zip files to practice using Astrometrica and detecting asteroids.
              </p>
              <a
                href="https://iasc.cosmosearch.org/Content/Distributables/Practice%20Image%20Sets.zip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--radar-green)] hover:opacity-85 transition-opacity underline decoration-[rgba(0,255,156,0.45)] underline-offset-4"
              >
                Practice Image Sets
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-white/60 leading-relaxed">
            For the latest Astrometrica software downloads and complete documentation, visit the official IASC page:
            {" "}
            <a
              href="https://iasc.cosmosearch.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--radar-green)] hover:opacity-85 transition-opacity underline decoration-[rgba(0,255,156,0.45)] underline-offset-4"
            >
              IASC Official Page
            </a>
          </p>
        </div>
      </section>

      <FooterSection />

      </div>
    </main>
  )

}