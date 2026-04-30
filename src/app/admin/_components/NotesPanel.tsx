"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X, Check, StickyNote } from "lucide-react";
import { cn } from "@/lib/cn";

type Note = {
  id: string;
  body: string;
  authorEmail: string | null;
  createdAt: string;
  updatedAt: string;
};

type Kind = "appointment" | "client";

function endpoints(kind: Kind, id: string) {
  if (kind === "appointment") {
    return {
      list: `/api/admin/appointments/${id}/notes`,
      item: (noteId: string) => `/api/admin/appointments/notes/${noteId}`,
    };
  }
  return {
    list: `/api/admin/clients/${id}/notes`,
    item: (noteId: string) => `/api/admin/clients/notes/${noteId}`,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function NotesPanel({
  kind,
  ownerId,
  title = "Notițe",
}: {
  kind: Kind;
  ownerId: string;
  title?: string;
}) {
  const ep = endpoints(kind, ownerId);
  const [items, setItems] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(ep.list, { cache: "no-store" });
        if (!res.ok) throw new Error("load failed");
        const body = (await res.json()) as { items?: Note[] };
        if (!cancelled) setItems(body.items ?? []);
      } catch {
        if (!cancelled) setError("Nu am putut încărca notițele.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ep.list]);

  async function addNote() {
    const body = draft.trim();
    if (!body) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(ep.list, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = (await res.json().catch(() => ({}))) as { note?: Note; error?: string };
      if (!res.ok || !data.note) throw new Error(data.error ?? "create failed");
      setItems((prev) => [data.note!, ...prev]);
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut adăuga notița.");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveEdit(id: string) {
    const body = editingBody.trim();
    if (!body) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(ep.item(id), {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = (await res.json().catch(() => ({}))) as { note?: Note; error?: string };
      if (!res.ok || !data.note) throw new Error(data.error ?? "update failed");
      setItems((prev) => prev.map((n) => (n.id === id ? data.note! : n)));
      setEditingId(null);
      setEditingBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut salva notița.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeNote(id: string) {
    if (!confirm("Sigur ștergi notița?")) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(ep.item(id), { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      setItems((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut șterge notița.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-jbi-navy/10 bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-jbi-navy/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-jbi-soft text-jbi-blue">
            <StickyNote className="h-4 w-4" />
          </span>
          <h4 className="font-display text-sm font-semibold text-jbi-navy">{title}</h4>
        </div>
        <span className="text-xs text-jbi-navy/50">{items.length}</span>
      </div>

      <div className="space-y-3 px-4 py-3">
        <div className="flex flex-col gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Scrie o notiță, diagnoză sau observație..."
            rows={2}
            className="w-full rounded-lg border border-jbi-navy/10 px-3 py-2 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addNote}
              disabled={submitting || !draft.trim()}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg bg-jbi-navy px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-jbi-blue",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Adaugă notiță
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        {loading ? (
          <p className="py-6 text-center text-xs text-jbi-navy/50">Se încarcă…</p>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-xs text-jbi-navy/50">Nu există notițe încă.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((note) => (
              <li
                key={note.id}
                className="rounded-lg border border-jbi-navy/5 bg-jbi-soft/30 p-3 text-sm text-jbi-navy/85"
              >
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingBody}
                      onChange={(e) => setEditingBody(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-jbi-navy/10 bg-white px-3 py-2 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditingBody("");
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-jbi-navy/10 px-2 py-1 text-xs font-semibold text-jbi-navy hover:bg-jbi-soft"
                      >
                        <X className="h-3 w-3" /> Anulează
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(note.id)}
                        disabled={submitting || !editingBody.trim()}
                        className="inline-flex items-center gap-1 rounded-md bg-jbi-navy px-2 py-1 text-xs font-semibold text-white hover:bg-jbi-blue disabled:opacity-60"
                      >
                        {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                        Salvează
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap">{note.body}</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-[11px] text-jbi-navy/50">
                        {formatDate(note.createdAt)}
                        {note.authorEmail ? ` · ${note.authorEmail}` : ""}
                      </p>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(note.id);
                            setEditingBody(note.body);
                          }}
                          title="Editează"
                          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-jbi-navy/70 hover:bg-white hover:text-jbi-navy"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeNote(note.id)}
                          title="Șterge"
                          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-red-600/80 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
