import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generic transactional email sender. `subject`/`html` are optional and default
// to the original password-reset copy so existing callers keep working unchanged.
export const sendEmail = async (to, link, subject = "Password Reset", html) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM, // must be verified in SendGrid
    subject,
    html: html || `
      <h3>${subject}</h3>
      <p>Click below to continue:</p>
      <a href="${link}">${link}</a>
    `,
  };

  await sgMail.send(msg);
};
