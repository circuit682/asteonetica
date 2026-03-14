"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { allowedUnderConstructionRoutes } from "@/lib/under-construction";

type Notice = {
  type: "success" | "error";
  message: string;
};

type ImportSummary = {
  fileName: string;
  records: number;
  importedAt: string;
};

type DispatchImportSummary = {
  fileName: string;
  title: string;
  savedAt: string;
};

type DispatchEntryType =
  | "campaign-update"
  | "discovery-announcement"
  | "observatory-log"
  | "team-highlight";

type DispatchEntryRecord = {
  title: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
  type: DispatchEntryType;
  location?: string;
  featured?: boolean;
  sourceFile: string;
  slug: string;
};

type CampaignPreview = {
  fileName: string;
  totalObservations: number;
  afronautDetections: number;
  panAfricanDetections: number;
  uniqueTeams: number;
};

type SiteFlagsResponse = {
  success: boolean;
  underConstructionRoutes?: string[];
  error?: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createDispatchForm = () => ({
  title: "",
  date: new Date().toISOString().slice(0, 10),
  summary: "",
  content: "",
  tags: "campaign, kenya, asteroids",
  type: "campaign-update" as DispatchEntryType,
  location: "Nairobi, Kenya",
  featured: false
});

function serializeDispatchForm(form: ReturnType<typeof createDispatchForm>) {
  return JSON.stringify(form);
}

function normalizeDispatchDateInput(value: string) {
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (!slashMatch) {
    return trimmed;
  }

  const [, month, day, year] = slashMatch;

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function formatDispatchPreviewDate(date: string) {
  if (!date) return "Select a date";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(parsed);
}

function formatDispatchTypeLabel(type: DispatchEntryType) {
  switch (type) {
    case "campaign-update":
      return "Campaign Update";
    case "discovery-announcement":
      return "Discovery Announcement";
    case "observatory-log":
      return "Observatory Log";
    case "team-highlight":
      return "Team Highlight";
    default:
      return "Dispatch Entry";
  }
}

const dispatchSectionConfig: Record<
  DispatchEntryType,
  {
    summaryPlaceholder: string;
    contentPlaceholder: string;
    previewPrompt: string;
  }
> = {
  "campaign-update": {
    summaryPlaceholder:
      "Summarize the campaign cycle, review window, and core operational update for this campaign section.",
    contentPlaceholder:
      "Campaign section preview. Document search phases, review cadence, and team coordination milestones.",
    previewPrompt: "Campaign section preview"
  },
  "discovery-announcement": {
    summaryPlaceholder:
      "Summarize the preliminary detection or confirmation and why this finding matters now.",
    contentPlaceholder:
      "Discovery section preview. Include object context, validation trail, and next verification actions.",
    previewPrompt: "Discovery section preview"
  },
  "observatory-log": {
    summaryPlaceholder:
      "Summarize the observatory work session, methods used, and what changed in this log entry.",
    contentPlaceholder:
      "Observatory section preview. Capture the workflow narrative, frame analysis notes, and key decisions.",
    previewPrompt: "Observatory section preview"
  },
  "team-highlight": {
    summaryPlaceholder:
      "Summarize the contributor focus and the specific work or discipline being highlighted.",
    contentPlaceholder:
      "Team section preview. Describe the person, practice, and measurable contribution to the mission.",
    previewPrompt: "Team section preview"
  }
};

export default function MissionControlConsole() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Idle");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [lastImport, setLastImport] = useState<ImportSummary | null>(null);
  const [dispatchSaving, setDispatchSaving] = useState(false);
  const [dispatchDeleting, setDispatchDeleting] = useState(false);
  const [dispatchLoading, setDispatchLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [lastDispatchImport, setLastDispatchImport] = useState<DispatchImportSummary | null>(null);
  const [dispatchEntries, setDispatchEntries] = useState<DispatchEntryRecord[]>([]);
  const [dispatchBaseline, setDispatchBaseline] = useState(() => serializeDispatchForm(createDispatchForm()));
  const [selectedDispatchSlug, setSelectedDispatchSlug] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [preview, setPreview] = useState<CampaignPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [siteFlagsLoading, setSiteFlagsLoading] = useState(false);
  const [siteFlagsSaving, setSiteFlagsSaving] = useState(false);
  const [underConstructionRoutes, setUnderConstructionRoutes] = useState<string[]>([]);

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

  const [dispatchForm, setDispatchForm] = useState(createDispatchForm);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateDispatchField = (key: string, value: string | boolean) => {
    setDispatchForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedDispatchEntry = useMemo(
    () => dispatchEntries.find((entry) => entry.slug === selectedDispatchSlug) ?? null,
    [dispatchEntries, selectedDispatchSlug]
  );

  const hasUnsavedDispatchChanges = useMemo(
    () => serializeDispatchForm(dispatchForm) !== dispatchBaseline,
    [dispatchBaseline, dispatchForm]
  );

  const activeDispatchSection = useMemo(
    () => dispatchSectionConfig[dispatchForm.type],
    [dispatchForm.type]
  );

  const dispatchTypeLabel = useMemo(
    () => formatDispatchTypeLabel(dispatchForm.type),
    [dispatchForm.type]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    void loadDispatchEntries();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    void loadSiteFlags();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedDispatchChanges) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedDispatchChanges]);

  function hydrateDispatchForm(entry: DispatchEntryRecord) {
    const nextForm = {
      title: entry.title,
      date: entry.date,
      summary: entry.summary,
      content: entry.content,
      tags: entry.tags.join(", "),
      type: entry.type,
      location: entry.location ?? "",
      featured: entry.featured === true
    };

    setDispatchForm(nextForm);
    setDispatchBaseline(serializeDispatchForm(nextForm));
  }

  function resetDispatchComposer() {
    const nextForm = createDispatchForm();
    setSelectedDispatchSlug("");
    setDeleteConfirmation("");
    setDispatchForm(nextForm);
    setDispatchBaseline(serializeDispatchForm(nextForm));
  }

  function setDispatchDateToToday() {
    updateDispatchField("date", new Date().toISOString().slice(0, 10));
  }

  function normalizeDispatchDateField() {
    const normalizedDate = normalizeDispatchDateInput(dispatchForm.date);
    updateDispatchField("date", normalizedDate);
  }

  function confirmDiscardDispatchChanges() {
    if (!hasUnsavedDispatchChanges) {
      return true;
    }

    return window.confirm("You have unsaved Dispatch changes. Discard them?");
  }

  function handleUnauthorized(res: Response) {
    if (res.status !== 401) {
      return false;
    }

    router.replace("/mission-control/login");
    router.refresh();
    return true;
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await fetch("/api/auth-mission", {
        method: "DELETE"
      });
    } finally {
      router.replace("/mission-control/login");
      router.refresh();
    }
  }

  async function loadDispatchEntries(preferredSlug?: string) {
    try {
      setDispatchLoading(true);

      const res = await fetch("/api/dispatch-entries", {
        cache: "no-store"
      });

      if (handleUnauthorized(res)) {
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        setNotice({
          type: "error",
          message: result.error || "Failed to load Dispatch entries."
        });
        return;
      }

      const entries = (result.entries ?? []) as DispatchEntryRecord[];
      setDispatchEntries(entries);

      const nextSlug = preferredSlug ?? selectedDispatchSlug;
      const selectedEntry = entries.find((entry) => entry.slug === nextSlug) ?? null;

      if (selectedEntry) {
        setSelectedDispatchSlug(selectedEntry.slug);
        hydrateDispatchForm(selectedEntry);
      } else if (nextSlug) {
        resetDispatchComposer();
      }
    } catch {
      setNotice({
        type: "error",
        message: "Failed to load Dispatch entries due to a network error."
      });
    } finally {
      setDispatchLoading(false);
    }
  }

  async function loadSiteFlags() {
    try {
      setSiteFlagsLoading(true);

      const res = await fetch("/api/site-flags", {
        cache: "no-store"
      });

      const result = (await res.json()) as SiteFlagsResponse;

      if (!res.ok) {
        setNotice({
          type: "error",
          message: result.error || "Failed to load site flags."
        });
        return;
      }

      setUnderConstructionRoutes(result.underConstructionRoutes ?? []);
    } catch {
      setNotice({
        type: "error",
        message: "Failed to load site flags due to a network error."
      });
    } finally {
      setSiteFlagsLoading(false);
    }
  }

  async function saveSiteFlags() {
    try {
      setSiteFlagsSaving(true);
      setNotice(null);

      const res = await fetch("/api/site-flags", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ underConstructionRoutes })
      });

      if (handleUnauthorized(res)) {
        return;
      }

      const result = (await res.json()) as SiteFlagsResponse;

      if (!res.ok) {
        setNotice({
          type: "error",
          message: result.error || "Failed to save site flags."
        });
        return;
      }

      setUnderConstructionRoutes(result.underConstructionRoutes ?? []);
      setNotice({
        type: "success",
        message: "Under-construction route flags updated."
      });
    } catch {
      setNotice({
        type: "error",
        message: "Failed to save site flags due to a network error."
      });
    } finally {
      setSiteFlagsSaving(false);
    }
  }

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

      if (handleUnauthorized(res)) {
        return;
      }

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

      if (handleUnauthorized(res)) {
        return;
      }

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
      if (!(form as Record<string, string>)[field] || (form as Record<string, string>)[field].trim() === "") {
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

    if (handleUnauthorized(res)) {
      return;
    }

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

  async function submitDispatchEntry() {
    const requiredFields = ["title", "date", "summary", "content", "type"];

    for (const field of requiredFields) {
      const value = dispatchForm[field as keyof typeof dispatchForm];

      if (typeof value === "string" && value.trim() === "") {
        setNotice({ type: "error", message: `${field} is required.` });
        return;
      }
    }

    const tags = dispatchForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tags.length === 0) {
      setNotice({ type: "error", message: "At least one tag is required." });
      return;
    }

    try {
      setDispatchSaving(true);
      setNotice(null);

      const isEditing = selectedDispatchSlug !== "";
      const res = await fetch(
        isEditing ? `/api/process-dispatch/${selectedDispatchSlug}` : "/api/process-dispatch",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...dispatchForm,
            title: dispatchForm.title.trim(),
            date: normalizeDispatchDateInput(dispatchForm.date),
            summary: dispatchForm.summary.trim(),
            content: dispatchForm.content.trim(),
            location: dispatchForm.location.trim(),
            tags
          })
        }
      );

      if (handleUnauthorized(res)) {
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        setNotice({
          type: "error",
          message: result.error || "Failed to save dispatch entry."
        });
        return;
      }

      setNotice({
        type: "success",
        message: isEditing
          ? `${dispatchTypeLabel} updated in ${result.file}.`
          : `${dispatchTypeLabel} published as ${result.file}.`
      });

      setLastDispatchImport({
        fileName: result.file,
        title: dispatchForm.title,
        savedAt: new Date().toLocaleString()
      });

      await loadDispatchEntries(result.slug);
      setDispatchBaseline(serializeDispatchForm({
        ...dispatchForm,
        date: normalizeDispatchDateInput(dispatchForm.date),
        tags: tags.join(", "),
        title: dispatchForm.title.trim(),
        summary: dispatchForm.summary.trim(),
        content: dispatchForm.content.trim(),
        location: dispatchForm.location.trim(),
      }));

      if (!isEditing) {
        setDeleteConfirmation("");
      }
    } catch {
      setNotice({
        type: "error",
        message: "Dispatch save failed due to a network or server error."
      });
    } finally {
      setDispatchSaving(false);
    }
  }

  async function deleteDispatchEntry() {
    if (!selectedDispatchSlug) {
      setNotice({ type: "error", message: "Select a Dispatch entry first." });
      return;
    }

    if (deleteConfirmation !== "DELETE") {
      setNotice({ type: "error", message: 'Type DELETE to confirm archival.' });
      return;
    }

    try {
      setDispatchDeleting(true);
      setNotice(null);

      const res = await fetch(`/api/process-dispatch/${selectedDispatchSlug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ confirmDelete: deleteConfirmation })
      });

      if (handleUnauthorized(res)) {
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        setNotice({
          type: "error",
          message: result.error || "Failed to archive dispatch entry."
        });
        return;
      }

      setNotice({
        type: "success",
        message: `Dispatch entry archived as ${result.archivedFile}.`
      });

      resetDispatchComposer();
      await loadDispatchEntries("");
    } catch {
      setNotice({
        type: "error",
        message: "Dispatch archival failed due to a network or server error."
      });
    } finally {
      setDispatchDeleting(false);
    }
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto py-20 px-6 space-y-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-light">Mission Control</h1>
          <p className="mt-2 text-sm text-white/55">Admin-only console for campaign imports, Dispatch publishing, and observation management.</p>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 disabled:opacity-50"
        >
          {loggingOut ? "Signing out..." : "Log Out"}
        </button>
      </div>

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

      <div className="dashboard-card p-6 space-y-4">
        <h2 className="text-xl">Upload Campaign Excel</h2>

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
          <p className="text-xs uppercase tracking-widest text-white/50">Status</p>

          {preview ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-[rgba(0,255,156,0.25)] bg-[rgba(0,255,156,0.08)] p-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--radar-green)] mb-3">Campaign Preview</p>
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
              <p className="text-sm text-white/80 min-h-6">{status}</p>

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
                <p className="text-xs text-[var(--radar-green)]/80 animate-pulse">Import console active...</p>
              )}

              {previewLoading && (
                <p className="text-xs text-[var(--radar-green)]/80 animate-pulse">Generating preview...</p>
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

      <div className="dashboard-card p-6 space-y-5">
        <div className="space-y-2">
          <h2 className="text-xl">Dispatch Entry Manager</h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Create structured Dispatch entries for Kenya asteroid campaign updates, discovery announcements,
            observatory logs, and team highlights. Saved entries are written into the content archive and
            rendered on the Dispatch page automatically.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/25 p-4 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/45">Edit Existing Entry</p>
              <p className="mt-1 text-sm text-white/55">
                Load an existing Dispatch post into the composer before editing or archival.
              </p>
            </div>

            <button
              onClick={() => {
                if (!confirmDiscardDispatchChanges()) {
                  return;
                }

                resetDispatchComposer();
              }}
              className="rounded border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10"
            >
              Start New Entry
            </button>
          </div>

          <select
            value={selectedDispatchSlug}
            onChange={(e) => {
              const slug = e.target.value;

              if (slug !== selectedDispatchSlug && !confirmDiscardDispatchChanges()) {
                return;
              }

              setSelectedDispatchSlug(slug);
              setDeleteConfirmation("");

              if (!slug) {
                const nextForm = createDispatchForm();
                setDispatchForm(nextForm);
                setDispatchBaseline(serializeDispatchForm(nextForm));
                return;
              }

              const entry = dispatchEntries.find((item) => item.slug === slug);
              if (entry) {
                hydrateDispatchForm(entry);
              }
            }}
            className="w-full rounded bg-black/40 border border-white/20 p-3"
          >
            <option value="">New entry</option>
            {dispatchEntries.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.date} - {entry.title}
              </option>
            ))}
          </select>

          {dispatchLoading && (
            <p className="text-xs text-[var(--radar-green)]/80">Loading Dispatch archive...</p>
          )}

          {selectedDispatchEntry && (
            <div className="rounded border border-[rgba(0,255,156,0.18)] bg-[rgba(0,255,156,0.06)] p-3 text-xs text-white/65 space-y-1">
              <p className="uppercase tracking-widest text-[var(--radar-green)]">Selected Entry</p>
              <p>File: {selectedDispatchEntry.sourceFile}</p>
              <p>Type: {selectedDispatchEntry.type}</p>
              <p>Featured: {selectedDispatchEntry.featured ? "Yes" : "No"}</p>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={dispatchForm.title}
            placeholder="Entry title"
            onChange={(e) => updateDispatchField("title", e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-white/20"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs uppercase tracking-widest text-white/45">Dispatch date</label>
              <button
                type="button"
                onClick={setDispatchDateToToday}
                className="text-xs text-[var(--radar-green)]/80 hover:text-[var(--radar-green)]"
              >
                Use Today
              </button>
            </div>
            <input
              type="text"
              value={dispatchForm.date}
              onChange={(e) => updateDispatchField("date", e.target.value)}
              onBlur={normalizeDispatchDateField}
              inputMode="numeric"
              placeholder="YYYY-MM-DD or M/D/YYYY"
              maxLength={10}
              className="w-full p-3 rounded bg-black/40 border border-white/20"
            />
            <p className="text-xs text-white/45">
              Auto-filled with today when you start or reset an entry. It does not keep updating on its own,
              and you can change it at any time. Accepted formats: YYYY-MM-DD or M/D/YYYY.
            </p>
          </div>

          <select
            value={dispatchForm.type}
            onChange={(e) => updateDispatchField("type", e.target.value as DispatchEntryType)}
            className="w-full p-3 rounded bg-black/40 border border-white/20"
          >
            <option value="campaign-update">Campaign Update</option>
            <option value="discovery-announcement">Discovery Announcement</option>
            <option value="observatory-log">Observatory Log</option>
            <option value="team-highlight">Team Highlight</option>
          </select>

          <input
            value={dispatchForm.location}
            placeholder="Location"
            onChange={(e) => updateDispatchField("location", e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-white/20"
          />
        </div>

        <textarea
          value={dispatchForm.summary}
          placeholder="Short summary"
          onChange={(e) => updateDispatchField("summary", e.target.value)}
          rows={3}
          className="w-full p-3 rounded bg-black/40 border border-white/20 resize-y"
        />

        <textarea
          value={dispatchForm.content}
          placeholder="Long-form dispatch content"
          onChange={(e) => updateDispatchField("content", e.target.value)}
          rows={10}
          className="w-full p-3 rounded bg-black/40 border border-white/20 resize-y"
        />

        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <input
            value={dispatchForm.tags}
            placeholder="Comma-separated tags"
            onChange={(e) => updateDispatchField("tags", e.target.value)}
            className="w-full p-3 rounded bg-black/40 border border-white/20"
          />

          <label className="flex items-center gap-3 rounded border border-white/15 bg-black/25 px-4 py-3 text-sm text-white/70">
            <input
              type="checkbox"
              checked={dispatchForm.featured}
              onChange={(e) => updateDispatchField("featured", e.target.checked)}
              className="accent-[var(--radar-green)]"
            />
            Feature on Dispatch page
          </label>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/25 p-4 text-xs text-white/55 space-y-1">
          <p className="uppercase tracking-widest text-white/45">Publishing Notes</p>
          <p>Tags should be comma-separated, for example: campaign, kenya, asteroids.</p>
          <p>Use blank lines in the long-form content to create readable paragraphs on the Dispatch page.</p>
          <p>Preview and publish are automatically synced to the selected section: {dispatchTypeLabel}.</p>
        </div>

        <div className="rounded-lg border border-[rgba(0,255,156,0.14)] bg-[rgba(0,255,156,0.04)] p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--radar-green)]">Live Preview</p>
              <p className="mt-1 text-xs text-white/45">
                {activeDispatchSection.previewPrompt} - adapts automatically while you edit.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/50">
              {selectedDispatchSlug ? `Editing ${dispatchTypeLabel}` : `Draft ${dispatchTypeLabel}`}
            </div>
          </div>

          <div className="vault-emerald-tablet rounded-2xl p-6 md:p-7">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/44">
                <span className="text-[var(--radar-green)]">{dispatchTypeLabel}</span>
                <span>{formatDispatchPreviewDate(dispatchForm.date)}</span>
                <span>{dispatchForm.location || "Location not set"}</span>
                <span>{dispatchForm.featured ? "Featured entry" : "Standard entry"}</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-light text-white/92 leading-tight">
                {dispatchForm.title || "Dispatch title preview"}
              </h3>

              <p className="text-sm md:text-base leading-7 text-white/68">
                {dispatchForm.summary || activeDispatchSection.summaryPlaceholder}
              </p>

              <div className="border-t border-white/10 pt-5 space-y-4 text-sm md:text-[15px] leading-7 text-white/68">
                {(dispatchForm.content || activeDispatchSection.contentPlaceholder)
                  .split("\n\n")
                  .filter(Boolean)
                  .slice(0, 3)
                  .map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {dispatchForm.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="emerald-tablet-chip rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/72"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={submitDispatchEntry}
          disabled={dispatchSaving}
          className="px-6 py-3 bg-[var(--radar-green)]/20 border border-[var(--radar-green)] text-[var(--radar-green)] hover:bg-[var(--radar-green)]/30 rounded disabled:opacity-50"
        >
          {dispatchSaving
            ? (selectedDispatchSlug ? `Updating ${dispatchTypeLabel}...` : `Publishing ${dispatchTypeLabel}...`)
            : (selectedDispatchSlug ? `Update ${dispatchTypeLabel}` : `Publish ${dispatchTypeLabel}`)}
        </button>

        {selectedDispatchSlug && (
          <div className="rounded-lg border border-[rgba(255,120,120,0.18)] bg-[rgba(255,90,90,0.08)] p-4 space-y-3">
            <p className="text-xs uppercase tracking-widest text-[rgba(255,180,180,0.75)]">Archive Entry Safely</p>
            <p className="text-sm text-white/62 leading-relaxed">
              Deletion is non-destructive. The JSON file is moved into an internal archive folder so it stops
              appearing on Dispatch but can still be recovered manually if needed.
            </p>

            <input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE to archive this entry"
              className="w-full rounded bg-black/35 border border-white/15 p-3 text-sm"
            />

            <button
              onClick={deleteDispatchEntry}
              disabled={dispatchDeleting || deleteConfirmation !== "DELETE"}
              className="px-5 py-3 rounded border border-[rgba(255,120,120,0.35)] text-[rgba(255,190,190,0.88)] hover:bg-[rgba(255,90,90,0.12)] disabled:opacity-50"
            >
              {dispatchDeleting ? "Archiving Entry..." : "Archive Dispatch Entry"}
            </button>
          </div>
        )}

        {lastDispatchImport && (
          <div className="rounded-lg border border-white/10 bg-black/25 p-3 text-xs text-white/65 space-y-1">
            <p className="uppercase tracking-widest text-white/45">Last Dispatch Save</p>
            <p>Title: {lastDispatchImport.title}</p>
            <p>File: {lastDispatchImport.fileName}</p>
            <p>Saved: {lastDispatchImport.savedAt}</p>
          </div>
        )}

        <div className="rounded-lg border border-white/10 bg-black/25 p-4 text-xs text-white/55 space-y-1">
          <p className="uppercase tracking-widest text-white/45">Safe Editing Workflow</p>
          <p>1. Select an existing entry from the archive picker to load it into the form.</p>
          <p>2. Update only the fields you intend to change, then use Update Dispatch Entry.</p>
          <p>3. To remove an entry from the live Dispatch page, type DELETE and archive it instead of permanently deleting it.</p>
          <p>4. If you try to switch entries or leave the page with unsaved Dispatch changes, you will get a warning first.</p>
        </div>
      </div>

      <div className="dashboard-card p-6 space-y-4">
        <h2 className="text-xl">Site Visibility Controls</h2>

        <p className="text-sm text-white/60 leading-relaxed">
          Toggle temporary under-construction fallback per public route without environment variable edits.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {allowedUnderConstructionRoutes.map((routeKey) => {
            const active = underConstructionRoutes.includes(routeKey);

            return (
              <label
                key={routeKey}
                className="flex items-center justify-between rounded border border-white/15 bg-black/25 px-4 py-3 text-sm"
              >
                <span className="uppercase tracking-[0.18em] text-white/70">/{routeKey}</span>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setUnderConstructionRoutes((prev) => {
                      if (checked) {
                        return Array.from(new Set([...prev, routeKey]));
                      }

                      return prev.filter((item) => item !== routeKey);
                    });
                  }}
                  className="accent-[var(--radar-green)]"
                />
              </label>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveSiteFlags}
            disabled={siteFlagsSaving || siteFlagsLoading}
            className="rounded border border-[var(--radar-green)] bg-[var(--radar-green)]/15 px-4 py-2 text-sm text-[var(--radar-green)] hover:bg-[var(--radar-green)]/25 disabled:opacity-50"
          >
            {siteFlagsSaving ? "Saving Controls..." : "Save Visibility Controls"}
          </button>

          <button
            type="button"
            onClick={() => void loadSiteFlags()}
            disabled={siteFlagsSaving || siteFlagsLoading}
            className="rounded border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 disabled:opacity-50"
          >
            {siteFlagsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <p className="text-xs text-white/45">
          Active fallback routes: {underConstructionRoutes.length > 0 ? underConstructionRoutes.join(", ") : "none"}
        </p>
      </div>

      <div className="dashboard-card p-6 space-y-4">
        <h2 className="text-xl">Manual Observation Entry</h2>

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
