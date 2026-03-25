import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Next.js Edge Middleware — runs BEFORE every matched request.
 * Protects all /api/* routes except /api/auth/* (login/register).
 *
 * Uses `jose` instead of `jsonwebtoken` because Edge Runtime
 * doesn't support Node.js `crypto` module.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow auth endpoints without token
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // All other /api/* routes require a valid JWT
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    // jose requires the secret as Uint8Array
    // Using HMAC import to avoid the 256-bit minimum key length check
    // that jwtVerify enforces for raw Uint8Array secrets
    const secretKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch (e) {
    console.error("[MIDDLEWARE] JWT verification failed:", e);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

/**
 * Only run this middleware on API routes (excluding auth).
 */
export const config = {
  matcher: ["/api/clients/:path*", "/api/sales/:path*", "/api/payments/:path*"],
};
