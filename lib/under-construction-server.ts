import "server-only";

import fs from "fs";
import path from "path";
import {
  isUnderConstruction,
  normalizeUnderConstructionRoute,
  sanitizeUnderConstructionRoutes,
} from "@/lib/under-construction";

const siteFlagsFilePath = path.join(process.cwd(), "content", "config", "site-flags.json");

type SiteFlags = {
  underConstructionRoutes?: string[];
};

function readDynamicUnderConstructionRoutes() {
  try {
    const raw = fs.readFileSync(siteFlagsFilePath, "utf8");
    const parsed = JSON.parse(raw) as SiteFlags;
    return sanitizeUnderConstructionRoutes(parsed.underConstructionRoutes ?? []);
  } catch {
    return [];
  }
}

export function isUnderConstructionServer(route: string) {
  const routeKey = sanitizeUnderConstructionRoutes([normalizeUnderConstructionRoute(route)])[0];

  if (!routeKey) {
    return false;
  }

  if (isUnderConstruction(routeKey)) {
    return true;
  }

  const dynamicRoutes = new Set(readDynamicUnderConstructionRoutes());
  return dynamicRoutes.has(routeKey);
}
