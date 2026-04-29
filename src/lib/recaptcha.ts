/**
 * Verifică tokenul reCAPTCHA pe server.
 *
 * Suportă DOAR reCAPTCHA Enterprise. Necesită ambele:
 *   - RECAPTCHA_PROJECT_ID (ID-ul proiectului Google Cloud)
 *   - RECAPTCHA_API_KEY (Google Cloud API Key cu acces la reCAPTCHA Enterprise API)
 *
 * Dacă vreuna lipsește, sărim verificarea (frontend-ul tot generează token,
 * dar nu-l validăm server-side). Util în dev sau ca etapă intermediară.
 */
export async function verifyRecaptcha(token: string | null | undefined): Promise<boolean> {
  const projectId = process.env.RECAPTCHA_PROJECT_ID;
  const apiKey = process.env.RECAPTCHA_API_KEY;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const expectedAction = "appointment";
  const minScore = 0.4;

  if (!projectId || !apiKey || !siteKey) {
    console.warn(
      "[recaptcha] PROJECT_ID / API_KEY / SITE_KEY lipsesc — sărim verificarea backend.",
    );
    return true;
  }

  if (!token) return false;

  try {
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: {
          token,
          expectedAction,
          siteKey,
        },
      }),
    });

    if (!res.ok) {
      console.error("[recaptcha] HTTP", res.status, await res.text());
      return false;
    }

    const data = (await res.json()) as {
      tokenProperties?: { valid?: boolean; action?: string };
      riskAnalysis?: { score?: number };
    };

    if (!data.tokenProperties?.valid) return false;

    if (
      expectedAction &&
      data.tokenProperties.action &&
      data.tokenProperties.action !== expectedAction
    ) {
      console.warn(
        "[recaptcha] action mismatch — expected:",
        expectedAction,
        "got:",
        data.tokenProperties.action,
      );
      return false;
    }

    const score = data.riskAnalysis?.score;
    if (typeof score === "number" && score < minScore) {
      console.warn("[recaptcha] scor sub prag:", score);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[recaptcha] eroare la verificare:", err);
    return false;
  }
}
