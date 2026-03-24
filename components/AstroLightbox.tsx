'use client';

import React, { useMemo, useRef, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
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
      carousel={{
        finite: false,
      }}
      render={{
        slide: ({ slide }) => {
          const currentImage =
            images.find((img) => img.highRes === slide.src) ?? images[0];
          return (
            <div className="relative">
              <PanZoomImage
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                glowColor={currentImage?.glowColor || '#ffffff'}
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

interface PanZoomImageProps {
  src: string;
  alt?: string;
  glowColor: string;
}

const PanZoomImage: React.FC<PanZoomImageProps> = ({ src, alt, glowColor }) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const clampScale = (value: number) => Math.min(4, Math.max(1, value));

  const handleZoomIn = () => {
    setScale((previous) => clampScale(previous + 0.2));
  };

  const handleZoomOut = () => {
    setScale((previous) => {
      const next = clampScale(previous - 0.2);
      if (next === 1) {
        setOffset({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
    setScale((previous) => clampScale(previous + zoomDelta));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    event.stopPropagation();
    setIsDragging(true);
    lastPointRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !lastPointRef.current || scale <= 1) return;

    const deltaX = event.clientX - lastPointRef.current.x;
    const deltaY = event.clientY - lastPointRef.current.y;
    lastPointRef.current = { x: event.clientX, y: event.clientY };

    setOffset((previous) => ({
      x: previous.x + deltaX,
      y: previous.y + deltaY,
    }));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    lastPointRef.current = null;
  };

  const handleDoubleClick = () => {
    setScale((previous) => {
      if (previous > 1) {
        setOffset({ x: 0, y: 0 });
        return 1;
      }
      return 2;
    });
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden touch-none"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 120ms ease-out',
          filter: `drop-shadow(0 0 40px ${glowColor}40)`,
        }}
      />

      <div className="absolute top-4 right-20 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleZoomIn();
          }}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-black/45 text-white/85 hover:bg-black/65"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleZoomOut();
          }}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-black/45 text-white/85 hover:bg-black/65"
          aria-label="Zoom out"
        >
          -
        </button>
      </div>

      <div className="absolute top-4 right-4 rounded border border-white/20 bg-black/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/70">
        Drag to pan • Wheel to zoom
      </div>
    </div>
  );
};
