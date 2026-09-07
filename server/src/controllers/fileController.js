import { ok, fail } from "../utils/response.js";
import { query } from "../config/database.js";
import { saveFileRecord, deleteFileRecord } from "../services/fileService.js";
import { env } from "../config/env.js";

export async function uploadController(req,res) {
  if (!req.file) return fail(res,"No file uploaded");
  try { return ok(res,{file:await saveFileRecord({userId:req.user.id,file:req.file})},201); }
  catch(e) { return fail(res,e.message,500); }
}

export async function listFilesController(req,res) {
  const { rows } = await query(
    `SELECT id,original_name,mime_type,size_bytes,created_at
     FROM files WHERE user_id=$1 ORDER BY created_at DESC`,
    [req.user.id]
  );
  return ok(res,{files:rows});
}

export async function deleteFileController(req,res) {
  try {
    const deleted = await deleteFileRecord({userId:req.user.id,id:req.params.id,uploadDir:env.uploadDir});
    if (!deleted) return fail(res,"File not found",404);
    return ok(res,{message:"File deleted"});
  } catch(e) { return fail(res,e.message,500); }
}
