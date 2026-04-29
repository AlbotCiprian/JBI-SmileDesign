"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  PartyPopper,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/cn";

type Status = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

type Appointment = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  service: string;
  preferredDate: string;
  preferredTime: string | null;
  message: string | null;
  status: Status;
  createdAt: string;
};

const STATUS_LABELS: Record<Status, string> = {
  PENDING: "În așteptare",
  CONFIRMED: "Confirmată",
  CANCELLED: "Anulată",
  COMPLETED: "Finalizată",
};

const STATUS_TONE: Record<Status, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  CONFIRMED: "bg-green-50 text-green-800 border-green-200",
  CANCELLED: "bg-red-50 text-red-800 border-red-200",
  COMPLETED: "bg-jbi-soft text-jbi-navy border-jbi-blue/20",
};

function formatDate(s: string) {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(s));
}

export function AppointmentsTable({ initialData }: { initialData: Appointment[] }) {
  const router = useRouter();
  const [data, setData] = useState<Appointment[]>(initialData);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((a) => {
      if (statusFilter && a.status !== statusFilter) return false;
      if (!q) return true;
      return (
        a.fullName.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        (a.email ?? "").toLowerCase().includes(q) ||
        a.service.toLowerCase().includes(q)
      );
    });
  }, [data, query, statusFilter]);

  async function updateStatus(id: string, status: Status) {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("update failed");
      setData((d) => d.map((a) => (a.id === id ? { ...a, status } : a)));
      startTransition(() => router.refresh());
    } catch {
      alert("Nu am putut actualiza statusul. Reîncearcă.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-jbi-navy/5 bg-white shadow-[0_2px_20px_-12px_rgba(11,31,58,0.12)]">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-jbi-navy/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-jbi-navy/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută după nume, telefon, email, serviciu..."
            className="w-full rounded-lg border border-jbi-navy/10 bg-white py-2 pl-10 pr-4 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-jbi-navy/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | "")}
            className="rounded-lg border border-jbi-navy/10 bg-white px-3 py-2 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
          >
            <option value="">Toate statusurile</option>
            {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table — scroll horizontal pe ecrane mici */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-jbi-navy/5 bg-jbi-soft/30 text-left text-xs font-semibold uppercase tracking-[0.08em] text-jbi-navy/60">
              <th className="px-4 py-3">Pacient</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Serviciu</th>
              <th className="px-4 py-3 whitespace-nowrap">Data</th>
              <th className="px-4 py-3">Ora</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-jbi-navy/50">
                  Nicio programare găsită.
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id} className="border-b border-jbi-navy/5 last:border-b-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-jbi-navy">{a.fullName}</p>
                    {a.message && (
                      <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-jbi-navy/50">
                        {a.message}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${a.phone}`}
                      className="flex items-center gap-1.5 text-jbi-navy hover:text-jbi-blue"
                    >
                      <Phone className="h-3 w-3" /> {a.phone}
                    </a>
                    {a.email && (
                      <a
                        href={`mailto:${a.email}`}
                        className="mt-1 flex items-center gap-1.5 text-xs text-jbi-navy/60 hover:text-jbi-blue"
                      >
                        <Mail className="h-3 w-3" /> {a.email}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-jbi-navy/80">{a.service}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-jbi-navy/80">
                    {formatDate(a.preferredDate)}
                  </td>
                  <td className="px-4 py-3 text-jbi-navy/80">
                    {a.preferredTime ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                        STATUS_TONE[a.status],
                      )}
                    >
                      {STATUS_LABELS[a.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {pendingId === a.id ? (
                        <span className="inline-flex h-7 w-7 items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin text-jbi-blue" />
                        </span>
                      ) : (
                        <>
                          {a.status !== "CONFIRMED" && (
                            <ActionButton
                              title="Confirmă"
                              tone="green"
                              onClick={() => updateStatus(a.id, "CONFIRMED")}
                              Icon={CheckCircle2}
                            />
                          )}
                          {a.status !== "COMPLETED" && (
                            <ActionButton
                              title="Marchează finalizată"
                              tone="navy"
                              onClick={() => updateStatus(a.id, "COMPLETED")}
                              Icon={PartyPopper}
                            />
                          )}
                          {a.status === "PENDING" && (
                            <ActionButton
                              title="Pune în așteptare"
                              tone="amber"
                              onClick={() => updateStatus(a.id, "PENDING")}
                              Icon={Clock}
                            />
                          )}
                          {a.status !== "CANCELLED" && (
                            <ActionButton
                              title="Anulează"
                              tone="red"
                              onClick={() => updateStatus(a.id, "CANCELLED")}
                              Icon={XCircle}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({
  title,
  tone,
  Icon,
  onClick,
}: {
  title: string;
  tone: "green" | "red" | "navy" | "amber";
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  const cls = {
    green: "text-green-700 hover:bg-green-50",
    red: "text-red-700 hover:bg-red-50",
    navy: "text-jbi-navy hover:bg-jbi-soft",
    amber: "text-amber-700 hover:bg-amber-50",
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md border border-jbi-navy/10 bg-white transition-colors",
        cls,
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
