"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
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
import {
  createAppointmentSchema,
  type AppointmentInput,
  type AppointmentValidationMessages,
} from "@/lib/validations";
import { cn } from "@/lib/cn";
import { useRecaptchaScript, executeRecaptcha } from "@/lib/recaptcha-client";
import { BorderBeam } from "./ui/BorderBeam";
import type { ServiceMessage } from "@/i18n/messages";
import { localizedHref, type Locale } from "@/i18n/routing";

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
  const t = useTranslations("appointment");
  const servicesT = useTranslations("services");
  const locale = useLocale() as Locale;
  const services = servicesT.raw("items") as ServiceMessage[];
  const validationMessages = t.raw("validation") as AppointmentValidationMessages;
  const schema = useMemo(() => createAppointmentSchema(validationMessages), [validationMessages]);
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
    resolver: zodResolver(schema),
    defaultValues: { gdpr: false as unknown as true, preferredTime: "", locale },
    mode: "onBlur",
  });

  const selectedDate = watch("preferredDate");
  const selectedTime = watch("preferredTime");

  useEffect(() => {
    setValue("locale", locale);
  }, [locale, setValue]);

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
        body: JSON.stringify({ ...data, locale, recaptchaToken }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setState({ kind: "error", message: body.error ?? t("genericError") });
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
      reset({ gdpr: false as unknown as true, preferredTime: "", locale });
      setAvailability({ kind: "idle" });
    } catch {
      setState({ kind: "error", message: t("networkError") });
    }
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-jbi-navy/5 bg-white p-5 shadow-soft sm:rounded-[2rem] sm:p-10">
      <BorderBeam size={250} duration={10} delay={0} />
      <BorderBeam size={250} duration={10} delay={5} colorFrom="#D8C3A5" colorTo="#1687FF" />
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
              {t("successTitle")}
            </h3>
            <p className="mt-2 max-w-md text-sm text-jbi-navy/65">{t("successText")}</p>
            <button onClick={() => setState({ kind: "idle" })} className="btn-secondary mt-6">
              {t("another")}
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
              <Field label={t("fields.fullName")} error={errors.fullName?.message} icon={User} required>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder={t("placeholders.fullName")}
                  {...register("fullName")}
                  className={inputCls(!!errors.fullName)}
                />
              </Field>

              <Field label={t("fields.phone")} error={errors.phone?.message} icon={Phone} required>
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder={t("placeholders.phone")}
                  {...register("phone")}
                  className={inputCls(!!errors.phone)}
                />
              </Field>
            </div>

            <Field label={t("fields.email")} error={errors.email?.message} icon={Mail} hint={t("hints.email")}>
              <input
                type="email"
                autoComplete="email"
                placeholder={t("placeholders.email")}
                {...register("email")}
                className={inputCls(!!errors.email)}
              />
            </Field>

            <Field label={t("fields.service")} error={errors.service?.message} icon={Stethoscope} required>
              <select {...register("service")} className={inputCls(!!errors.service)} defaultValue="">
                <option value="" disabled>
                  {t("placeholders.selectService")}
                </option>
                {services.map((s) => (
                  <option key={s.slug} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value={servicesT("other")}>{servicesT("other")}</option>
              </select>
            </Field>

            <Field label={t("fields.date")} error={errors.preferredDate?.message} icon={Calendar} required>
              <input
                type="date"
                min={today}
                {...register("preferredDate")}
                className={inputCls(!!errors.preferredDate)}
              />
            </Field>

            <div>
              <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-jbi-navy/60">
                <Clock className="h-3.5 w-3.5 text-jbi-blue" />
                {t("fields.time")} <span className="text-jbi-blue">*</span>
              </span>

              <Controller
                control={control}
                name="preferredTime"
                render={({ field }) => (
                  <SlotPicker
                    state={availability}
                    selectedDate={selectedDate}
                    selectedTime={field.value}
                    onSelect={(slot) => field.onChange(slot)}
                  />
                )}
              />

              {errors.preferredTime?.message && (
                <p className="mt-2 text-xs font-medium text-red-600">{errors.preferredTime.message}</p>
              )}
            </div>

            <Field label={t("fields.message")} error={errors.message?.message} icon={MessageSquare} hint={t("hints.message")}>
              <textarea
                rows={3}
                placeholder={t("placeholders.message")}
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
                {t("gdpr")}{" "}
                <a href={localizedHref(locale, "/privacy-policy")} className="font-semibold text-jbi-blue underline">
                  {t("privacyPolicy")}
                </a>
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
                  <Loader2 className="h-4 w-4 animate-spin" /> {t("submitting")}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> {t("submit")}
                </>
              )}
            </button>

            <p className="text-xs text-jbi-navy/40">{t("afterSubmit")}</p>
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
  const t = useTranslations("appointment");

  if (!selectedDate) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-jbi-navy/15 bg-jbi-soft/30 px-4 py-5 text-sm text-jbi-navy/60">
        <Info className="h-4 w-4 text-jbi-blue" />
        {t("slotPickDate")}
      </div>
    );
  }

  if (state.kind === "loading" || state.kind === "idle") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-jbi-navy/10 bg-white px-4 py-5 text-sm text-jbi-navy/60">
        <Loader2 className="h-4 w-4 animate-spin text-jbi-blue" />
        {t("slotLoading")}
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertCircle className="h-4 w-4" />
        {t("slotError")}
      </div>
    );
  }

  if (!state.isOpen) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <Info className="h-4 w-4" />
        {state.closedReason ?? t("closedFallback")}
      </div>
    );
  }

  if (state.slots.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {t("noSlots")}
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
        {t("unavailableLegend")}
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
