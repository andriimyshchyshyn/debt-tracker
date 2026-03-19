import { ClientSummary } from "./types";
import { ClientCard } from "./ClientCard";

type Props = {
  loading: boolean;
  items: ClientSummary[];
};

export function ClientsList({ loading, items }: Props) {
  if (loading) {
    return (
      <div className="px-4 py-4 space-y-3">
        <div className="h-20 rounded-2xl bg-white/10" />
        <div className="h-20 rounded-2xl bg-white/10" />
        <div className="h-20 rounded-2xl bg-white/10" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-4">
        <div className="rounded-2xl bg-black/20 border border-white/10 p-4 text-sm text-white/85">
          Нічого не знайдено. Спробуй інший запит або додай клієнта.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-3">
      {items.map((c) => (
        <ClientCard key={c.id} client={c} />
      ))}
    </div>
  );
}