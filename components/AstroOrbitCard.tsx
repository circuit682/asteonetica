'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AstrophysicsImage } from '@/lib/astrophotography-data';

interface AstroOrbitCardProps {
  image: AstrophysicsImage;
  orbitRotation: number;
  opacity: number;
  scale: number;
  depth: number;
  isFrontMost: boolean;
  onClick: () => void;
}

export const AstroOrbitCard: React.FC<AstroOrbitCardProps> = ({
  image,
  orbitRotation,
  opacity,
  scale,
  depth,
  isFrontMost,
  onClick,
}) => {
  const aspectRatio = '1 / 1';

  const cardWidthClass = 'w-36 sm:w-44 md:w-52';
  const imageSizes = '(max-width: 640px) 144px, (max-width: 768px) 176px, 208px';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      animate={{
        rotateY: -orbitRotation,
        opacity,
        scale,
      }}
      transition={{
        rotateY: { duration: 0 },
        opacity: { duration: 0.05 },
        scale: { duration: 0.05 },
      }}
      style={{
        transformStyle: 'preserve-3d',
        zIndex: Math.round((depth + 1) * 100),
        borderColor: isFrontMost
          ? 'rgba(0,255,156,0.5)'
          : 'rgba(0,255,156,0.12)',
        boxShadow: isFrontMost
          ? `0 0 16px ${image.glowColor ?? '#00FF9C'}55, 0 10px 22px rgba(0,0,0,0.34)`
          : '0 6px 14px rgba(0,0,0,0.26)',
      }}
      className={`${cardWidthClass} overflow-hidden rounded-[1rem] border bg-black/10 text-left`}
      aria-label={`Focus ${image.title}`}
    >
      <div className="relative w-full overflow-hidden bg-black/80" style={{ aspectRatio }}>
        <Image
          src={image.imagePath}
          alt={image.title}
          fill
          quality={86}
          sizes={imageSizes}
          className="object-fill"
        />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_38%,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_34%,rgba(0,0,0,0.1)_72%,rgba(0,0,0,0.2)_100%)]" />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_14px_20px_rgba(255,255,255,0.08),inset_0_-20px_28px_rgba(0,0,0,0.3),inset_14px_0_22px_rgba(0,0,0,0.18),inset_-14px_0_22px_rgba(0,0,0,0.18)]" />
        <div className="absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-[#020912]/86 to-transparent" />
        <div className="absolute left-4 bottom-3.5 right-4 flex flex-col gap-0.5">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.14em] text-white/92 truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
            {image.title}
          </p>
          {image.versionLabel && (
            <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--radar-green)] truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.72)]">
              {image.versionLabel}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
};
