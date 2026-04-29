"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Stethoscope,
  MessageSquare,
  Send,
  Info,
} from "lucide-react";
import { appointmentSchema, type AppointmentInput } from "@/lib/validations";
import { services } from "@/lib/data";
import { cn } from "@/lib/cn";
import { useRecaptchaScript, executeRecaptcha } from "@/lib/recaptcha-client";

type SubmitState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; message: string };

type Slot = { time: string; available: boolean };
type AvailabilityState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; isOpen: boolean; closedReason: string | null; slots: Slot[] }
  | { kind: "error" };

export function AppointmentForm() {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [availability, setAvailability] = useState<AvailabilityState>({ kind: "idle" });
  useRecaptchaScript();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { gdpr: false as unknown as true, preferredTime: "" },
    mode: "onBlur",
  });

  const selectedDate = watch("preferredDate");
  const selectedTime = watch("preferredTime");

  // Când se schimbă data, resetăm ora aleasă și fetch-uim disponibilitatea.
  useEffect(() => {
    if (!selectedDate || !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      setAvailability({ kind: "idle" });
      return;
    }

    setValue("preferredTime", "");
    setAvailability({ kind: "loading" });

    let cancelled = false;
    fetch(`/api/availability?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setAvailability({ kind: "error" });
          return;
        }
        setAvailability({
          kind: "ready",
          isOpen: data.isOpen,
          closedReason: data.closedReason,
          slots: data.slots ?? [],
        });
      })
      .catch(() => {
        if (cancelled) return;
        setAvailability({ kind: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setState({ kind: "loading" });
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
        // Dacă slot-ul a fost luat între timp, refresh la availability.
        if (res.status === 409 && selectedDate) {
          setAvailability({ kind: "loading" });
          const av = await fetch(`/api/availability?date=${selectedDate}`).then((r) => r.json());
          setAvailability({
            kind: "ready",
            isOpen: av.isOpen,
            closedReason: av.closedReason,
            slots: av.slots ?? [],
          });
        }
        return;
      }

      setState({ kind: "success" });
      reset();
      setAvailability({ kind: "idle" });
    } catch {
      setState({
        kind: "error",
        message: "Nu ne-am putut conecta la server. Încearcă din nou.",
      });
    }
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-3xl border border-jbi-navy/5 bg-white p-5 shadow-soft sm:rounded-[2rem] sm:p-10">
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
              Echipa JBI Smile Design te va contacta în cel mai scurt timp pentru
              a confirma ora exactă a programării.
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
            className="grid gap-4 sm:gap-5"
          >
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
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

            <Field
              label="Email"
              error={errors.email?.message}
              icon={Mail}
              hint="Opțional — pentru confirmarea programării"
            >
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

            <Field label="Data preferată" error={errors.preferredDate?.message} icon={Calendar} required>
              <input
                type="date"
                min={today}
                {...register("preferredDate")}
                className={inputCls(!!errors.preferredDate)}
              />
            </Field>

            {/* Slot picker live */}
            <div>
              <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-jbi-navy/60">
                <Clock className="h-3.5 w-3.5 text-jbi-blue" />
                Ora preferată <span className="text-jbi-blue">*</span>
              </span>

              <Controller
                control={control}
                name="preferredTime"
                render={({ field }) => (
                  <SlotPicker
                    state={availability}
                    selectedDate={selectedDate}
                    selectedTime={field.value}
                    onSelect={(t) => field.onChange(t)}
                  />
                )}
              />

              {errors.preferredTime?.message && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.preferredTime.message}
                </p>
              )}
            </div>

            <Field label="Mesaj" error={errors.message?.message} icon={MessageSquare} hint="Opțional">
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
              <p className="-mt-2 text-xs font-medium text-red-600">{errors.gdpr.message}</p>
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

function SlotPicker({
  state,
  selectedDate,
  selectedTime,
  onSelect,
}: {
  state: AvailabilityState;
  selectedDate: string | undefined;
  selectedTime: string;
  onSelect: (time: string) => void;
}) {
  if (!selectedDate) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-jbi-navy/15 bg-jbi-soft/30 px-4 py-5 text-sm text-jbi-navy/60">
        <Info className="h-4 w-4 text-jbi-blue" />
        Alege mai întâi data, apoi vei vedea intervalele orare disponibile.
      </div>
    );
  }

  if (state.kind === "loading" || state.kind === "idle") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-jbi-navy/10 bg-white px-4 py-5 text-sm text-jbi-navy/60">
        <Loader2 className="h-4 w-4 animate-spin text-jbi-blue" />
        Verificăm disponibilitatea...
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertCircle className="h-4 w-4" />
        Nu am putut verifica disponibilitatea. Reîncearcă peste câteva secunde.
      </div>
    );
  }

  if (!state.isOpen) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <Info className="h-4 w-4" />
        {state.closedReason ?? "Clinica este închisă în această zi"}
      </div>
    );
  }

  if (state.slots.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Nu există intervale orare disponibile pentru această zi.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
        {state.slots.map((slot) => {
          const isSelected = slot.time === selectedTime;
          return (
            <button
              type="button"
              key={slot.time}
              disabled={!slot.available}
              onClick={() => onSelect(slot.time)}
              aria-pressed={isSelected}
              className={cn(
                "rounded-lg border px-2 py-2 text-sm font-semibold transition-all",
                isSelected
                  ? "border-jbi-blue bg-jbi-blue text-white shadow-soft"
                  : slot.available
                  ? "border-jbi-navy/10 bg-white text-jbi-navy hover:border-jbi-blue hover:bg-jbi-soft/50"
                  : "cursor-not-allowed border-jbi-navy/5 bg-jbi-navy/5 text-jbi-navy/30 line-through",
              )}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
      <p className="flex items-center gap-2 text-xs text-jbi-navy/50">
        <span className="inline-block h-2.5 w-2.5 rounded bg-jbi-navy/20" />
        Indisponibil — interval ocupat sau prea apropiat de altă programare
      </p>
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
