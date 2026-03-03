"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { motionTimings, motionEase } from "@/lib/motion";

export default function ScrollUp() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const fadeStart = 200;   // when fade begins
      const fadeEnd = 600;     // fully visible

      if (scrollTop <= fadeStart) {
        setOpacity(0);
      } else if (scrollTop >= fadeEnd) {
        setOpacity(1);
      } else {
        const progress =
          (scrollTop - fadeStart) / (fadeEnd - fadeStart);
        setOpacity(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{ opacity }}
      initial={{ y: 20 }}
      animate={{ y: opacity > 0 ? 0 : 20 }}
      transition={{ duration: motionTimings.hover, ease: motionEase }}
      className="fixed bottom-8 right-8 z-50 backdrop-blur-md bg-white/5 border border-white/10 p-3 rounded-full hover:bg-white/10 transition-colors"
    >
      <ArrowUp size={18} className="text-[var(--radar-green)]" />
    </motion.button>
  );
}