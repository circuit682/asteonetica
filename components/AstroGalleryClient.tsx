'use client';

import React, { useState } from 'react';
import { AstroCarousel } from '@/components/AstroCarousel';
import { AstroLightbox } from '@/components/AstroLightbox';
import { ASTROPHOTOGRAPHY_IMAGES, AstrophysicsImage } from '@/lib/astrophotography-data';

export const AstroGalleryClient: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageSelect = (image: AstrophysicsImage) => {
    const index = ASTROPHOTOGRAPHY_IMAGES.findIndex((img) => img.id === image.id);
    setSelectedImageIndex(index >= 0 ? index : 0);
  };

  const handleOpenLightbox = () => {
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Carousel section */}
      <section className="relative w-full">
        <AstroCarousel
          images={ASTROPHOTOGRAPHY_IMAGES}
          onImageSelect={handleImageSelect}
        />

        {/* Zoom button overlay */}
        <button
          onClick={handleOpenLightbox}
          className="absolute bottom-8 right-8 z-20 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white text-sm font-mono uppercase tracking-wider border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
          aria-label="Open lightbox zoom view"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
              />
            </svg>
            Zoom
          </span>
        </button>
      </section>

      {/* Image metadata panel */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Current image info */}
          {ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex] && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-2">
                  {ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].title}
                </h2>
                {ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].subtitle && (
                  <p className="text-gray-400 text-lg mb-4">
                    {ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].subtitle}
                  </p>
                )}
                <p className="text-gray-300 leading-relaxed max-w-2xl">
                  {ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].description}
                </p>
              </div>

              {/* Metadata table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-8 border-t border-gray-700">
                {ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].metadata.cod && (
                  <MetadataBlock
                    label="COD"
                    value={ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].metadata.cod}
                    color="blue"
                  />
                )}
                {ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].metadata.obs && (
                  <MetadataBlock
                    label="OBS"
                    value={ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].metadata.obs}
                    color="cyan"
                  />
                )}
                {ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].metadata.mea && (
                  <MetadataBlock
                    label="MEA"
                    value={ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].metadata.mea}
                    color="green"
                  />
                )}
                {ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].metadata.tel && (
                  <MetadataBlock
                    label="TEL"
                    value={ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].metadata.tel}
                    color="purple"
                  />
                )}
                {ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].metadata.ack && (
                  <MetadataBlock
                    label="ACK"
                    value={ASTROPHOTOGRAPHY_IMAGES[selectedImageIndex].metadata.ack}
                    color="yellow"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AstroLightbox
        images={ASTROPHOTOGRAPHY_IMAGES}
        initialIndex={selectedImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};

interface MetadataBlockProps {
  label: string;
  value: string;
  color?: 'blue' | 'cyan' | 'green' | 'purple' | 'yellow';
}

const MetadataBlock: React.FC<MetadataBlockProps> = ({ label, value, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-blue-400',
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className="space-y-2">
      <p className={`text-xs font-mono uppercase tracking-widest ${colorMap[color]}`}>
        {label}
      </p>
      <p className="text-sm text-gray-300 font-light line-clamp-3">{value}</p>
    </div>
  );
};
