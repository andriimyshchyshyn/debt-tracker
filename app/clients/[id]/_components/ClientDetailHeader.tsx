import { useRouter } from "next/navigation";
import { ClientDetail } from "./types";

type Props = {
  client: ClientDetail;
};

export function ClientDetailHeader({ client }: Props) {
  const router = useRouter();

  return (
    <div className="px-5 pt-5 pb-4 border-b border-white/10">
      {/* Кнопка назад */}
      <button
        onClick={() => router.push("/clients")}
        className="mb-4 flex items-center gap-2 text-sm text-white/70 active:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Всі клієнти
      </button>

      {/* Ім'я клієнта */}
      <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>

      {/* Телефон і нотатка */}
      {client.phone && (
        
        <a  href={`tel:${client.phone}`}
          className="mt-1 block text-sm text-white/70"
        >
          {client.phone}
        </a>
      )}
      {client.note && (
        <p className="mt-1 text-sm text-white/60 line-clamp-2">{client.note}</p>
      )}
    </div>
  );
}