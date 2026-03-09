export const dynamic = "force-dynamic";

async function getClients() {
  const res = await fetch("http://localhost:3000/api/clients", {
    cache: "no-store",
  });
  return res.json();
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Клієнти</h1>

      <form
        action={async (formData) => {
          "use server";
          const name = String(formData.get("name") ?? "").trim();
          if (!name) return;

          await fetch("http://localhost:3000/api/clients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          });
        }}
        className="flex gap-2"
      >
        <input
          name="name"
          placeholder="Назва клієнта"
          className="border rounded px-3 py-2 w-full"
        />
        <button className="border rounded px-4 py-2">Додати</button>
      </form>

      <ul className="space-y-2">
        {clients.map((c: any) => (
          <li key={c.id} className="border rounded p-3">
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}