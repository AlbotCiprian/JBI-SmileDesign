import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppointmentsTable } from "./_components/AppointmentsTable";
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const [total, pending, confirmed, today] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "CONFIRMED" } }),
    prisma.appointment.count({
      where: {
        preferredDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
  ]);
  return { total, pending, confirmed, today };
}

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const stats = await getStats();
  const appointments = await prisma.appointment.findMany({
    orderBy: [{ status: "asc" }, { preferredDate: "desc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-semibold text-jbi-navy sm:text-3xl">
          Bună, {session.user.name?.split(" ")[0] ?? "admin"} 👋
        </h1>
        <p className="mt-1 text-sm text-jbi-navy/60">
          Iată o privire de ansamblu asupra programărilor.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total programări" value={stats.total} Icon={Calendar} tone="navy" />
        <StatCard label="În așteptare" value={stats.pending} Icon={Clock} tone="amber" />
        <StatCard label="Confirmate" value={stats.confirmed} Icon={CheckCircle2} tone="green" />
        <StatCard label="Programări azi" value={stats.today} Icon={Calendar} tone="blue" />
      </div>

      <section id="programari" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-jbi-navy">
            Toate programările
          </h2>
          <p className="text-xs text-jbi-navy/50">
            {appointments.length} {appointments.length === 1 ? "rezultat" : "rezultate"}
          </p>
        </div>
        <AppointmentsTable initialData={JSON.parse(JSON.stringify(appointments))} />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: number;
  Icon: React.ComponentType<{ className?: string }>;
  tone: "navy" | "amber" | "green" | "blue";
}) {
  const toneCls = {
    navy: "from-jbi-navy to-[#0e2747] text-white",
    amber: "from-amber-50 to-amber-100 text-amber-900",
    green: "from-green-50 to-green-100 text-green-900",
    blue: "from-jbi-soft to-jbi-soft/50 text-jbi-navy",
  }[tone];
  return (
    <div
      className={`rounded-2xl border border-jbi-navy/5 bg-gradient-to-br p-5 shadow-[0_2px_20px_-12px_rgba(11,31,58,0.12)] ${toneCls}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">
          {label}
        </p>
        <Icon className="h-5 w-5 opacity-70" />
      </div>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}
