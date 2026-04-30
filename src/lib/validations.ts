import { z } from "zod";
import { isLocale } from "@/i18n/routing";

const phoneRegex = /^[+]?[\d\s().-]{7,20}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

export type AppointmentValidationMessages = {
  nameMin: string;
  nameMax: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  messageMax: string;
  gdpr: string;
};

const roValidationMessages: AppointmentValidationMessages = {
  nameMin: "Numele este prea scurt",
  nameMax: "Numele este prea lung",
  phone: "Numar de telefon invalid",
  email: "Adresa de email invalida",
  service: "Alege un serviciu",
  date: "Alege o data valida",
  time: "Alege un interval orar",
  messageMax: "Mesajul este prea lung",
  gdpr: "Acceptul GDPR este obligatoriu",
};

export function createAppointmentSchema(messages: AppointmentValidationMessages = roValidationMessages) {
  return z.object({
    fullName: z.string().trim().min(2, messages.nameMin).max(120, messages.nameMax),
    phone: z.string().trim().regex(phoneRegex, messages.phone),
    email: z
      .string()
      .trim()
      .email(messages.email)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    service: z.string().min(1, messages.service),
    preferredDate: z.string().regex(dateRegex, messages.date),
    preferredTime: z.string().regex(timeRegex, messages.time),
    message: z
      .string()
      .max(1000, messages.messageMax)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    gdpr: z.literal(true, {
      errorMap: () => ({ message: messages.gdpr }),
    }),
    recaptchaToken: z.string().optional(),
    locale: z
      .string()
      .optional()
      .transform((value) => (isLocale(value) ? value : "ro")),
  });
}

export const appointmentSchema = createAppointmentSchema();
export type AppointmentInput = z.infer<typeof appointmentSchema>;
