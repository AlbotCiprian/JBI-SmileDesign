import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createSchema = z.object({
  body: z.string().trim().min(1).max(4000),
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

  const notes = await prisma.clientNote.findMany({
    where: { clientId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items: notes });
}

export async function POST(
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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Date invalide" }, { status: 422 });
  }

  const exists = await prisma.client.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    return NextResponse.json({ error: "Clientul nu a fost găsit" }, { status: 404 });
  }

  const note = await prisma.clientNote.create({
    data: {
      clientId: id,
      body: parsed.data.body,
      authorEmail: session.user.email ?? null,
    },
  });

  return NextResponse.json({ ok: true, note }, { status: 201 });
}
