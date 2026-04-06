"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { ClientDetail, Totals, formatUAH } from "./_components/types";
import { ClientDetailHeader } from "./_components/ClientDetailHeader";
import { TotalsCard } from "./_components/TotalsCard";
import { TransactionList } from "./_components/TransactionList";
import { Loader } from "@/app/components/Loader";
import dynamic from "next/dynamic";

const AddTransactionModal = dynamic(
  () => import("./_components/AddTransactionModal").then((mod) => mod.AddTransactionModal),
  { ssr: false }
);

type PageProps = {
  params: Promise<{ id: string }>;
};

type Modal = "sale" | "payment" | null;

type ClientData = { client: ClientDetail; totals: Totals };

export default function ClientDetailPage({ params }: PageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [clientId, setClientId] = useState<string | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    params.then((p) => setClientId(p.id));
  }, [params]);

  // ── Data fetching via TanStack Query ──────────────────────
  const { data, isLoading } = useQuery<ClientData>({
    queryKey: ["client-detail", clientId],
    queryFn: () => apiFetch<ClientData>(`/api/clients/${clientId}`),
    enabled: !!clientId,
  });

  const client = data?.client ?? null;
  const totals = data?.totals ?? null;

  function handleSuccess() {
    setModal(null);
    if (clientId) {
      queryClient.invalidateQueries({ queryKey: ["client-detail", clientId] });
      // Also refresh the summary list so debt numbers are up to date
      queryClient.invalidateQueries({ queryKey: ["clients-summary"] });
    }
  }

  async function closeDebt() {
    if (!clientId || !totals) return;

    const confirmed = window.confirm(
      `Закрити борг ${formatUAH(totals.debt)}?\n\nБуде створена оплата на цю суму.`
    );
    if (!confirmed) return;

    setClosing(true);
    try {
      await apiFetch(`/api/clients/${clientId}/close-debt`, {
        method: "POST",
      });
      queryClient.invalidateQueries({ queryKey: ["client-detail", clientId] });
      queryClient.invalidateQueries({ queryKey: ["clients-summary"] });
    } catch (e: unknown) {
      if (e instanceof Error && e.message?.includes("Борг вже закритий")) {
        alert("Борг вже закритий.");
      } else {
        const msg = e instanceof Error ? e.message : "Невідома помилка";
        alert(`Не вдалося закрити борг. Помилка: ${msg}`);
      }
    } finally {
      setClosing(false);
    }
  }

  if (isLoading || !client || !totals) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-700 via-sky-800 to-indigo-950
                      flex items-center justify-center">
        <Loader className="h-6 w-6 text-white/60" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-700 via-sky-800 to-indigo-950 text-white">
      <div className="mx-auto w-full max-w-md px-5 pt-6 pb-32">
        <div className="rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/15
                        shadow-2xl shadow-black/30 overflow-hidden">

          <ClientDetailHeader client={client} />
          <TotalsCard totals={totals} />
          <TransactionList sales={client.sales} payments={client.payments} />

        </div>
      </div>

      {/* Фіксовані кнопки знизу */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-auto max-w-md px-5 pb-8 pt-4
                        bg-gradient-to-t from-indigo-950/95 to-transparent">

          {/* Кнопка закриття боргу — тільки якщо борг > 0, на всю ширину */}
          {totals.debt > 0 && (
            <button
              onClick={closeDebt}
              disabled={closing}
              className="w-full mb-3 rounded-2xl bg-white/15 border border-white/20
                         py-3 text-base font-semibold text-white shadow-lg
                         active:scale-[0.98] disabled:opacity-60"
            >
              {closing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader /> Закриваємо...
                </div>
              ) : (
                `Закрити борг — ${formatUAH(totals.debt)}`
              )}
            </button>
          )}

          {/* Продаж і Оплата — поруч */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setModal("sale")}
              className="rounded-2xl bg-amber-400 py-4 text-base font-semibold
                         text-slate-900 shadow-lg active:scale-[0.98]"
            >
              + Продаж
            </button>
            <button
              onClick={() => setModal("payment")}
              className="rounded-2xl bg-emerald-400 py-4 text-base font-semibold
                         text-slate-900 shadow-lg active:scale-[0.98]"
            >
              + Оплата
            </button>
          </div>

        </div>
      </div>

      {/* Модалка */}
      {modal && clientId && (
        <AddTransactionModal
          clientId={clientId}
          mode={modal}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}