"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/api";
import { Loader } from "@/app/components/Loader";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.2 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.1-.1-2.1-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.2 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.1 0 9.8-2 13.3-5.3l-6.1-5.2C29.2 35.8 26.7 36 24 36c-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.4 39.7 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.2-4 5.7-7.1 7.5l.1.1 6.1 5.2C33.9 41.2 44 36 44 24c0-1.1-.1-2.1-.4-3.5z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.7.5.6 5.7.6 12.1c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.9 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.4 5.7 18.3.5 12 .5z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"
      />
    </svg>
  );
}

function EyeIcon({ off }: { off?: boolean }) {
  return off ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2.1 3.5 3.5 2.1l18.4 18.4-1.4 1.4-3-3c-1.6.7-3.4 1.1-5.5 1.1C7 20 3.2 16.7 1 12c1-2.1 2.5-3.9 4.4-5.2l-3.3-3.3zm5 5c-1.7 1-3.1 2.3-4 3.5 1.7 3.3 5 6 9 6 1.5 0 2.9-.3 4.1-.8l-1.8-1.8c-.7.4-1.5.6-2.3.6a4 4 0 0 1-4-4c0-.8.2-1.6.6-2.3L7.1 8.5zM12 6c5 0 8.8 3.3 11 8-1 2-2.4 3.8-4.2 5.1l-2-2c1.2-.9 2.2-2 3-3.1-1.7-3.3-5-6-9-6-.8 0-1.6.1-2.4.3l-1.7-1.7C8.2 6.2 10 6 12 6zm0 4a4 4 0 0 1 4 4c0 .3 0 .6-.1.9l-4.8-4.8c.3-.1.6-.1.9-.1z"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 5c5 0 8.8 3.3 11 7-2.2 3.7-6 7-11 7S3.2 15.7 1 12c2.2-3.7 6-7 11-7zm0 2C8 7 4.8 9.6 3.1 12 4.8 14.4 8 17 12 17s7.2-2.6 8.9-5C19.2 9.6 16 7 12 7zm0 2.5A2.5 2.5 0 1 1 12 14a2.5 2.5 0 0 1 0-5z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Invalid email or password");
        return;
      }

      const data = await res.json();
      setToken(data.token);
      router.push("/clients");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-700 via-sky-800 to-indigo-950 flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        {/* Glass card */}
        <div className="rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/30 px-6 py-8">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center shadow-inner">
              <div className="h-5 w-5 rounded-md bg-white/70" />
            </div>
            <div className="mt-3 text-white/90 font-semibold">Your logo</div>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-semibold text-white">Login</h1>
          </div>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            {/* Email */}
            <label className="block">
              <div className="text-xs text-white/70 mb-1.5">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputMode="email"
                autoComplete="email"
                placeholder="username@gmail.com"
                className="w-full rounded-xl bg-white/90 text-slate-900 placeholder:text-slate-400 px-4 py-3 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/50"
              />
            </label>

            {/* Password */}
            <label className="block">
              <div className="text-xs text-white/70 mb-1.5">Password</div>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Password"
                  type={showPass ? "text" : "password"}
                  className="w-full rounded-xl bg-white/90 text-slate-900 placeholder:text-slate-400 px-4 py-3 pr-11 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 active:scale-95"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  <EyeIcon off={showPass} />
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-xs text-white/80 hover:text-white underline underline-offset-4"
                onClick={() => setError("Поки що відновлення пароля не реалізовано")}
              >
                Forgot Password?
              </button>
              <div className="text-[11px] text-white/60">v1.0</div>
            </div>

            {error && (
              <div className="rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-sm text-white/90">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-slate-900/80 text-white font-semibold py-3 shadow-lg shadow-black/20 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader /> Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 pt-2">
              <div className="h-px flex-1 bg-white/20" />
              <div className="text-xs text-white/70">or continue with</div>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            {/* Social buttons (UI only) */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="rounded-xl bg-white/90 text-slate-900 py-3 flex items-center justify-center shadow active:scale-[0.99]"
                aria-label="Continue with Google"
              >
                <GoogleIcon />
              </button>
              <button
                type="button"
                className="rounded-xl bg-white/90 text-slate-900 py-3 flex items-center justify-center shadow active:scale-[0.99]"
                aria-label="Continue with GitHub"
              >
                <GithubIcon />
              </button>
              <button
                type="button"
                className="rounded-xl bg-white/90 py-3 flex items-center justify-center shadow active:scale-[0.99]"
                aria-label="Continue with Facebook"
              >
                <FacebookIcon />
              </button>
            </div>

            <div className="pt-1 text-center text-xs text-white/75">
              Don’t have an account yet?{" "}
              <button
                type="button"
                className="font-semibold text-white underline underline-offset-4"
                onClick={() => setError("Реєстрація зараз вимкнена (тільки адмін).")}
              >
                Register for free
              </button>
            </div>
          </form>
        </div>

        {/* little bottom spacing for mobiles */}
        <div className="h-6" />
      </div>
    </div>
  );
}