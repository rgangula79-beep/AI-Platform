import { query } from "../config/database.js";
import { ok, fail } from "../utils/response.js";

export async function updateProfile(req,res) {
  const name = String(req.body.name || "").trim();
  if (name.length < 2) return fail(res,"Name is too short");
  const { rows } = await query(
    `UPDATE users SET name=$1,updated_at=NOW()
     WHERE id=$2
     RETURNING id,name,email,role,plan,is_guest,created_at`,
    [name,req.user.id]
  );
  return ok(res,{user:rows[0]});
}

export async function history(req,res) {
  const { rows } = await query(
    `SELECT id,title,created_at,updated_at
     FROM conversations WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 100`,
    [req.user.id]
  );
  return ok(res,{conversations:rows});
}

export async function conversation(req,res) {
  const { rows: conv } = await query(
    "SELECT id,title FROM conversations WHERE id=$1 AND user_id=$2",
    [req.params.id,req.user.id]
  );
  if (!conv[0]) return fail(res,"Conversation not found",404);
  const { rows:messages } = await query(
    `SELECT id,role,content,sources,created_at FROM messages
     WHERE conversation_id=$1 ORDER BY created_at`,
    [req.params.id]
  );
  return ok(res,{conversation:conv[0],messages});
}
