"use client";

import { motion } from "framer-motion";

export default function CosmicHeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[760px] h-[760px] rounded-full bg-[radial-gradient(circle,rgba(0,255,156,0.24),rgba(0,255,156,0.08)_36%,transparent_72%)] blur-3xl opacity-70" />
      </div>

      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ backgroundPosition: ["0px 0px", "1000px 500px"] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(1px 1px at 40px 70px, white, transparent), radial-gradient(1px 1px at 130px 40px, white, transparent), radial-gradient(2px 2px at 200px 120px, white, transparent)",
          backgroundSize: "300px 300px",
        }}
      />
    </div>
  );
}