/**
 * Server-side reCAPTCHA verification helper.
 * Use this in API routes to verify a reCAPTCHA token received from the client.
 * The SECRET key is only used here on the server and never exposed to the browser.
 */

interface RecaptchaVerifyResult {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export async function verifyRecaptcha(token: string, remoteIp?: string): Promise<RecaptchaVerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification");
    return { success: true };
  }
  if (!token) {
    return { success: false, "error-codes": ["missing-input"] };
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);
    if (remoteIp) params.append("remoteip", remoteIp);

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!res.ok) {
      return { success: false, "error-codes": ["http-error"] };
    }

    return (await res.json()) as RecaptchaVerifyResult;
  } catch (e) {
    console.error("reCAPTCHA verification failed:", e);
    return { success: false, "error-codes": ["network-error"] };
  }
}
