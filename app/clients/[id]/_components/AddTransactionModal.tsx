import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Loader } from "@/app/components/Loader";
import { Input } from "@/app/components/Input";

type Mode = "sale" | "payment";

type Props = {
  clientId: string;
  mode: Mode;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddTransactionModal({ clientId, mode, onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isSale = mode === "sale";
  const title = isSale ? "Додати продаж" : "Додати оплату";
  const endpoint = isSale ? "/api/sales" : "/api/payments";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const amountNum = parseInt(amount.replace(/\s/g, ""), 10);
    if (!amountNum || amountNum <= 0) {
      setErr("Введи суму більше 0");
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          clientId,
          amountUAH: amountNum,
          comment: comment.trim() || null,
        }),
      });
      onSuccess();
    } catch {
      setErr("Не вдалося зберегти. Спробуй ще раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // Затемнений фон — клік закриває модалку
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Сама модалка — клік всередині не закриває */}
      <div
        className="w-full max-w-md rounded-t-[32px] bg-gradient-to-b from-sky-800 to-indigo-950
                   border-t border-white/15 shadow-2xl px-5 pt-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-white/60 active:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Сума */}
          <Input
            label="Сума (грн)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Наприклад: 5000"
            inputMode="numeric"
            autoFocus
          />

          {/* Коментар */}
          <Input
            label="Коментар (необов'язково)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={isSale ? "Яблука, 200 кг" : "Часткова оплата"}
          />

          {err && (
            <div className="rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-sm text-white/90">
              {err}
            </div>
          )}

          {/* Кнопка */}
          <button
            disabled={loading}
            className={
              "cursor-pointer w-full flex items-center justify-center rounded-xl py-3 text-base font-semibold shadow active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed " +
              (isSale
                ? "bg-amber-400 text-slate-900"
                : "bg-emerald-400 text-slate-900")
            }
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="text-slate-900" /> Збереження...
              </div>
            ) : (
              title
            )}
          </button>
        </form>
      </div>
    </div>
  );
}