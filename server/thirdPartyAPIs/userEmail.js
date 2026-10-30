// Transactional email via Brevo (https://developers.brevo.com/reference/sendtransacemail).
// Uses the HTTPS API through built-in fetch, so no extra package is needed.
// Env: BREVO_API_KEY (required), EMAIL_FROM (a sender verified in Brevo), EMAIL_FROM_NAME (optional).

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

// Generic transactional email sender. `subject`/`html` are optional and default
// to the original password-reset copy so existing callers keep working unchanged.
export const sendEmail = async (to, link, subject = "Password Reset", html) => {
  if (!process.env.BREVO_API_KEY) throw new Error("BREVO_API_KEY is not set");
  if (!process.env.EMAIL_FROM) throw new Error("EMAIL_FROM is not set");

  const payload = {
    sender: { email: process.env.EMAIL_FROM, name: process.env.EMAIL_FROM_NAME || "Prime Resume AI" },
    to: [{ email: to }],
    subject,
    htmlContent: html || `
      <h3>${subject}</h3>
      <p>Click below to continue:</p>
      <a href="${link}">${link}</a>
    `,
  };

  const res = await fetch(BREVO_URL, {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json()).message || ""; } catch { /* non-JSON body */ }
    throw new Error(`Brevo ${res.status}${detail ? `: ${detail}` : ""}`);
  }
};
