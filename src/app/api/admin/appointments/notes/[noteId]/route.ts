import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const patchSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { noteId } = await params;

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

  try {
    const note = await prisma.appointmentNote.update({
      where: { id: noteId },
      data: { body: parsed.data.body },
    });
    return NextResponse.json({ ok: true, note });
  } catch (err) {
    console.error("[admin/appointments/notes/PATCH] error:", err);
    return NextResponse.json({ error: "Notița nu a fost găsită" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ noteId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { noteId } = await params;

  try {
    await prisma.appointmentNote.delete({ where: { id: noteId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/appointments/notes/DELETE] error:", err);
    return NextResponse.json({ error: "Notița nu a fost găsită" }, { status: 404 });
  }
}
