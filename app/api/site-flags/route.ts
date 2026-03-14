import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isMissionControlSessionActive } from "@/lib/mission-auth";
import { sanitizeUnderConstructionRoutes } from "@/lib/under-construction";

export const dynamic = "force-dynamic";

type SiteFlags = {
  underConstructionRoutes: string[];
};

type SiteFlagsPayload = {
  underConstructionRoutes?: string[];
};

const siteFlagsFilePath = path.join(process.cwd(), "content", "config", "site-flags.json");

function ensureSiteFlagsFile() {
  const configDir = path.dirname(siteFlagsFilePath);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!fs.existsSync(siteFlagsFilePath)) {
    fs.writeFileSync(siteFlagsFilePath, JSON.stringify({ underConstructionRoutes: [] }, null, 2));
  }
}

function readSiteFlags(): SiteFlags {
  ensureSiteFlagsFile();

  try {
    const raw = fs.readFileSync(siteFlagsFilePath, "utf8");
    const parsed = JSON.parse(raw) as SiteFlags;

    return {
      underConstructionRoutes: sanitizeUnderConstructionRoutes(parsed.underConstructionRoutes ?? []),
    };
  } catch {
    return { underConstructionRoutes: [] };
  }
}

function writeSiteFlags(siteFlags: SiteFlags) {
  ensureSiteFlagsFile();
  fs.writeFileSync(siteFlagsFilePath, JSON.stringify(siteFlags, null, 2));
}

export async function GET() {
  const siteFlags = readSiteFlags();
  return NextResponse.json({ success: true, ...siteFlags });
}

export async function PATCH(request: Request) {
  if (!(await isMissionControlSessionActive())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as SiteFlagsPayload;

    if (!Array.isArray(payload.underConstructionRoutes)) {
      return NextResponse.json(
        { error: "underConstructionRoutes must be an array." },
        { status: 400 }
      );
    }

    const underConstructionRoutes = sanitizeUnderConstructionRoutes(payload.underConstructionRoutes);
    const siteFlags: SiteFlags = { underConstructionRoutes };

    writeSiteFlags(siteFlags);

    return NextResponse.json({
      success: true,
      underConstructionRoutes,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update site flags." },
      { status: 500 }
    );
  }
}
