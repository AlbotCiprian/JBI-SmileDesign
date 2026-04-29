import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAppointmentEmails } from "@/lib/resend";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { appointmentSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă" }, { status: 400 });
  }

  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Date invalide", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;

  const ok = await verifyRecaptcha(data.recaptchaToken);
  if (!ok) {
    return NextResponse.json({ error: "Verificare anti-spam eșuată" }, { status: 403 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        error:
          "Sistemul de programări nu este încă configurat. Te rugăm să ne suni sau să ne scrii pe WhatsApp.",
      },
      { status: 503 },
    );
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email ?? null,
        service: data.service,
        preferredDate: new Date(data.preferredDate),
        preferredTime: data.preferredTime ?? null,
        message: data.message ?? null,
      },
    });

    // Trimitem emailurile dar nu blocăm răspunsul dacă eșuează — programarea e deja salvată.
    try {
      await sendAppointmentEmails({
        fullName: appointment.fullName,
        phone: appointment.phone,
        email: appointment.email,
        service: appointment.service,
        preferredDate: appointment.preferredDate,
        preferredTime: appointment.preferredTime,
        message: appointment.message,
      });
    } catch (err) {
      console.error("[appointment] email send failed:", err);
    }

    return NextResponse.json({ ok: true, id: appointment.id }, { status: 201 });
  } catch (err) {
    console.error("[appointment] DB error:", err);
    return NextResponse.json(
      { error: "Nu am putut salva programarea. Încearcă din nou sau sună-ne." },
      { status: 500 },
    );
  }
}
