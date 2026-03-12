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

type CampaignPreview = {
  fileName: string;
  totalObservations: number;
  afronautDetections: number;
  panAfricanDetections: number;
  uniqueTeams: number;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function MissionControl() {

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Idle");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [lastImport, setLastImport] = useState<ImportSummary | null>(null);
  const [preview, setPreview] = useState<CampaignPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

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

  async function previewCampaign(file: File) {
    try {
      setPreviewLoading(true);
      setNotice(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/campaign-preview", {
        method: "POST",
        body: formData
      });

      const result = await res.json();

      if (!res.ok) {
        setNotice({
          type: "error",
          message: result.error || "Failed to preview campaign file."
        });
        setPreview(null);
        return;
      }

      setPreview({
        fileName: file.name,
        totalObservations: result.totalObservations,
        afronautDetections: result.afronautDetections,
        panAfricanDetections: result.panAfricanDetections,
        uniqueTeams: result.uniqueTeams
      });

      setPendingFile(file);
    } catch {
      setNotice({
        type: "error",
        message: "Failed to preview campaign file due to a network error."
      });
      setPreview(null);
    } finally {
      setPreviewLoading(false);
    }
  }

  async function confirmImportCampaign() {
    if (!pendingFile) return;

    try {
      setNotice(null);
      setUploading(true);
      setStatus("Uploading file...");
      setProgress(10);
      await wait(220);

      const data = new FormData();
      data.append("file", pendingFile);

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
        setPreview(null);
        setPendingFile(null);
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
        fileName: pendingFile.name,
        records: processed,
        importedAt: new Date().toLocaleString()
      });

      setPreview(null);
      setPendingFile(null);
    } catch {
      setProgress(0);
      setStatus("Upload failed.");
      setNotice({
        type: "error",
        message: "Upload failed due to a network or server error."
      });
      setPreview(null);
      setPendingFile(null);
    } finally {
      setUploading(false);
    }
  }

  function cancelPreview() {
    setPreview(null);
    setPendingFile(null);
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

            await previewCampaign(file);
            e.target.value = "";

          }}
          className="w-full p-3 rounded bg-black/40 border border-white/20"
        />

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-white/50">
            Status
          </p>

          {preview ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-[rgba(0,255,156,0.25)] bg-[rgba(0,255,156,0.08)] p-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--radar-green)] mb-3">
                  Campaign Preview
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-white/50 text-xs">Total Observations</p>
                    <p className="text-white text-lg font-light">{preview.totalObservations}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Afronaut Detections</p>
                    <p className="text-white text-lg font-light">{preview.afronautDetections}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Pan-African Detections</p>
                    <p className="text-white text-lg font-light">{preview.panAfricanDetections}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Unique Teams</p>
                    <p className="text-white text-lg font-light">{preview.uniqueTeams}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={confirmImportCampaign}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 rounded bg-[var(--radar-green)]/20 border border-[var(--radar-green)] text-[var(--radar-green)] hover:bg-[var(--radar-green)]/30 disabled:opacity-50 text-sm font-light"
                >
                  {uploading ? "Importing..." : "Confirm Import"}
                </button>
                <button
                  onClick={cancelPreview}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 rounded bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 disabled:opacity-50 text-sm font-light"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
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
            </>
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