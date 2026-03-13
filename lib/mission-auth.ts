import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const missionControlSessionCookie = "mission_control_session";
const missionControlSessionMaxAge = 60 * 60 * 12;

function getMissionControlSecret() {
  return process.env.MISSION_CONTROL_SESSION_SECRET || process.env.MISSION_CONTROL_PASSWORD || "";
}

function signMissionPayload(payload: string) {
  return crypto
    .createHmac("sha256", getMissionControlSecret())
    .update(payload)
    .digest("base64url");
}

export function createMissionControlSessionToken() {
  const issuedAt = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${issuedAt}.${nonce}`;
  const signature = signMissionPayload(payload);

  return `${payload}.${signature}`;
}

export function verifyMissionControlSessionToken(token: string | undefined) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [issuedAt, nonce, signature] = parts;
  const payload = `${issuedAt}.${nonce}`;
  const expectedSignature = signMissionPayload(payload);

  if (signature !== expectedSignature) {
    return false;
  }

  const issuedAtNumber = Number(issuedAt);
  if (!Number.isFinite(issuedAtNumber)) {
    return false;
  }

  return Date.now() - issuedAtNumber <= missionControlSessionMaxAge * 1000;
}

export function getMissionControlCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: missionControlSessionMaxAge,
  };
}

export async function isMissionControlSessionActive() {
  const cookieStore = await cookies();
  const token = cookieStore.get(missionControlSessionCookie)?.value;
  return verifyMissionControlSessionToken(token);
}

export async function requireMissionControlSession() {
  if (!(await isMissionControlSessionActive())) {
    redirect("/mission-control/login");
  }
}
