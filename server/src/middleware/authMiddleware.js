import { verifyToken } from "../utils/jwt.js";
import { query } from "../config/database.js";

export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: "Authentication required" });

    const payload = verifyToken(token);
    const { rows } = await query(
      "SELECT id,name,email,role,plan,is_guest,is_active,created_at FROM users WHERE id=$1",
      [payload.sub]
    );
    const user = rows[0];
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: "User account is unavailable" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
