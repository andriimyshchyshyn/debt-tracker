import { ApiError } from "./errors";

// ─── Token management ───────────────────────────────────────

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

// ─── Centralised fetch wrapper ──────────────────────────────

/**
 * Wrapper around `fetch` that:
 * 1. Attaches the JWT token from localStorage.
 * 2. Centralises 401 handling — clears token & throws ApiError.
 * 3. Throws typed `ApiError` instead of generic `Error`.
 *
 * NOTE: Redirect to /login on 401 is handled by QueryProvider's
 * global onError callback, NOT here. This prevents race conditions
 * where background TanStack Query refetches could redirect the page
 * while the user is interacting (e.g. window.confirm dialog).
 */
export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...options, headers });

  // Clear token on 401 but DON'T redirect here — let the caller handle it
  if (res.status === 401) {
    clearToken();
    throw ApiError.unauthorized();
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.error ?? message;
    } catch {
      // response wasn't JSON — use status text
      message = (await res.text()) || message;
    }
    throw new ApiError(message, res.status);
  }

  return (await res.json()) as T;
}