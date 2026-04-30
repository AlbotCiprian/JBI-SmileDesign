import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findDuplicateClient } from "@/lib/clients";

export const runtime = "nodejs";

const patchSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  email: z
    .string()
    .trim()
    .email()
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      appointments: {
        orderBy: { preferredDate: "desc" },
        take: 20,
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Clientul nu a fost găsit" }, { status: 404 });
  }

  return NextResponse.json({ client });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide" }, { status: 422 });
  }

  const current = await prisma.client.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ error: "Clientul nu a fost găsit" }, { status: 404 });
  }

  const next = {
    fullName: parsed.data.fullName ?? current.fullName,
    phone: parsed.data.phone ?? current.phone,
    email:
      parsed.data.email === undefined ? current.email : parsed.data.email,
  };

  if (
    next.fullName !== current.fullName ||
    next.phone !== current.phone ||
    next.email !== current.email
  ) {
    const duplicate = await findDuplicateClient(next);
    if (duplicate && duplicate.id !== id) {
      return NextResponse.json(
        { error: "Există deja un client cu aceleași date.", clientId: duplicate.id },
        { status: 409 },
      );
    }
  }

  try {
    const client = await prisma.client.update({
      where: { id },
      data: next,
    });
    return NextResponse.json({ ok: true, client });
  } catch (err) {
    console.error("[admin/clients/PATCH] error:", err);
    return NextResponse.json({ error: "Nu am putut actualiza clientul" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/clients/DELETE] error:", err);
    return NextResponse.json({ error: "Clientul nu a fost găsit" }, { status: 404 });
  }
}
