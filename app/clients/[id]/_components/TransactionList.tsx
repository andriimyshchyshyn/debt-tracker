import { Sale, Payment, formatUAH, formatDate } from "./types";

type Props = {
  sales: Sale[];
  payments: Payment[];
};

// Об'єднуємо продажі і оплати в один список, сортуємо по даті (нові зверху)
function mergeTransactions(sales: Sale[], payments: Payment[]) {
  const all = [
    ...sales.map((s) => ({ ...s, type: "sale" as const })),
    ...payments.map((p) => ({ ...p, type: "payment" as const })),
  ];
  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function TransactionList({ sales, payments }: Props) {
  const transactions = mergeTransactions(sales, payments);

  if (transactions.length === 0) {
    return (
      <div className="px-5 py-6 text-center text-sm text-white/60">
        Ще немає жодних операцій.
        <br />
        Додай перший продаж або оплату.
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-2">
      <div className="text-xs text-white/70 px-1 mb-3">Історія операцій</div>

      {transactions.map((t) => {
        const isSale = t.type === "sale";

        return (
          <div
            key={t.id}
            className="rounded-2xl bg-black/15 border border-white/10 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Тип + коментар */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {/* Індикатор типу */}
                  <span className={
                    "inline-block w-2 h-2 rounded-full shrink-0 " +
                    (isSale ? "bg-amber-300" : "bg-emerald-300")
                  }/>
                  <span className="text-sm font-semibold">
                    {isSale ? "Продаж" : "Оплата"}
                  </span>
                </div>
                {t.comment && (
                  <div className="mt-1 text-xs text-white/60 truncate">
                    {t.comment}
                  </div>
                )}
                <div className="mt-1 text-xs text-white/50">
                  {formatDate(t.date)}
                </div>
              </div>

              {/* Сума */}
              <div className={
                "text-base font-semibold shrink-0 " +
                (isSale ? "text-amber-200" : "text-emerald-200")
              }>
                {isSale ? "+" : "−"}{formatUAH(t.amountUAH)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}