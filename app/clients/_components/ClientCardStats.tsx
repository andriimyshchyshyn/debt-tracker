import { formatUAH } from "./types";

type Props = {
  totalSales: number;
  totalPayments: number;
};

export function ClientCardStats({ totalSales, totalPayments }: Props) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-white/10 border border-white/10 px-3 py-2">
        <div className="text-[11px] text-white/70">Продажі</div>
        <div className="text-sm font-semibold">{formatUAH(totalSales)}</div>
      </div>
      <div className="rounded-xl bg-white/10 border border-white/10 px-3 py-2">
        <div className="text-[11px] text-white/70">Оплати</div>
        <div className="text-sm font-semibold">{formatUAH(totalPayments)}</div>
      </div>
    </div>
  );
}
