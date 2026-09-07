import { query } from "../config/database.js";
import { ok } from "../utils/response.js";

export async function dashboard(req,res) {
  const [users, chats, searches] = await Promise.all([
    query("SELECT COUNT(*)::int AS count FROM users"),
    query("SELECT COUNT(*)::int AS count FROM usage WHERE feature='chat'"),
    query("SELECT COUNT(*)::int AS count FROM usage WHERE feature='search'")
  ]);
  return ok(res,{stats:{
    users:users.rows[0].count,
    chats:chats.rows[0].count,
    searches:searches.rows[0].count
  }});
}

export async function users(req,res) {
  const { rows } = await query(
    `SELECT id,name,email,role,plan,is_guest,is_active,created_at
     FROM users ORDER BY created_at DESC LIMIT 500`
  );
  return ok(res,{users:rows});
}



export async function usage(req,res) {
  const { rows } = await query(
    `SELECT feature,COUNT(*)::int AS count
     FROM usage GROUP BY feature ORDER BY count DESC`
  );
  return ok(res,{usage:rows});
}

export async function owner(req,res) {
  return ok(res,{owner:{
    name:process.env.OWNER_NAME || "Rajesh",
    email:process.env.OWNER_EMAIL || "rgangula79@gmail.com",
    phone:process.env.OWNER_PHONE || "9515242059"
  }});
}
