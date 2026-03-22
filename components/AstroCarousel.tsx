'use client';

import React, { useState, useRef } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Pagination, Navigation, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { AstrophysicsImage } from '@/lib/astrophotography-data';

interface AstroCarouselProps {
  images: AstrophysicsImage[];
  onImageSelect: (image: AstrophysicsImage) => void;
}

export const AstroCarousel: React.FC<AstroCarouselProps> = ({
  images,
  onImageSelect,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
    onImageSelect(images[swiper.activeIndex]);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Main Carousel */}
      <div className="relative w-full h-full z-10">
        <Swiper
          modules={[EffectCube, Pagination, Navigation, Autoplay]}
          effect="cube"
          grabCursor={true}
          cubeEffect={{
            shadow: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: true,
          }}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="w-full h-full"
        >
          {images.map((image) => (
            <SwiperSlide key={image.id} className="flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center p-8">
                {/* Image container with cinematic framing */}
                <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl">
                  {/* Glowing border effect */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${image.glowColor}33 0%, transparent 70%)`,
                      filter: 'blur(20px)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Image */}
                  <Image
                    src={image.imagePath}
                    alt={image.title}
                    fill
                    className="object-cover"
                    priority={activeIndex === images.indexOf(image)}
                    quality={85}
                  />

                  {/* Vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons */}
        <button
          className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40 hover:shadow-lg"
          aria-label="Previous image"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40 hover:shadow-lg"
          aria-label="Next image"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Custom pagination styling */}
      <style jsx>{`
        :global(.swiper-pagination) {
          bottom: 2rem;
          z-index: 30;
        }

        :global(.swiper-pagination-bullet) {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        :global(.swiper-pagination-bullet-active) {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.3);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
        }

        :global(.swiper-button-prev::after),
        :global(.swiper-button-next::after) {
          display: none;
        }
      `}</style>
    </div>
  );
};
