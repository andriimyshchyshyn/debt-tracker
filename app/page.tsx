"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // анімація появи
    const showTimer = setTimeout(() => setVisible(true), 100);

    // перевіряємо токен і редіректимо
    const redirectTimer = setTimeout(() => {
      const token = getToken();
      router.push(token ? "/clients" : "/login");
    }, 1800);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-700 via-sky-800 to-indigo-950 flex items-center justify-center overflow-hidden">

      {/* Декоративні кола на фоні */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sky-600/5 blur-3xl" />
      </div>

      {/* Головний контент */}
      <div
        className="relative flex flex-col items-center gap-6 px-8 text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* Іконка */}
        <div className="relative">
          <div className="w-24 h-24 rounded-[28px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/30 flex items-center justify-center">
            {/* Яблуко — SVG іконка */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 10C24 10 22 6 18 6C14 6 11 9 11 13C11 17 13 19 13 19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M31 14C34.5 14 38 17 38 22C38 31 31 40 24 40C17 40 10 31 10 22C10 17 13.5 14 17 14C19.5 14 21.5 15.5 24 15.5C26.5 15.5 28.5 14 31 14Z"
                fill="white"
                fillOpacity="0.9"
              />
              <path
                d="M18 22C18 22 19 26 24 26"
                stroke="rgba(14,116,144,0.8)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Пульсуючий ефект */}
          <div
            className="absolute inset-0 rounded-[28px] bg-white/10 border border-white/10"
            style={{
              animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
        </div>

        {/* Назва */}
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Борги
          </h1>
          <p className="mt-2 text-sky-200/80 text-lg font-light tracking-wide">
            Оптовий облік клієнтів
          </p>
        </div>

        {/* Індикатор завантаження */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-white/60"
                style={{
                  animation: "bounce 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Версія */}
        <p className="text-white/30 text-xs tracking-widest uppercase mt-4">
          v1.0
        </p>
      </div>

      <style jsx>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.3; }
          75%, 100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}