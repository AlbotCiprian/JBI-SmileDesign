import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});

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

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ ok: true, appointment: updated });
  } catch (err) {
    console.error("[admin/appointments/PATCH] error:", err);
    return NextResponse.json({ error: "Programarea nu a fost găsită" }, { status: 404 });
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
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/appointments/DELETE] error:", err);
    return NextResponse.json({ error: "Programarea nu a fost găsită" }, { status: 404 });
  }
}
