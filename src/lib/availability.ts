import { prisma } from "./prisma";

/**
 * Configurarea programului clinicii. Modifică aici dacă programul se schimbă.
 *
 * Reguli:
 * - Slot interval: 30 minute
 * - Fereastra blocată per programare existentă: [T - 90min, T + 60min]
 *   (1.5h înainte conform cerinței + 1h pentru durata estimată a programării)
 * - Pentru ziua curentă, slot-urile valabile încep la cel puțin 60 min în viitor.
 */

export const SLOT_INTERVAL_MINUTES = 30;
export const BUFFER_BEFORE_MINUTES = 90;
export const APPOINTMENT_DURATION_MINUTES = 60;
const TODAY_LEAD_TIME_MINUTES = 60;

// 0 = Duminică, 1 = Luni, ..., 6 = Sâmbătă
const WORKING_HOURS: Record<number, { open: number; close: number } | null> = {
  0: null, // Duminică — închis
  1: { open: minutes(9, 0), close: minutes(19, 0) },
  2: { open: minutes(9, 0), close: minutes(19, 0) },
  3: { open: minutes(9, 0), close: minutes(19, 0) },
  4: { open: minutes(9, 0), close: minutes(19, 0) },
  5: { open: minutes(9, 0), close: minutes(19, 0) },
  6: { open: minutes(10, 0), close: minutes(15, 0) }, // Sâmbătă scurt
};

const DAY_NAMES = [
  "duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă",
];

export type Slot = { time: string; available: boolean };

export type AvailabilityResponse = {
  date: string;
  isOpen: boolean;
  closedReason: string | null;
  slots: Slot[];
};

function minutes(h: number, m: number): number {
  return h * 60 + m;
}

function formatHHMM(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function parseHHMM(s: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
}

/** Generează lista de slot-uri pentru o anumită zi a săptămânii (0–6). */
function generateSlots(dayOfWeek: number): string[] {
  const wh = WORKING_HOURS[dayOfWeek];
  if (!wh) return [];
  const out: string[] = [];
  for (let m = wh.open; m < wh.close; m += SLOT_INTERVAL_MINUTES) {
    out.push(formatHHMM(m));
  }
  return out;
}

/** Parsează un string YYYY-MM-DD ca dată locală (00:00). */
function parseDateLocal(dateStr: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return null;
  const [, y, mo, d] = m;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d));
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

export async function getAvailabilityForDate(
  dateStr: string,
): Promise<AvailabilityResponse> {
  const date = parseDateLocal(dateStr);
  if (!date) {
    return { date: dateStr, isOpen: false, closedReason: "Dată invalidă", slots: [] };
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (date < startOfToday) {
    return { date: dateStr, isOpen: false, closedReason: "Această dată a trecut", slots: [] };
  }

  const dayOfWeek = date.getDay();
  const wh = WORKING_HOURS[dayOfWeek];
  if (!wh) {
    return {
      date: dateStr,
      isOpen: false,
      closedReason: `Clinica este închisă ${DAY_NAMES[dayOfWeek]}`,
      slots: [],
    };
  }

  const baseSlots = generateSlots(dayOfWeek);

  // Caută programări existente în acea zi (rezervare = PENDING sau CONFIRMED).
  const startOfDate = new Date(date);
  const endOfDate = new Date(date);
  endOfDate.setHours(23, 59, 59, 999);

  const existing = await prisma.appointment.findMany({
    where: {
      preferredDate: { gte: startOfDate, lte: endOfDate },
      preferredTime: { not: null },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: { preferredTime: true },
  });

  const blockedRanges: Array<[number, number]> = [];
  for (const appt of existing) {
    if (!appt.preferredTime) continue;
    const t = parseHHMM(appt.preferredTime);
    if (t === null) continue;
    blockedRanges.push([t - BUFFER_BEFORE_MINUTES, t + APPOINTMENT_DURATION_MINUTES]);
  }

  const isToday = date.toDateString() === now.toDateString();
  const minTimeToday = isToday
    ? now.getHours() * 60 + now.getMinutes() + TODAY_LEAD_TIME_MINUTES
    : -1;

  const slots: Slot[] = baseSlots.map((time) => {
    const t = parseHHMM(time)!;
    const inBlocked = blockedRanges.some(([a, b]) => t >= a && t < b);
    const tooSoon = isToday && t < minTimeToday;
    return { time, available: !inBlocked && !tooSoon };
  });

  return { date: dateStr, isOpen: true, closedReason: null, slots };
}

/** Verifică server-side dacă un slot anume este disponibil. */
export async function isSlotAvailable(dateStr: string, time: string): Promise<boolean> {
  const av = await getAvailabilityForDate(dateStr);
  if (!av.isOpen) return false;
  const slot = av.slots.find((s) => s.time === time);
  return !!slot && slot.available;
}
