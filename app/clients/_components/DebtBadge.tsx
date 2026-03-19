import { formatUAH } from "./types";

export function DebtBadge({ value }: { value: number }) {
  return (
    <div className={
      "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold " +
      (value > 0
        ? "bg-amber-300/20 text-amber-100 ring-1 ring-amber-200/20"
        : "bg-emerald-300/20 text-emerald-100 ring-1 ring-emerald-200/20")
    }>
      {formatUAH(value)}
    </div>
  );
}