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
  confirmDelete?: string;
};

const validTypes = new Set<DispatchEntryType>([
  "campaign-update",
  "discovery-announcement",
  "observatory-log",
  "team-highlight"
]);

function resolveDispatchFile(slug: string) {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "");
  const dispatchDir = path.join(process.cwd(), "content", "dispatch");
  const fileName = `${safeSlug}.json`;

  return {
    dispatchDir,
    fileName,
    filePath: path.join(dispatchDir, fileName),
  };
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  if (!(await isMissionControlSessionActive())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { slug } = await context.params;
    const payload = (await request.json()) as DispatchPayload;
    const { filePath, fileName } = resolveDispatchFile(slug);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Dispatch entry not found." },
        { status: 404 }
      );
    }

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

    const updatedRecord = {
      title,
      date,
      summary,
      content,
      tags,
      type,
      location: location || undefined,
      featured: payload.featured === true,
    };

    fs.writeFileSync(filePath, JSON.stringify(updatedRecord, null, 2));

    return NextResponse.json({
      success: true,
      file: fileName,
      slug,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update dispatch entry." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  if (!(await isMissionControlSessionActive())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { slug } = await context.params;
    const payload = (await request.json()) as DispatchPayload;
    const { dispatchDir, fileName, filePath } = resolveDispatchFile(slug);

    if (payload.confirmDelete !== "DELETE") {
      return NextResponse.json(
        { error: 'Type DELETE to confirm archival.' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Dispatch entry not found." },
        { status: 404 }
      );
    }

    const archivedDir = path.join(dispatchDir, "_archived");

    if (!fs.existsSync(archivedDir)) {
      fs.mkdirSync(archivedDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const archivedFileName = `${fileName.replace(/\.json$/i, "")}-${timestamp}.json`;
    const archivedPath = path.join(archivedDir, archivedFileName);

    fs.renameSync(filePath, archivedPath);

    return NextResponse.json({
      success: true,
      archivedFile: archivedFileName,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to archive dispatch entry." },
      { status: 500 }
    );
  }
}