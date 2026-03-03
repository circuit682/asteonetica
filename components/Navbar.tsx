"use client";

import { useEffect, useState } from "react";
import NavLink from "@/components/NavLink";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { motionTimings, motionEase } from "@/lib/motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-white/5 border border-white/10 border-t-0 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-white">
        
        {/* Logo */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: motionTimings.hover, ease: motionEase }}
        >
          <Link
            href="/"
            className="text-lg tracking-wide font-light text-white/80 hover:text-[var(--radar-green)] transition duration-300"
          >
            Asteonetica
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-8">
          <NavLink href="/afronauts">Afronauts</NavLink>
          <NavLink href="/observatory">Observatory</NavLink>
          <NavLink href="/vault">Vault</NavLink>
          <NavLink href="/dispatch">Dispatch</NavLink>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown with smooth animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-6 pb-4 flex flex-col gap-4 text-sm tracking-wide bg-white/10 backdrop-blur-xl"
          >
            <NavLink href="/afronauts">Afronauts</NavLink>
            <NavLink href="/observatory">Observatory</NavLink>
            <NavLink href="/vault">Vault</NavLink>
            <NavLink href="/dispatch">Dispatch</NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}