export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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