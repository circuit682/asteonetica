"use client";

import { motion } from "framer-motion";
import { motionTimings, motionEase } from "@/lib/motion";

export default function PageSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: motionTimings.reveal,
        ease: motionEase,
      }}
      className={`max-w-6xl mx-auto px-6 md:px-12 py-24 ${className}`}
    >
      {children}
    </motion.section>
  );
}