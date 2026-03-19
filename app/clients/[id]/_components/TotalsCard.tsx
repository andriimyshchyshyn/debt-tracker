import { Totals, formatUAH } from "./types";

type Props = { totals: Totals };

export function TotalsCard({ totals }: Props) {
  const isDebt = totals.debt > 0;

  return (
    <div className="px-5 py-4 border-b border-white/10">
      {/* Борг великий */}
      <div className="text-xs text-white/70 mb-1">Поточний борг</div>
      <div className={
        "text-3xl font-semibold tracking-tight " +
        (isDebt ? "text-amber-300" : "text-emerald-300")
      }>
        {formatUAH(totals.debt)}
      </div>

      {/* Продажі і оплати */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/10 border border-white/10 px-3 py-2">
          <div className="text-[11px] text-white/70">Всього продажів</div>
          <div className="text-sm font-semibold">{formatUAH(totals.totalSales)}</div>
        </div>
        <div className="rounded-xl bg-white/10 border border-white/10 px-3 py-2">
          <div className="text-[11px] text-white/70">Всього оплат</div>
          <div className="text-sm font-semibold">{formatUAH(totals.totalPayments)}</div>
        </div>
      </div>
    </div>
  );
}