import { promises as fs } from "fs";
import path from "path";

export type DispatchEntryType =
  | "campaign-update"
  | "discovery-announcement"
  | "observatory-log"
  | "team-highlight";

export type DispatchEntry = {
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

const dispatchDirectory = path.join(process.cwd(), "content", "dispatch");

function toSlug(fileName: string) {
  return fileName.replace(/\.json$/i, "");
}

function isDispatchEntry(value: unknown): value is Omit<DispatchEntry, "sourceFile" | "slug"> {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.title === "string" &&
    typeof candidate.date === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.content === "string" &&
    Array.isArray(candidate.tags) &&
    typeof candidate.type === "string"
  );
}

export async function getDispatchEntries(): Promise<DispatchEntry[]> {
  try {
    const files = await fs.readdir(dispatchDirectory);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const entries = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(dispatchDirectory, file);
        const raw = await fs.readFile(filePath, "utf8");
        const parsed = JSON.parse(raw) as unknown;

        if (!isDispatchEntry(parsed)) {
          return null;
        }

        return {
          ...parsed,
          sourceFile: file,
          slug: toSlug(file),
        } satisfies DispatchEntry;
      })
    );

    return entries
      .filter((entry): entry is DispatchEntry => entry !== null)
      .sort((left, right) => right.date.localeCompare(left.date));
  } catch {
    return [];
  }
}
