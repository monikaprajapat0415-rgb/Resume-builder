import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, link) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM, // must be verified in SendGrid
    subject: "Password Reset",
    html: `
      <h3>Password Reset</h3>
      <p>Click below to reset your password:</p>
      <a href="${link}">${link}</a>
    `,
  };

  await sgMail.send(msg);
};
