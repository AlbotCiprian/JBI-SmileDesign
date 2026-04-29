"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Calendar, Clock, User, Phone, Mail, Stethoscope, MessageSquare, Send } from "lucide-react";
import { appointmentSchema, type AppointmentInput } from "@/lib/validations";
import { services } from "@/lib/data";
import { cn } from "@/lib/cn";
import { useRecaptchaScript, executeRecaptcha } from "@/lib/recaptcha-client";

type SubmitState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function AppointmentForm() {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  useRecaptchaScript();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { gdpr: false as unknown as true },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (data) => {
    setState({ kind: "loading" });

    // reCAPTCHA Enterprise — generează token; dacă site-key lipsește, returnează null.
    const recaptchaToken = await executeRecaptcha("appointment");

    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setState({
          kind: "error",
          message:
            body.error ??
            "A apărut o eroare. Te rugăm să încerci din nou sau să ne contactezi telefonic.",
        });
        return;
      }

      setState({ kind: "success" });
      reset();
    } catch {
      setState({
        kind: "error",
        message: "Nu ne-am putut conecta la server. Încearcă din nou.",
      });
    }
  });

  // Min date = azi (format YYYY-MM-DD pentru input[type=date])
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-[2rem] border border-jbi-navy/5 bg-white p-6 shadow-soft sm:p-10">
      <AnimatePresence mode="wait">
        {state.kind === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-jbi-navy">
              Mulțumim! Cererea ta a fost trimisă.
            </h3>
            <p className="mt-2 max-w-md text-sm text-jbi-navy/65">
              Echipa JBI Smile Design te va contacta în cel mai scurt timp pentru a
              confirma ora exactă a programării.
            </p>
            <button
              onClick={() => setState({ kind: "idle" })}
              className="btn-secondary mt-6"
            >
              Trimite altă cerere
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            noValidate
            className="grid gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nume complet" error={errors.fullName?.message} icon={User} required>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="ex. Ana Popescu"
                  {...register("fullName")}
                  className={inputCls(!!errors.fullName)}
                />
              </Field>

              <Field label="Telefon" error={errors.phone?.message} icon={Phone} required>
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="+373 ..."
                  {...register("phone")}
                  className={inputCls(!!errors.phone)}
                />
              </Field>
            </div>

            <Field label="Email (opțional)" error={errors.email?.message} icon={Mail} hint="Pentru confirmarea programării">
              <input
                type="email"
                autoComplete="email"
                placeholder="email@exemplu.com"
                {...register("email")}
                className={inputCls(!!errors.email)}
              />
            </Field>

            <Field label="Serviciu dorit" error={errors.service?.message} icon={Stethoscope} required>
              <select {...register("service")} className={inputCls(!!errors.service)} defaultValue="">
                <option value="" disabled>
                  Alege un serviciu
                </option>
                {services.map((s) => (
                  <option key={s.slug} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="Altceva / Nu sunt sigur">Altceva / Nu sunt sigur</option>
              </select>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Data preferată" error={errors.preferredDate?.message} icon={Calendar} required>
                <input
                  type="date"
                  min={today}
                  {...register("preferredDate")}
                  className={inputCls(!!errors.preferredDate)}
                />
              </Field>

              <Field label="Ora preferată" error={errors.preferredTime?.message} icon={Clock}>
                <input
                  type="time"
                  {...register("preferredTime")}
                  className={inputCls(!!errors.preferredTime)}
                />
              </Field>
            </div>

            <Field label="Mesaj (opțional)" error={errors.message?.message} icon={MessageSquare}>
              <textarea
                rows={3}
                placeholder="Detalii suplimentare, dureri, întrebări..."
                {...register("message")}
                className={cn(inputCls(!!errors.message), "min-h-[88px] resize-y")}
              />
            </Field>

            <label className="flex items-start gap-3 rounded-xl border border-jbi-navy/5 bg-jbi-soft/30 p-4">
              <input
                type="checkbox"
                {...register("gdpr")}
                className="mt-1 h-4 w-4 rounded border-jbi-navy/20 text-jbi-blue focus:ring-jbi-blue"
              />
              <span className="text-xs text-jbi-navy/70">
                Sunt de acord cu prelucrarea datelor personale conform{" "}
                <a href="#" className="font-semibold text-jbi-blue underline">
                  Politicii de Confidențialitate
                </a>
                . Datele sunt folosite exclusiv pentru contactarea mea în legătură cu
                programarea.
              </span>
            </label>
            {errors.gdpr?.message && (
              <p className="-mt-3 text-xs font-medium text-red-600">{errors.gdpr.message}</p>
            )}

            {state.kind === "error" && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{state.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={state.kind === "loading"}
              className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:self-start"
            >
              {state.kind === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Se trimite...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Trimite programarea
                </>
              )}
            </button>

            <p className="text-xs text-jbi-navy/40">
              Programarea va fi confirmată telefonic de echipa noastră.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-jbi-navy placeholder-jbi-navy/35 transition-colors focus:outline-none focus:ring-2 focus:ring-jbi-blue/30",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
      : "border-jbi-navy/10 focus:border-jbi-blue",
  );
}

function Field({
  label,
  error,
  hint,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-jbi-navy/60">
        {Icon && <Icon className="h-3.5 w-3.5 text-jbi-blue" />}
        {label}
        {required && <span className="text-jbi-blue">*</span>}
      </span>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-jbi-navy/45">{hint}</p>
      ) : null}
    </label>
  );
}
