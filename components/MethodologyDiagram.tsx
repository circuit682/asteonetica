"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { motionTimings, motionEase } from "@/lib/motion";


const steps = 4;
const center = 100;
const radius = 70;

export default function MethodologyDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.6 });
  const [activeIndex, setActiveIndex] = useState(0);

  // Sequential lighting effect
  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps);
    }, 1200);

    return () => clearInterval(interval);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: motionTimings.reveal, ease: motionEase }}
      className="relative w-48 md:w-56 lg:w-64 aspect-square"
    >
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 40,
          ease: "linear",
        }}
      >
        {/* Nodes Only — No Outer Ring */}

        {[0, 90, 180, 270].map((angle, index) => {
          const radians = (angle * Math.PI) / 180;
          const x = center + radius * Math.cos(radians);
          const y = center + radius * Math.sin(radians);

          const isActive = index === activeIndex;

          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="7"
              fill={isActive ? "var(--radar-green)" : "white"}
              animate={{
                scale: isActive ? 1.3 : 1,
                opacity: isActive ? 1 : 0.5,
              }}
              transition={{ duration: motionTimings.reveal, ease: motionEase }}
            />
          );
        })}

        {/* Center Anchor */}
        <circle
          cx="100"
          cy="100"
          r="5"
          fill="white"
          opacity="0.8"
        />
      </motion.svg>
    </motion.div>
  );
}