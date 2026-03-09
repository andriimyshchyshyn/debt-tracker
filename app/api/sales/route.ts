export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSaleSchema } from "@/lib/validators/sale.schema";

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = createSaleSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { clientId, amountUAH, comment, date } = parsed.data;

  const sale = await prisma.sale.create({
    data: {
      clientId,
      amountUAH,
      comment: comment ?? null,
      date: date ? new Date(date) : new Date(),
    },
  });

  return NextResponse.json(sale, { status: 201 });
}