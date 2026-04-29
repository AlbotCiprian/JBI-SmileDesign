"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const fromPath = search.get("from") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Email sau parolă incorectă.");
      return;
    }

    router.push(fromPath);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jbi-navy via-[#0e2747] to-jbi-blue p-4">
      <div className="mx-auto flex min-h-screen max-w-md items-center">
        <div className="w-full">
          <div className="mb-8 flex flex-col items-center text-center">
            <Image
              src="/images/jbi-logo.png"
              alt="JBI Smile Design"
              width={56}
              height={56}
              className="rounded-xl bg-white p-1.5"
            />
            <h1 className="mt-4 font-display text-3xl font-semibold text-white">
              Admin Panel
            </h1>
            <p className="mt-1 text-sm text-white/60">
              JBI Smile Design — autentificare
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-jbi-electric focus:outline-none focus:ring-2 focus:ring-jbi-electric/30"
                placeholder="admin@jbismiledesign.md"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                Parolă
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pr-11 text-sm text-white placeholder-white/30 focus:border-jbi-electric focus:outline-none focus:ring-2 focus:ring-jbi-electric/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-white/50 transition-colors hover:text-white"
                  aria-label={showPwd ? "Ascunde parola" : "Arată parola"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-jbi-navy transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Se autentifică...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Conectează-te
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/40">
            Acces restricționat. Doar pentru personalul autorizat.
          </p>
        </div>
      </div>
    </div>
  );
}
