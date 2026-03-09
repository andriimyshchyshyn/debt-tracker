export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateClientSchema } from "@/lib/validators/client-update.schema";


type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      sales: { orderBy: { date: "desc" } },
      payments: { orderBy: { date: "desc" } },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const totalSales = client.sales.reduce((sum, s) => sum + s.amountUAH, 0);
const totalPayments = client.payments.reduce((sum, p) => sum + p.amountUAH, 0);
const debt = totalSales - totalPayments;

return NextResponse.json({
  client,
  totals: { totalSales, totalPayments, debt },
});
 
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const json = await req.json();
  const parsed = updateClientSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await prisma.client.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // якщо є зв’язки і onDelete: Cascade — продажі/оплати видаляться автоматично
  await prisma.client.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}