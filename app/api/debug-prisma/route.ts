export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({
    hasUserModel: typeof (prisma as any).user !== "undefined",
    keys: Object.keys(prisma as any),
  });
}