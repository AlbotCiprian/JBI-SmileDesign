"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Phone,
  Mail,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { NotesPanel } from "./NotesPanel";

export type ClientRow = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  createdAt: string;
  appointmentsCount: number;
  notesCount: number;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function ClientsTable({ initialData }: { initialData: ClientRow[] }) {
  const router = useRouter();
  const [data, setData] = useState<ClientRow[]>(initialData);
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ClientRow | null>(null);
  const [viewing, setViewing] = useState<ClientRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q),
    );
  }, [data, query]);

  async function saveClient(
    id: string | null,
    payload: { fullName: string; phone: string; email: string },
  ) {
    setPendingId(id ?? "__new__");
    try {
      const res = await fetch(id ? `/api/admin/clients/${id}` : "/api/admin/clients", {
        method: id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: payload.fullName,
          phone: payload.phone,
          email: payload.email || null,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        client?: { id: string; fullName: string; phone: string; email: string | null; createdAt: string };
        error?: string;
      };
      if (!res.ok || !body.client) throw new Error(body.error ?? "save failed");

      const row: ClientRow = {
        id: body.client.id,
        fullName: body.client.fullName,
        phone: body.client.phone,
        email: body.client.email,
        createdAt: body.client.createdAt,
        appointmentsCount: id ? data.find((c) => c.id === id)?.appointmentsCount ?? 0 : 0,
        notesCount: id ? data.find((c) => c.id === id)?.notesCount ?? 0 : 0,
      };

      setData((prev) => {
        if (id) return prev.map((c) => (c.id === id ? row : c));
        return [row, ...prev];
      });
      setEditing(null);
      setCreating(false);
      startTransition(() => router.refresh());
    } catch (err) {
      alert(err instanceof Error ? err.message : "Nu am putut salva clientul.");
    } finally {
      setPendingId(null);
    }
  }

  async function deleteClient(id: string) {
    if (!confirm("Sigur ștergi clientul? Notițele lui se șterg automat.")) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      setData((prev) => prev.filter((c) => c.id !== id));
      startTransition(() => router.refresh());
    } catch {
      alert("Nu am putut șterge clientul.");
    } finally {
      setPendingId(null);
    }
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
              placeholder="Caută după nume, telefon sau email…"
              className="w-full rounded-lg border border-jbi-navy/10 bg-white py-2 pl-10 pr-4 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
            />
          </div>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-jbi-navy px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-jbi-blue"
          >
            <UserPlus className="h-4 w-4" />
            Adaugă client
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-jbi-navy/5 bg-jbi-soft/30 text-left text-xs font-semibold uppercase tracking-[0.08em] text-jbi-navy/60">
                <th className="px-4 py-3">Nume</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Programări</th>
                <th className="px-4 py-3">Notițe</th>
                <th className="px-4 py-3">Adăugat</th>
                <th className="px-4 py-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-jbi-navy/50">
                    Niciun client.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-b border-jbi-navy/5 last:border-b-0">
                    <td className="px-4 py-3 font-semibold text-jbi-navy">{c.fullName}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-jbi-navy hover:text-jbi-blue">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </a>
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="mt-1 flex items-center gap-1.5 text-xs text-jbi-navy/60 hover:text-jbi-blue">
                          <Mail className="h-3 w-3" /> {c.email}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-jbi-navy/80">{c.appointmentsCount}</td>
                    <td className="px-4 py-3 text-jbi-navy/80">{c.notesCount}</td>
                    <td className="px-4 py-3 text-jbi-navy/70">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        {pendingId === c.id ? (
                          <span className="inline-flex h-7 w-7 items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin text-jbi-blue" />
                          </span>
                        ) : (
                          <>
                            <ActionButton title="Detalii" tone="navy" onClick={() => setViewing(c)} Icon={Eye} />
                            <ActionButton title="Editează" tone="navy" onClick={() => setEditing(c)} Icon={Pencil} />
                            <ActionButton title="Șterge" tone="red" onClick={() => deleteClient(c.id)} Icon={Trash2} />
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

      {creating && (
        <ClientFormModal
          title="Adaugă client"
          pending={pendingId === "__new__"}
          onClose={() => setCreating(false)}
          onSave={(payload) => saveClient(null, payload)}
        />
      )}
      {editing && (
        <ClientFormModal
          title="Editează client"
          pending={pendingId === editing.id}
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(payload) => saveClient(editing.id, payload)}
        />
      )}
      {viewing && (
        <ClientDetailsModal client={viewing} onClose={() => setViewing(null)} />
      )}
    </>
  );
}

function ClientFormModal({
  title,
  initial,
  pending,
  onClose,
  onSave,
}: {
  title: string;
  initial?: { fullName: string; phone: string; email: string | null };
  pending: boolean;
  onClose: () => void;
  onSave: (payload: { fullName: string; phone: string; email: string }) => void;
}) {
  const [form, setForm] = useState({
    fullName: initial?.fullName ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-jbi-navy/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jbi-navy/50">Client</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-jbi-navy">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-semibold text-jbi-navy hover:bg-jbi-soft">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          <FieldInput label="Nume complet" value={form.fullName} onChange={(fullName) => setForm((f) => ({ ...f, fullName }))} required />
          <FieldInput label="Telefon" value={form.phone} onChange={(phone) => setForm((f) => ({ ...f, phone }))} required />
          <FieldInput label="Email" type="email" value={form.email} onChange={(email) => setForm((f) => ({ ...f, email }))} />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary">Anulează</button>
          <button type="submit" disabled={pending} className="btn-primary disabled:opacity-70">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Salvează
          </button>
        </div>
      </form>
    </div>
  );
}

function ClientDetailsModal({
  client,
  onClose,
}: {
  client: ClientRow;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-jbi-navy/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jbi-navy/50">Detalii client</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-jbi-navy">{client.fullName}</h3>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-jbi-navy/75">
              <a href={`tel:${client.phone}`} className="inline-flex items-center gap-1 hover:text-jbi-blue">
                <Phone className="h-3.5 w-3.5" /> {client.phone}
              </a>
              {client.email && (
                <a href={`mailto:${client.email}`} className="inline-flex items-center gap-1 hover:text-jbi-blue">
                  <Mail className="h-3.5 w-3.5" /> {client.email}
                </a>
              )}
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-semibold text-jbi-navy hover:bg-jbi-soft">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6">
          <NotesPanel kind="client" ownerId={client.id} title="Notițe & diagnoze" />
        </div>
      </div>
    </div>
  );
}

function FieldInput({
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

function ActionButton({
  title,
  tone,
  Icon,
  onClick,
}: {
  title: string;
  tone: "navy" | "red";
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  const cls = {
    navy: "text-jbi-navy hover:bg-jbi-soft",
    red: "text-red-700 hover:bg-red-50",
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
