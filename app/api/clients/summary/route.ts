export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        c.id, 
        c.name, 
        c.phone, 
        c.note, 
        COALESCE(s."totalSales", 0)::INT as "totalSales",
        COALESCE(p."totalPayments", 0)::INT as "totalPayments",
        (COALESCE(s."totalSales", 0) - COALESCE(p."totalPayments", 0))::INT as "debt",
        GREATEST(c."createdAt", s."lastSaleAt", p."lastPaymentAt") as "lastActivityAt"
      FROM "Client" c
      LEFT JOIN (
        SELECT "clientId", SUM("amountUAH") as "totalSales", MAX("date") as "lastSaleAt"
        FROM "Sale"
        GROUP BY "clientId"
      ) s ON c.id = s."clientId"
      LEFT JOIN (
        SELECT "clientId", SUM("amountUAH") as "totalPayments", MAX("date") as "lastPaymentAt"
        FROM "Payment"
        GROUP BY "clientId"
      ) p ON c.id = p."clientId"
      ORDER BY "debt" DESC
    `;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Summary report error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}