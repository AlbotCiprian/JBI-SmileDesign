import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findOrCreateClientFromAppointment } from "@/lib/clients";

export const runtime = "nodejs";

const schema = z.object({
  appointmentId: z.string().min(1),
});

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

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide" }, { status: 422 });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: parsed.data.appointmentId },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Programarea nu a fost găsită" }, { status: 404 });
  }

  const { client, created } = await findOrCreateClientFromAppointment({
    fullName: appointment.fullName,
    phone: appointment.phone,
    email: appointment.email,
  });

  if (appointment.clientId !== client.id) {
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { clientId: client.id },
    });
  }

  if (!created) {
    return NextResponse.json(
      {
        ok: false,
        alreadyExists: true,
        client,
        error: "Clientul există deja în baza de date.",
      },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true, client, created: true }, { status: 201 });
}
