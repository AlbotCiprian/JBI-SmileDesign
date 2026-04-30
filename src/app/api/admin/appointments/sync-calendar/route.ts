import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createGoogleCalendarEvent, isGoogleCalendarConfigured } from "@/lib/google-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isGoogleCalendarConfigured()) {
    return NextResponse.json(
      { error: "Google Calendar nu este configurat in .env." },
      { status: 400 },
    );
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      googleEventId: null,
      preferredTime: { not: null },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    orderBy: [{ preferredDate: "asc" }, { preferredTime: "asc" }],
    take: 100,
  });

  let synced = 0;
  const failed: string[] = [];

  for (const appointment of appointments) {
    try {
      const googleEventId = await createGoogleCalendarEvent(appointment);
      if (googleEventId) {
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { googleEventId },
        });
        synced += 1;
      }
    } catch (err) {
      console.error("[admin/appointments/sync-calendar] failed:", appointment.id, err);
      failed.push(appointment.id);
    }
  }

  return NextResponse.json({ ok: true, total: appointments.length, synced, failed });
}
