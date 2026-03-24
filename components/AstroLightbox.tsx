'use client';

import React, { useMemo } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { AstrophysicsImage } from '@/lib/astrophotography-data';

interface AstroLightboxProps {
  images: AstrophysicsImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const AstroLightbox: React.FC<AstroLightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const safeIndex = Math.max(0, Math.min(initialIndex, Math.max(images.length - 1, 0)));

  // Transform data for lightbox library
  const slides = useMemo(
    () =>
      images.map((img) => ({
        src: img.highRes,
        alt: img.title,
        title: img.title,
        description: img.description,
      })),
    [images],
  );

  if (!isOpen) return null;

  return (
    <Lightbox
      slides={slides}
      open={isOpen}
      close={onClose}
      index={safeIndex}
      plugins={[Zoom]}
      carousel={{
        finite: false,
      }}
      zoom={{
        maxZoomPixelRatio: 2,
      }}
      render={{
        slide: ({ slide }) => {
          const currentImage =
            images.find((img) => img.highRes === slide.src) ?? images[0];
          return (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-contain"
                style={{
                  filter: `drop-shadow(0 0 40px ${currentImage?.glowColor || '#ffffff'}40)`,
                }}
              />

              {/* Metadata overlay */}
              {currentImage && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white"
                  style={{
                    borderTop: `2px solid ${currentImage.glowColor}`,
                  }}
                >
                  <h3 className="text-2xl font-bold mb-2">{currentImage.title}</h3>
                  {currentImage.versionLabel && (
                    <p className="text-xs uppercase tracking-widest text-[var(--radar-green)] mb-2">
                      {currentImage.versionLabel}
                    </p>
                  )}
                  {currentImage.subtitle && (
                    <p className="text-sm text-gray-300 mb-3">
                      {currentImage.subtitle}
                    </p>
                  )}

                  {/* Metadata blocks */}
                  <div className="grid grid-cols-2 gap-3 text-xs mt-4 font-mono">
                    {currentImage.metadata.cod && (
                      <div>
                        <span className="text-[var(--radar-green)]">COD:</span>
                        <p className="text-gray-200 truncate">
                          {currentImage.metadata.cod}
                        </p>
                      </div>
                    )}
                    {currentImage.metadata.tel && (
                      <div>
                        <span className="text-[var(--radar-green)]">TEL:</span>
                        <p className="text-gray-200 truncate">
                          {currentImage.metadata.tel}
                        </p>
                      </div>
                    )}
                    {currentImage.metadata.obs && (
                      <div>
                        <span className="text-[var(--radar-green)]">OBS:</span>
                        <p className="text-gray-200 truncate">
                          {currentImage.metadata.obs}
                        </p>
                      </div>
                    )}
                    {currentImage.metadata.mea && (
                      <div>
                        <span className="text-[var(--radar-green)]">MEA:</span>
                        <p className="text-gray-200 truncate">
                          {currentImage.metadata.mea}
                        </p>
                      </div>
                    )}
                  </div>

                  {currentImage.metadata.ack && (
                    <p className="text-xs text-gray-400 mt-3 italic border-t border-gray-600 pt-3">
                      ACK: {currentImage.metadata.ack}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        },
      }}
      styles={{
        container: {
          backgroundColor: 'rgba(11, 13, 23, 0.95)',
          backdropFilter: 'blur(8px)',
        },
      }}
    />
  );
};
