"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSparkle } from "@/lib/SparkleContext";

export default function NavLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const { triggerSparkle } = useSparkle();
  const [sparkle, setSparkle] = useState(false);
  const [hovering, setHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hovering) return;

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setSparkle(true);
        triggerSparkle();
        setTimeout(() => setSparkle(false), 1200);
      }, 7000 + Math.random() * 4000);
    };

    startInterval();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovering]);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`relative text-sm tracking-wide transition-all duration-500 ${
        sparkle
          ? "text-[var(--radar-green)] drop-shadow-[0_0_10px_var(--radar-green)]"
          : "text-white/80 hover:text-[var(--radar-green)]"
      }`}
    >
      {children}

      {sparkle && (
        <span
          className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-white rounded-full"
          style={{ animation: "sparkle 1.2s ease-out forwards" }}
        />
      )}
    </Link>
  );
}