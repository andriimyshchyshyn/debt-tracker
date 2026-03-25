"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, clearToken } from "@/lib/api";
import { ClientSummary } from "./_components/types";
import { ClientsHeader } from "./_components/ClientsHeader";
import { AddClientForm } from "./_components/AddClientForm";
import { ClientsList } from "./_components/ClientsList";

export default function ClientsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [name, setName] = useState("");

  // ── Data fetching via TanStack Query ──────────────────────
  // Automatic 5s background polling comes from defaultOptions in QueryProvider
  const {
    data: items = [],
    isLoading: loading,
    error,
  } = useQuery<ClientSummary[]>({
    queryKey: ["clients-summary"],
    queryFn: () => apiFetch<ClientSummary[]>("/api/clients/summary"),
  });

  // ── Add client mutation ───────────────────────────────────
  const addMutation = useMutation({
    mutationFn: (clientName: string) =>
      apiFetch("/api/clients", {
        method: "POST",
        body: JSON.stringify({ name: clientName }),
      }),
    onSuccess: () => {
      setName("");
      queryClient.invalidateQueries({ queryKey: ["clients-summary"] });
    },
  });

  function addClient(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addMutation.mutate(trimmed);
  }

  // ── Client-side filtering (small dataset OK) ──────────────
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return query
      ? items.filter((x) => x.name.toLowerCase().includes(query))
      : items;
  }, [items, q]);

  const totalDebt = useMemo(
    () => items.reduce((sum, c) => sum + (c.debt > 0 ? c.debt : 0), 0),
    [items]
  );

  // Derive error message
  const err =
    addMutation.error instanceof Error
      ? "Не вдалося додати клієнта"
      : error instanceof Error
        ? "Не вдалося завантажити список клієнтів"
        : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-700 via-sky-800 to-indigo-950 text-white">
      <div className="mx-auto w-full max-w-md px-5 pt-6 pb-10">
        <div className="rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/30 overflow-hidden">

          <ClientsHeader
            totalDebt={totalDebt}
            q={q}
            onChangeQuery={setQ}
            onLogout={() => {
              clearToken();
              router.push("/login");
            }}
          />
          <AddClientForm
            name={name}
            adding={addMutation.isPending}
            onChangeName={setName}
            onSubmit={addClient}
          />

          {err && (
            <div className="px-5 py-3">
              <div className="rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-sm text-white/90">
                {err}
              </div>
            </div>
          )}

          <ClientsList loading={loading} items={filtered} />
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
}