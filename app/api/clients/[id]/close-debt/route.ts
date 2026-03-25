export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Ctx) {
  const { id } = await params;

  try {
    const payment = await prisma.$transaction(async (tx) => {
      // 1) Рахуємо борг прямо в БД — актуальні дані
      const salesAgg = await tx.sale.aggregate({
        where: { clientId: id },
        _sum: { amountUAH: true },
      });

      const paymentsAgg = await tx.payment.aggregate({
        where: { clientId: id },
        _sum: { amountUAH: true },
      });

      const totalSales = salesAgg._sum.amountUAH ?? 0;
      const totalPayments = paymentsAgg._sum.amountUAH ?? 0;
      const debt = totalSales - totalPayments;

      // 2) Якщо боргу немає — кидаємо помилку
      if (debt <= 0) {
        throw new Error("NO_DEBT");
      }

      // 3) Створюємо оплату на точну суму боргу
      return tx.payment.create({
        data: {
          clientId: id,
          amountUAH: debt,
          comment: "Закриття боргу",
        },
      });
    });

    return NextResponse.json(payment, { status: 201 });

  } catch (e: any) {
    if (e?.message === "NO_DEBT") {
      return NextResponse.json(
        { error: "Борг вже закритий" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Щось пішло не так" },
      { status: 500 }
    );
  }
}