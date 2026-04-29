"use client";

/**
 * Helpers pentru reCAPTCHA Enterprise pe client.
 * - useRecaptchaScript: încarcă scriptul Enterprise când există site key
 * - executeRecaptcha: returnează un token pentru o acțiune dată
 */

import { useEffect } from "react";

type GrecaptchaEnterprise = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: { enterprise?: GrecaptchaEnterprise };
  }
}

const SCRIPT_ID = "recaptcha-enterprise-script";

export function useRecaptchaScript() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    if (typeof window === "undefined") return;
    if (document.getElementById(SCRIPT_ID)) return;

    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, [siteKey]);
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) return null;
  if (typeof window === "undefined") return null;

  // Așteaptă încărcarea scriptului (max ~3s)
  const start = Date.now();
  while (!window.grecaptcha?.enterprise && Date.now() - start < 3000) {
    await new Promise((r) => setTimeout(r, 100));
  }
  if (!window.grecaptcha?.enterprise) return null;

  return new Promise((resolve) => {
    window.grecaptcha!.enterprise!.ready(async () => {
      try {
        const token = await window.grecaptcha!.enterprise!.execute(siteKey, { action });
        resolve(token);
      } catch (err) {
        console.error("[recaptcha] execute failed:", err);
        resolve(null);
      }
    });
  });
}
