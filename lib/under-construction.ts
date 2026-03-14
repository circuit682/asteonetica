export const allowedUnderConstructionRoutes = [
  "afronauts",
  "observatory",
  "vault",
  "dispatch",
] as const;

export type UnderConstructionRouteKey = (typeof allowedUnderConstructionRoutes)[number];

const allowedRouteSet = new Set<string>(allowedUnderConstructionRoutes);

export function normalizeUnderConstructionRoute(route: string) {
  return route.trim().toLowerCase();
}

export function sanitizeUnderConstructionRoutes(routes: string[]) {
  const sanitized = routes
    .map((route) => normalizeUnderConstructionRoute(route))
    .filter((route): route is UnderConstructionRouteKey => allowedRouteSet.has(route));

  return Array.from(new Set(sanitized));
}

const envRouteSet = new Set<string>(
  sanitizeUnderConstructionRoutes((process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION_ROUTES ?? "").split(","))
);

export function isUnderConstruction(route: string) {
  return envRouteSet.has(normalizeUnderConstructionRoute(route));
}

