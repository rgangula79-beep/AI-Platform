import fs from "fs/promises";
import path from "path";
import { query } from "../config/database.js";

export async function saveFileRecord({ userId, file }) {
  const { rows } = await query(
    `INSERT INTO files (user_id,original_name,stored_name,mime_type,size_bytes)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id,original_name,mime_type,size_bytes,created_at`,
    [userId, file.originalname, file.filename, file.mimetype, file.size]
  );
  return rows[0];
}

export async function deleteFileRecord({ userId, id, uploadDir }) {
  const { rows } = await query(
    "DELETE FROM files WHERE id=$1 AND user_id=$2 RETURNING stored_name",
    [id, userId]
  );
  if (!rows[0]) return false;
  try {
    await fs.unlink(path.resolve(uploadDir, rows[0].stored_name));
  } catch {}
  return true;
}
