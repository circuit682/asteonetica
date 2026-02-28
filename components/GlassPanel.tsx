export default function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}