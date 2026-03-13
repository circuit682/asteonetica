"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSparkle } from "@/lib/SparkleContext";
import { motionTimings } from "@/lib/motion";


const center = 100;
const outerOrbitRadius = 70;
const innerOrbitRadius = 40;
const nodeRadius = 6;

const outerAngles = [0, 60, 120, 180, 240, 300];
const innerAngles = [90, 270];

function polarToCartesian(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;

  const x = center + radius * Math.cos(radians);
  const y = center + radius * Math.sin(radians);

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
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
      className="relative w-52 h-52 md:w-64 md:h-64"
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,255,156,0.22),rgba(0,255,156,0.08)_38%,transparent_68%)] blur-2xl opacity-90" />

      <motion.svg
        viewBox="0 0 200 200"
        className="relative z-10 w-full h-full drop-shadow-[0_0_14px_rgba(0,255,156,0.34)]"
        animate={
          react
            ? { scale: 1.05 }
            : { scale: 1 }
        }
        transition={{ duration: motionTimings.ambient, ease: "linear" }}
      >
        <motion.circle
          cx={center}
          cy={center}
          r={outerOrbitRadius}
          stroke="rgba(130,255,210,0.95)"
          strokeWidth="2"
          fill="none"
          opacity={react ? 1 : 0.78}
        />

        <circle
          cx={center}
          cy={center}
          r={innerOrbitRadius}
          stroke="rgba(120,255,202,0.82)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.55"
        />

        <motion.circle
          cx={center}
          cy={center}
          r="5"
          fill="rgba(204,255,236,1)"
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
              fill="rgba(180,255,228,0.96)"
              opacity="0.95"
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
              fill="rgba(223,255,242,1)"
              opacity="1"
            />
          );
        })}
      </motion.svg>
    </motion.div>
  );
}