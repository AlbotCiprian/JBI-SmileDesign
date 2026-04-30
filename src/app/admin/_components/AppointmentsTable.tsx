"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
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
  RefreshCw,
  Eye,
  Pencil,
  Download,
  Bell,
  Trash2,
  UserPlus,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { NotesPanel } from "./NotesPanel";

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
  googleEventId?: string | null;
};

const STATUS_LABELS: Record<Status, string> = {
  PENDING: "In asteptare",
  CONFIRMED: "Confirmata",
  CANCELLED: "Anulata",
  COMPLETED: "Finalizata",
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

function dateInputValue(s: string) {
  return new Date(s).toISOString().split("T")[0];
}

function csvEscape(value: string | null | undefined) {
  const safe = value ?? "";
  return `"${safe.replace(/"/g, '""')}"`;
}

export function AppointmentsTable({ initialData }: { initialData: Appointment[] }) {
  const router = useRouter();
  const [data, setData] = useState<Appointment[]>(initialData);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [syncingCalendar, setSyncingCalendar] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [creating, setCreating] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
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

  useEffect(() => {
    const timer = window.setInterval(async () => {
      try {
        const res = await fetch("/api/admin/appointments", { cache: "no-store" });
        if (!res.ok) return;
        const body = (await res.json()) as { items?: Appointment[] };
        const items = body.items ?? [];
        setData((current) => {
          const currentNewest = Math.max(0, ...current.map((a) => new Date(a.createdAt).getTime()));
          const incoming = items.filter((a) => new Date(a.createdAt).getTime() > currentNewest);
          if (incoming.length > 0) {
            setNewCount((count) => count + incoming.length);
            if (audioEnabled) playBeep();
          }
          return items.length ? items : current;
        });
      } catch {
        // Silent polling failure keeps the admin table usable.
      }
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [audioEnabled]);

  async function updateAppointment(id: string, payload: Partial<Appointment>) {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { appointment?: Appointment };
      if (!res.ok || !body.appointment) throw new Error("update failed");
      setData((d) => d.map((a) => (a.id === id ? body.appointment! : a)));
      setEditing(null);
      startTransition(() => router.refresh());
    } catch {
      alert("Nu am putut actualiza programarea. Reincearca.");
    } finally {
      setPendingId(null);
    }
  }

  async function deleteAppointment(id: string) {
    if (!confirm("Sigur ștergi programarea? Acțiunea nu poate fi anulată.")) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      setData((d) => d.filter((a) => a.id !== id));
      setSelected((s) => (s?.id === id ? null : s));
      setEditing((e) => (e?.id === id ? null : e));
      startTransition(() => router.refresh());
    } catch {
      alert("Nu am putut șterge programarea.");
    } finally {
      setPendingId(null);
    }
  }

  async function saveAsClient(id: string) {
    setPendingId(id);
    try {
      const res = await fetch("/api/admin/clients/from-appointment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ appointmentId: id }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        alreadyExists?: boolean;
        error?: string;
      };
      if (res.status === 409 && body.alreadyExists) {
        alert(body.error ?? "Clientul există deja.");
        return;
      }
      if (!res.ok) throw new Error(body.error ?? "save failed");
      alert("Clientul a fost salvat cu succes.");
      startTransition(() => router.refresh());
    } catch (err) {
      alert(err instanceof Error ? err.message : "Nu am putut salva clientul.");
    } finally {
      setPendingId(null);
    }
  }

  async function createAppointment(payload: NewAppointmentForm) {
    setPendingId("__new__");
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { appointment?: Appointment; error?: string };
      if (!res.ok || !body.appointment) throw new Error(body.error ?? "create failed");
      setData((d) => [body.appointment!, ...d]);
      setCreating(false);
      startTransition(() => router.refresh());
    } catch (err) {
      alert(err instanceof Error ? err.message : "Nu am putut crea programarea.");
    } finally {
      setPendingId(null);
    }
  }

  async function syncCalendar() {
    setSyncingCalendar(true);
    try {
      const res = await fetch("/api/admin/appointments/sync-calendar", { method: "POST" });
      const body = (await res.json().catch(() => ({}))) as {
        synced?: number;
        total?: number;
        error?: string;
      };
      if (!res.ok) throw new Error(body.error ?? "sync failed");
      alert(`Sincronizare Google Calendar: ${body.synced ?? 0}/${body.total ?? 0} programari.`);
      startTransition(() => router.refresh());
    } catch (err) {
      alert(err instanceof Error ? err.message : "Nu am putut sincroniza Google Calendar.");
    } finally {
      setSyncingCalendar(false);
    }
  }

  function exportCsv() {
    const rows = [
      ["Pacient", "Telefon", "Email", "Serviciu", "Data", "Ora", "Status", "Mesaj"],
      ...filtered.map((a) => [
        a.fullName,
        a.phone,
        a.email ?? "",
        a.service,
        dateInputValue(a.preferredDate),
        a.preferredTime ?? "",
        STATUS_LABELS[a.status],
        a.message ?? "",
      ]),
    ];
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "programari-jbi.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-jbi-navy/5 bg-white shadow-[0_2px_20px_-12px_rgba(11,31,58,0.12)]">
        <div className="flex flex-col gap-3 border-b border-jbi-navy/5 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-jbi-navy/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cauta dupa nume, telefon, email, serviciu..."
              className="w-full rounded-lg border border-jbi-navy/10 bg-white py-2 pl-10 pr-4 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-jbi-navy px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-jbi-blue"
            >
              <Plus className="h-4 w-4" />
              Programare nouă
            </button>
            <button
              type="button"
              onClick={() => {
                setAudioEnabled((value) => !value);
                setNewCount(0);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                audioEnabled
                  ? "border-jbi-blue bg-jbi-soft text-jbi-blue"
                  : "border-jbi-navy/10 bg-white text-jbi-navy hover:bg-jbi-soft",
              )}
            >
              <Bell className="h-4 w-4" />
              Noi {newCount > 0 ? `(${newCount})` : ""}
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-lg border border-jbi-navy/10 bg-white px-3 py-2 text-sm font-semibold text-jbi-navy transition-colors hover:bg-jbi-soft"
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
            <button
              type="button"
              onClick={syncCalendar}
              disabled={syncingCalendar}
              className="inline-flex items-center gap-2 rounded-lg border border-jbi-navy/10 bg-white px-3 py-2 text-sm font-semibold text-jbi-navy transition-colors hover:bg-jbi-soft disabled:cursor-not-allowed disabled:opacity-70"
            >
              <RefreshCw className={cn("h-4 w-4", syncingCalendar && "animate-spin")} />
              Sync Calendar
            </button>
            <Filter className="h-4 w-4 text-jbi-navy/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | "")}
              className="rounded-lg border border-jbi-navy/10 bg-white px-3 py-2 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
            >
              <option value="">Toate statusurile</option>
              {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-jbi-navy/5 bg-jbi-soft/30 text-left text-xs font-semibold uppercase tracking-[0.08em] text-jbi-navy/60">
                <th className="px-4 py-3">Pacient</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Serviciu</th>
                <th className="whitespace-nowrap px-4 py-3">Data</th>
                <th className="px-4 py-3">Ora</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-jbi-navy/50">
                    Nicio programare gasita.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b border-jbi-navy/5 last:border-b-0">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-jbi-navy">{a.fullName}</p>
                      {a.message && <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-jbi-navy/50">{a.message}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`tel:${a.phone}`} className="flex items-center gap-1.5 text-jbi-navy hover:text-jbi-blue">
                        <Phone className="h-3 w-3" /> {a.phone}
                      </a>
                      {a.email && (
                        <a href={`mailto:${a.email}`} className="mt-1 flex items-center gap-1.5 text-xs text-jbi-navy/60 hover:text-jbi-blue">
                          <Mail className="h-3 w-3" /> {a.email}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-jbi-navy/80">{a.service}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-jbi-navy/80">{formatDate(a.preferredDate)}</td>
                    <td className="px-4 py-3 text-jbi-navy/80">{a.preferredTime ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", STATUS_TONE[a.status])}>
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
                            <ActionButton title="Detalii" tone="navy" onClick={() => setSelected(a)} Icon={Eye} />
                            <ActionButton title="Editeaza" tone="navy" onClick={() => setEditing(a)} Icon={Pencil} />
                            <ActionButton title="Salveaza ca client" tone="navy" onClick={() => saveAsClient(a.id)} Icon={UserPlus} />
                            {a.status !== "CONFIRMED" && (
                              <ActionButton title="Confirma" tone="green" onClick={() => updateAppointment(a.id, { status: "CONFIRMED" })} Icon={CheckCircle2} />
                            )}
                            {a.status !== "COMPLETED" && (
                              <ActionButton title="Marcheaza finalizata" tone="navy" onClick={() => updateAppointment(a.id, { status: "COMPLETED" })} Icon={PartyPopper} />
                            )}
                            {a.status !== "PENDING" && (
                              <ActionButton title="Pune in asteptare" tone="amber" onClick={() => updateAppointment(a.id, { status: "PENDING" })} Icon={Clock} />
                            )}
                            {a.status !== "CANCELLED" && (
                              <ActionButton title="Anuleaza" tone="red" onClick={() => updateAppointment(a.id, { status: "CANCELLED" })} Icon={XCircle} />
                            )}
                            <ActionButton title="Sterge" tone="red" onClick={() => deleteAppointment(a.id)} Icon={Trash2} />
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

      {selected && (
        <DetailsModal
          appointment={selected}
          onClose={() => setSelected(null)}
          onSaveAsClient={() => saveAsClient(selected.id)}
          onDelete={() => deleteAppointment(selected.id)}
          onEdit={() => {
            const target = selected;
            setSelected(null);
            setEditing(target);
          }}
        />
      )}
      {editing && (
        <EditModal
          appointment={editing}
          pending={pendingId === editing.id}
          onClose={() => setEditing(null)}
          onSave={(payload) => updateAppointment(editing.id, payload)}
        />
      )}
      {creating && (
        <CreateAppointmentModal
          pending={pendingId === "__new__"}
          onClose={() => setCreating(false)}
          onSave={(payload) => createAppointment(payload)}
        />
      )}
    </>
  );
}

function DetailsModal({
  appointment,
  onClose,
  onSaveAsClient,
  onDelete,
  onEdit,
}: {
  appointment: Appointment;
  onClose: () => void;
  onSaveAsClient: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-jbi-navy/50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="my-6 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jbi-navy/50">Detalii programare</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-jbi-navy">{appointment.fullName}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-semibold text-jbi-navy hover:bg-jbi-soft">
            <X className="h-4 w-4" />
          </button>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label="Telefon" value={appointment.phone} />
          <Info label="Email" value={appointment.email ?? "—"} />
          <Info label="Serviciu" value={appointment.service} />
          <Info label="Data" value={`${formatDate(appointment.preferredDate)} ${appointment.preferredTime ?? ""}`} />
          <Info label="Status" value={STATUS_LABELS[appointment.status]} />
          <Info label="Google Calendar" value={appointment.googleEventId ? "Sincronizat" : "Nesincronizat"} />
        </dl>
        <div className="mt-5 rounded-xl bg-jbi-soft/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jbi-navy/50">Mesaj de la pacient</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-jbi-navy/75">{appointment.message ?? "—"}</p>
        </div>

        <div className="mt-5">
          <NotesPanel kind="appointment" ownerId={appointment.id} title="Notițe pentru această programare" />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onSaveAsClient}
            className="inline-flex items-center gap-2 rounded-lg border border-jbi-navy/10 bg-white px-3 py-2 text-sm font-semibold text-jbi-navy hover:bg-jbi-soft"
          >
            <UserPlus className="h-4 w-4" />
            Salvează ca client
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-lg border border-jbi-navy/10 bg-white px-3 py-2 text-sm font-semibold text-jbi-navy hover:bg-jbi-soft"
          >
            <Pencil className="h-4 w-4" />
            Editează
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Șterge
          </button>
        </div>
      </div>
    </div>
  );
}

type NewAppointmentForm = {
  fullName: string;
  phone: string;
  email: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  status: Status;
  message: string;
};

function CreateAppointmentModal({
  pending,
  onClose,
  onSave,
}: {
  pending: boolean;
  onClose: () => void;
  onSave: (payload: NewAppointmentForm) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState<NewAppointmentForm>({
    fullName: "",
    phone: "",
    email: "",
    service: "",
    preferredDate: today,
    preferredTime: "",
    status: "PENDING",
    message: "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-jbi-navy/50 p-4 backdrop-blur-sm overflow-y-auto">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}
        className="my-6 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-soft"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jbi-navy/50">Programare nouă</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-jbi-navy">Adaugă o programare manual</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-semibold text-jbi-navy hover:bg-jbi-soft">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <EditInput label="Nume complet" value={form.fullName} onChange={(fullName) => setForm((f) => ({ ...f, fullName }))} required />
          <EditInput label="Telefon" value={form.phone} onChange={(phone) => setForm((f) => ({ ...f, phone }))} required />
          <EditInput label="Email" type="email" value={form.email} onChange={(email) => setForm((f) => ({ ...f, email }))} />
          <EditInput label="Serviciu" value={form.service} onChange={(service) => setForm((f) => ({ ...f, service }))} required />
          <EditInput label="Data" type="date" value={form.preferredDate} onChange={(preferredDate) => setForm((f) => ({ ...f, preferredDate }))} required />
          <EditInput label="Ora" type="time" value={form.preferredTime} onChange={(preferredTime) => setForm((f) => ({ ...f, preferredTime }))} />
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-jbi-navy/50">Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}
              className="w-full rounded-xl border border-jbi-navy/10 px-3 py-2 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
            >
              {(Object.keys(STATUS_LABELS) as Status[]).map((status) => (
                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-jbi-navy/50">Mesaj (opțional)</span>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-jbi-navy/10 px-3 py-2 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary">Anulează</button>
          <button type="submit" disabled={pending} className="btn-primary disabled:opacity-70">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Salvează programarea
          </button>
        </div>
      </form>
    </div>
  );
}

function EditModal({
  appointment,
  pending,
  onClose,
  onSave,
}: {
  appointment: Appointment;
  pending: boolean;
  onClose: () => void;
  onSave: (payload: Partial<Appointment>) => void;
}) {
  const [form, setForm] = useState({
    fullName: appointment.fullName,
    phone: appointment.phone,
    email: appointment.email ?? "",
    service: appointment.service,
    preferredDate: dateInputValue(appointment.preferredDate),
    preferredTime: appointment.preferredTime ?? "",
    status: appointment.status,
    message: appointment.message ?? "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-jbi-navy/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form as Partial<Appointment>);
        }}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-soft"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jbi-navy/50">Editare programare</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-jbi-navy">{appointment.fullName}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-semibold text-jbi-navy hover:bg-jbi-soft">Inchide</button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <EditInput label="Nume" value={form.fullName} onChange={(fullName) => setForm((f) => ({ ...f, fullName }))} />
          <EditInput label="Telefon" value={form.phone} onChange={(phone) => setForm((f) => ({ ...f, phone }))} />
          <EditInput label="Email" value={form.email} onChange={(email) => setForm((f) => ({ ...f, email }))} />
          <EditInput label="Serviciu" value={form.service} onChange={(service) => setForm((f) => ({ ...f, service }))} />
          <EditInput label="Data" type="date" value={form.preferredDate} onChange={(preferredDate) => setForm((f) => ({ ...f, preferredDate }))} />
          <EditInput label="Ora" type="time" value={form.preferredTime} onChange={(preferredTime) => setForm((f) => ({ ...f, preferredTime }))} />
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-jbi-navy/50">Status</span>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))} className="w-full rounded-xl border border-jbi-navy/10 px-3 py-2 text-sm">
              {(Object.keys(STATUS_LABELS) as Status[]).map((status) => (
                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-jbi-navy/50">Mesaj</span>
            <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={3} className="w-full rounded-xl border border-jbi-navy/10 px-3 py-2 text-sm" />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary">Anuleaza</button>
          <button type="submit" disabled={pending} className="btn-primary disabled:opacity-70">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Salveaza
          </button>
        </div>
      </form>
    </div>
  );
}

function EditInput({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-jbi-navy/50">{label}</span>
      <input
        value={value}
        type={type}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-jbi-navy/10 px-3 py-2 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
      />
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-jbi-navy/5 bg-jbi-soft/30 p-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-jbi-navy/50">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-jbi-navy">{value}</dd>
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
      className={cn("inline-flex h-7 w-7 items-center justify-center rounded-md border border-jbi-navy/10 bg-white transition-colors", cls)}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function playBeep() {
  try {
    const AudioContext = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.frequency.value = 880;
    gain.gain.value = 0.04;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.18);
  } catch {
    // Audio notification is optional.
  }
}
