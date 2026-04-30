import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAppointmentEmails } from "@/lib/resend";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { createAppointmentSchema, type AppointmentValidationMessages } from "@/lib/validations";
import { isSlotAvailable } from "@/lib/availability";
import { getMessagesForLocale } from "@/lib/i18n-server";
import { isLocale, routing, type Locale } from "@/i18n/routing";
import { createGoogleCalendarEvent, isGoogleCalendarConfigured } from "@/lib/google-calendar";

export const runtime = "nodejs";

function bodyLocale(body: unknown): Locale {
  if (body && typeof body === "object" && "locale" in body) {
    const value = (body as { locale?: unknown }).locale;
    if (typeof value === "string" && isLocale(value)) return value;
  }

  return routing.defaultLocale;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    const messages = await getMessagesForLocale();
    return NextResponse.json({ error: messages.appointment.api.invalidRequest }, { status: 400 });
  }

  const locale = bodyLocale(body);
  const messages = await getMessagesForLocale(locale);
  const schema = createAppointmentSchema(messages.appointment.validation as AppointmentValidationMessages);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: messages.appointment.api.invalidData, issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;

  const ok = await verifyRecaptcha(data.recaptchaToken);
  if (!ok) {
    return NextResponse.json({ error: messages.appointment.api.recaptchaFailed }, { status: 403 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: messages.appointment.api.notConfigured }, { status: 503 });
  }

  const stillAvailable = await isSlotAvailable(data.preferredDate, data.preferredTime);
  if (!stillAvailable) {
    return NextResponse.json({ error: messages.appointment.api.slotTaken }, { status: 409 });
  }

  try {
    const dateOnly = new Date(`${data.preferredDate}T00:00:00`);

    const appointment = await prisma.appointment.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email ?? null,
        service: data.service,
        preferredDate: dateOnly,
        preferredTime: data.preferredTime,
        message: data.message ?? null,
      },
    });

    if (isGoogleCalendarConfigured()) {
      try {
        const googleEventId = await createGoogleCalendarEvent(appointment);
        if (googleEventId) {
          await prisma.appointment.update({
            where: { id: appointment.id },
            data: { googleEventId },
          });
        }
      } catch (err) {
        console.error("[appointment] calendar sync failed:", err);
      }
    }

    try {
      await sendAppointmentEmails({
        fullName: appointment.fullName,
        phone: appointment.phone,
        email: appointment.email,
        service: appointment.service,
        preferredDate: appointment.preferredDate,
        preferredTime: appointment.preferredTime,
        message: appointment.message,
        locale,
      });
    } catch (err) {
      console.error("[appointment] email send failed:", err);
    }

    return NextResponse.json({ ok: true, id: appointment.id }, { status: 201 });
  } catch (err) {
    console.error("[appointment] DB error:", err);
    return NextResponse.json({ error: messages.appointment.api.saveFailed }, { status: 500 });
  }
}
