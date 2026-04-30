import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  isGoogleCalendarConfigured,
  updateGoogleCalendarEvent,
} from "@/lib/google-calendar";
import { findOrCreateClientFromAppointment } from "@/lib/clients";

export const runtime = "nodejs";

const patchSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  email: z.string().trim().email().nullable().optional().or(z.literal("").transform(() => null)),
  service: z.string().trim().min(1).optional(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  message: z.string().max(1000).nullable().optional().or(z.literal("").transform(() => null)),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide" }, { status: 422 });
  }

  try {
    const { preferredDate, ...rest } = parsed.data;
    let updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...rest,
        ...(preferredDate ? { preferredDate: new Date(`${preferredDate}T00:00:00`) } : {}),
      },
    });

    if (isGoogleCalendarConfigured()) {
      if (updated.status === "CANCELLED") {
        await deleteGoogleCalendarEvent(updated.googleEventId);
        if (updated.googleEventId) {
          updated = await prisma.appointment.update({
            where: { id },
            data: { googleEventId: null },
          });
        }
      } else if (updated.googleEventId) {
        await updateGoogleCalendarEvent(updated);
      } else if (updated.status === "PENDING" || updated.status === "CONFIRMED") {
        const googleEventId = await createGoogleCalendarEvent(updated);
        if (googleEventId) {
          updated = await prisma.appointment.update({
            where: { id },
            data: { googleEventId },
          });
        }
      }
    }

    if (
      (updated.status === "CONFIRMED" || updated.status === "COMPLETED") &&
      !updated.clientId
    ) {
      try {
        const { client } = await findOrCreateClientFromAppointment({
          fullName: updated.fullName,
          phone: updated.phone,
          email: updated.email,
        });
        updated = await prisma.appointment.update({
          where: { id },
          data: { clientId: client.id },
        });
      } catch (err) {
        console.error("[admin/appointments/PATCH] auto-save client failed:", err);
      }
    }

    return NextResponse.json({ ok: true, appointment: updated });
  } catch (err) {
    console.error("[admin/appointments/PATCH] error:", err);
    return NextResponse.json({ error: "Programarea nu a fost găsită" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    await deleteGoogleCalendarEvent(appointment?.googleEventId ?? null);
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/appointments/DELETE] error:", err);
    return NextResponse.json({ error: "Programarea nu a fost găsită" }, { status: 404 });
  }
}
