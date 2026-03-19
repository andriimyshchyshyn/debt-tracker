type Props = {
  name: string;
  adding: boolean;
  onChangeName: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function AddClientForm({ name, adding, onChangeName, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="px-5 pt-4 pb-4 border-b border-white/10">
      <div className="text-xs text-white/70 mb-1.5">Новий клієнт</div>
      <div className="flex gap-3">
        <input
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Назва клієнта"
          className="flex-1 rounded-xl bg-white/90 text-slate-900 placeholder:text-slate-400 px-4 py-3 outline-none"
        />
        <button
          disabled={adding}
          className="w-14 rounded-xl bg-slate-900/80 text-white font-semibold shadow active:scale-[0.99] disabled:opacity-60"
        >
          {adding ? "..." : "+"}
        </button>
      </div>
    </form>
  );
}