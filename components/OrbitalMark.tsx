"use client";

import { motion } from "framer-motion";

const center = 100;
const orbitRadius = 70;
const nodeRadius = 6;

const nodeAngles = [0, 60, 120, 180, 240, 300];

function polarToCartesian(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

export default function OrbitalMark() {
  return (
    <motion.div
      whileHover={{ rotate: 15 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="w-40 h-40"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Orbit Ring */}
        <circle
          cx={center}
          cy={center}
          r={orbitRadius}
          stroke="white"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />

        {/* Central Star */}
        <circle
          cx={center}
          cy={center}
          r="5"
          fill="white"
        />

        {/* Crew Nodes */}
        {nodeAngles.map((angle, index) => {
          const { x, y } = polarToCartesian(angle, orbitRadius);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={nodeRadius}
              fill="white"
            />
          );
        })}
      </svg>
    </motion.div>
  );
}