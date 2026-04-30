"use client";

import { useState } from "react";
import { Loader2, KeyRound } from "lucide-react";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/password", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Nu am putut schimba parola.");
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Parola a fost schimbata.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Nu am putut schimba parola.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-jbi-navy/5 bg-white p-5 shadow-[0_2px_20px_-12px_rgba(11,31,58,0.12)]"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-jbi-soft text-jbi-blue">
          <KeyRound className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold text-jbi-navy">Schimba parola admin</h2>
          <p className="text-sm text-jbi-navy/55">Foloseste parola curenta pentru confirmare.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder="Parola curenta"
          className="rounded-xl border border-jbi-navy/10 px-4 py-2.5 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Parola noua, minim 10 caractere"
          className="rounded-xl border border-jbi-navy/10 px-4 py-2.5 text-sm focus:border-jbi-blue focus:outline-none focus:ring-2 focus:ring-jbi-blue/20"
          required
          minLength={10}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-70">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Salveaza parola
        </button>
        {message && <p className="text-sm text-jbi-navy/60">{message}</p>}
      </div>
    </form>
  );
}
