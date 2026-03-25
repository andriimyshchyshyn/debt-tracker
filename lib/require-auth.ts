import { NextResponse } from "next/server";
import { verifyJwt, type JwtPayload } from "./auth";

/**
 * Extracts and verifies the JWT from the Authorization header.
 * Returns the decoded payload, or null if invalid/missing.
 */
export function getAuthPayload(req: Request): JwtPayload | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;

  const token = header.slice(7);
  try {
    return verifyJwt(token);
  } catch {
    return null;
  }
}

/**
 * Guard function for API route handlers.
 * Returns the JWT payload if valid, otherwise returns a 401 NextResponse.
 *
 * Usage:
 *   const auth = requireAuth(req);
 *   if (auth instanceof NextResponse) return auth;
 *   // auth is now JwtPayload
 */
export function requireAuth(
  req: Request
): JwtPayload | NextResponse {
  const payload = getAuthPayload(req);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return payload;
}
