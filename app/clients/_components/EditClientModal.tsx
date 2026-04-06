import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Loader } from "@/app/components/Loader";
import { ClientSummary } from "./types";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/app/components/Input";

type Props = {
  client: ClientSummary;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditClientModal({ client, onClose, onSuccess }: Props) {
  const [name, setName] = useState(client.name || "");
  const [phone, setPhone] = useState(client.phone || "");
  const [note, setNote] = useState(client.note || "");
  const [err, setErr] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      apiFetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim() || undefined,
          phone: phone.trim() || null,
          note: note.trim() || null,
        }),
      }),
    onSuccess: () => {
      onSuccess();
    },
    onError: () => {
      setErr("Не вдалося зберегти. Спробуй ще раз.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErr("Ім'я є обов'язковим");
      return;
    }
    mutation.mutate();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-t-[32px] bg-gradient-to-b from-slate-800 to-slate-950
                   border-t border-white/15 shadow-2xl px-5 pt-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Редагувати клієнта</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 active:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <Input
            label="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+380..."
          />

          <Input
            label="Нотатка"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />


          {err && (
            <div className="rounded-xl bg-black/25 border border-white/10 px-4 py-3 text-sm text-white/90">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full flex items-center justify-center rounded-xl py-3 text-base font-semibold shadow active:scale-[0.99] disabled:opacity-60 bg-sky-400 text-slate-900"
          >
            {mutation.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="text-slate-900" /> Збереження...
              </div>
            ) : (
              "Зберегти"
            )}
          </button>
        </form>
      </div>
    </div >
  );
}