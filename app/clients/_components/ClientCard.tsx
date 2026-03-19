import { useRouter } from "next/navigation";
import { DebtBadge } from "./DebtBadge";
import { ClientSummary, formatUAH } from "./types";

export function ClientCard({ client }: { client: ClientSummary }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/clients/${client.id}`)}
      className="w-full text-left rounded-2xl bg-black/15 border border-white/10 px-4 py-4 active:scale-[0.995]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-semibold truncate">{client.name}</div>
          <div className="mt-1 text-xs text-white/70">
            Остання дія: {new Date(client.lastActivityAt).toLocaleString("uk-UA")}
          </div>
          {client.phone && (
            <div className="mt-1 text-xs text-white/70 truncate">{client.phone}</div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[11px] text-white/70 mb-1">Борг</div>
          <DebtBadge value={client.debt} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 border border-white/10 px-3 py-2">
          <div className="text-[11px] text-white/70">Продажі</div>
          <div className="text-sm font-semibold">{formatUAH(client.totalSales)}</div>
        </div>
        <div className="rounded-xl bg-white/10 border border-white/10 px-3 py-2">
          <div className="text-[11px] text-white/70">Оплати</div>
          <div className="text-sm font-semibold">{formatUAH(client.totalPayments)}</div>
        </div>
      </div>

      {client.note && (
        <div className="mt-3 text-xs text-white/70 line-clamp-2">{client.note}</div>
      )}
    </button>
  );
}