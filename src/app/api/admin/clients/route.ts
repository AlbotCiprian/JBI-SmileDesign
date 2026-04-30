import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findDuplicateClient } from "@/lib/clients";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  email: z
    .string()
    .trim()
    .email()
    .or(z.literal(""))
    .optional()
    .transform((v) => (v ? v : null)),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.client.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 500,
    include: {
      _count: { select: { appointments: true, notes: true } },
    },
  });

  return NextResponse.json({ items });
}

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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide" }, { status: 422 });
  }

  const duplicate = await findDuplicateClient(parsed.data);
  if (duplicate) {
    return NextResponse.json(
      { error: "Acest client există deja.", clientId: duplicate.id },
      { status: 409 },
    );
  }

  const client = await prisma.client.create({
    data: {
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email,
    },
  });

  return NextResponse.json({ ok: true, client }, { status: 201 });
}
