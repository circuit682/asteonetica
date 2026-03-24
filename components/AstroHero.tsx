'use client';

import React from 'react';

export const AstroHero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen bg-[var(--space-black)] flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Stellar glow orbs */}
        <div className="absolute top-20 right-10 w-32 h-32 sm:w-52 sm:h-52 md:w-72 md:h-72 rounded-full blur-3xl opacity-50 animate-pulse" style={{ backgroundColor: 'rgba(0, 255, 156, 0.22)' }} />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-3xl opacity-40" style={{ backgroundColor: 'rgba(187, 30, 16, 0.18)' }} />
        <div className="absolute top-1/2 left-1/3 w-20 h-20 sm:w-32 sm:h-32 md:w-52 md:h-52 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s', backgroundColor: 'rgba(0, 255, 156, 0.12)' }} />

        {/* Twinkling stars */}
        <div className="absolute w-1 h-1 bg-white rounded-full opacity-60 top-10 left-20 animate-pulse" />
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40 top-32 right-32" />
        <div className="absolute w-1 h-1 bg-white rounded-full opacity-50 bottom-40 right-10 animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="h-px w-6 sm:w-12 bg-gradient-to-r from-transparent to-[var(--radar-green)]" />
          <span className="text-xs font-mono text-[var(--radar-green)] uppercase tracking-widest whitespace-nowrap">
            Deep Space Heritage
          </span>
          <div className="h-px w-6 sm:w-12 bg-gradient-to-l from-transparent to-[var(--radar-green)]" />
        </div>

        {/* Main title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          <span className="bg-gradient-to-r from-[var(--radar-green)] via-white to-[var(--kenyan-red)] bg-clip-text text-transparent">
            Astrophotography
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light mb-3 sm:mb-4 max-w-2xl mx-auto">
          Celestial moments frozen in time. Explore the universe through our collection of
          meticulously captured deep-sky observations.
        </p>

        {/* Secondary descriptor */}
        <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider mb-8 sm:mb-12 font-mono">
          NGC objects • Galaxy systems • Nebular complexes
        </p>

        {/* CTA hint */}
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm font-light animate-bounce">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          <span>Scroll to explore</span>
        </div>
      </div>

      {/* Scroll indicator glow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-10 border rounded-full flex items-start justify-center p-2 z-20" style={{ borderColor: 'rgba(0, 255, 156, 0.45)' }}>
        <div className="w-1 h-2 rounded-full animate-bounce bg-[var(--radar-green)]" />
      </div>
    </section>
  );
};
