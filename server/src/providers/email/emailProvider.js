import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

let transporter = null;

if (env.smtpHost && env.smtpUser && env.smtpPass) {
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: { user: env.smtpUser, pass: env.smtpPass }
  });
}

export async function sendMail({ to, subject, text, html }) {
  if (!transporter) {
    console.log(`[email disabled] to=${to} subject=${subject}`);
    return { disabled: true };
  }
  return transporter.sendMail({
    from: env.mailFrom,
    to,
    subject,
    text,
    html
  });
}
