import { NextResponse } from "next/server";
import { getAvailabilityForDate } from "@/lib/availability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Parametrul 'date' (YYYY-MM-DD) este obligatoriu" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    // Fără DB nu putem ști ce e ocupat — răspundem cu toate slot-urile libere
    // (degradare elegantă). Pe Vercel cu env setat, nu se va întâmpla.
    return NextResponse.json({
      date,
      isOpen: true,
      closedReason: null,
      slots: [],
      warning: "DATABASE_URL nu este configurat",
    });
  }

  try {
    const data = await getAvailabilityForDate(date);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[availability] error:", err);
    return NextResponse.json({ error: "Eroare la verificarea disponibilității" }, { status: 500 });
  }
}
