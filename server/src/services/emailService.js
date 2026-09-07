import { sendMail } from "../providers/email/emailProvider.js";
import { env } from "../config/env.js";

export async function sendWelcomeEmail(user) {
  if (!user?.email) return;
  await sendMail({
    to: user.email,
    subject: `Welcome to ${env.ownerName}'s AI Platform`,
    text: `Welcome ${user.name}. Your account is ready.`,
    html: `<h2>Welcome ${user.name}</h2><p>Your AI Platform account is ready.</p>`
  });
}
