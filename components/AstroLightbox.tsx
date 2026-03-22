'use client';

import React, { useState, useCallback } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Transform data for lightbox library
  const slides = images.map((img) => ({
    src: img.highRes,
    alt: img.title,
    title: img.title,
    description: img.description,
  }));

  const handleIndexChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  if (!isOpen) return null;

  return (
    <Lightbox
      slides={slides}
      open={isOpen}
      close={onClose}
      index={currentIndex}
      on={{
        view: ({ index }) => handleIndexChange(index),
      }}
      plugins={[Zoom]}
      carousel={{
        finite: false,
      }}
      zoom={{
        maxZoomPixelRatio: 2,
      }}
      render={{
        slide: ({ slide }) => {
          const currentImage = images[currentIndex];
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
                  {currentImage.subtitle && (
                    <p className="text-sm text-gray-300 mb-3">
                      {currentImage.subtitle}
                    </p>
                  )}

                  {/* Metadata blocks */}
                  <div className="grid grid-cols-2 gap-3 text-xs mt-4 font-mono">
                    {currentImage.metadata.cod && (
                      <div>
                        <span className="text-blue-400">COD:</span>
                        <p className="text-gray-200 truncate">
                          {currentImage.metadata.cod}
                        </p>
                      </div>
                    )}
                    {currentImage.metadata.tel && (
                      <div>
                        <span className="text-blue-400">TEL:</span>
                        <p className="text-gray-200 truncate">
                          {currentImage.metadata.tel}
                        </p>
                      </div>
                    )}
                    {currentImage.metadata.obs && (
                      <div>
                        <span className="text-blue-400">OBS:</span>
                        <p className="text-gray-200 truncate">
                          {currentImage.metadata.obs}
                        </p>
                      </div>
                    )}
                    {currentImage.metadata.mea && (
                      <div>
                        <span className="text-blue-400">MEA:</span>
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
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)',
        },
      }}
    />
  );
};
