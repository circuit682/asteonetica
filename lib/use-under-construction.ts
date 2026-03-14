"use client";

import { useEffect, useState } from "react";
import {
  isUnderConstruction,
  normalizeUnderConstructionRoute,
} from "@/lib/under-construction";

type SiteFlagsResponse = {
  success?: boolean;
  underConstructionRoutes?: string[];
};

export function useUnderConstruction(route: string) {
  const routeKey = normalizeUnderConstructionRoute(route);
  const [underConstruction, setUnderConstruction] = useState(() => isUnderConstruction(routeKey));

  useEffect(() => {
    let active = true;

    async function loadSiteFlags() {
      try {
        const response = await fetch("/api/site-flags", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as SiteFlagsResponse;
        const dynamicRoutes = new Set((data.underConstructionRoutes ?? []).map(normalizeUnderConstructionRoute));

        if (active) {
          setUnderConstruction(isUnderConstruction(routeKey) || dynamicRoutes.has(routeKey));
        }
      } catch {
        if (active) {
          setUnderConstruction(isUnderConstruction(routeKey));
        }
      }
    }

    void loadSiteFlags();

    return () => {
      active = false;
    };
  }, [routeKey]);

  return underConstruction;
}
