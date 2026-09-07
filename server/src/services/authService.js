import bcrypt from "bcryptjs";
import { query } from "../config/database.js";
import { signToken } from "../utils/jwt.js";

export async function register({ name, email, password }) {
  if (!name || name.trim().length < 2) throw new Error("Name is required");
  if (!email || !email.includes("@")) throw new Error("Valid email is required");
  if (!password || password.length < 8) throw new Error("Password must be at least 8 characters");

  const existing = await query("SELECT id FROM users WHERE LOWER(email)=LOWER($1)", [email.trim()]);
  if (existing.rows[0]) throw new Error("Email is already registered");

  const passwordHash = await bcrypt.hash(password, 12);
  const { rows } = await query(
    `INSERT INTO users (name,email,password_hash)
     VALUES ($1,$2,$3)
     RETURNING id,name,email,role,plan,is_guest,created_at`,
    [name.trim(), email.trim().toLowerCase(), passwordHash]
  );
  return { user: rows[0], token: signToken(rows[0]) };
}

export async function login({ email, password }) {
  const { rows } = await query(
    "SELECT * FROM users WHERE LOWER(email)=LOWER($1) AND is_active=true",
    [email.trim()]
  );
  const user = rows[0];
  if (!user || !user.password_hash) throw new Error("Invalid email or password");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Invalid email or password");

  const safeUser = {
    id: user.id, name: user.name, email: user.email,
    role: user.role, plan: user.plan, is_guest: user.is_guest,
    created_at: user.created_at
  };
  return { user: safeUser, token: signToken(safeUser) };
}

export async function createGuest() {
  const { rows } = await query(
    `INSERT INTO users (name,is_guest)
     VALUES ($1,true)
     RETURNING id,name,email,role,plan,is_guest,created_at`,
    ["Guest User"]
  );
  return { user: rows[0], token: signToken(rows[0]) };
}
