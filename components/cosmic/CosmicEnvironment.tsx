"use client";

export default function CosmicEnvironment() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      {/* Deep Space Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,20,40,0.9),black_70%)]" />

      {/* Nebula Layer */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_60%,rgba(40,60,120,0.25),transparent_60%)]" />

      {/* Star Field */}
      <div className="stars-layer absolute inset-0" />

    </div>
  );
}