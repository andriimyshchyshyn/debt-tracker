export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // 1) агрегуємо продажі по clientId
  const sales = await prisma.sale.groupBy({
    by: ["clientId"],
    _sum: { amountUAH: true },
    _max: { date: true },
  });

  // 2) агрегуємо оплати по clientId
  const payments = await prisma.payment.groupBy({
    by: ["clientId"],
    _sum: { amountUAH: true },
    _max: { date: true },
  });

  // 3) список клієнтів
  const clients = await prisma.client.findMany({
    select: { id: true, name: true, phone: true, note: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  // 4) мапи для швидкого доступу
  const salesMap = new Map(
    sales.map((s) => [
      s.clientId,
      { totalSales: s._sum.amountUAH ?? 0, lastSaleAt: s._max.date ?? null },
    ])
  );

  const paymentsMap = new Map(
    payments.map((p) => [
      p.clientId,
      {
        totalPayments: p._sum.amountUAH ?? 0,
        lastPaymentAt: p._max.date ?? null,
      },
    ])
  );

  // 5) збираємо summary
  const result = clients.map((c) => {
    const s = salesMap.get(c.id) ?? { totalSales: 0, lastSaleAt: null };
    const p = paymentsMap.get(c.id) ?? { totalPayments: 0, lastPaymentAt: null };

    const lastActivityAt =
      s.lastSaleAt && p.lastPaymentAt
        ? new Date(Math.max(+new Date(s.lastSaleAt), +new Date(p.lastPaymentAt)))
        : s.lastSaleAt ?? p.lastPaymentAt ?? c.createdAt;

    const debt = s.totalSales - p.totalPayments;

    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      note: c.note,
      totalSales: s.totalSales,
      totalPayments: p.totalPayments,
      debt,
      lastActivityAt,
    };
  });

  // 6) сортуємо: найбільший борг зверху
  result.sort((a, b) => b.debt - a.debt);

  return NextResponse.json(result);
}