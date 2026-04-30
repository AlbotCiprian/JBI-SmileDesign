import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createGoogleCalendarEvent,
  isGoogleCalendarConfigured,
} from "@/lib/google-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  email: z
    .string()
    .trim()
    .email()
    .or(z.literal(""))
    .optional()
    .transform((v) => (v ? v : null)),
  service: z.string().trim().min(1).max(120),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  message: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
});

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

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide" }, { status: 422 });
  }

  const data = parsed.data;

  let appointment = await prisma.appointment.create({
    data: {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      service: data.service,
      preferredDate: new Date(`${data.preferredDate}T00:00:00`),
      preferredTime: data.preferredTime ?? null,
      message: data.message ?? null,
      status: data.status ?? "PENDING",
      source: "admin",
    },
  });

  if (
    isGoogleCalendarConfigured() &&
    appointment.preferredTime &&
    (appointment.status === "PENDING" || appointment.status === "CONFIRMED")
  ) {
    try {
      const googleEventId = await createGoogleCalendarEvent(appointment);
      if (googleEventId) {
        appointment = await prisma.appointment.update({
          where: { id: appointment.id },
          data: { googleEventId },
        });
      }
    } catch (err) {
      console.error("[admin/appointments/POST] calendar sync failed:", err);
    }
  }

  return NextResponse.json({ ok: true, appointment }, { status: 201 });
}
