"use client";

import { useEffect, useState } from "react";
import NavLink from "@/components/NavLink";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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
        <div className="font-light tracking-wide text-lg">
          Asteonetica
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-8">
          <NavLink>Afronauts</NavLink>
          <NavLink>Observatory</NavLink>
          <NavLink>Vault</NavLink>
          <NavLink>Dispatch</NavLink>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Atmospheric Fade
      <div className="absolute bottom-0 left-0 w-full h-8 pointer-events-none bg-gradient-to-b from-white/5 to-transparent" /> */}

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 text-sm tracking-wide bg-white/10 backdrop-blur-xl">
          <NavLink>Afronauts</NavLink>
          <NavLink>Observatory</NavLink>
          <NavLink>Vault</NavLink>
          <NavLink>Dispatch</NavLink>
        </div>
      )}
    </header>
  );
}