"use client";

import { useState } from "react";

export default function MissionControlPage() {

  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const handleLogin = async () => {

    const res = await fetch("/api/auth-mission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.authorized) {
      setAuthorized(true);
    } else {
      alert("Access denied");
    }

  };

  if (!authorized) {
    return (

      <main className="min-h-screen flex items-center justify-center">

        <div className="glass-card p-8 w-full max-w-sm">

          <h1 className="text-xl mb-6">Mission Control Access</h1>

          <input
            type="password"
            placeholder="Enter admin password"
            className="w-full p-3 bg-black/40 border border-white/20 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded"
          >
            Enter
          </button>

        </div>

      </main>

    );
  }

  return <ObservationForm />;
}

function ObservationForm() {

  const [form, setForm] = useState({
    id: "",
    object: "",
    observers: "",
    team: "",
    country: "",
    status: "",
    imageSet: "",
    date: "",
    campaign: "",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitObservation = async () => {

    const res = await fetch("/api/observations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Observation saved");
    } else {
      alert("Error saving observation");
    }

  };

  return (

    <main className="min-h-screen px-8 py-24 max-w-3xl mx-auto">

      <h1 className="text-4xl font-light mb-10">
        Mission Control
      </h1>

      <div className="glass-card p-8 space-y-4">

        {Object.keys(form).map((field) => (

          <input
            key={field}
            placeholder={field}
            value={(form as any)[field]}
            onChange={(e) => updateField(field, e.target.value)}
            className="w-full p-3 bg-black/40 border border-white/20 rounded"
          />

        ))}

        <button
          onClick={submitObservation}
          className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 rounded"
        >
          Save Observation
        </button>

      </div>

    </main>

  );
}