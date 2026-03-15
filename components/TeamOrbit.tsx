"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const crew = [
  {
    name: "V. Nyambura",
    role: "Mission Lead",
    color: "0,255,170",
    avatar: "/crew/V. Nyambura.webp",
  },
  {
    name: "L. Mwai",
    role: "Data Analyst",
    color: "100,200,255",
    avatar: "/crew/L. Mwai.webp",
  },
  {
    name: "J. Kamau",
    role: "Observer",
    color: "255,150,100",
    avatar: "/crew/J. Kamau.webp",
  },
  {
    name: "M. Ruko",
    role: "Coordinator",
    color: "200,100,255",
    avatar: "/crew/M. Ruko.webp",
  },
  {
    name: "M. Auma",
    role: "Tracker",
    color: "255,200,100",
    avatar: "/crew/M. Auma.webp",
  },
  {
    name: "L. Kipkoech",
    role: "Researcher",
    color: "100,255,200",
    avatar: "/crew/L. Kipkoech.webp",
  },
  {
    name: "B. Kharuba",
    role: "Navigator",
    color: "255,100,200",
    avatar: "/crew/B. Kharuba.webp",
  },
  {
    name: "D. Rosana",
    role: "Systems Lead",
    color: "150,255,100",
    avatar: "/crew/D. Rosana.webp",
  },
];

export default function TeamOrbit() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  const degreePerMember = 360 / crew.length;

  useEffect(() => {
    const startTime = Date.now();
    const duration = 60000;

    const updateRotation = () => {
      const elapsed = Date.now() - startTime;
      const rotation = ((elapsed / duration) * 360) % 360;
      setCurrentRotation(rotation);
    };

    const interval = setInterval(updateRotation, 50);
    return () => clearInterval(interval);
  }, []);

  const depths = crew.map((_, i) => {
    const angle = degreePerMember * i;
    const relativeAngle = (angle + currentRotation) % 360;
    const normalizedAngle =
      relativeAngle > 180 ? relativeAngle - 360 : relativeAngle;

    return Math.cos((normalizedAngle * Math.PI) / 180);
  });

  const frontIndex = depths.indexOf(Math.max(...depths));

  return (
    <div
      className="relative w-full min-h-[620px] md:min-h-[700px] flex items-center justify-center overflow-hidden px-4"
      style={{ perspective: "1200px" }}
    >

      {/* EMERALD COSMIC GLOW */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[760px] h-[760px] rounded-full bg-[radial-gradient(circle,rgba(0,255,156,0.24),rgba(0,255,156,0.08)_36%,transparent_72%)] blur-3xl opacity-70" />
      </div>

      {/* STARFIELD BACKGROUND */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        animate={{ backgroundPosition: ["0px 0px", "1000px 500px"] }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(1px 1px at 40px 70px, white, transparent), radial-gradient(1px 1px at 130px 40px, white, transparent), radial-gradient(2px 2px at 200px 120px, white, transparent)",
          backgroundSize: "300px 300px",
        }}
      />

      <div
        className="relative w-[min(94vw,700px)] h-[min(94vw,700px)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* SWANKY ORBIT RINGS */}
        <motion.div
          className="absolute inset-[6%] rounded-full border border-[rgba(0,255,156,0.42)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ boxShadow: "0 0 22px rgba(0,255,156,0.22), inset 0 0 26px rgba(0,255,156,0.08)" }}
        />
        <motion.div
          className="absolute inset-[6%]"
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#aaffea] shadow-[0_0_12px_rgba(170,255,234,0.95),0_0_22px_rgba(0,255,156,0.55)]" />
        </motion.div>
        <motion.div
          className="absolute inset-[14%] rounded-full border border-dashed border-[rgba(110,255,205,0.36)]"
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ boxShadow: "0 0 18px rgba(110,255,205,0.2)" }}
        />
        <motion.div
          className="absolute inset-[14%]"
          animate={{ rotate: -360 }}
          transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-[#cffff3] shadow-[0_0_10px_rgba(207,255,243,0.9),0_0_18px_rgba(0,255,156,0.45)]" />
        </motion.div>
        <motion.div
          className="absolute inset-[23%] rounded-full border border-[rgba(170,255,228,0.28)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          style={{ boxShadow: "0 0 14px rgba(120,255,204,0.16)" }}
        />
        <motion.div
          className="absolute inset-[23%]"
          animate={{ rotate: 360 }}
          transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#e7fff8] shadow-[0_0_8px_rgba(231,255,248,0.9),0_0_14px_rgba(0,255,156,0.38)]" />
        </motion.div>

        <div className="absolute inset-[33%] rounded-full border border-[rgba(200,255,236,0.2)] bg-[radial-gradient(circle,rgba(0,255,156,0.12),transparent_72%)] shadow-[0_0_24px_rgba(0,255,156,0.22)]" />

        <motion.div
          animate={{ rotateY: currentRotation }}
          transition={{ duration: 0 }}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {crew.map((member, i) => {
            const angle = degreePerMember * i;

            const relativeAngle = (angle + currentRotation) % 360;
            const normalizedAngle =
              relativeAngle > 180 ? relativeAngle - 360 : relativeAngle;

            const depth = depths[i];
            const isFacingForward = Math.abs(normalizedAngle) <= 90;
            const distanceFromFront = Math.abs(normalizedAngle);

            let opacity = 0;

            if (isFacingForward) {
              if (distanceFromFront < 30) {
                opacity = 0.5 + depth * 0.5;
              } else {
                opacity = Math.max(0, (90 - distanceFromFront) / 90) * 0.8;
              }
            }

            const isFrontMost = i === frontIndex && isFacingForward;
            const forwardDepth = Math.max(depth, 0);
            const orbitDistance = 280 + (isFrontMost ? 18 : forwardDepth * 8);
            const scale = 0.92 + forwardDepth * 0.12;
            const lift = isFrontMost ? -4 : 0;

            return (
              <div
                key={member.name}
                className="absolute top-1/2 left-1/2"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${angle}deg) translateZ(${orbitDistance}px) rotateY(-${angle}deg) translate(-50%, -50%)`,
                }}
              >
                <motion.div
                  animate={{
                    rotateY: -currentRotation,
                    opacity,
                    scale,
                    y: lift,
                  }}
                  transition={{
                    rotateY: { duration: 0 },
                    opacity: { duration: 0.15 },
                    scale: { duration: 0.2 },
                    y: { duration: 0.2 },
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    zIndex: Math.round((forwardDepth + 1) * 100),
                  }}
                >
                  <motion.button
                    type="button"
                    onMouseEnter={() => isFacingForward && setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="dashboard-card-soft w-36 sm:w-44 md:w-52 rounded-2xl backdrop-blur-md p-3 sm:p-4 text-center flex flex-col items-center justify-center pointer-events-auto"
                    style={{
                      backfaceVisibility: "hidden",
                      transformOrigin: "center center",
                      borderColor:
                        (hoveredIndex === i || isFrontMost) && isFacingForward
                          ? `rgba(${member.color},0.72)`
                          : "rgba(0,255,156,0.14)",
                      boxShadow:
                        (hoveredIndex === i || isFrontMost) && isFacingForward
                          ? `0 0 16px rgba(${member.color},0.38), 0 0 26px rgba(${member.color},0.18), 0 8px 22px rgba(0,0,0,0.26)`
                          : "0 7px 20px rgba(0,0,0,0.26)",
                    }}
                  >
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={144}
                      height={144}
                      sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 144px"
                      quality={70}
                      className="mx-auto mb-2 h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full object-cover"
                    />

                    <p className="text-[10px] sm:text-[12px] md:text-[13px] font-medium text-white/90 leading-tight">
                      {member.name}
                    </p>

                    <p className="text-[9px] sm:text-[10px] md:text-[11px] text-white/60 leading-none">
                      {member.role}
                    </p>
                  </motion.button>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}