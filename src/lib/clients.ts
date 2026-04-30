import { prisma } from "@/lib/prisma";
import type { Client } from "@prisma/client";

function normalizePhone(value: string) {
  return value.replace(/[\s\-().]/g, "").toLowerCase();
}

function normalizeEmail(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function findDuplicateClient(input: {
  fullName: string;
  phone: string;
  email?: string | null;
}): Promise<Client | null> {
  const phone = normalizePhone(input.phone);
  const email = normalizeEmail(input.email);
  const name = normalizeName(input.fullName);

  const candidates = await prisma.client.findMany({
    where: {
      OR: [
        ...(phone ? [{ phone: input.phone }] : []),
        ...(email ? [{ email: input.email ?? "" }] : []),
      ],
    },
    take: 50,
  });

  return (
    candidates.find((c) => {
      const sameName = normalizeName(c.fullName) === name;
      const samePhone = normalizePhone(c.phone) === phone;
      const sameEmail = normalizeEmail(c.email) === email;
      return sameName && samePhone && sameEmail;
    }) ?? null
  );
}

export async function findOrCreateClientFromAppointment(input: {
  fullName: string;
  phone: string;
  email?: string | null;
}): Promise<{ client: Client; created: boolean }> {
  const existing = await findDuplicateClient(input);
  if (existing) return { client: existing, created: false };

  const client = await prisma.client.create({
    data: {
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
    },
  });

  return { client, created: true };
}
