"use client";

import { useState } from "react";

export default function MissionControl() {

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    observers: "",
    team: "",
    country: "",
    status: "",
    date: "",
    imageSet: "",
    campaign: ""
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function uploadSpreadsheet(file: File) {

    setUploading(true);

    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/process-campaign", {
      method: "POST",
      body: data
    });

    const result = await res.json();

    setUploading(false);

    if (!res.ok) {
      alert(result.error || "Failed to process campaign file");
      return;
    }

    const processed = typeof result.records === "number" ? result.records : 0;
    alert(`Processed ${processed} observations`);
  }

  async function submitObservation() {

    const requiredFields = [
      "id",
      "observers",
      "team",
      "country",
      "status",
      "date",
      "imageSet",
      "campaign"
    ];

    for (const field of requiredFields) {

      if (!(form as any)[field] || (form as any)[field].trim() === "") {
        alert(`${field} is required`);
        return;
      }

    }

    const res = await fetch("/api/observations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      alert("Failed to save observation");
      return;
    }

    alert("Observation saved");

    setForm({
      id: "",
      observers: "",
      team: "",
      country: "",
      status: "",
      date: "",
      imageSet: "",
      campaign: ""
    });

  }

  return (

    <main className="min-h-screen max-w-3xl mx-auto py-20 px-6 space-y-12">

      <h1 className="text-4xl font-light">
        Mission Control
      </h1>

      {/* Upload Campaign Excel */}

      <div className="glass-card p-6 space-y-4">

        <h2 className="text-xl">
          Upload Campaign Excel
        </h2>

        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => {

            const file = e.target.files?.[0];
            if (!file) return;

            uploadSpreadsheet(file);

          }}
        />

        {uploading && (
          <p className="text-sm text-white/60">
            Processing campaign file...
          </p>
        )}

      </div>

      {/* Manual Observation Entry */}

      <div className="glass-card p-6 space-y-4">

        <h2 className="text-xl">
          Manual Observation Entry
        </h2>

        {Object.entries(form).map(([key, value]) => (

          <input
            key={key}
            value={value}
            placeholder={key}
            required
            onChange={(e) => updateField(key, e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-white/20"
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