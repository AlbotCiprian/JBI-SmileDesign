import { z } from "zod";

// Telefon RO/MD permisiv: cifre, spații, +, -, paranteze.
const phoneRegex = /^[+]?[\d\s().-]{7,20}$/;

export const appointmentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Numele este prea scurt")
    .max(120, "Numele este prea lung"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Număr de telefon invalid"),
  email: z
    .string()
    .trim()
    .email("Adresă de email invalidă")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  service: z.string().min(1, "Alege un serviciu"),
  preferredDate: z
    .string()
    .min(1, "Alege o dată")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Dată invalidă"),
  preferredTime: z.string().optional().or(z.literal("").transform(() => undefined)),
  message: z.string().max(1000, "Mesajul este prea lung").optional().or(z.literal("").transform(() => undefined)),
  gdpr: z.literal(true, {
    errorMap: () => ({ message: "Acceptul GDPR este obligatoriu" }),
  }),
  recaptchaToken: z.string().optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
