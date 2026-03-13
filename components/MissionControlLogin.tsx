"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MissionControlLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth-mission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await res.json();

      if (!res.ok || !result.authorized) {
        setError(result.error || "Access denied. Check the Mission Control password.");
        return;
      }

      router.replace("/mission-control");
      router.refresh();
    } catch {
      setError("Unable to reach Mission Control right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 text-white">
      <div className="dashboard-card w-full max-w-md p-8 space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--radar-green)]">Restricted Access</p>
          <h1 className="text-3xl font-light text-white/92">Mission Control Login</h1>
          <p className="text-sm leading-7 text-white/60">
            Only administrators can access campaign imports, Dispatch management, and manual observation tools.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="mission-control-password" className="text-xs uppercase tracking-widest text-white/45">
              Admin password
            </label>
            <input
              id="mission-control-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded border border-white/20 bg-black/35 p-3"
              placeholder="Enter Mission Control password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded border border-[rgba(255,90,90,0.35)] bg-[rgba(255,90,90,0.1)] px-4 py-3 text-sm text-[rgba(255,210,210,0.95)]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || password.trim() === ""}
            className="w-full rounded border border-[var(--radar-green)] bg-[var(--radar-green)]/16 px-4 py-3 text-sm text-[var(--radar-green)] hover:bg-[var(--radar-green)]/24 disabled:opacity-50"
          >
            {submitting ? "Authorizing..." : "Enter Mission Control"}
          </button>
        </form>
      </div>
    </main>
  );
}
