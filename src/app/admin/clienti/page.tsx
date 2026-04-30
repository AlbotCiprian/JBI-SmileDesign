import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ClientsTable, type ClientRow } from "../_components/ClientsTable";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientsAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const clients = await prisma.client.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 500,
    include: {
      _count: { select: { appointments: true, notes: true } },
    },
  });

  const initialData: ClientRow[] = clients.map((c) => ({
    id: c.id,
    fullName: c.fullName,
    phone: c.phone,
    email: c.email,
    createdAt: c.createdAt.toISOString(),
    appointmentsCount: c._count.appointments,
    notesCount: c._count.notes,
  }));

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-jbi-soft text-jbi-blue">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold text-jbi-navy sm:text-3xl">
              Clienți
            </h1>
            <p className="mt-0.5 text-sm text-jbi-navy/60">
              Baza de date cu pacienți, notițe și istoric programări.
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-jbi-navy">
            Toți clienții
          </h2>
          <p className="text-xs text-jbi-navy/50">
            {initialData.length} {initialData.length === 1 ? "client" : "clienți"}
          </p>
        </div>
        <ClientsTable initialData={initialData} />
      </section>
    </div>
  );
}
