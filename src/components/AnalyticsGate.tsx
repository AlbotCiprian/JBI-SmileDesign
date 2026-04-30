"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";

const STORAGE_KEY = "jbi-cookie-consent-v2";

function hasAnalyticsConsent() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(stored) as { analytics?: unknown };
    return parsed.analytics === true;
  } catch {
    return false;
  }
}

export function AnalyticsGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(hasAnalyticsConsent());
    sync();
    window.addEventListener("jbi-cookie-consent-change", sync);
    return () => window.removeEventListener("jbi-cookie-consent-change", sync);
  }, []);

  return enabled ? <Analytics /> : null;
}
