"use client";

import Link from "next/link";
import { Telescope, Globe, Users, Mail } from "lucide-react";
import KenyaFlag from "@/components/KenyaFlag";

type FooterSectionProps = {
  tone?: "default" | "integrated";
};

export default function FooterSection({ tone = "default" }: FooterSectionProps) {
  const atmosphereClassName =
    tone === "integrated"
      ? "absolute inset-0 bg-gradient-to-b from-transparent via-[#081018]/24 to-[#081018]/48"
      : "absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90";

  const volunteerEmail = "veronicakihagi@gmail.com";
  const volunteerSubject = "Volunteer Application - Asteroid Afronauts Kenya";
  const volunteerBody = [
    "Hello Veronica,",
    "",
    "I would like to volunteer with Asteroid Afronauts Kenya.",
    "",
    "Name:",
    "Location:",
    "Background/Skills:",
    "Availability:",
    "Why I want to join:",
    "",
    "Thank you."
  ].join("\r\n");

  const volunteerGmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(volunteerEmail)}&su=${encodeURIComponent(volunteerSubject)}&body=${encodeURIComponent(volunteerBody)}`;
  const volunteerMailto = `mailto:${volunteerEmail}?subject=${encodeURIComponent(volunteerSubject)}&body=${encodeURIComponent(volunteerBody)}`;

  return (
    <footer className="relative mt-40 overflow-hidden">

      {/* Atmospheric Gradient */}
      <div className={atmosphereClassName} />

      {/* Subtle Starfield Background */}
      <div className={`absolute inset-0 pointer-events-none ${tone === "integrated" ? "opacity-60" : "opacity-100"}`}>
        <div className="stars-layer" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-20 grid md:grid-cols-3 gap-16 text-sm">

        {/* Identity */}
        <div className="space-y-6">
          <h4 className="text-white/90 tracking-widest font-light text-lg">
            Asteroid Afronauts Kenya
          </h4>

          <div className="flex items-start gap-3 text-white/60">
            <Telescope size={18} className="text-[var(--radar-green)] mt-1" />
            <span>Volunteer asteroid detection research</span>
          </div>

          <div className="flex items-start gap-3 text-white/60">
            <Globe size={18} className="text-[var(--radar-green)] mt-1" />
            <span>Participant in IASC global campaigns</span>
          </div>

          <div className="flex items-center gap-3 text-white/60">
            <KenyaFlag className="w-6 h-4" />
            <span>Nairobi, Kenya</span>
          </div>
        </div>

        {/* Explore */}
        <div className="space-y-6">
          <h5 className="text-white/80 uppercase tracking-[0.2em] text-xs">
            Explore
          </h5>

          <ul className="space-y-3 text-white/60">
            <li>
              <Link href="/afronauts" className="hover:text-[var(--radar-green)] transition-colors">
                Afronauts
              </Link>
            </li>
            <li>
              <Link href="/observatory" className="hover:text-[var(--radar-green)] transition-colors">
                Observatory
              </Link>
            </li>
            <li>
              <Link href="/vault" className="hover:text-[var(--radar-green)] transition-colors">
                Vault
              </Link>
            </li>
            <li>
              <Link href="/dispatch" className="hover:text-[var(--radar-green)] transition-colors">
                Dispatch
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div className="space-y-6">
          <h5 className="text-white/80 uppercase tracking-[0.2em] text-xs">
            Connect
          </h5>

          <div className="flex items-start gap-3 text-white/60 hover:text-[var(--radar-green)] transition-colors cursor-pointer">
            <Users size={18} className="mt-1" />
            <span>Team Leaders</span>
          </div>

          <a
            href={volunteerGmailCompose}
            target="_blank"
            rel="noopener noreferrer"
            title={volunteerMailto}
            className="flex items-start gap-3 text-white/60 hover:text-[var(--radar-green)] transition-colors"
          >
            <Mail size={18} className="mt-1" />
            <span>Volunteer With Us</span>
          </a>

          <a
            href={volunteerMailto}
            className="block pl-8 text-[11px] text-white/45 hover:text-[var(--radar-green)] transition-colors"
          >
            Not using Gmail? Open in mail app
          </a>

          <div className="pt-2">
            <a
              href="https://iasc.cosmosearch.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--radar-green)] hover:opacity-80 transition-opacity text-xs"
            >
              Visit IASC Official Site →
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 text-center text-white/30 text-xs pb-12">
        © {new Date().getFullYear()} Asteroid Afronauts Kenya — Volunteer Astronomy Research Collective · Kenya
      </div>
      
    </footer>
   
  );
}