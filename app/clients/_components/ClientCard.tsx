import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { DebtBadge } from "./DebtBadge";
import { ClientSummary } from "./types";
import { ClientCardStats } from "./ClientCardStats";
import { ClientCardMenu } from "./ClientCardMenu";
import { useState } from "react";
import dynamic from "next/dynamic";

const EditClientModal = dynamic(
  () => import("./EditClientModal").then((mod) => mod.EditClientModal),
  { ssr: false }
);

export function ClientCard({ client }: { client: ClientSummary }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => apiFetch(`/api/clients/${client.id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients-summary"] });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCardClick = () => {
    router.push(`/clients/${client.id}`);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
        className={`w-full text-left rounded-2xl bg-black/15 border border-white/10 px-4 py-4 transition-transform active:scale-[0.995] ${deleteMutation.isPending ? "opacity-50 pointer-events-none" : ""
          }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 pr-2">
            <div className="text-base font-semibold truncate">{client.name}</div>
            <div className="mt-1 text-xs text-white/70">
              Остання дія: {new Date(client.lastActivityAt).toLocaleString("uk-UA")}
            </div>
            {client.phone && (
              <div className="mt-1 text-xs text-white/70 truncate">{client.phone}</div>
            )}
          </div>

          <div className="flex items-start gap-4 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-white/70 mb-1">Борг</div>
              <DebtBadge value={client.debt} />
            </div>
            <div className="mt-1">
              <ClientCardMenu
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
              />
            </div>
          </div>
        </div>

        <ClientCardStats totalSales={client.totalSales} totalPayments={client.totalPayments} />

        {client.note && (
          <div className="mt-3 text-xs text-white/70 line-clamp-2">{client.note}</div>
        )}
      </div>

      {isEditing && (
        <EditClientModal
          client={client}
          onClose={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ["clients-summary"] });
            queryClient.invalidateQueries({ queryKey: ["client-details", client.id] });
          }}
        />
      )}
    </>
  );
}