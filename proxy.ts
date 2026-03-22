import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSiteUrl } from "@/lib/site-url";

function normalizeHost(value: string | null): string {
  if (!value) return "";
  return value.toLowerCase().split(":")[0];
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const canonicalHost = normalizeHost(new URL(getSiteUrl()).host);
  const requestHost = normalizeHost(request.headers.get("host"));
  const isPreviewDeployment = process.env.VERCEL_ENV === "preview";
  const isNonCanonicalHost = requestHost !== "" && requestHost !== canonicalHost;

  if (isPreviewDeployment || isNonCanonicalHost) {
    response.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive, nosnippet"
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
