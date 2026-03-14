"use client";

import { useState } from "react";
import Link from "next/link";
import { Telescope, Globe, Users, Mail } from "lucide-react";
import KenyaFlag from "@/components/KenyaFlag";

type FooterSectionProps = {
  tone?: "default" | "integrated";
};

export default function FooterSection({ tone = "default" }: FooterSectionProps) {
  const [leadersOpen, setLeadersOpen] = useState(false);

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

  const leaders = [
    {
      name: "V. Kihagi",
      role: "Mission Lead",
      focus: "Campaign direction, volunteer onboarding, and mission coordination.",
      email: "veronicakihagi@gmail.com",
      emailSubject: "Message for V. Kihagi - Mission Lead"
    },
    {
      name: "J. Kamau",
      role: "Lead Observer",
      focus: "Frame review guidance, detection workflow, and candidate validation support.",
      email: "kjn4206@gmail.com",
      emailSubject: "Message for J. Kamau - Lead Observer"
    }
  ];

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
                The Team
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

          <button
            type="button"
            onClick={() => setLeadersOpen(true)}
            className="flex w-full items-start gap-3 text-left text-white/60 hover:text-[var(--radar-green)] transition-colors"
          >
            <Users size={18} className="mt-1" />
            <span>Team Leaders</span>
          </button>

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

      {leadersOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <button
            type="button"
            onClick={() => setLeadersOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close team leaders panel"
          />

          <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-[rgba(130,255,210,0.2)] bg-[rgba(7,17,20,0.96)] p-6 md:p-8 shadow-[0_0_30px_rgba(0,255,156,0.14)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--radar-green)]">Connect With Leaders</p>
                <h3 className="mt-3 text-2xl font-light text-white/92">Team Leadership Desk</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  Reach out for campaign support, onboarding guidance, and observatory workflow help.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setLeadersOpen(false)}
                className="rounded border border-white/20 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/65 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {leaders.map((leader) => {
                const composeLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(leader.email)}&su=${encodeURIComponent(leader.emailSubject)}&body=${encodeURIComponent(`Hello ${leader.name},\n\nI would like guidance on:\n\nThank you.`)}`;
                const fallbackMailto = `mailto:${leader.email}?subject=${encodeURIComponent(leader.emailSubject)}`;

                return (
                  <article
                    key={leader.name}
                    className="rounded-xl border border-white/10 bg-black/25 p-4"
                  >
                    <p className="text-white/88 text-base font-light">{leader.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--radar-green)]">{leader.role}</p>
                    <p className="mt-3 text-sm leading-7 text-white/62">{leader.focus}</p>

                    <a
                      href={composeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={fallbackMailto}
                      className="mt-4 inline-flex items-center gap-2 rounded border border-[var(--radar-green)] bg-[var(--radar-green)]/12 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[var(--radar-green)] hover:bg-[var(--radar-green)]/20"
                    >
                      <Mail size={14} />
                      Message Leader
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
    </footer>
   
  );
}