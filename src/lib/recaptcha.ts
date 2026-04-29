/**
 * Verifică tokenul reCAPTCHA pe server.
 * Dacă RECAPTCHA_SECRET_KEY nu e setat (dev), sărim verificarea și returnăm true.
 */
export async function verifyRecaptcha(token: string | null | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("[recaptcha] RECAPTCHA_SECRET_KEY lipsește — sărim verificarea (dev mode).");
    return true;
  }

  if (!token) return false;

  try {
    const params = new URLSearchParams({ secret, response: token });
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = (await res.json()) as { success: boolean; score?: number };
    if (!data.success) return false;
    // Pentru reCAPTCHA v3 verificăm și scorul.
    if (typeof data.score === "number" && data.score < 0.4) return false;
    return true;
  } catch (err) {
    console.error("[recaptcha] eroare la verificare:", err);
    return false;
  }
}
