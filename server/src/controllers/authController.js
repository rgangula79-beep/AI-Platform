import { register, login, createGuest } from "../services/authService.js";
import { ok, fail } from "../utils/response.js";
import { query } from "../config/database.js";
import { signToken } from "../utils/jwt.js";

export async function registerController(req,res) {
  try { return ok(res, await register(req.body), 201); }
  catch(e) { const status = e.message.includes('already registered') ? 409 : 400; return fail(res,e.message,status); }
}

export async function loginController(req,res) {
  try { return ok(res, await login(req.body)); }
  catch(e) { return fail(res,e.message,401); }
}

export async function guestController(req,res) {
  try { return ok(res, await createGuest(), 201); }
  catch(e) { return fail(res,e.message,500); }
}

export async function meController(req,res) {
  return ok(res,{user:req.user});
}

export async function googleCallbackController(req,res) {
  const google = req.user;
  try {
    const { rows } = await query(
      "SELECT id,name,email,role,plan,is_guest,created_at FROM users WHERE google_id=$1 OR LOWER(email)=LOWER($2) LIMIT 1",
      [google.id, google.email]
    );

    let user = rows[0];
    if (!user) {
      const created = await query(
        `INSERT INTO users (name,email,google_id)
         VALUES ($1,$2,$3)
         RETURNING id,name,email,role,plan,is_guest,created_at`,
        [google.name || "Google User", google.email, google.id]
      );
      user = created.rows[0];
    } else if (!user.google_id) {
      await query("UPDATE users SET google_id=$1 WHERE id=$2", [google.id, user.id]);
    }

    const token = signToken(user);
    const redirect = `${process.env.CLIENT_URL || "http://localhost:5173"}/login?token=${encodeURIComponent(token)}`;
    return res.redirect(redirect);
  } catch {
    return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=google_login_failed`);
  }
}
