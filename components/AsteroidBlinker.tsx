"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const frames = [
  "/training/frames/frame1.jpg",
  "/training/frames/frame2.jpg",
  "/training/frames/frame3.jpg",
  "/training/frames/frame4.jpg"
];
export default function AsteroidBlinker() {

  const [frameIndex,setFrameIndex] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frames.length);
    },400);

    return () => clearInterval(interval);

  },[]);

  return (

    <div className="flex flex-col items-center space-y-6">

      <div className="relative w-[420px] h-[420px] border border-white/10 rounded-lg overflow-hidden">
        <Image
          src={frames[frameIndex]}
          alt="Animated asteroid training frames"
          fill
          sizes="(max-width: 768px) 92vw, 420px"
          quality={70}
          className="object-cover"
        />

      </div>

      <p className="text-white/60 text-sm text-center max-w-md">
        Sequential telescope images are blinked rapidly to reveal moving
        objects. Stars remain fixed while asteroids shift position across
        frames.
      </p>

    </div>

  );
}