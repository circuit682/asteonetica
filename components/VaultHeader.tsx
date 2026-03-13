"use client";

import Image from "next/image";
import { useState } from "react";

export default function VaultHeader() {
  const [gifFailed, setGifFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-16">

      {/* Afronaut Symbol */}
      <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
        {gifFailed ? (
          <div className="w-20 h-20 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
            <span className="text-white/30 text-xs text-center leading-tight px-1">Afronaut</span>
          </div>
        ) : (
          <Image
            src="/vault/afronaut-symbol.gif"
            width={80}
            height={80}
            alt="Afronaut mission symbol"
            unoptimized
            onError={() => setGifFailed(true)}
            className="opacity-90 object-contain"
          />
        )}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-light tracking-wide text-white/90 text-center">
        Afronaut Initiation
      </h1>

      {/* IASC Partnership */}
      <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
        {logoFailed ? (
          <div className="w-20 h-20 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
            <span className="text-white/30 text-xs text-center leading-tight px-1">IASC</span>
          </div>
        ) : (
          <Image
            src="/vault/iasc-logo.png"
            width={80}
            height={80}
            alt="International Astronomical Search Collaboration logo"
            onError={() => setLogoFailed(true)}
            className="opacity-80 object-contain"
          />
        )}
      </div>

    </div>
  );
}