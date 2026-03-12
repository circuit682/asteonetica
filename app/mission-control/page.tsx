"use client";

import { useState } from "react";

type Notice = {
  type: "success" | "error";
  message: string;
};

type ImportSummary = {
  fileName: string;
  records: number;
  importedAt: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function MissionControl() {

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Idle");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [lastImport, setLastImport] = useState<ImportSummary | null>(null);

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

    try {
      setNotice(null);
      setUploading(true);
      setStatus("Uploading file...");
      setProgress(10);
      await wait(220);

      const data = new FormData();
      data.append("file", file);

      setStatus("Sending campaign file to parser...");
      setProgress(30);
      await wait(300);

      const res = await fetch("/api/process-campaign", {
        method: "POST",
        body: data
      });

      setStatus("Processing observations...");
      setProgress(70);
      await wait(350);

      const result = await res.json();

      if (!res.ok) {
        const message = result.error || "Failed to process campaign file";
        setStatus(message);
        setProgress(0);
        setNotice({ type: "error", message });
        return;
      }

      const processed = typeof result.records === "number" ? result.records : 0;
      setProgress(100);
      setStatus(`Completed - ${processed} observations processed`);
      setNotice({
        type: "success",
        message: `Campaign import complete: ${processed} observations processed.`
      });
      setLastImport({
        fileName: file.name,
        records: processed,
        importedAt: new Date().toLocaleString()
      });
    } catch {
      setProgress(0);
      setStatus("Upload failed.");
      setNotice({
        type: "error",
        message: "Upload failed due to a network or server error."
      });
    } finally {
      setUploading(false);
    }
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
        setNotice({ type: "error", message: `${field} is required.` });
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
      setNotice({ type: "error", message: "Failed to save observation." });
      return;
    }

    setNotice({ type: "success", message: "Observation saved." });

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

      {notice && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            notice.type === "success"
              ? "border-[rgba(0,255,156,0.45)] bg-[rgba(0,255,156,0.09)] text-[rgba(180,255,225,0.95)]"
              : "border-[rgba(255,90,90,0.45)] bg-[rgba(255,90,90,0.1)] text-[rgba(255,210,210,0.95)]"
          }`}
        >
          {notice.message}
        </div>
      )}

      {/* Upload Campaign Excel */}

      <div className="dashboard-card p-6 space-y-4">

        <h2 className="text-xl">
          Upload Campaign Excel
        </h2>

        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={async (e) => {

            const file = e.target.files?.[0];
            if (!file) return;

            await uploadSpreadsheet(file);
            e.target.value = "";

          }}
          className="w-full p-3 rounded bg-black/40 border border-white/20"
        />

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-white/50">
            Status
          </p>

          <p className="text-sm text-white/80 min-h-6">
            {status}
          </p>

          <div className="w-full h-3 rounded-full bg-black/45 border border-white/10 overflow-hidden">
            <div
              className="h-full bg-[linear-gradient(90deg,var(--radar-green),#59f2b7)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-xs text-white/45 space-y-1">
            <p>{progress >= 10 ? "[x]" : "[ ]"} Uploading file...</p>
            <p>{progress >= 30 ? "[x]" : "[ ]"} Parsing observations...</p>
            <p>{progress >= 70 ? "[x]" : "[ ]"} Generating dataset...</p>
            <p>{progress >= 100 ? "[x]" : "[ ]"} Campaign dataset created</p>
          </div>

          {uploading && (
            <p className="text-xs text-[var(--radar-green)]/80 animate-pulse">
              Import console active...
            </p>
          )}

          {lastImport && (
            <div className="mt-3 rounded-lg border border-white/10 bg-black/25 p-3 text-xs text-white/65 space-y-1">
              <p className="uppercase tracking-widest text-white/45">Last Import Summary</p>
              <p>File: {lastImport.fileName}</p>
              <p>Records: {lastImport.records}</p>
              <p>Imported: {lastImport.importedAt}</p>
            </div>
          )}
        </div>

      </div>

      {/* Manual Observation Entry */}

      <div className="dashboard-card p-6 space-y-4">

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