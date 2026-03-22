"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, clearToken } from "@/lib/api";
import { ClientSummary } from "./_components/types";
import { ClientsHeader } from "./_components/ClientsHeader";
import { AddClientForm } from "./_components/AddClientForm";
import { ClientsList } from "./_components/ClientsList";

export default function ClientsPage() {
  const router = useRouter();
  const [items, setItems] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);

  async function load(silent = false) {
  if (!silent) setLoading(true);
  setErr(null);
  try {
    const data = await apiFetch<ClientSummary[]>("/api/clients/summary");
    setItems(data);
  } catch (e: any) {
    if (e?.message === "UNAUTHORIZED") {
      router.push("/login");
      return;
    }
    if (!silent) setErr("Не вдалося завантажити список клієнтів");
  } finally {
    if (!silent) setLoading(false);
  }
}

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setAdding(true);
    try {
      await apiFetch("/api/clients", { method: "POST", body: JSON.stringify({ name: trimmed }) });
      setName("");
      await load();
    } catch (e: any) {
      if (e?.message === "UNAUTHORIZED") router.push("/login");
      else setErr("Не вдалося додати клієнта");
    } finally {
      setAdding(false);
    }
  }

  useEffect(() => {
     load();

     const interval = setInterval(() => load(true), 5000);
      return () => clearInterval(interval);
    }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return query ? items.filter((x) => x.name.toLowerCase().includes(query)) : items;
  }, [items, q]);

  const totalDebt = useMemo(
    () => items.reduce((sum, c) => sum + (c.debt > 0 ? c.debt : 0), 0),
    [items]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-700 via-sky-800 to-indigo-950 text-white">
      <div className="mx-auto w-full max-w-md px-5 pt-6 pb-10">
        <div className="rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/30 overflow-hidden">

          <ClientsHeader totalDebt={totalDebt} q={q} onChangeQuery={setQ} onLogout={() => { clearToken(); router.push("/login"); }} />
          <AddClientForm name={name} adding={adding} onChangeName={setName} onSubmit={addClient} />

          {err && (
            <div className="px-5 py-3">
              <div className="rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-sm text-white/90">{err}</div>
            </div>
          )}

          <ClientsList loading={loading} items={filtered} />
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
}