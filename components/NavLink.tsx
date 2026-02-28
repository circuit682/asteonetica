"use client";

export default function NavLink({
  children,
  href = "#",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="relative group text-sm tracking-wide transition duration-300"
    >
      <span className="group-hover:text-[var(--radar-green)] transition duration-300">
        {children}
      </span>

      {/* Sparkle Star */}
      <span
        className="absolute -top-1 -right-2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
        style={{ animation: "sparkle 0.8s ease-in-out forwards" }}
      />
    </a>
  );
}