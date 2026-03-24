'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AstroOrbitCard } from '@/components/AstroOrbitCard';
import { AstrophysicsImage } from '@/lib/astrophotography-data';

interface AstroCarouselProps {
  images: AstrophysicsImage[];
  onImageSelect: (image: AstrophysicsImage) => void;
}

export const AstroCarousel: React.FC<AstroCarouselProps> = ({
  images,
  onImageSelect,
}) => {
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [autoRotation, setAutoRotation] = useState(0);
  const [manualOffset, setManualOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [momentum, setMomentum] = useState(0);
  const dragXRef = useRef<number | null>(null);
  const dragVelocityRef = useRef(0);
  const lastFrontIndexRef = useRef<number>(-1);
  const momentumTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const degreePerImage = 360 / images.length;
  const imageCount = Math.max(images.length, 1);
  const orbitRotation = autoRotation + manualOffset;
  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1200;

  const normalizeAngle = (angle: number) => {
    let normalized = angle % 360;
    if (normalized > 180) normalized -= 360;
    if (normalized < -180) normalized += 360;
    return normalized;
  };

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    // Auto-scale orbit time from current card count so no manual retuning is needed.
    const imageCount = Math.max(images.length, 1);
    // Match TeamOrbit pacing: 60s over 8 cards => 7.5s per card.
    const msPerCard = 7500;
    const minOrbitDuration = 14000;
    const maxOrbitDuration = 90000;
    const duration = Math.min(
      maxOrbitDuration,
      Math.max(minOrbitDuration, imageCount * msPerCard),
    );
    const startTime = performance.now();
    let animationFrame = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      setAutoRotation((elapsed / duration) * 360);
      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [images.length]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Strong momentum on wheel scroll
    const wheelDelta = event.deltaY * 0.18;
    setManualOffset((previous) => previous - wheelDelta);
    setMomentum(-wheelDelta * 0.8); // Carry momentum into next frame
    
    if (momentumTimeoutRef.current) {
      clearTimeout(momentumTimeoutRef.current);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragXRef.current = event.clientX;
    dragVelocityRef.current = 0;
    setMomentum(0); // Stop momentum on new drag
    
    if (momentumTimeoutRef.current) {
      clearTimeout(momentumTimeoutRef.current);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragXRef.current === null) return;

    const deltaX = event.clientX - dragXRef.current;
    dragVelocityRef.current = deltaX; // Track velocity for momentum on release
    dragXRef.current = event.clientX;
    setManualOffset((previous) => previous + deltaX * 0.42); // Increased from 0.28
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragXRef.current = null;
    // Apply momentum on release (reduced friction)
    setMomentum(dragVelocityRef.current * 0.6);
  };

  const snapToImage = (index: number) => {
    const angle = degreePerImage * index;
    const delta = normalizeAngle(-(angle + orbitRotation));
    setManualOffset((previous) => previous + delta);
    if (images[index]) {
      onImageSelect(images[index]);
    }
  };

  // Apply momentum decay over time
  useEffect(() => {
    if (Math.abs(momentum) < 0.1 || isDragging) {
      setMomentum(0);
      return;
    }

    const decayTimeout = setTimeout(() => {
      setManualOffset((previous) => previous + momentum);
      setMomentum((prev) => prev * 0.92); // Friction coefficient
    }, 16); // ~60fps

    momentumTimeoutRef.current = decayTimeout;
    return () => clearTimeout(decayTimeout);
  }, [momentum, isDragging]);

  const depths = useMemo(
    () =>
      images.map((_, index) => {
        const angle = degreePerImage * index;
        const relativeAngle = (angle + orbitRotation) % 360;
        const normalizedAngle = relativeAngle > 180 ? relativeAngle - 360 : relativeAngle;

        return Math.cos((normalizedAngle * Math.PI) / 180);
      }),
    [images, degreePerImage, orbitRotation],
  );

  const frontIndex = depths.indexOf(Math.max(...depths));

  // Keyboard navigation (arrow keys for quick browsing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        snapToImage((frontIndex + 1) % images.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        snapToImage((frontIndex - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [frontIndex, images.length]);

  // Only update image selection when significantly centered (threshold), not on every frame
  useEffect(() => {
    if (
      frontIndex >= 0 &&
      images[frontIndex] &&
      lastFrontIndexRef.current !== frontIndex
    ) {
      lastFrontIndexRef.current = frontIndex;
      onImageSelect(images[frontIndex]);
    }
  }, [frontIndex, images, onImageSelect]);

  return (
    <div
      className="relative w-full min-h-[700px] md:min-h-[840px] flex items-center justify-center overflow-hidden px-2 md:px-4 touch-none"
      style={{
        perspective: isMobile ? '860px' : isTablet ? '1040px' : '1200px',
        backgroundColor: 'var(--space-black)',
      }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[760px] h-[760px] rounded-full bg-[radial-gradient(circle,rgba(0,255,156,0.2),rgba(0,255,156,0.06)_38%,transparent_72%)] blur-3xl opacity-70" />
      </div>

      <div className="stars-layer pointer-events-none" />

      <div
        className="relative w-[min(100vw,1040px)] h-[min(100vw,860px)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          animate={{ rotateY: orbitRotation }}
          transition={{ duration: 0 }}
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {images.map((image, index) => {
            const angle = degreePerImage * index;
            const relativeAngle = (angle + orbitRotation) % 360;
            const normalizedAngle = relativeAngle > 180 ? relativeAngle - 360 : relativeAngle;

            const depth = depths[index];
            const depthNormalized = (depth + 1) / 2;
            const isFrontMost = index === frontIndex;
            const opacity = 0.24 + depthNormalized * 0.76;

            // Keep orbit tighter on mobile to avoid messy edge crowding.
            const baseDistance = isMobile
              ? Math.min(360, 220 + imageCount * 26)
              : isTablet
                ? Math.min(500, 290 + imageCount * 36)
                : Math.min(620, 320 + imageCount * 44);
            const orbitDistance = baseDistance;
            const scale = 1;

            return (
              <div
                key={image.id}
                className="absolute top-1/2 left-1/2"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${angle}deg) translateZ(${orbitDistance}px) rotateY(-${angle}deg) translate(-50%, -50%)`,
                }}
              >
                <AstroOrbitCard
                  image={image}
                  orbitRotation={orbitRotation}
                  opacity={opacity}
                  scale={scale}
                  depth={depth}
                  isFrontMost={isFrontMost}
                  onClick={() => snapToImage(index)}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
