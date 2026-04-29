import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.appointment.findMany({
    orderBy: [{ status: "asc" }, { preferredDate: "desc" }, { createdAt: "desc" }],
    take: 500,
  });

  return NextResponse.json({ items });
}
