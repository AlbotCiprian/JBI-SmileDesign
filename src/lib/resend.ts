import { Resend } from "resend";
import { clinic } from "./data";

const apiKey = process.env.RESEND_API_KEY;
const toClinic = process.env.APPOINTMENT_TO_EMAIL ?? clinic.email;

// Pentru testare folosim domeniul Resend onboarding (nu necesită verificare).
// Pentru producție, schimbă cu un domeniu verificat în Resend (ex. noreply@jbismiledesign.md).
const FROM = "JBI Smile Design <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

export type AppointmentPayload = {
  fullName: string;
  phone: string;
  email?: string | null;
  service: string;
  preferredDate: Date;
  preferredTime?: string | null;
  message?: string | null;
};

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export async function sendAppointmentEmails(p: AppointmentPayload) {
  if (!resend) {
    // Resend nu e configurat — log clar pentru dev.
    console.warn("[resend] RESEND_API_KEY lipsește — sărim peste trimiterea emailurilor.");
    return { skipped: true as const };
  }

  const dateStr = fmtDate(p.preferredDate);
  const timeStr = p.preferredTime ?? "neprecizat";

  // Email către clinică
  const clinicHtml = `
    <div style="font-family: Inter, system-ui, sans-serif; color: #101828; max-width: 560px;">
      <h2 style="color:#0B1F3A;margin:0 0 8px">Programare nouă</h2>
      <p style="color:#475467;margin:0 0 24px">Ai primit o nouă cerere prin website.</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tbody>
          ${row("Nume", p.fullName)}
          ${row("Telefon", p.phone)}
          ${row("Email", p.email ?? "—")}
          ${row("Serviciu", p.service)}
          ${row("Data preferată", dateStr)}
          ${row("Ora preferată", timeStr)}
          ${row("Mesaj", (p.message ?? "—").replace(/</g, "&lt;"))}
        </tbody>
      </table>

      <p style="margin-top:24px;color:#475467;font-size:13px">
        Trimis automat de website-ul JBI Smile Design.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to: toClinic,
    replyTo: p.email ?? undefined,
    subject: `Programare nouă — ${p.fullName}`,
    html: clinicHtml,
  });

  // Email confirmare către pacient (opțional, doar dacă a dat email)
  if (p.email) {
    const patientHtml = `
      <div style="font-family: Inter, system-ui, sans-serif; color: #101828; max-width: 560px;">
        <h2 style="color:#0B1F3A;margin:0 0 8px">Mulțumim, ${p.fullName.split(" ")[0]}!</h2>
        <p style="color:#475467;margin:0 0 16px">
          Am primit cererea ta de programare la <strong>JBI Smile Design</strong>.
          Echipa noastră te va contacta în cel mai scurt timp pentru a confirma ora exactă.
        </p>

        <div style="background:#EAF4FF;border-radius:12px;padding:16px;margin:16px 0">
          <p style="margin:0 0 8px;font-weight:600;color:#0B1F3A">Detalii cerere</p>
          <p style="margin:0;color:#475467;font-size:14px">
            ${p.service} · ${dateStr}${p.preferredTime ? ` · ${p.preferredTime}` : ""}
          </p>
        </div>

        <p style="color:#475467;font-size:14px;margin:16px 0 4px"><strong>Adresa:</strong> ${clinic.address.full}</p>
        <p style="color:#475467;font-size:14px;margin:0 0 4px"><strong>Telefon:</strong> ${clinic.phone.international}</p>
        <p style="color:#475467;font-size:14px;margin:0 0 24px"><strong>Email:</strong> ${clinic.email}</p>

        <p style="color:#98A2B3;font-size:12px">
          Acest email este trimis automat. Pentru întrebări urgente, sună-ne sau scrie-ne pe WhatsApp.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: FROM,
      to: p.email,
      subject: "Am primit solicitarea ta de programare — JBI Smile Design",
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
