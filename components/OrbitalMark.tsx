"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSparkle } from "@/lib/SparkleContext";

const center = 100;
const outerOrbitRadius = 70;
const innerOrbitRadius = 40;
const nodeRadius = 6;

const outerAngles = [0, 60, 120, 180, 240, 300];
const innerAngles = [90, 270];

function polarToCartesian(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

export default function OrbitalMark() {
  const { sparkleSignal } = useSparkle();
  const [react, setReact] = useState(false);

  useEffect(() => {
    if (sparkleSignal === 0) return;
    setReact(true);
    const timeout = setTimeout(() => setReact(false), 800);
    return () => clearTimeout(timeout);
  }, [sparkleSignal]);

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
      whileHover={{ rotate: 15 }}
      className="w-40 h-40"
    >
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        animate={
          react
            ? { scale: 1.04 }
            : { scale: 1 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.circle
          cx={center}
          cy={center}
          r={outerOrbitRadius}
          stroke="white"
          strokeWidth="2"
          fill="none"
          opacity={react ? 0.9 : 0.6}
        />

        <circle
          cx={center}
          cy={center}
          r={innerOrbitRadius}
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          opacity="0.35"
        />

        <motion.circle
          cx={center}
          cy={center}
          r="5"
          fill="white"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {outerAngles.map((angle, index) => {
          const { x, y } = polarToCartesian(angle, outerOrbitRadius);
          return (
            <circle
              key={`outer-${index}`}
              cx={x}
              cy={y}
              r={nodeRadius}
              fill="white"
              opacity="0.75"
            />
          );
        })}

        {innerAngles.map((angle, index) => {
          const { x, y } = polarToCartesian(angle, innerOrbitRadius);
          return (
            <circle
              key={`inner-${index}`}
              cx={x}
              cy={y}
              r={nodeRadius - 1}
              fill="white"
              opacity="0.95"
            />
          );
        })}
      </motion.svg>
    </motion.div>
  );
}