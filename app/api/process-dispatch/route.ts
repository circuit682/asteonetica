import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isMissionControlSessionActive } from "@/lib/mission-auth";

export const dynamic = "force-dynamic";

type DispatchEntryType =
  | "campaign-update"
  | "discovery-announcement"
  | "observatory-log"
  | "team-highlight";

type DispatchPayload = {
  title?: string;
  date?: string;
  summary?: string;
  content?: string;
  tags?: string[];
  type?: DispatchEntryType;
  location?: string;
  featured?: boolean;
};

const validTypes = new Set<DispatchEntryType>([
  "campaign-update",
  "discovery-announcement",
  "observatory-log",
  "team-highlight"
]);

function sanitizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  if (!(await isMissionControlSessionActive())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const payload = (await request.json()) as DispatchPayload;

    const title = payload.title?.trim();
    const date = payload.date?.trim();
    const summary = payload.summary?.trim();
    const content = payload.content?.trim();
    const location = payload.location?.trim();
    const type = payload.type;
    const tags = Array.isArray(payload.tags)
      ? payload.tags.map((tag) => tag.trim()).filter(Boolean)
      : [];

    if (!title || !date || !summary || !content || !type) {
      return NextResponse.json(
        { error: "Missing required dispatch fields." },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Dispatch date must use YYYY-MM-DD." },
        { status: 400 }
      );
    }

    if (!validTypes.has(type)) {
      return NextResponse.json(
        { error: "Invalid dispatch entry type." },
        { status: 400 }
      );
    }

    if (tags.length === 0) {
      return NextResponse.json(
        { error: "At least one dispatch tag is required." },
        { status: 400 }
      );
    }

    const dispatchDir = path.join(process.cwd(), "content", "dispatch");

    if (!fs.existsSync(dispatchDir)) {
      fs.mkdirSync(dispatchDir, { recursive: true });
    }

    const baseSlug = sanitizeSlug(title) || "dispatch-entry";
    const baseFileName = `${date}-${baseSlug}.json`;
    let fileName = baseFileName;
    let filePath = path.join(dispatchDir, fileName);

    if (fs.existsSync(filePath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      fileName = `${date}-${baseSlug}-${timestamp}.json`;
      filePath = path.join(dispatchDir, fileName);
    }

    const record = {
      title,
      date,
      summary,
      content,
      tags,
      type,
      location: location || undefined,
      featured: payload.featured === true
    };

    fs.writeFileSync(filePath, JSON.stringify(record, null, 2));

    return NextResponse.json({
      success: true,
      file: fileName,
      slug: fileName.replace(/\.json$/i, "")
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to save dispatch entry." },
      { status: 500 }
    );
  }
}