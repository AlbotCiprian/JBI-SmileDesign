import { Resend } from "resend";
import { clinic } from "./data";
import { getMessagesForLocale } from "./i18n-server";
import type { Locale } from "@/i18n/routing";

const toClinic = process.env.APPOINTMENT_TO_EMAIL ?? clinic.email;
const FROM = process.env.RESEND_FROM_EMAIL ?? "JBI Smile Design <onboarding@resend.dev>";

let resend: Resend | null | undefined;

function getResend() {
  if (resend !== undefined) return resend;
  resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  return resend;
}

export type AppointmentPayload = {
  fullName: string;
  phone: string;
  email?: string | null;
  service: string;
  preferredDate: Date;
  preferredTime?: string | null;
  message?: string | null;
  locale?: Locale;
};

const dateLocales: Record<Locale, string> = {
  ro: "ro-RO",
  en: "en-US",
  ru: "ru-RU",
};

function fmtDate(d: Date, locale: Locale) {
  return new Intl.DateTimeFormat(dateLocales[locale], {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMessage(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

export async function sendAppointmentEmails(p: AppointmentPayload) {
  const client = getResend();
  if (!client) {
    console.warn("[resend] RESEND_API_KEY lipseste — sarim peste trimiterea emailurilor.");
    return { skipped: true as const };
  }

  const messages = await getMessagesForLocale(p.locale);
  const email = messages.appointment.email;
  const locale = p.locale ?? "ro";
  const dateStr = fmtDate(p.preferredDate, locale);
  const timeStr = p.preferredTime ?? email.notSpecified;
  const safeName = escapeHtml(p.fullName);

  const clinicHtml = `
    <div style="font-family: Inter, system-ui, sans-serif; color: #101828; max-width: 560px;">
      <h2 style="color:#0B1F3A;margin:0 0 8px">${email.clinicTitle}</h2>
      <p style="color:#475467;margin:0 0 24px">${email.clinicIntro}</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tbody>
          ${row(email.labels.name, safeName)}
          ${row(email.labels.phone, escapeHtml(p.phone))}
          ${row(email.labels.email, p.email ? escapeHtml(p.email) : email.empty)}
          ${row(email.labels.service, escapeHtml(p.service))}
          ${row(email.labels.date, dateStr)}
          ${row(email.labels.time, timeStr)}
          ${row(email.labels.message, p.message ? escapeHtml(p.message) : email.empty)}
        </tbody>
      </table>

      <p style="margin-top:24px;color:#475467;font-size:13px">${email.automatic}</p>
    </div>
  `;

  await client.emails.send({
    from: FROM,
    to: toClinic,
    replyTo: p.email ?? undefined,
    subject: formatMessage(email.clinicSubject, { name: p.fullName }),
    html: clinicHtml,
  });

  if (p.email) {
    const firstName = p.fullName.split(" ")[0] || p.fullName;
    const patientHtml = `
      <div style="font-family: Inter, system-ui, sans-serif; color: #101828; max-width: 560px;">
        <h2 style="color:#0B1F3A;margin:0 0 8px">${formatMessage(email.patientThanks, {
          name: escapeHtml(firstName),
        })}</h2>
        <p style="color:#475467;margin:0 0 16px">${email.patientIntro}</p>

        <div style="background:#EAF4FF;border-radius:12px;padding:16px;margin:16px 0">
          <p style="margin:0 0 8px;font-weight:600;color:#0B1F3A">${email.requestDetails}</p>
          <p style="margin:0;color:#475467;font-size:14px">
            ${escapeHtml(p.service)} · ${dateStr}${p.preferredTime ? ` · ${p.preferredTime}` : ""}
          </p>
        </div>

        <p style="color:#475467;font-size:14px;margin:16px 0 4px"><strong>${email.labels.address}:</strong> ${messages.clinic.addressFull}</p>
        <p style="color:#475467;font-size:14px;margin:0 0 4px"><strong>${email.labels.phone}:</strong> ${clinic.phone.international}</p>
        <p style="color:#475467;font-size:14px;margin:0 0 24px"><strong>${email.labels.email}:</strong> ${clinic.email}</p>

        <p style="color:#98A2B3;font-size:12px">${email.autoNotice}</p>
      </div>
    `;

    await client.emails.send({
      from: FROM,
      to: p.email,
      subject: email.patientSubject,
      html: patientHtml,
    });
  }

  return { skipped: false as const };
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #EAECF0;color:#667085;width:140px">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #EAECF0;color:#101828;font-weight:500">${value}</td>
    </tr>
  `;
}
