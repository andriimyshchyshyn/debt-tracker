import { formatUAH } from "./types";

type Props = {
  totalDebt: number;
  q: string;
  onChangeQuery: (v: string) => void;
  onLogout: () => void;
};

export function ClientsHeader({ totalDebt, q, onChangeQuery, onLogout }: Props) {
  return (
    <div className="px-5 pt-5 pb-4 border-b border-white/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-white/70">Загальний борг</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">
            {formatUAH(totalDebt)}
          </div>
        </div>
        <button
          onClick={onLogout}
          className="rounded-xl bg-slate-900/70 px-3 py-2 text-sm font-semibold text-white shadow active:scale-[0.99]"
        >
          Вийти
        </button>
      </div>

      <div className="mt-4">
        <div className="text-xs text-white/70 mb-1.5">Пошук</div>
        <input
          value={q}
          onChange={(e) => onChangeQuery(e.target.value)}
          placeholder="Наприклад: Іван"
          className="w-full rounded-xl bg-white/90 text-slate-900 placeholder:text-slate-400 px-4 py-3 outline-none"
        />
      </div>
    </div>
  );
}