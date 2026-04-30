import { google, type calendar_v3 } from "googleapis";
import type { Appointment } from "@prisma/client";

const TIME_ZONE = "Europe/Chisinau";
const EVENT_DURATION_MINUTES = 60;

let calendarClient: calendar_v3.Calendar | null | undefined;

export function isGoogleCalendarConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID,
  );
}

function getCalendarClient() {
  if (calendarClient !== undefined) return calendarClient;
  if (!isGoogleCalendarConfigured()) {
    calendarClient = null;
    return calendarClient;
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  calendarClient = google.calendar({ version: "v3", auth });
  return calendarClient;
}

function eventDateTime(date: Date, time: string, offsetMinutes = 0) {
  const [hours, minutes] = time.split(":").map(Number);
  const value = new Date(date);
  value.setHours(hours, minutes + offsetMinutes, 0, 0);

  const yyyy = value.getFullYear();
  const mm = String(value.getMonth() + 1).padStart(2, "0");
  const dd = String(value.getDate()).padStart(2, "0");
  const hh = String(value.getHours()).padStart(2, "0");
  const min = String(value.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
}

function eventBody(appointment: Appointment): calendar_v3.Schema$Event {
  const description = [
    `Pacient: ${appointment.fullName}`,
    `Telefon: ${appointment.phone}`,
    appointment.email ? `Email: ${appointment.email}` : null,
    `Serviciu: ${appointment.service}`,
    appointment.message ? `Mesaj: ${appointment.message}` : null,
    `Status: ${appointment.status}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    summary: `${appointment.fullName} — ${appointment.service}`,
    description,
    start: {
      dateTime: eventDateTime(appointment.preferredDate, appointment.preferredTime!),
      timeZone: TIME_ZONE,
    },
    end: {
      dateTime: eventDateTime(
        appointment.preferredDate,
        appointment.preferredTime!,
        EVENT_DURATION_MINUTES,
      ),
      timeZone: TIME_ZONE,
    },
  };
}

export async function createGoogleCalendarEvent(appointment: Appointment) {
  const client = getCalendarClient();
  if (!client || !appointment.preferredTime) return null;

  const res = await client.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    requestBody: eventBody(appointment),
  });

  return res.data.id ?? null;
}

export async function updateGoogleCalendarEvent(appointment: Appointment) {
  const client = getCalendarClient();
  if (!client || !appointment.googleEventId || !appointment.preferredTime) return null;

  await client.events.update({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    eventId: appointment.googleEventId,
    requestBody: eventBody(appointment),
  });

  return appointment.googleEventId;
}

export async function deleteGoogleCalendarEvent(eventId: string | null) {
  const client = getCalendarClient();
  if (!client || !eventId) return;

  try {
    await client.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId,
    });
  } catch (err) {
    console.error("[google-calendar] delete failed:", err);
  }
}
