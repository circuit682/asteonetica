'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AstroCarousel } from '@/components/AstroCarousel';
import { AstroLightbox } from '@/components/AstroLightbox';
import {
  ASTROPHOTOGRAPHY_OBJECTS,
  AstrophotographyObject,
  AstrophysicsImage,
} from '@/lib/astrophotography-data';

export const AstroGalleryClient: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVersionByObject, setSelectedVersionByObject] = useState<Record<string, number>>(
    () =>
      Object.fromEntries(
        ASTROPHOTOGRAPHY_OBJECTS.map((objectItem) => [objectItem.id, 0]),
      ),
  );

  const displayImages = useMemo(
    () =>
      ASTROPHOTOGRAPHY_OBJECTS.map((objectItem) => {
        const selectedVersionIndex = selectedVersionByObject[objectItem.id] ?? 0;
        return objectItem.versions[selectedVersionIndex] ?? objectItem.versions[0];
      }),
    [selectedVersionByObject],
  );

  const selectedImage = displayImages[selectedImageIndex];
  const selectedObject = useMemo<AstrophotographyObject | null>(
    () =>
      ASTROPHOTOGRAPHY_OBJECTS.find(
        (objectItem) => objectItem.id === selectedImage?.objectId,
      ) ?? null,
    [selectedImage],
  );

  const handleImageSelect = useCallback((image: AstrophysicsImage) => {
    if (lightboxOpen) return;

    const index = displayImages.findIndex((img) => img.id === image.id);
    const nextIndex = index >= 0 ? index : 0;
    setSelectedImageIndex((previous) => (previous === nextIndex ? previous : nextIndex));
  }, [displayImages, lightboxOpen]);

  const handleVersionChange = (objectId: string, versionIndex: number) => {
    setSelectedVersionByObject((prev) => ({
      ...prev,
      [objectId]: versionIndex,
    }));
  };

  const handleOpenLightbox = () => {
    if (displayImages.length === 0) return;
    setLightboxOpen(true);
  };

  useEffect(() => {
    setSelectedImageIndex((previous) => {
      if (displayImages.length === 0) return 0;
      const clamped = Math.min(previous, displayImages.length - 1);
      return clamped === previous ? previous : clamped;
    });
  }, [displayImages.length]);

  return (
    <>
      {/* Unified gallery narrative section */}
      <section className="relative w-full -mt-8 md:-mt-12 pb-12 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(2,10,18,0.72)_24%,rgba(2,10,18,0.94)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(to_bottom,rgba(2,10,18,0),rgba(7,17,24,0.62)_56%,rgba(8,16,24,0.92))]" />

        <div className="relative">
        <AstroCarousel
          images={displayImages}
          onImageSelect={handleImageSelect}
        />

        {/* Zoom button overlay */}
        <button
          onClick={handleOpenLightbox}
          className="absolute bottom-8 right-8 z-20 px-6 py-3 dashboard-card-soft rounded-lg text-white text-sm font-mono uppercase tracking-wider border border-[rgba(0,255,156,0.2)] hover:border-[rgba(0,255,156,0.45)] transition-all duration-300 hover:shadow-xl"
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
        </div>

      {/* Image metadata panel */}
        <div className="relative z-10 px-4 md:px-6">
          <div className="max-w-7xl mx-auto rounded-2xl border border-[rgba(0,255,156,0.14)] bg-[rgba(4,14,22,0.74)] backdrop-blur-md p-6 md:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.34)]">
          {/* Current image info */}
          {selectedImage && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-2">
                  {selectedImage.title}
                </h2>
                {selectedImage.subtitle && (
                  <p className="text-gray-400 text-lg mb-4">
                    {selectedImage.subtitle}
                  </p>
                )}
                <p className="text-gray-300 leading-relaxed max-w-2xl">
                  {selectedImage.description}
                </p>
              </div>

              {selectedObject && selectedObject.versions.length > 1 && (
                <div className="flex flex-wrap gap-2 pb-2 border-b border-[rgba(0,255,156,0.14)]">
                  {selectedObject.versions.map((version, index) => {
                    const isActive =
                      (selectedVersionByObject[selectedObject.id] ?? 0) === index;

                    return (
                      <button
                        key={version.id}
                        type="button"
                        onClick={() => handleVersionChange(selectedObject.id, index)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all duration-200 ${
                          isActive
                            ? 'border-[var(--radar-green)] text-[var(--radar-green)] bg-[rgba(0,255,156,0.1)]'
                            : 'border-[rgba(0,255,156,0.2)] text-white/70 hover:text-white hover:border-[rgba(0,255,156,0.45)]'
                        }`}
                      >
                        {version.versionLabel ?? `Version ${index + 1}`}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Metadata table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-8 border-t border-[rgba(0,255,156,0.22)]">
                {selectedImage.metadata.cod && (
                  <MetadataBlock
                    label="COD"
                    value={selectedImage.metadata.cod}
                    color="radar"
                  />
                )}
                {selectedImage.metadata.obs && (
                  <MetadataBlock
                    label="OBS"
                    value={selectedImage.metadata.obs}
                    color="radarSoft"
                  />
                )}
                {selectedImage.metadata.mea && (
                  <MetadataBlock
                    label="MEA"
                    value={selectedImage.metadata.mea}
                    color="radar"
                  />
                )}
                {selectedImage.metadata.tel && (
                  <MetadataBlock
                    label="TEL"
                    value={selectedImage.metadata.tel}
                    color="radarSoft"
                  />
                )}
                {selectedImage.metadata.ack && (
                  <MetadataBlock
                    label="ACK"
                    value={selectedImage.metadata.ack}
                    color="kenyanRed"
                  />
                )}
              </div>
            </div>
          )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AstroLightbox
        images={displayImages}
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
  color?: 'radar' | 'radarSoft' | 'kenyanRed';
}

const MetadataBlock: React.FC<MetadataBlockProps> = ({ label, value, color = 'radar' }) => {
  const colorMap = {
    radar: 'text-[var(--radar-green)]',
    radarSoft: 'text-[rgba(0,255,156,0.72)]',
    kenyanRed: 'text-[var(--kenyan-red)]',
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
